export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  price: number;
  thumbnail: string;
  category: string;
  level: 'Boshlang\'ich' | 'O\'rta' | 'Yuqori';
  tags: string[];
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  telegramUsername: string; // Telegram username orqali ro'yxatdan o'tish
  avatar: string;
  role: 'admin' | 'user';
  enrolledCourses: string[];
  completedCourses: string[];
  paidCourses: string[];
  progress: { [courseId: string]: number };
  createdAt: string;
  profile: {
    phone?: string;
    bio?: string;
    location?: string;
    birthDate?: string;
  };
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl: string;
  description: string;
  order: number;
  isFree: boolean; // Birinchi 2 ta dars bepul
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface PaymentData {
  amount: number;
  currency: string;
  courseId: string;
  userId: string;
  userEmail: string;
  courseName: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  error?: string;
}

// Qurilma sessiya uchun yangi interface
export interface DeviceSession {
  id: string;
  userId: string;
  deviceId: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    browser: string;
    ip?: string;
    location?: string;
  };
  loginTime: string;
  lastActivity: string;
  isActive: boolean;
}

// Session xatolik turlari
export interface SessionError {
  type: 'DEVICE_LIMIT_EXCEEDED' | 'SESSION_EXPIRED' | 'INVALID_SESSION';
  message: string;
  activeDevices?: DeviceSession[];
}