import React from 'react';
import { Star, Clock, Users, Play, BookOpen, CheckCircle } from 'lucide-react';
import { Course } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface CourseCardProps {
  course: Course;
  onViewCourse: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onViewCourse }) => {
  const { hasAccessToCourse } = useAuth();
  const hasPurchased = hasAccessToCourse(course.id);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Boshlang\'ich': return 'bg-green-100 text-green-700 border-green-200';
      case 'O\'rta': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Yuqori': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-secondary-100 text-secondary-700 border-secondary-200';
    }
  };

  const handleCardClick = () => {
    onViewCourse(course);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm border border-secondary-200 hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
    >
      {/* Course Thumbnail */}
      <div className="relative overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 text-secondary-900 p-3 rounded-full hover:bg-white transition-colors duration-200">
            <Play className="h-6 w-6" />
          </div>
        </div>
        
        {/* Level Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        </div>
        
        {/* Price or Purchased Badge */}
        {!hasPurchased && (
          <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full">
            <span className="text-sm font-bold text-secondary-900">
              {Math.floor(course.price / 1000)}k so'm
            </span>
          </div>
        )}

        {hasPurchased && (
          <div className="absolute top-3 right-3 bg-primary-600 px-3 py-1 rounded-full">
            <span className="text-sm font-bold text-white flex items-center space-x-1">
              <CheckCircle className="h-4 w-4" />
              <span>Sotib olingan</span>
            </span>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6 space-y-4">
        {/* Category */}
        <div className="text-sm text-primary-600 font-medium bg-primary-50 px-3 py-1 rounded-lg inline-block">
          {course.category}
        </div>
        
        {/* Title - Clickable */}
        <h3 
          onClick={handleCardClick}
          className="text-lg font-bold text-secondary-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200 cursor-pointer"
        >
          {course.title}
        </h3>
        
        {/* Description */}
        <p className="text-secondary-600 text-sm line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
          <img 
            src={course.instructorAvatar} 
            alt={course.instructor}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium text-secondary-700">{course.instructor}</span>
        </div>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-sm text-secondary-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.lessons} dars</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{course.students.toLocaleString()}</span>
          </div>
        </div>

        {/* Rating and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${
                    i < Math.floor(course.rating) ? 'text-yellow-400 fill-current' : 'text-secondary-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm font-medium text-secondary-900">{course.rating}</span>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewCourse(course);
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              hasPurchased 
                ? 'bg-primary-600 text-white hover:bg-primary-700' 
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {hasPurchased ? 'Davom etish' : 'Ko\'rish'}
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {course.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-secondary-100 text-secondary-600 text-xs rounded-lg font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;