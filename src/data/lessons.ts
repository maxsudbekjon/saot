import { Lesson } from '../types';

export const lessons: { [courseId: string]: Lesson[] } = {
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
    },
    {
      id: '1-6',
      courseId: '1',
      title: 'Ro\'yxatlar (Lists)',
      duration: '25:30',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'Python da ro\'yxatlar bilan ishlash',
      order: 6,
      isFree: false
    },
    {
      id: '1-7',
      courseId: '1',
      title: 'Lug\'atlar (Dictionaries)',
      duration: '20:15',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'Dictionary ma\'lumot tuzilmasi',
      order: 7,
      isFree: false
    },
    {
      id: '1-8',
      courseId: '1',
      title: 'Fayllar bilan ishlash',
      duration: '30:45',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'Fayllarni o\'qish va yozish',
      order: 8,
      isFree: false
    }
  ],
  '2': [
    {
      id: '2-1',
      courseId: '2',
      title: 'HTML asoslari',
      duration: '20:30',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'HTML teglar va tuzilma',
      order: 1,
      isFree: true
    },
    {
      id: '2-2',
      courseId: '2',
      title: 'CSS bilan dizayn',
      duration: '25:15',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'CSS selektorlar va stillar',
      order: 2,
      isFree: true
    },
    {
      id: '2-3',
      courseId: '2',
      title: 'JavaScript asoslari',
      duration: '30:45',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'JavaScript sintaksis va asosiy tushunchalar',
      order: 3,
      isFree: false
    },
    {
      id: '2-4',
      courseId: '2',
      title: 'React ga kirish',
      duration: '40:20',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'React library bilan tanishish',
      order: 4,
      isFree: false
    },
    {
      id: '2-5',
      courseId: '2',
      title: 'React Hooks',
      duration: '35:10',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'useState, useEffect va boshqa hooklar',
      order: 5,
      isFree: false
    },
    {
      id: '2-6',
      courseId: '2',
      title: 'Node.js Backend',
      duration: '45:30',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'Server yaratish va API endpoints',
      order: 6,
      isFree: false
    }
  ],
  '3': [
    {
      id: '3-1',
      courseId: '3',
      title: 'Data Science ga kirish',
      duration: '25:00',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'Ma\'lumotlar fani asoslari',
      order: 1,
      isFree: true
    },
    {
      id: '3-2',
      courseId: '3',
      title: 'Pandas kutubxonasi',
      duration: '35:20',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'Ma\'lumotlarni qayta ishlash',
      order: 2,
      isFree: true
    },
    {
      id: '3-3',
      courseId: '3',
      title: 'NumPy bilan ishlash',
      duration: '28:45',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'Matematik hisoblashlar',
      order: 3,
      isFree: false
    }
  ],
  '4': [
    {
      id: '4-1',
      courseId: '4',
      title: 'Flutter ga kirish',
      duration: '22:30',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'Flutter framework asoslari',
      order: 1,
      isFree: true
    },
    {
      id: '4-2',
      courseId: '4',
      title: 'Dart dasturlash tili',
      duration: '30:15',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'Dart sintaksis va xususiyatlari',
      order: 2,
      isFree: true
    }
  ],
  '5': [
    {
      id: '5-1',
      courseId: '5',
      title: 'Digital Marketing asoslari',
      duration: '18:20',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'Raqamli marketing strategiyalari',
      order: 1,
      isFree: true
    },
    {
      id: '5-2',
      courseId: '5',
      title: 'SMM strategiyalari',
      duration: '24:45',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'Ijtimoiy tarmoqlarda marketing',
      order: 2,
      isFree: true
    }
  ],
  '6': [
    {
      id: '6-1',
      courseId: '6',
      title: 'Grafik dizayn asoslari',
      duration: '20:10',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'Dizayn tamoyillari va asoslar',
      order: 1,
      isFree: true
    },
    {
      id: '6-2',
      courseId: '6',
      title: 'Figma bilan ishlash',
      duration: '32:30',
      completed: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'Figma dasturida dizayn yaratish',
      order: 2,
      isFree: true
    }
  ]
};