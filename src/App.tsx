import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Hero from './components/Layout/Hero';
import CourseList from './components/Course/CourseList';
import MyCourses from './components/Course/MyCourses';
import CourseDetail from './components/Course/CourseDetail';
import About from './components/Pages/About';
import AdminPanel from './components/Admin/AdminPanel';
import { Course } from './types';
import { BookOpen, Users, Award, Star } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView('course-detail');
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setCurrentView('courses');
  };

  const handleEnrollCourse = async (courseId: string) => {
    try {
      alert('Kursga muvaffaqiyatli yozildingiz!');
      setCurrentView('my-courses');
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Hero onViewChange={setCurrentView} />;
      case 'courses':
        return <CourseList onViewCourse={handleViewCourse} />;
      case 'my-courses':
        return <MyCourses onViewCourse={handleViewCourse} />;
      case 'course-detail':
        return selectedCourse ? (
          <CourseDetail 
            course={selectedCourse} 
            onBack={handleBackToCourses}
            onEnroll={handleEnrollCourse}
          />
        ) : (
          <CourseList onViewCourse={handleViewCourse} />
        );
      case 'about':
        return <About />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Hero onViewChange={setCurrentView} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Header 
          currentView={currentView}
          onViewChange={setCurrentView}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
        <main>
          {renderContent()}
        </main>
        
        {/* Footer */}
        <footer className="bg-secondary-900 text-white py-16 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-600 p-2 rounded-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">SAOT</h3>
                    <p className="text-sm text-secondary-400">Sifatli Arzon Online Ta'lim</p>
                  </div>
                </div>
                <p className="text-secondary-300 text-sm leading-relaxed">
                  Eng so'nggi texnologiyalarni o'rganish uchun eng yaxshi joy. 
                  Minglab dasturchilar bilan birga kelajakni quring.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-lg">Kurslar</h4>
                <ul className="space-y-3 text-sm text-secondary-300">
                  <li className="hover:text-white transition-colors duration-200 cursor-pointer">Dasturlash</li>
                  <li className="hover:text-white transition-colors duration-200 cursor-pointer">Video montaj</li>
                  <li className="hover:text-white transition-colors duration-200 cursor-pointer">Grafik dizayn</li>
                  <li className="hover:text-white transition-colors duration-200 cursor-pointer">Marketing</li>
                  <li className="hover:text-white transition-colors duration-200 cursor-pointer">Web dizayn</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-lg">Kompaniya</h4>
                <ul className="space-y-3 text-sm text-secondary-300">
                  <li className="hover:text-white transition-colors duration-200 cursor-pointer">Biz haqimizda</li>
                  <li className="hover:text-white transition-colors duration-200 cursor-pointer">Karyera</li>
                  <li className="hover:text-white transition-colors duration-200 cursor-pointer">Hamkorlar</li>
                  <li className="hover:text-white transition-colors duration-200 cursor-pointer">Maxfiylik</li>
                  <li className="hover:text-white transition-colors duration-200 cursor-pointer">Shartlar</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-lg">Bog'lanish</h4>
                <ul className="space-y-3 text-sm text-secondary-300">
                  <li>+998 90 123 45 67</li>
                  <li>hello@saot.uz</li>
                  <li>Toshkent, O'zbekiston</li>
                  <li>24/7 Yordam</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-secondary-700 mt-12 pt-8 text-center">
              <p className="text-sm text-secondary-300">
                &copy; 2024 SAOT. Barcha huquqlar himoyalangan.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;