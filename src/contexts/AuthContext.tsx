import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, SessionError } from '../types';
import { databaseService } from '../services/database.service';
import { sessionService } from '../services/session.service';

interface AuthContextType extends AuthState {
  login: (telegramUsername: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, telegramUsername: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  purchaseCourse: (courseId: string) => void;
  hasAccessToCourse: (courseId: string) => boolean;
  checkDatabaseForUpdates: () => Promise<void>;
  terminateOtherDevices: () => Promise<boolean>;
  getActiveSessions: () => Promise<any[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true
  });

  useEffect(() => {
    initializeAuth();
    
    // Har 30 soniyada sessiyani tekshirish
    const sessionInterval = setInterval(() => {
      if (authState.user) {
        validateCurrentSession();
      }
    }, 30000);

    // Har 2 daqiqada database ni tekshirish
    const dbInterval = setInterval(() => {
      if (authState.user) {
        checkDatabaseForUpdates(authState.user.id);
      }
    }, 120000);

    return () => {
      clearInterval(sessionInterval);
      clearInterval(dbInterval);
    };
  }, []);

  const initializeAuth = async () => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const deviceId = localStorage.getItem('deviceId');
      
      if (storedUser && deviceId) {
        const user = JSON.parse(storedUser);
        
        // Sessiyani tekshirish
        const sessionValidation = await sessionService.validateSession(user.id, deviceId);
        
        if (sessionValidation.valid) {
          setAuthState({
            isAuthenticated: true,
            user,
            loading: false
          });
          
          // Database dan yangilanishlarni tekshirish
          await checkDatabaseForUpdates(user.id);
        } else {
          // Sessiya yaroqsiz - logout
          await handleSessionError(sessionValidation.error);
        }
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const validateCurrentSession = async () => {
    if (!authState.user) return;
    
    const deviceId = localStorage.getItem('deviceId');
    if (!deviceId) return;

    const sessionValidation = await sessionService.validateSession(authState.user.id, deviceId);
    
    if (!sessionValidation.valid) {
      await handleSessionError(sessionValidation.error);
    }
  };

  const handleSessionError = async (error?: SessionError) => {
    if (error) {
      switch (error.type) {
        case 'DEVICE_LIMIT_EXCEEDED':
          alert(`⚠️ Qurilma Limiti!\n\n${error.message}\n\nFaol qurilmalar: ${error.activeDevices?.length || 0}`);
          break;
        case 'SESSION_EXPIRED':
          alert(`⏰ Sessiya Tugadi!\n\n${error.message}`);
          break;
        case 'INVALID_SESSION':
          alert(`🔒 Sessiya Xatoligi!\n\n${error.message}`);
          break;
      }
    }
    
    // Logout
    logout();
  };

  const checkDatabaseForUpdates = async (userId?: string) => {
    if (!userId && !authState.user) return;
    
    try {
      const currentUserId = userId || authState.user!.id;
      const updatedUser = await databaseService.getUserById(currentUserId);
      
      if (updatedUser && authState.user) {
        // Agar database da o'zgarishlar bo'lsa, local state ni yangilash
        if (JSON.stringify(updatedUser.paidCourses) !== JSON.stringify(authState.user.paidCourses)) {
          setAuthState(prev => ({
            ...prev,
            user: updatedUser
          }));
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Error checking database updates:', error);
    }
  };

  const login = async (telegramUsername: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const user = await databaseService.getUserByTelegramUsername(telegramUsername);
      if (!user || password !== 'password') { // Demo uchun har qanday parol
        return { success: false, error: 'Telegram username yoki parol noto\'g\'ri' };
      }

      // Sessiya yaratish
      const sessionResult = await sessionService.createSession(user);
      
      if (!sessionResult.success) {
        const error = sessionResult.error!;
        
        if (error.type === 'DEVICE_LIMIT_EXCEEDED') {
          // Foydalanuvchiga boshqa qurilmalardan chiqish imkoniyatini berish
          const shouldTerminateOthers = confirm(
            `⚠️ Maksimal ${error.activeDevices?.length || 2} ta qurilmada kirilgan!\n\n` +
            `Faol qurilmalar:\n${error.activeDevices?.map(d => `• ${d.deviceInfo.browser} (${d.deviceInfo.platform})`).join('\n') || ''}\n\n` +
            `Boshqa qurilmalardan chiqib, bu qurilmada kirishni xohlaysizmi?`
          );
          
          if (shouldTerminateOthers) {
            // Boshqa sessiyalarni tugatish
            await sessionService.terminateOtherSessions(user.id, '');
            
            // Qaytadan sessiya yaratishga harakat
            const retryResult = await sessionService.createSession(user);
            if (!retryResult.success) {
              return { success: false, error: retryResult.error?.message || 'Sessiya yaratishda xatolik' };
            }
          } else {
            return { success: false, error: error.message };
          }
        } else {
          return { success: false, error: error.message };
        }
      }

      setAuthState({
        isAuthenticated: true,
        user,
        loading: false
      });
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Tizimda xatolik yuz berdi' };
    }
  };

  const register = async (name: string, telegramUsername: string, password: string): Promise<boolean> => {
    try {
      const existingUser = await databaseService.getUserByTelegramUsername(telegramUsername);
      if (existingUser) {
        return false; // User already exists
      }

      const newUser = await databaseService.createUser({
        name,
        email: `${telegramUsername}@saot.uz`,
        telegramUsername,
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'user',
        enrolledCourses: [],
        completedCourses: [],
        paidCourses: [],
        progress: {},
        profile: {}
      });

      // Sessiya yaratish
      const sessionResult = await sessionService.createSession(newUser);
      if (!sessionResult.success) {
        console.error('Session creation failed:', sessionResult.error);
        return false;
      }

      setAuthState({
        isAuthenticated: true,
        user: newUser,
        loading: false
      });
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = async () => {
    if (authState.user) {
      const deviceId = localStorage.getItem('deviceId');
      if (deviceId) {
        await sessionService.terminateSession(authState.user.id, deviceId);
      }
    }
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false
    });
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      databaseService.updateUser(authState.user.id, updatedUser);
    }
  };

  const purchaseCourse = async (courseId: string) => {
    if (authState.user) {
      const success = await databaseService.purchaseCourse(authState.user.id, courseId);
      if (success) {
        const updatedUser = {
          ...authState.user,
          paidCourses: [...authState.user.paidCourses, courseId],
          enrolledCourses: authState.user.enrolledCourses.includes(courseId) 
            ? authState.user.enrolledCourses 
            : [...authState.user.enrolledCourses, courseId]
        };
        updateProfile(updatedUser);
      }
    }
  };

  const hasAccessToCourse = (courseId: string): boolean => {
    return authState.user?.paidCourses.includes(courseId) || false;
  };

  const terminateOtherDevices = async (): Promise<boolean> => {
    if (!authState.user) return false;
    
    const deviceId = localStorage.getItem('deviceId');
    if (!deviceId) return false;
    
    return await sessionService.terminateOtherSessions(authState.user.id, deviceId);
  };

  const getActiveSessions = async () => {
    if (!authState.user) return [];
    return await sessionService.getUserSessions(authState.user.id);
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      updateProfile,
      purchaseCourse,
      hasAccessToCourse,
      checkDatabaseForUpdates: () => checkDatabaseForUpdates(),
      terminateOtherDevices,
      getActiveSessions
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};