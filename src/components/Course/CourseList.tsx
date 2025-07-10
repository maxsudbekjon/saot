import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import CourseCard from './CourseCard';
import { Course } from '../../types';
import { databaseService } from '../../services/database.service';

interface CourseListProps {
  onViewCourse: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ onViewCourse }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Barcha kategoriyalar');
  const [selectedLevel, setSelectedLevel] = useState('Barcha darajalar');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const allCourses = await databaseService.getAllCourses();
        setCourses(allCourses);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();

    const handleCategoryFilter = (event: CustomEvent) => {
      setSelectedCategory(event.detail);
    };

    window.addEventListener('filterByCategory', handleCategoryFilter as EventListener);

    return () => {
      window.removeEventListener('filterByCategory', handleCategoryFilter as EventListener);
    };
  }, []);

  const categories = ['Barcha kategoriyalar', ...Array.from(new Set(courses.map(course => course.category)))];
  const levels = ['Barcha darajalar', 'Boshlang\'ich', 'O\'rta', 'Yuqori'];

  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'Barcha kategoriyalar' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'Barcha darajalar' || course.level === selectedLevel;
      
      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.students - a.students;
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return 0;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-secondary-600">Kurslar yuklanmoqda...</p>
          </div>
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
            Barcha kurslar
          </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Professional ko'nikmalarni o'rganing va karyerangizni rivojlantiring
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">Kurs qidirish</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Python, Video montaj, Dizayn..."
                  className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Kategoriya</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 px-4 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Daraja</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full py-3 px-4 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Saralash</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-3 px-4 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value="popular">Eng mashhur</option>
                <option value="rating">Yuqori reyting</option>
                <option value="price-low">Arzon narx</option>
                <option value="price-high">Qimmat narx</option>
                <option value="newest">Yangi kurslar</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle and Results */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-secondary-200">
            <div className="text-sm text-secondary-600">
              <span className="font-medium text-secondary-900">{filteredCourses.length}</span> ta kurs topildi
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'text-secondary-400 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
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

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onViewCourse={onViewCourse}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl p-8 border border-secondary-200">
              <Filter className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">Kurslar topilmadi</h3>
              <p className="text-secondary-600">Qidiruv filtrlarini o'zgartiring</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;