// Session Service - Qurilma sessiyalarini boshqarish
import { DeviceSession, SessionError, User } from '../types';

class SessionService {
  private sessions: Map<string, DeviceSession[]> = new Map(); // userId -> sessions
  private readonly MAX_DEVICES_PER_USER = 2; // Maksimal 2 ta qurilma
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 daqiqa (milliseconds)

  // Qurilma ma'lumotlarini olish
  private getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    // Browser aniqlash
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    return {
      userAgent,
      platform,
      browser,
      ip: 'Unknown', // Real loyihada IP address olish kerak
      location: 'Unknown' // Real loyihada geolocation
    };
  }

  // Unique device ID yaratish
  private generateDeviceId(): string {
    const deviceInfo = this.getDeviceInfo();
    const fingerprint = `${deviceInfo.userAgent}-${deviceInfo.platform}-${Date.now()}`;
    return btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  // Foydalanuvchi uchun yangi sessiya yaratish
  async createSession(user: User): Promise<{ success: boolean; error?: SessionError; deviceId?: string }> {
    const userId = user.id;
    const deviceId = this.generateDeviceId();
    const currentTime = new Date().toISOString();

    // Mavjud sessiyalarni tekshirish
    const userSessions = this.sessions.get(userId) || [];
    
    // Eski sessiyalarni tozalash
    const activeSessions = userSessions.filter(session => 
      session.isActive && 
      (Date.now() - new Date(session.lastActivity).getTime()) < this.SESSION_TIMEOUT
    );

    // Maksimal qurilma limitini tekshirish
    if (activeSessions.length >= this.MAX_DEVICES_PER_USER) {
      return {
        success: false,
        error: {
          type: 'DEVICE_LIMIT_EXCEEDED',
          message: `Maksimal ${this.MAX_DEVICES_PER_USER} ta qurilmada kirish mumkin. Boshqa qurilmadan chiqing.`,
          activeDevices: activeSessions
        }
      };
    }

    // Yangi sessiya yaratish
    const newSession: DeviceSession = {
      id: `session_${Date.now()}`,
      userId,
      deviceId,
      deviceInfo: this.getDeviceInfo(),
      loginTime: currentTime,
      lastActivity: currentTime,
      isActive: true
    };

    // Sessiyani saqlash
    activeSessions.push(newSession);
    this.sessions.set(userId, activeSessions);

    // Local storage ga device ID saqlash
    localStorage.setItem('deviceId', deviceId);
    localStorage.setItem('sessionId', newSession.id);

    return {
      success: true,
      deviceId
    };
  }

  // Sessiyani yangilash (faollik vaqtini)
  async updateSessionActivity(userId: string, deviceId: string): Promise<boolean> {
    const userSessions = this.sessions.get(userId) || [];
    const sessionIndex = userSessions.findIndex(s => s.deviceId === deviceId && s.isActive);
    
    if (sessionIndex !== -1) {
      userSessions[sessionIndex].lastActivity = new Date().toISOString();
      this.sessions.set(userId, userSessions);
      return true;
    }
    
    return false;
  }

  // Sessiyani tekshirish
  async validateSession(userId: string, deviceId: string): Promise<{ valid: boolean; error?: SessionError }> {
    const userSessions = this.sessions.get(userId) || [];
    const session = userSessions.find(s => s.deviceId === deviceId && s.isActive);

    if (!session) {
      return {
        valid: false,
        error: {
          type: 'INVALID_SESSION',
          message: 'Sessiya topilmadi yoki yaroqsiz'
        }
      };
    }

    // Sessiya vaqtini tekshirish
    const timeSinceLastActivity = Date.now() - new Date(session.lastActivity).getTime();
    if (timeSinceLastActivity > this.SESSION_TIMEOUT) {
      // Sessiyani o'chirish
      session.isActive = false;
      this.sessions.set(userId, userSessions);
      
      return {
        valid: false,
        error: {
          type: 'SESSION_EXPIRED',
          message: 'Sessiya muddati tugagan. Qaytadan kiring.'
        }
      };
    }

    // Faollikni yangilash
    await this.updateSessionActivity(userId, deviceId);
    return { valid: true };
  }

  // Foydalanuvchining barcha sessiyalarini olish
  async getUserSessions(userId: string): Promise<DeviceSession[]> {
    const userSessions = this.sessions.get(userId) || [];
    return userSessions.filter(session => session.isActive);
  }

  // Boshqa qurilmalardan chiqarish
  async terminateOtherSessions(userId: string, currentDeviceId: string): Promise<boolean> {
    const userSessions = this.sessions.get(userId) || [];
    
    // Joriy qurilmadan boshqa barcha sessiyalarni o'chirish
    const updatedSessions = userSessions.map(session => {
      if (session.deviceId !== currentDeviceId) {
        session.isActive = false;
      }
      return session;
    });

    this.sessions.set(userId, updatedSessions);
    return true;
  }

  // Sessiyani tugatish (logout)
  async terminateSession(userId: string, deviceId: string): Promise<boolean> {
    const userSessions = this.sessions.get(userId) || [];
    const sessionIndex = userSessions.findIndex(s => s.deviceId === deviceId);
    
    if (sessionIndex !== -1) {
      userSessions[sessionIndex].isActive = false;
      this.sessions.set(userId, userSessions);
      
      // Local storage dan tozalash
      localStorage.removeItem('deviceId');
      localStorage.removeItem('sessionId');
      
      return true;
    }
    
    return false;
  }

  // Barcha eski sessiyalarni tozalash
  async cleanupExpiredSessions(): Promise<void> {
    const currentTime = Date.now();
    
    for (const [userId, sessions] of this.sessions.entries()) {
      const activeSessions = sessions.filter(session => {
        const timeSinceLastActivity = currentTime - new Date(session.lastActivity).getTime();
        return session.isActive && timeSinceLastActivity < this.SESSION_TIMEOUT;
      });
      
      this.sessions.set(userId, activeSessions);
    }
  }

  // Statistika olish
  async getSessionStats(): Promise<{
    totalActiveSessions: number;
    userCount: number;
    averageSessionsPerUser: number;
  }> {
    let totalActiveSessions = 0;
    const userCount = this.sessions.size;
    
    for (const sessions of this.sessions.values()) {
      totalActiveSessions += sessions.filter(s => s.isActive).length;
    }
    
    return {
      totalActiveSessions,
      userCount,
      averageSessionsPerUser: userCount > 0 ? totalActiveSessions / userCount : 0
    };
  }
}

// Singleton instance
export const sessionService = new SessionService();

// Har 5 daqiqada eski sessiyalarni tozalash
setInterval(() => {
  sessionService.cleanupExpiredSessions();
}, 5 * 60 * 1000);