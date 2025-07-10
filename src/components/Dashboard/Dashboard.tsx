import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Award, TrendingUp, Play, CheckCircle, Calendar, User, Code, Monitor, Smartphone, Database, Shield, Cpu, Zap, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../services/database.service';
import { Course } from '../../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserCourses = async () => {
      if (!user) return;
      
      try {
        const allCourses = await databaseService.getAllCourses();
        const userCourses = allCourses.filter(course => 
          user.paidCourses.includes(course.id)
        );
        setEnrolledCourses(userCourses);
      } catch (error) {
        console.error('Failed to load user courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserCourses();
  }, [user]);

  const handleContinueCourse = (courseId: string) => {
    // Bu yerda kursni davom ettirish logikasi
    // Course detail sahifasiga o'tish
    window.location.hash = `#course-${courseId}`;
  };

  const achievements = [
    { id: '1', title: 'Birinchi kurs', description: 'Birinchi kursni muvaffaqiyatli tugatdingiz', icon: '🎓', date: '2024-01-15' },
    { id: '2', title: 'Tezkor o\'quvchi', description: '3 ta kursni 1 oyda tugatdingiz', icon: '⚡', date: '2024-01-10' },
    { id: '3', title: 'Python Mutaxassis', description: 'Python bo\'yicha barcha kurslarni tugatdingiz', icon: '🐍', date: '2024-01-05' }
  ];

  const stats = [
    { label: 'Sotib olingan kurslar', value: user?.paidCourses.length || 0, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'O\'rganish vaqti', value: '85s', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { label: 'Sertifikatlar', value: user?.completedCourses.length || 0, icon: Award, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { label: 'O\'sish darajasi', value: '92%', icon: TrendingUp, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' }
  ];

  const recentActivities = [
    { id: '1', action: 'Video ko\'rildi', course: 'Python Asoslari', time: '2 soat oldin', icon: Play, color: 'text-blue-600' },
    { id: '2', action: 'Test topshirildi', course: 'Web Development', time: '5 soat oldin', icon: CheckCircle, color: 'text-green-600' },
    { id: '3', action: 'Sertifikat olindi', course: 'Digital Marketing', time: '1 kun oldin', icon: Award, color: 'text-purple-600' },
    { id: '4', action: 'Kurs boshlandi', course: 'Grafik Dizayn', time: '3 kun oldin', icon: BookOpen, color: 'text-pink-600' }
  ];

  const techStack = [
    { icon: Code, name: 'Dasturlash', progress: 85, color: 'blue' },
    { icon: Monitor, name: 'Video Montaj', progress: 70, color: 'purple' },
    { icon: Smartphone, name: 'Grafik Dizayn', progress: 45, color: 'green' },
    { icon: Database, name: 'Marketing', progress: 60, color: 'pink' },
    { icon: Shield, name: 'Web Dizayn', progress: 30, color: 'yellow' },
    { icon: Cpu, name: 'Til O\'rganish', progress: 25, color: 'indigo' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Dashboard yuklanmoqda...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DASHBOARD
            </span>
          </h1>
          <p className="text-gray-600">O'rganish jarayoningizni kuzatib boring va muvaffaqiyatga erishing</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`bg-white rounded-xl shadow-lg border ${stat.border} p-6 hover:scale-105 transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg border ${stat.border}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Courses */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-gray-900 flex items-center">
                  <Code className="h-6 w-6 text-blue-600 mr-2" />
                  Joriy Kurslar
                </h2>
                <button className="text-blue-600 hover:text-purple-600 font-semibold transition-colors duration-200">
                  Barchasini ko'rish
                </button>
              </div>
              
              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => {
                    const progress = user?.progress[course.id] || 0;
                    const isCompleted = progress >= 100;
                    
                    return (
                      <div key={course.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all duration-300 bg-gray-50 hover:bg-white">
                        <div className="flex items-start space-x-4">
                          <img 
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-gray-600">Jarayon</span>
                                  <span className="font-semibold text-blue-600">{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-600">
                                {isCompleted ? (
                                  <span className="font-semibold text-green-600 flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Kurs tugallandi
                                  </span>
                                ) : (
                                  <>
                                    <span className="font-semibold text-blue-600">Keyingi dars:</span> {course.title} - Dars {Math.floor(progress / 10) + 1}
                                  </>
                                )}
                              </div>
                              {!isCompleted && (
                                <button 
                                  onClick={() => handleContinueCourse(course.id)}
                                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition-all duration-200 flex items-center shadow-lg"
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                  Davom etish
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Hali kursga yozilmagansiz</h3>
                    <p className="text-gray-600 mb-4">Kurslar sahifasiga o'ting va o'zingizga mos kursni tanlang</p>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:scale-105 transition-all duration-200 font-semibold">
                      Kurslarni ko'rish
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tech Skills Progress */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                <Cpu className="h-6 w-6 text-purple-600 mr-2" />
                Ko'nikmalar
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {techStack.map((tech, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <tech.icon className={`h-5 w-5 text-${tech.color}-600 mr-2`} />
                        <span className="font-semibold text-gray-900">{tech.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{tech.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r from-${tech.color}-500 to-${tech.color}-600 h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${tech.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                <Zap className="h-6 w-6 text-yellow-500 mr-2" />
                So'nggi Faoliyat
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-300">
                    <div className={`bg-white p-2 rounded-full border border-gray-200`}>
                      <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">
                        <span className="font-semibold text-blue-600">{activity.action}</span> - {activity.course}
                      </p>
                      <p className="text-sm text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <img 
                    src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
                    alt="Profile"
                    className="w-20 h-20 rounded-full mx-auto border-4 border-blue-200"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{user?.name || 'Foydalanuvchi'}</h3>
                <p className="text-blue-600 mb-4 capitalize font-semibold">@{user?.telegramUsername || 'username'}</p>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-sm text-gray-600 mb-1">Umumiy progress</div>
                  <div className="text-2xl font-black text-blue-600">
                    {user?.paidCourses.length > 0 
                      ? Math.round(Object.values(user.progress).reduce((a, b) => a + b, 0) / user.paidCourses.length)
                      : 0}%
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 text-purple-600 mr-2" />
                Yutuqlar
              </h3>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-purple-300 transition-all duration-300">
                    <div className="text-2xl bg-white p-2 rounded-lg border border-gray-200">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Bu oylik maqsad
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">O'rganish vaqti</span>
                    <span className="font-semibold text-blue-600">15/20 soat</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Kurslar</span>
                    <span className="font-semibold text-purple-600">{user?.paidCourses.length || 0}/3 ta</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: `${Math.min(((user?.paidCourses.length || 0) / 3) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tezkor Amallar</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:scale-105 transition-all duration-200">
                  Yangi kurs boshlash
                </button>
                <button className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:border-blue-300 hover:text-blue-600 transition-all duration-200">
                  Sertifikatlarni ko'rish
                </button>
                <button className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:border-purple-300 hover:text-purple-600 transition-all duration-200">
                  Profil sozlamalari
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;