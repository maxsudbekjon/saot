// Database Service - Ma'lumotlar bazasi bilan ishlash uchun
import { User, Course, Lesson } from '../types';

// Mock database - real loyihada PostgreSQL yoki boshqa DB ishlatiladi
class DatabaseService {
  private users: User[] = [
    {
      id: '1',
      name: 'Admin Foydalanuvchi',
      email: 'admin@saot.uz',
      telegramUsername: 'admin_saot',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'admin',
      enrolledCourses: [],
      completedCourses: [],
      paidCourses: [],
      progress: {},
      createdAt: '2024-01-01',
      profile: {
        phone: '+998901234567',
        bio: 'SAOT platform administratori',
        location: 'Toshkent, O\'zbekiston'
      }
    },
    {
      id: '2',
      name: 'Alijon Karimov',
      email: 'alijon@saot.uz',
      telegramUsername: 'alijon_dev',
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'user',
      enrolledCourses: ['1', '2'],
      completedCourses: [],
      paidCourses: ['1'],
      progress: { '1': 75, '2': 45 },
      createdAt: '2024-01-15',
      profile: {
        phone: '+998901234568',
        bio: 'Dasturlashni o\'rganuvchi',
        location: 'Samarqand, O\'zbekiston'
      }
    }
  ];

  private courses: Course[] = [
    {
      id: '1',
      title: 'Python Dasturlash - Noldan Professionalgacha',
      description: 'Python dasturlash tilini noldan o\'rganing. Backend development, data science va automation uchun zarur bo\'lgan barcha bilimlar.',
      instructor: 'Alijon Karimov',
      instructorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      duration: '15 soat',
      lessons: 52,
      students: 3240,
      rating: 4.9,
      price: 399000,
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Dasturlash',
      level: 'Boshlang\'ich',
      tags: ['Python', 'Backend', 'Django', 'Flask', 'API'],
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      title: 'Video Montaj - Adobe Premiere Pro',
      description: 'Professional video montaj qilishni o\'rganing. Adobe Premiere Pro dasturida mukammal videolar yarating.',
      instructor: 'Madina Usmanova',
      instructorAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      duration: '20 soat',
      lessons: 65,
      students: 2890,
      rating: 4.8,
      price: 299000,
      thumbnail: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Video Montaj',
      level: 'O\'rta',
      tags: ['Premiere Pro', 'Video', 'Montaj', 'Adobe'],
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '3',
      title: 'Grafik Dizayn - Photoshop va Illustrator',
      description: 'Professional grafik dizayn yaratishni o\'rganing. Logo, banner va reklama materiallari tayyorlash.',
      instructor: 'Bobur Rahimov',
      instructorAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      duration: '18 soat',
      lessons: 48,
      students: 1850,
      rating: 4.7,
      price: 349000,
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Grafik Dizayn',
      level: 'Boshlang\'ich',
      tags: ['Photoshop', 'Illustrator', 'Dizayn', 'Logo'],
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '4',
      title: 'Digital Marketing va SMM',
      description: 'Ijtimoiy tarmoqlarda marketing, content yaratish va reklama strategiyalari o\'rganing.',
      instructor: 'Zarina Abdullayeva',
      instructorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      duration: '16 soat',
      lessons: 55,
      students: 3200,
      rating: 4.6,
      price: 249000,
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Marketing',
      level: 'Boshlang\'ich',
      tags: ['SMM', 'Digital Marketing', 'Instagram', 'Facebook'],
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '5',
      title: 'Web Dizayn - Figma va UI/UX',
      description: 'Zamonaviy web dizayn yaratish, Figma dasturida ishlash va foydalanuvchi tajribasi dizayni.',
      instructor: 'Dilshod Tursunov',
      instructorAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      duration: '22 soat',
      lessons: 68,
      students: 1670,
      rating: 4.8,
      price: 399000,
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Web Dizayn',
      level: 'O\'rta',
      tags: ['Figma', 'UI/UX', 'Web Dizayn', 'Prototyping'],
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '6',
      title: 'Ingliz Tili - Umumiy Kurs',
      description: 'Ingliz tilini noldan o\'rganing. Grammatika, lug\'at va gapirish ko\'nikmalarini rivojlantiring.',
      instructor: 'Nargiza Ismoilova',
      instructorAvatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
      duration: '25 soat',
      lessons: 75,
      students: 4500,
      rating: 4.9,
      price: 199000,
      thumbnail: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Til O\'rganish',
      level: 'Boshlang\'ich',
      tags: ['Ingliz Tili', 'Grammar', 'Speaking', 'Vocabulary'],
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  private lessons: { [courseId: string]: Lesson[] } = {
    '1': [
      {
        id: '1-1',
        courseId: '1',
        title: 'Python ga kirish va muhitni sozlash',
        duration: '15:30',
        completed: false,
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        description: 'Python dasturlash tili bilan tanishish va ishchi muhitni sozlash',
        order: 1,
        isFree: true
      },
      {
        id: '1-2',
        courseId: '1',
        title: 'O\'zgaruvchilar va ma\'lumot turlari',
        duration: '22:45',
        completed: false,
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        description: 'Python da o\'zgaruvchilar va asosiy ma\'lumot turlari',
        order: 2,
        isFree: true
      },
      {
        id: '1-3',
        courseId: '1',
        title: 'Shartli operatorlar',
        duration: '28:15',
        completed: false,
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        description: 'If, elif, else operatorlari bilan ishlash',
        order: 3,
        isFree: false
      },
      {
        id: '1-4',
        courseId: '1',
        title: 'Sikllar (for va while)',
        duration: '35:20',
        completed: false,
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        description: 'For va while sikllari bilan ishlash',
        order: 4,
        isFree: false
      },
      {
        id: '1-5',
        courseId: '1',
        title: 'Funksiyalar',
        duration: '18:45',
        completed: false,
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        description: 'Funksiyalar yaratish va ulardan foydalanish',
        order: 5,
        isFree: false
      }
    ],
    '2': [
      {
        id: '2-1',
        courseId: '2',
        title: 'Adobe Premiere Pro ga kirish',
        duration: '20:30',
        completed: false,
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        description: 'Premiere Pro interfeysi va asosiy vositalar',
        order: 1,
        isFree: true
      },
      {
        id: '2-2',
        courseId: '2',
        title: 'Video import va timeline',
        duration: '25:15',
        completed: false,
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        description: 'Video fayllarni import qilish va timeline da ishlash',
        order: 2,
        isFree: true
      },
      {
        id: '2-3',
        courseId: '2',
        title: 'Video kesish va tahrirlash',
        duration: '30:45',
        completed: false,
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        description: 'Video kliplarni kesish va tahrirlash usullari',
        order: 3,
        isFree: false
      }
    ],
    '3': [
      {
        id: '3-1',
        courseId: '3',
        title: 'Photoshop ga kirish',
        duration: '18:20',
        completed: false,
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        description: 'Adobe Photoshop interfeysi va asosiy vositalar',
        order: 1,
        isFree: true
      },
      {
        id: '3-2',
        courseId: '3',
        title: 'Layerlar bilan ishlash',
        duration: '24:45',
        completed: false,
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        description: 'Photoshop da layerlar va ularning turlari',
        order: 2,
        isFree: true
      }
    ]
  };

  // User operations
  async getUserByTelegramUsername(telegramUsername: string): Promise<User | null> {
    return this.users.find(user => user.telegramUsername === telegramUsername) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    return this.users[userIndex];
  }

  // Course operations
  async getAllCourses(): Promise<Course[]> {
    return [...this.courses];
  }

  async getCourseById(id: string): Promise<Course | null> {
    return this.courses.find(course => course.id === id) || null;
  }

  async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course | null> {
    const courseIndex = this.courses.findIndex(course => course.id === id);
    if (courseIndex === -1) return null;
    
    this.courses[courseIndex] = { 
      ...this.courses[courseIndex], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.courses[courseIndex];
  }

  async deleteCourse(id: string): Promise<boolean> {
    const courseIndex = this.courses.findIndex(course => course.id === id);
    if (courseIndex === -1) return false;
    
    this.courses.splice(courseIndex, 1);
    // Darslarni ham o'chirish
    delete this.lessons[id];
    return true;
  }

  // Lesson operations
  async getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
    return this.lessons[courseId] || [];
  }

  async getLessonById(lessonId: string): Promise<Lesson | null> {
    for (const courseId in this.lessons) {
      const lesson = this.lessons[courseId].find(l => l.id === lessonId);
      if (lesson) return lesson;
    }
    return null;
  }

  async createLesson(lessonData: Omit<Lesson, 'id'>): Promise<Lesson> {
    const newLesson: Lesson = {
      ...lessonData,
      id: `${lessonData.courseId}-${Date.now()}`
    };
    
    if (!this.lessons[lessonData.courseId]) {
      this.lessons[lessonData.courseId] = [];
    }
    
    this.lessons[lessonData.courseId].push(newLesson);
    
    // Kurs darslar sonini yangilash
    const course = this.courses.find(c => c.id === lessonData.courseId);
    if (course) {
      course.lessons = this.lessons[lessonData.courseId].length;
    }
    
    return newLesson;
  }

  async updateLesson(lessonId: string, updates: Partial<Lesson>): Promise<Lesson | null> {
    for (const courseId in this.lessons) {
      const lessonIndex = this.lessons[courseId].findIndex(l => l.id === lessonId);
      if (lessonIndex !== -1) {
        this.lessons[courseId][lessonIndex] = { 
          ...this.lessons[courseId][lessonIndex], 
          ...updates 
        };
        return this.lessons[courseId][lessonIndex];
      }
    }
    return null;
  }

  async deleteLesson(lessonId: string): Promise<boolean> {
    for (const courseId in this.lessons) {
      const lessonIndex = this.lessons[courseId].findIndex(l => l.id === lessonId);
      if (lessonIndex !== -1) {
        this.lessons[courseId].splice(lessonIndex, 1);
        
        // Kurs darslar sonini yangilash
        const course = this.courses.find(c => c.id === courseId);
        if (course) {
          course.lessons = this.lessons[courseId].length;
        }
        
        return true;
      }
    }
    return false;
  }

  // Purchase operations
  async purchaseCourse(userId: string, courseId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) return false;

    if (!user.paidCourses.includes(courseId)) {
      user.paidCourses.push(courseId);
    }
    
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
    }

    // Kurs statistikasini yangilash
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      course.students += 1;
    }

    await this.updateUser(userId, user);
    return true;
  }

  async hasUserPurchasedCourse(userId: string, courseId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    return user ? user.paidCourses.includes(courseId) : false;
  }

  // Progress operations
  async updateLessonProgress(userId: string, lessonId: string, completed: boolean): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) return false;

    const lesson = await this.getLessonById(lessonId);
    if (!lesson) return false;

    // Progress ni yangilash
    if (!user.progress[lesson.courseId]) {
      user.progress[lesson.courseId] = 0;
    }

    const courseLessons = await this.getLessonsByCourseId(lesson.courseId);
    const completedLessons = courseLessons.filter(l => l.completed).length;
    const totalLessons = courseLessons.length;
    
    if (completed && totalLessons > 0) {
      user.progress[lesson.courseId] = Math.round(((completedLessons + 1) / totalLessons) * 100);
    }

    await this.updateUser(userId, user);
    return true;
  }

  // Telegram bot integration
  async purchaseCourseByTelegramUsername(telegramUsername: string, courseId: string): Promise<boolean> {
    const user = await this.getUserByTelegramUsername(telegramUsername);
    if (!user) return false;
    
    return await this.purchaseCourse(user.id, courseId);
  }

  async getUserPurchasesByTelegramUsername(telegramUsername: string): Promise<string[]> {
    const user = await this.getUserByTelegramUsername(telegramUsername);
    return user ? user.paidCourses : [];
  }

  // Statistics
  async getStatistics(): Promise<{
    totalUsers: number;
    totalCourses: number;
    totalStudents: number;
    totalRevenue: number;
    coursesByCategory: { [category: string]: number };
  }> {
    const totalUsers = this.users.length;
    const totalCourses = this.courses.length;
    const totalStudents = this.courses.reduce((sum, course) => sum + course.students, 0);
    const totalRevenue = this.users.reduce((sum, user) => {
      return sum + user.paidCourses.reduce((courseSum, courseId) => {
        const course = this.courses.find(c => c.id === courseId);
        return courseSum + (course ? course.price : 0);
      }, 0);
    }, 0);

    const coursesByCategory: { [category: string]: number } = {};
    this.courses.forEach(course => {
      coursesByCategory[course.category] = (coursesByCategory[course.category] || 0) + 1;
    });

    return {
      totalUsers,
      totalCourses,
      totalStudents,
      totalRevenue,
      coursesByCategory
    };
  }

  // Search and filter
  async searchCourses(query: string, category?: string, level?: string): Promise<Course[]> {
    let filteredCourses = this.courses;

    if (query) {
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (category && category !== 'Barcha Kategoriyalar') {
      filteredCourses = filteredCourses.filter(course => course.category === category);
    }

    if (level && level !== 'Barcha Darajalar') {
      filteredCourses = filteredCourses.filter(course => course.level === level);
    }

    return filteredCourses;
  }

  // Categories
  async getAllCategories(): Promise<string[]> {
    const categories = [...new Set(this.courses.map(course => course.category))];
    return categories;
  }
}

// Singleton instance
export const databaseService = new DatabaseService();