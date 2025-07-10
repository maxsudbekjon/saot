import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Clock, Users, BookOpen, Star, Download, Share2, Heart, CheckCircle, Lock, Send, Award } from 'lucide-react';
import { Course } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../services/database.service';
import { telegramService } from '../../services/telegram.service';
import LessonViewer from './LessonViewer';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onEnroll: (courseId: string) => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack, onEnroll }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [courseLessons, setCourseLessons] = useState<any[]>([]);
  const { isAuthenticated, user, hasAccessToCourse, checkDatabaseForUpdates } = useAuth();

  const hasAccess = hasAccessToCourse(course.id);

  useEffect(() => {
    const loadLessons = async () => {
      const lessons = await databaseService.getLessonsByCourseId(course.id);
      setCourseLessons(lessons);
    };
    loadLessons();
  }, [course.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkDatabaseForUpdates();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (currentLesson) {
    const lesson = courseLessons.find(l => l.id === currentLesson);
    if (lesson) {
      const currentIndex = courseLessons.findIndex(l => l.id === currentLesson);
      
      return (
        <LessonViewer
          lesson={lesson}
          course={course}
          allLessons={courseLessons}
          onBack={() => setCurrentLesson(null)}
          onNextLesson={() => {
            const nextLesson = courseLessons[currentIndex + 1];
            if (nextLesson) setCurrentLesson(nextLesson.id);
          }}
          onPrevLesson={() => {
            const prevLesson = courseLessons[currentIndex - 1];
            if (prevLesson) setCurrentLesson(prevLesson.id);
          }}
        />
      );
    }
  }

  const handleTelegramPayment = async () => {
    setIsProcessingPayment(true);

    try {
      const telegramUrl = telegramService.redirectToTelegramBot(
        course.id, 
        course.title, 
        course.price
      );

      window.open(telegramUrl, '_blank');
      
      alert(`
🤖 Telegram botga yo'naltirildi!

📱 @SAOT_django_bot ga o'ting
💳 Kursni sotib oling
🔄 Saytga qaytib keling

Database avtomatik yangilanadi va kurs ochiladi.
      `);

    } catch (error) {
      console.error('Telegram redirect error:', error);
      alert('Telegram bot bilan bog\'lanishda xatolik yuz berdi');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleLessonClick = (lessonId: string, lessonIndex: number) => {
    if (lessonIndex < 2) {
      setCurrentLesson(lessonId);
    } else if (hasAccess) {
      setCurrentLesson(lessonId);
    } else {
      alert(`
🔒 Bu dars faqat to'lov qilgan foydalanuvchilar uchun!

💳 Kursni sotib olish uchun:
1. Telegram botga o'ting: @SAOT_django_bot
2. Kursni sotib oling
3. Saytga qaytib keling

Database avtomatik yangilanadi va barcha darslar ochiladi.
      `);
    }
  };

  const reviews = [
    {
      id: '1',
      name: 'Aziz Karimov',
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      comment: 'Juda yaxshi kurs! O\'qituvchi juda tushunarli tushuntiradi. Amaliy loyihalar ajoyib.',
      date: '2 hafta oldin'
    },
    {
      id: '2',
      name: 'Malika Toshmatova',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      comment: 'Professional darajada tayyorlangan kurs. Ish topishda juda yordam berdi. Tavsiya qilaman!',
      date: '1 oy oldin'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Umumiy ma\'lumot' },
    { id: 'curriculum', label: 'Dars rejasi' },
    { id: 'reviews', label: 'Sharhlar' },
    { id: 'instructor', label: 'O\'qituvchi' }
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button 
          onClick={onBack}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-8 transition-colors duration-200 font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-secondary-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Orqaga qaytish
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-medium border border-primary-200">
                  {course.category}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  course.level === 'Boshlang\'ich' ? 'bg-green-100 text-green-600 border border-green-200' :
                  course.level === 'O\'rta' ? 'bg-yellow-100 text-yellow-600 border border-yellow-200' :
                  'bg-red-100 text-red-600 border border-red-200'
                }`}>
                  {course.level}
                </span>
                {hasAccess && (
                  <span className="bg-primary-100 text-primary-600 px-4 py-2 rounded-full text-sm font-medium flex items-center border border-primary-200">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Sotib olingan
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4 leading-tight">
                {course.title}
              </h1>
              
              <p className="text-lg text-secondary-600 mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-primary-50 p-4 rounded-lg text-center border border-primary-200">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-primary-600 fill-current" />
                  </div>
                  <div className="font-bold text-secondary-900">{course.rating}</div>
                  <div className="text-xs text-secondary-600">Reyting</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="font-bold text-secondary-900">{course.duration}</div>
                  <div className="text-xs text-secondary-600">Davomiyligi</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="font-bold text-secondary-900">{course.lessons}</div>
                  <div className="text-xs text-secondary-600">Darslar</div>
                </div>
                <div className="bg-accent-50 p-4 rounded-lg text-center border border-accent-200">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-accent-600" />
                  </div>
                  <div className="font-bold text-secondary-900">{course.students.toLocaleString()}</div>
                  <div className="text-xs text-secondary-600">O'quvchilar</div>
                </div>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative bg-secondary-900 rounded-xl overflow-hidden shadow-sm border border-secondary-300">
              <img 
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                <button 
                  onClick={() => {
                    if (courseLessons.length > 0) {
                      setCurrentLesson(courseLessons[0].id);
                    }
                  }}
                  className="bg-white/90 text-secondary-900 p-6 rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg group"
                >
                  <Play className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                </button>
              </div>
              <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-sm px-3 py-1 rounded-full border border-primary-400/30">
                <span className="text-sm font-medium text-primary-400">Birinchi dars - BEPUL</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
              <div className="border-b border-secondary-200">
                <nav className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-4 px-6 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                          : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-secondary-900 mb-4">Kurs haqida</h3>
                      <p className="text-secondary-600 leading-relaxed text-lg">
                        {course.description} Bu kursda siz professional darajada {course.category.toLowerCase()} 
                        bo'yicha bilim va ko'nikmalarni egallaysiz. Amaliy mashg'ulotlar va real loyihalar orqali 
                        o'rganasiz.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-secondary-900 mb-6">Nima o'rganasiz</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          'Asosiy tushuncha va tamoyillar',
                          'Amaliy ko\'nikmalar va texnikalar',
                          'Real loyihalar ustida ishlash',
                          'Professional vositalar bilan ishlash',
                          'Eng yaxshi amaliyotlar va standartlar',
                          'Sertifikat olish imkoniyati'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center bg-primary-50 p-3 rounded-lg border border-primary-200">
                            <CheckCircle className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0" />
                            <span className="text-secondary-700 font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-secondary-900">Dars rejasi</h3>
                      <div className="text-sm text-secondary-600 bg-secondary-100 px-3 py-1 rounded-full border border-secondary-200">
                        {courseLessons.length} ta dars
                      </div>
                    </div>

                    <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                      <h5 className="font-medium text-primary-600 mb-2 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Bepul kirish
                      </h5>
                      <p className="text-sm text-primary-700">
                        Birinchi 2 ta dars hamma uchun bepul! Ro'yxatdan o'tmasdan ham ko'rishingiz mumkin.
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {courseLessons.map((lesson, index) => {
                        const isAccessible = index < 2 || hasAccess;
                        const isFree = index < 2;
                        
                        return (
                          <div key={lesson.id} className={`rounded-xl border-2 transition-all duration-200 ${
                            isAccessible 
                              ? 'border-primary-200 bg-white hover:border-primary-300 hover:shadow-sm cursor-pointer' 
                              : 'border-secondary-200 bg-secondary-50'
                          }`}>
                            <div 
                              className="p-6"
                              onClick={() => handleLessonClick(lesson.id, index)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                                    isAccessible 
                                      ? 'bg-primary-600 text-white shadow-sm' 
                                      : 'bg-secondary-300 text-secondary-600'
                                  }`}>
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-bold text-secondary-900 flex items-center text-lg">
                                      {lesson.title}
                                      {isFree && (
                                        <span className="ml-3 bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-xs font-medium border border-primary-200">
                                          BEPUL
                                        </span>
                                      )}
                                    </h4>
                                    <p className="text-secondary-600 flex items-center mt-2">
                                      <Clock className="h-4 w-4 mr-2" />
                                      {lesson.duration}
                                    </p>
                                    <p className="text-secondary-500 mt-2 leading-relaxed">{lesson.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  {!isAccessible && (
                                    <div className="bg-secondary-300 p-2 rounded-full">
                                      <Lock className="h-5 w-5 text-secondary-600" />
                                    </div>
                                  )}
                                  {isAccessible && (
                                    <button className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 transition-colors duration-200 shadow-sm">
                                      <Play className="h-5 w-5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {!hasAccess && (
                      <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-8 mt-8">
                        <div className="text-center">
                          <div className="bg-primary-600 p-4 rounded-full inline-block mb-4">
                            <Send className="h-8 w-8 text-white" />
                          </div>
                          <h4 className="text-2xl font-bold text-secondary-900 mb-3">Barcha darslarni ochish</h4>
                          <p className="text-secondary-600 mb-6 text-lg">
                            @SAOT_django_bot ga o'ting va kursni sotib oling. 
                            Database avtomatik yangilanadi va {courseLessons.length - 2} ta qo'shimcha dars ochiladi.
                          </p>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-secondary-200">
                              <CheckCircle className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                              <div className="font-medium text-secondary-900">6 oylik kirish</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-secondary-200">
                              <CheckCircle className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                              <div className="font-medium text-secondary-900">Sertifikat</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-secondary-200">
                              <CheckCircle className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                              <div className="font-medium text-secondary-900">Qo'llab-quvvatlash</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-secondary-900 mb-6">O'quvchilar sharhlari</h3>
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-secondary-50 rounded-xl p-6 border border-secondary-200">
                        <div className="flex items-start space-x-4">
                          <img 
                            src={review.avatar}
                            alt={review.name}
                            className="w-14 h-14 rounded-full border-2 border-primary-200 shadow-sm"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-secondary-900 text-lg">{review.name}</h4>
                              <span className="text-sm text-secondary-600 bg-white px-2 py-1 rounded-full">{review.date}</span>
                            </div>
                            <div className="flex items-center mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-5 w-5 ${
                                    i < review.rating ? 'text-yellow-500 fill-current' : 'text-secondary-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            <p className="text-secondary-700 leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'instructor' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-secondary-900 mb-6">O'qituvchi haqida</h3>
                    <div className="bg-secondary-50 rounded-xl p-8 border border-secondary-200">
                      <div className="flex items-start space-x-6">
                        <img 
                          src={course.instructorAvatar}
                          alt={course.instructor}
                          className="w-24 h-24 rounded-full border-4 border-primary-200 shadow-lg"
                        />
                        <div>
                          <h4 className="text-2xl font-bold text-secondary-900 mb-3">{course.instructor}</h4>
                          <p className="text-secondary-600 mb-4 text-lg leading-relaxed">
                            Professional {course.category} o'qituvchisi va amaliyotchisi. 8+ yillik tajriba.
                            Katta IT kompaniyalarda ishlagan va yuzlab o'quvchini muvaffaqiyatli tayyorlagan.
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg text-center border border-secondary-200">
                              <Users className="h-5 w-5 mx-auto mb-1 text-primary-600" />
                              <div className="font-bold text-secondary-900">{course.students.toLocaleString()}</div>
                              <div className="text-xs text-secondary-600">O'quvchilar</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg text-center border border-secondary-200">
                              <Star className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                              <div className="font-bold text-secondary-900">{course.rating}</div>
                              <div className="text-xs text-secondary-600">Reyting</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8 sticky top-24">
              {/* Price */}
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-secondary-900 mb-2">
                  {Math.floor(course.price / 1000)}k so'm
                </div>
                <div className="text-secondary-600 bg-secondary-100 px-3 py-1 rounded-full inline-block">
                  6 oylik kirish
                </div>
              </div>

              {/* Purchase/Enroll Button */}
              {hasAccess ? (
                <button 
                  onClick={() => {
                    if (courseLessons.length > 0) {
                      setCurrentLesson(courseLessons[0].id);
                    }
                  }}
                  className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-primary-700 transition-colors duration-200 mb-6 shadow-sm"
                >
                  Kursni boshlash
                </button>
              ) : (
                <button 
                  onClick={handleTelegramPayment}
                  disabled={isProcessingPayment}
                  className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-primary-700 transition-colors duration-200 mb-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Yo'naltirish...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Telegram orqali sotib olish</span>
                    </>
                  )}
                </button>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                    isWishlisted 
                      ? 'bg-red-50 border-red-200 text-red-600' 
                      : 'bg-secondary-50 border-secondary-200 text-secondary-600 hover:border-primary-300 hover:text-primary-600'
                  }`}
                >
                  <Heart className={`h-6 w-6 mx-auto ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="p-4 rounded-lg border-2 bg-secondary-50 border-secondary-200 text-secondary-600 hover:bg-secondary-100 hover:border-primary-300 hover:text-primary-600 transition-colors duration-200">
                  <Share2 className="h-6 w-6 mx-auto" />
                </button>
                <button className="p-4 rounded-lg border-2 bg-secondary-50 border-secondary-200 text-secondary-600 hover:bg-secondary-100 hover:border-primary-300 hover:text-primary-600 transition-colors duration-200">
                  <Download className="h-6 w-6 mx-auto" />
                </button>
              </div>

              {/* Course Includes */}
              <div className="space-y-4">
                <h4 className="font-bold text-secondary-900 text-lg">Kurs o'z ichiga oladi:</h4>
                <div className="space-y-3">
                  {[
                    { icon: Clock, text: `${course.duration} video darslar` },
                    { icon: BookOpen, text: 'Amaliy topshiriqlar' },
                    { icon: Award, text: 'Sertifikat' },
                    { icon: CheckCircle, text: '6 oylik kirish' },
                    { icon: Users, text: 'O\'qituvchi qo\'llab-quvvatlashi' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center bg-primary-50 p-3 rounded-lg border border-primary-200">
                      <item.icon className="h-5 w-5 text-primary-600 mr-3" />
                      <span className="text-secondary-700 font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;