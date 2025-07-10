import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Clock, CheckCircle, Star, TrendingUp, Award, Users, ArrowRight, Filter, Search, Grid, List } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../services/database.service';
import { Course } from '../../types';
import CourseCard from './CourseCard';

interface MyCoursesProps {
  onViewCourse: (course: Course) => void;
}

const MyCourses: React.FC<MyCoursesProps> = ({ onViewCourse }) => {
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const loadMyCourses = async () => {
      if (!user) return;
      
      try {
        const allCourses = await databaseService.getAllCourses();
        const userCourses = allCourses.filter(course => 
          user.paidCourses.includes(course.id)
        );
        setMyCourses(userCourses);
      } catch (error) {
        console.error('Failed to load user courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMyCourses();
  }, [user]);

  const filteredCourses = myCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    
    const progress = user?.progress[course.id] || 0;
    if (filter === 'completed') return matchesSearch && progress >= 100;
    if (filter === 'in-progress') return matchesSearch && progress > 0 && progress < 100;
    
    return matchesSearch;
  });

  const stats = [
    {
      icon: BookOpen,
      label: 'Jami kurslar',
      value: myCourses.length,
      color: 'bg-primary-50 text-primary-600'
    },
    {
      icon: TrendingUp,
      label: 'Jarayonda',
      value: myCourses.filter(course => {
        const progress = user?.progress[course.id] || 0;
        return progress > 0 && progress < 100;
      }).length,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: CheckCircle,
      label: 'Tugallangan',
      value: user?.completedCourses.length || 0,
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: Award,
      label: 'Sertifikatlar',
      value: user?.completedCourses.length || 0,
      color: 'bg-yellow-50 text-yellow-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-secondary-600">Kurslaringiz yuklanmoqda...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Kirish talab qilinadi</h1>
          <p className="text-secondary-600">Bu sahifani ko'rish uchun tizimga kiring.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Mening kurslarim
          </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Sotib olgan kurslaringiz va o'rganish jarayoningiz
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">Qidirish</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Kurs nomi yoki o'qituvchi..."
                  className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
            </div>

            {/* Filter */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Holat</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full py-3 px-4 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value="all">Barcha kurslar</option>
                <option value="in-progress">Jarayonda</option>
                <option value="completed">Tugallangan</option>
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Ko'rinish</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-primary-100 text-primary-600' 
                      : 'text-secondary-400 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-colors duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-primary-100 text-primary-600' 
                      : 'text-secondary-400 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-secondary-200">
            <div className="text-sm text-secondary-600">
              <span className="font-medium text-secondary-900">{filteredCourses.length}</span> ta kurs topildi
            </div>
          </div>
        </div>

        {/* Courses Grid/List */}
        {filteredCourses.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredCourses.map((course) => (
              <div key={course.id} className="relative">
                <div 
                  onClick={() => onViewCourse(course)}
                  className="cursor-pointer"
                >
                  <CourseCard 
                    course={course} 
                    onViewCourse={onViewCourse}
                  />
                </div>
                
                {/* Progress Overlay */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-secondary-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 relative">
                      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-secondary-300"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 14}`}
                          strokeDashoffset={`${2 * Math.PI * 14 * (1 - (user?.progress[course.id] || 0) / 100)}`}
                          className="text-primary-600 transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-secondary-900">
                          {user?.progress[course.id] || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <div className="absolute bottom-4 right-4">
                  <button 
                    onClick={() => onViewCourse(course)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2 shadow-lg"
                  >
                    <Play className="h-4 w-4" />
                    <span>Davom etish</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl p-8 border border-secondary-200">
              {myCourses.length === 0 ? (
                <>
                  <BookOpen className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">Hali kurs sotib olmadingiz</h3>
                  <p className="text-secondary-600 mb-6">Kurslar bo'limiga o'ting va o'zingizga mos kursni tanlang</p>
                  <button 
                    onClick={() => window.location.hash = '#courses'}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium flex items-center space-x-2 mx-auto"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Kurslarni ko'rish</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <>
                  <Filter className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">Kurslar topilmadi</h3>
                  <p className="text-secondary-600">Qidiruv filtrlarini o'zgartiring</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {myCourses.length > 0 && (
          <div className="mt-12 bg-white rounded-xl p-8 border border-secondary-200">
            <h3 className="text-2xl font-bold text-secondary-900 mb-6 text-center">
              O'rganish statistikasi
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {Math.round(Object.values(user?.progress || {}).reduce((a, b) => a + b, 0) / Math.max(myCourses.length, 1))}%
                </div>
                <div className="text-secondary-600">O'rtacha progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Object.values(user?.progress || {}).reduce((total, progress) => total + Math.floor(progress / 10), 0)}
                </div>
                <div className="text-secondary-600">Ko'rilgan darslar</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 mb-2">
                  {myCourses.reduce((total, course) => total + course.lessons, 0)}
                </div>
                <div className="text-secondary-600">Jami darslar</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;