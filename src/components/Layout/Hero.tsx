import React from 'react';
import { Users, Award, BookOpen, ArrowRight, Star, Play, TrendingUp } from 'lucide-react';

interface HeroProps {
  onViewChange: (view: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onViewChange }) => {
  const stats = [
    { icon: Users, value: '15,000+', label: 'Faol o\'quvchilar' },
    { icon: BookOpen, value: '200+', label: 'Sifatli kurslar' },
    { icon: Award, value: '98%', label: 'Muvaffaqiyat darajasi' },
    { icon: Star, value: '4.9', label: 'O\'rtacha reyting' }
  ];

  const categories = [
    { name: 'Dasturlash', icon: '💻', count: '45+ kurs', category: 'Dasturlash' },
    { name: 'Video montaj', icon: '🎬', count: '25+ kurs', category: 'Video Montaj' },
    { name: 'Grafik dizayn', icon: '🎨', count: '30+ kurs', category: 'Grafik Dizayn' },
    { name: 'Marketing', icon: '📈', count: '20+ kurs', category: 'Marketing' },
    { name: 'Til o\'rganish', icon: '🗣️', count: '15+ kurs', category: 'Til O\'rganish' },
    { name: 'Web dizayn', icon: '🌐', count: '35+ kurs', category: 'Web Dizayn' }
  ];

  const handleCategoryClick = (category: string) => {
    onViewChange('courses');
    setTimeout(() => {
      const event = new CustomEvent('filterByCategory', { detail: category });
      window.dispatchEvent(event);
    }, 100);
  };

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-primary-50 border border-primary-200 text-primary-700 rounded-full text-sm font-medium">
                <BookOpen className="h-4 w-4 mr-2" />
                O'zbekistondagi eng yaxshi online ta'lim platformasi
              </div>
              
              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-secondary-900">
                <span className="block">Kelajagingizni</span>
                <span className="block text-primary-600">yarating</span>
                <span className="block text-2xl md:text-3xl font-medium text-secondary-700 mt-2">
                  bugun!
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-xl text-secondary-600 leading-relaxed max-w-2xl">
                SAOT platformasida 200+ sifatli kurs bilan o'zingizga kerakli 
                ko'nikmalarni o'rganing va karyerangizni rivojlantiring.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 py-6">
                {[
                  { icon: '🎯', title: 'Maqsadli ta\'lim', desc: 'Har bir kurs aniq natija uchun' },
                  { icon: '💰', title: 'Arzon narxlar', desc: 'Hamyonbop va sifatli ta\'lim' },
                  { icon: '🏆', title: 'Sertifikat', desc: 'Tan olingan sertifikatlar' },
                  { icon: '⏰', title: '24/7 kirish', desc: 'Istalgan vaqtda o\'rganing' }
                ].map((feature, index) => (
                  <div 
                    key={index} 
                    className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 hover:bg-secondary-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{feature.icon}</div>
                      <div>
                        <div className="font-medium text-secondary-900 text-sm">{feature.title}</div>
                        <div className="text-xs text-secondary-600">{feature.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onViewChange('courses')}
                className="bg-primary-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Kurslarni ko'rish</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button 
                onClick={() => onViewChange('about')}
                className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-primary-50 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Biz haqimizda</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary-600 p-3 rounded-lg inline-block mb-3">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-secondary-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-secondary-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Categories */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-lg border border-secondary-200 overflow-hidden">
              {/* Header */}
              <div className="bg-primary-600 px-6 py-4">
                <h3 className="text-white text-xl font-bold">Kurs kategoriyalari</h3>
                <p className="text-primary-100 text-sm">O'zingizga mos yo'nalishni tanlang</p>
              </div>
              
              {/* Categories */}
              <div className="p-6 space-y-4">
                {categories.map((category, index) => (
                  <div 
                    key={index}
                    onClick={() => handleCategoryClick(category.category)}
                    className="flex items-center justify-between p-4 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{category.icon}</div>
                      <div>
                        <div className="font-medium text-secondary-900">{category.name}</div>
                        <div className="text-sm text-secondary-500">{category.count}</div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-secondary-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                ))}
              </div>
              
              {/* Footer */}
              <div className="bg-secondary-50 px-6 py-4 border-t border-secondary-200">
                <button 
                  onClick={() => onViewChange('courses')}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
                >
                  Barcha kurslarni ko'rish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;