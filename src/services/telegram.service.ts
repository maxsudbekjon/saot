// Telegram Bot Service - To'lov uchun telegram bot bilan integratsiya
import { databaseService } from './database.service';

export interface TelegramUser {
  username: string;
  password: string;
  telegramId: string;
  userId?: string;
}

class TelegramService {
  private botToken = '7432272023:AAGy1mrK7GqpuhMmcTQq_V_3ZOO-rOLIMGo';
  private botUsername = 'SAOT_django_bot';
  private botUrl = `https://api.telegram.org/bot${this.botToken}`;

  // Telegram botga foydalanuvchini yo'naltirish
  redirectToTelegramBot(courseId: string, courseName: string, amount: number): string {
    const startParam = `course_${courseId}_${amount}`;
    return `https://t.me/${this.botUsername}?start=${startParam}`;
  }

  // Telegram bot orqali username va password yaratish
  async createTelegramUser(telegramId: string, firstName?: string, lastName?: string): Promise<TelegramUser> {
    const username = `user_${telegramId}`;
    const password = `pass_${telegramId.slice(-6)}`;
    
    // Database da foydalanuvchi yaratish
    try {
      const existingUser = await databaseService.getUserByTelegramId(telegramId);
      if (existingUser) {
        return {
          username: existingUser.email.split('@')[0],
          password: password,
          telegramId: telegramId,
          userId: existingUser.id
        };
      }

      const newUser = await databaseService.createUser({
        name: `${firstName || 'User'} ${lastName || ''}`.trim(),
        email: `${username}@telegram.user`,
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'user',
        enrolledCourses: [],
        completedCourses: [],
        paidCourses: [],
        progress: {},
        profile: {
          telegramId: telegramId
        }
      });

      return {
        username: username,
        password: password,
        telegramId: telegramId,
        userId: newUser.id
      };
    } catch (error) {
      console.error('Error creating telegram user:', error);
      throw error;
    }
  }

  // Telegram bot orqali kurs sotib olish
  async purchaseCourseViaTelegram(telegramId: string, courseId: string): Promise<boolean> {
    try {
      const user = await databaseService.getUserByTelegramId(telegramId);
      if (!user) {
        throw new Error('User not found');
      }

      const success = await databaseService.purchaseCourse(user.id, courseId);
      return success;
    } catch (error) {
      console.error('Error purchasing course via telegram:', error);
      return false;
    }
  }

  // Foydalanuvchining sotib olgan kurslarini tekshirish
  async checkUserPurchases(telegramId: string): Promise<string[]> {
    try {
      const user = await databaseService.getUserByTelegramId(telegramId);
      return user ? user.paidCourses : [];
    } catch (error) {
      console.error('Error checking user purchases:', error);
      return [];
    }
  }

  // Telegram bot webhook uchun
  async handleWebhook(update: any): Promise<void> {
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id.toString();
      const text = update.message.text;
      const firstName = update.message.from?.first_name;
      const lastName = update.message.from?.last_name;

      if (text.startsWith('/start')) {
        const params = text.split(' ')[1];
        if (params && params.startsWith('course_')) {
          await this.handleCoursePayment(chatId, params, firstName, lastName);
        } else {
          await this.sendWelcomeMessage(chatId, firstName, lastName);
        }
      } else if (text.startsWith('/buy_')) {
        const courseId = text.replace('/buy_', '');
        await this.handleCoursePurchase(chatId, courseId);
      } else if (text === '/my_courses') {
        await this.showUserCourses(chatId);
      }
    }
  }

  private async sendWelcomeMessage(chatId: string, firstName?: string, lastName?: string): Promise<void> {
    try {
      // Foydalanuvchi yaratish yoki mavjudini topish
      const telegramUser = await this.createTelegramUser(chatId, firstName, lastName);
      
      const message = `
🎓 EduPlatform ga xush kelibsiz, ${firstName || 'Foydalanuvchi'}!

Sizning hisobingiz yaratildi:
👤 Username: ${telegramUser.username}
🔐 Parol: ${telegramUser.password}

📚 Kurslar ro'yxati:
/courses - Barcha kurslarni ko'rish
/my_courses - Sotib olingan kurslar

💳 Kurs sotib olish:
Kurs ID bilan: /buy_[kurs_id]

🌐 Sayt: https://your-domain.com
Saytga shu username va parol bilan kiring.
      `;

      await this.sendMessage(chatId, message);
    } catch (error) {
      console.error('Error sending welcome message:', error);
    }
  }

  private async handleCoursePayment(chatId: string, params: string, firstName?: string, lastName?: string): Promise<void> {
    try {
      const [, courseId, amount] = params.split('_');
      
      // Foydalanuvchi yaratish
      const telegramUser = await this.createTelegramUser(chatId, firstName, lastName);
      
      // Kurs ma'lumotlarini olish
      const course = await databaseService.getCourseById(courseId);
      if (!course) {
        await this.sendMessage(chatId, '❌ Kurs topilmadi!');
        return;
      }

      const message = `
💳 Kurs to'lovi

📚 Kurs: ${course.title}
💰 Narx: ${amount} so'm
👨‍🏫 O'qituvchi: ${course.instructor}

Sizning hisobingiz:
👤 Username: ${telegramUser.username}
🔐 Parol: ${telegramUser.password}

Kursni sotib olish uchun:
/buy_${courseId}

🌐 Sayt: https://your-domain.com
      `;

      await this.sendMessage(chatId, message);
    } catch (error) {
      console.error('Error handling course payment:', error);
    }
  }

  private async handleCoursePurchase(chatId: string, courseId: string): Promise<void> {
    try {
      const success = await this.purchaseCourseViaTelegram(chatId, courseId);
      
      if (success) {
        const course = await databaseService.getCourseById(courseId);
        const message = `
✅ Kurs muvaffaqiyatli sotib olindi!

📚 Kurs: ${course?.title}
🎯 Endi saytga kirib darslarni boshlashingiz mumkin.

🌐 Sayt: https://your-domain.com
        `;
        await this.sendMessage(chatId, message);
      } else {
        await this.sendMessage(chatId, '❌ Kurs sotib olishda xatolik yuz berdi!');
      }
    } catch (error) {
      console.error('Error handling course purchase:', error);
      await this.sendMessage(chatId, '❌ Xatolik yuz berdi!');
    }
  }

  private async showUserCourses(chatId: string): Promise<void> {
    try {
      const purchasedCourses = await this.checkUserPurchases(chatId);
      
      if (purchasedCourses.length === 0) {
        await this.sendMessage(chatId, '📚 Hali kurs sotib olmadingiz.\n\n/courses - Kurslarni ko\'rish');
        return;
      }

      let message = '📚 Sizning kurslaringiz:\n\n';
      
      for (const courseId of purchasedCourses) {
        const course = await databaseService.getCourseById(courseId);
        if (course) {
          message += `✅ ${course.title}\n👨‍🏫 ${course.instructor}\n\n`;
        }
      }

      message += '🌐 Saytga kirib darslarni boshlang: https://your-domain.com';
      
      await this.sendMessage(chatId, message);
    } catch (error) {
      console.error('Error showing user courses:', error);
    }
  }

  private async sendMessage(chatId: string, text: string): Promise<void> {
    try {
      await fetch(`${this.botUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML'
        })
      });
    } catch (error) {
      console.error('Telegram send message error:', error);
    }
  }

  // Webhook URL ni o'rnatish
  async setWebhook(webhookUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.botUrl}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl
        })
      });

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('Error setting webhook:', error);
      return false;
    }
  }
}

export const telegramService = new TelegramService();