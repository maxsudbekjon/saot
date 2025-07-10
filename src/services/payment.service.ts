// Payment Service - To'lov tizimi uchun
import { PaymentData, PaymentResult } from '../types';
import { telegramService } from './telegram.service';

export interface PaymentProvider {
  name: string;
  processPayment(data: PaymentData): Promise<PaymentResult>;
  verifyPayment(transactionId: string): Promise<boolean>;
}

// Telegram Payment Provider - Telegram bot orqali to'lov
class TelegramPaymentProvider implements PaymentProvider {
  name = 'Telegram';

  async processPayment(data: PaymentData): Promise<PaymentResult> {
    try {
      // Telegram botga yo'naltirish URL yaratish
      const telegramUrl = telegramService.redirectToTelegramBot(
        data.courseId, 
        data.courseName, 
        data.amount
      );

      return {
        success: true,
        transactionId: `telegram_${Date.now()}`,
        paymentUrl: telegramUrl
      };
    } catch (error) {
      return {
        success: false,
        error: 'Telegram bot bilan bog\'lanishda xatolik'
      };
    }
  }

  async verifyPayment(transactionId: string): Promise<boolean> {
    // Telegram bot orqali to'lov tasdiqlanadi
    return true;
  }
}

// Mock Payment Provider - Demo uchun
class MockPaymentProvider implements PaymentProvider {
  name = 'Mock';

  async processPayment(data: PaymentData): Promise<PaymentResult> {
    // Demo uchun har doim muvaffaqiyatli
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `mock_${Date.now()}`,
          paymentUrl: '#'
        });
      }, 1000);
    });
  }

  async verifyPayment(transactionId: string): Promise<boolean> {
    return true;
  }
}

// Payment Service - barcha to'lov providerlarini boshqaradi
class PaymentService {
  private providers: Map<string, PaymentProvider> = new Map();
  private defaultProvider: string = 'telegram';

  constructor() {
    // Telegram provider - asosiy to'lov usuli
    this.providers.set('telegram', new TelegramPaymentProvider());
    
    // Mock provider - demo uchun
    this.providers.set('mock', new MockPaymentProvider());
  }

  // To'lov jarayonini boshlash
  async initiatePayment(data: PaymentData, providerName?: string): Promise<PaymentResult> {
    const provider = this.providers.get(providerName || this.defaultProvider);
    
    if (!provider) {
      return {
        success: false,
        error: 'To\'lov tizimi topilmadi'
      };
    }

    return await provider.processPayment(data);
  }

  // To'lovni tasdiqlash
  async verifyPayment(transactionId: string, providerName?: string): Promise<boolean> {
    const provider = this.providers.get(providerName || this.defaultProvider);
    
    if (!provider) {
      return false;
    }

    return await provider.verifyPayment(transactionId);
  }

  // Mavjud to'lov providerlarini olish
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  // Default providerni o'zgartirish
  setDefaultProvider(providerName: string): void {
    if (this.providers.has(providerName)) {
      this.defaultProvider = providerName;
    }
  }
}

// Singleton instance
export const paymentService = new PaymentService();