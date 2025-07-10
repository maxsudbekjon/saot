import React from 'react';
import { Users, Award, BookOpen, Globe, Target, Heart, CheckCircle, ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { value: '15,000+', label: 'Faol o\'quvchilar', icon: Users },
    { value: '200+', label: 'Sifatli kurslar', icon: BookOpen },
    { value: '50+', label: 'Ekspert o\'qituvchilar', icon: Award },
    { value: '98%', label: 'Muvaffaqiyat darajasi', icon: Heart }
  ];

  const features = [
    {
      icon: Target,
      title: 'Maqsadli ta\'lim',
      description: 'Har bir kurs aniq maqsad va natijalar bilan tuzilgan. Real loyihalar va amaliy mashg\'ulotlar orqali o\'rganish.'
    },
    {
      icon: Users,
      title: 'Ekspert o\'qituvchilar',
      description: 'Sohadagi professional mutaxassislar va tajribali o\'qituvchilar tomonidan tayyorlangan kurslar.'
    },
    {
      icon: Award,
      title: 'Tan olingan sertifikatlar',
      description: 'Kursni tugatgandan so\'ng professional sertifikat oling va ish beruvchilarga ko\'rsating.'
    },
    {
      icon: Globe,
      title: 'Onlayn kirish',
      description: 'Istalgan vaqtda, istalgan joydan o\'rganish. 24/7 platform kirish imkoniyati.'
    }
  ];

  const team = [
    {
      name: 'Aziz Rahimov',
      role: 'Asoschisi va bosh direktor',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Ta\'lim sohasida 10+ yillik tajriba. Zamonaviy o\'qitish metodologiyalari mutaxassisi.'
    },
    {
      name: 'Madina Karimova',
      role: 'Ta\'lim direktori',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Ta\'lim sohasida 8+ yillik tajriba. Kurs yaratish va o\'qituvchilar tayyorlash bo\'yicha mutaxassis.'
    },
    {
      name: 'Bobur Tursunov',
      role: 'Texnologiyalar direktori',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Full-stack dasturchi va platform arxitekti. Zamonaviy texnologiyalar bo\'yicha ekspert.'
    }
  ];

  const values = [
    {
      title: 'Sifat',
      description: 'Faqat yuqori sifatli ta\'lim materiallari va professional kurslar taqdim etamiz',
      icon: '⭐',
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      title: 'Arzonlik',
      description: 'Sifatli ta\'limni hamyonbop narxlarda taqdim etish bizning asosiy maqsadimiz',
      icon: '💰',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Qo\'llab-quvvatlash',
      description: 'O\'quvchilar va o\'qituvchilar o\'rtasida doimiy aloqa va yordam berish',
      icon: '🤝',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Rivojlanish',
      description: 'Doimiy o\'sish, yangi ko\'nikmalar va karyera rivojlanishini qo\'llab-quvvatlaymiz',
      icon: '📈',
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  const categories = [
    { name: 'Dasturlash', count: '45+ kurs', icon: '💻' },
    { name: 'Video montaj', count: '25+ kurs', icon: '🎬' },
    { name: 'Grafik dizayn', count: '30+ kurs', icon: '🎨' },
    { name: 'Marketing', count: '20+ kurs', icon: '📈' },
    { name: 'Til o\'rganish', count: '15+ kurs', icon: '🗣️' },
    { name: 'Web dizayn', count: '35+ kurs', icon: '🌐' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary-50 border border-primary-200 text-primary-700 rounded-full text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4 mr-2" />
            SAOT haqida ma'lumot
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            Sifatli arzon online ta'lim
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            SAOT - O'zbekistondagi eng yirik va zamonaviy online ta'lim platformasi. 
            Bizning maqsadimiz har bir kishi uchun sifatli ta'limni arzon va 
            ochiq qilishdir.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-primary-600 p-4 rounded-xl inline-block mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-secondary-900 mb-2">{stat.value}</div>
              <div className="text-secondary-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="bg-primary-600 rounded-2xl p-8 md:p-12 mb-20 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bizning missiyamiz
            </h2>
            <p className="text-lg leading-relaxed mb-8 text-primary-100">
              Biz har bir inson uchun sifatli ta'lim imkoniyatlarini yaratish va ularning 
              professional rivojlanishiga yordam berish uchun ishlaymiz. Zamonaviy texnologiyalar 
              va eng yaxshi o'qitish usullarini birlashtirib, o'quvchilarimizga eng mukammal 
              ta'lim tajribasini taqdim etamiz.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-bold text-white mb-2">Maqsad</h3>
                <p className="text-primary-100 text-sm">O'zbekistonda online ta'limni rivojlantirish va zamonaviylashtirishda yetakchi bo'lish</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-4">👁️</div>
                <h3 className="font-bold text-white mb-2">Vizyon</h3>
                <p className="text-primary-100 text-sm">Markaziy Osiyodagi eng yaxshi va tan olingan online ta'lim platformasi bo'lish</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="font-bold text-white mb-2">Qiymatlar</h3>
                <p className="text-primary-100 text-sm">Sifat, arzonlik, qo'llab-quvvatlash va o'quvchiga yo'naltirilganlik</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Kurs kategoriyalari
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Turli sohalarda professional ko'nikmalarni o'rganing
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-secondary-50 rounded-xl p-6 border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{category.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary-900">{category.name}</h3>
                    <p className="text-sm text-primary-600 font-medium">{category.count}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-600 text-sm">Professional kurslar</span>
                  <ArrowRight className="h-5 w-5 text-secondary-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Bizning afzalliklarimiz
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Nima uchun minglab o'quvchilar bizni tanlab, muvaffaqiyatga erishmoqda?
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-secondary-50 rounded-xl p-6 border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
                <div className="bg-primary-600 p-3 rounded-lg inline-block mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-secondary-900 mb-2">{feature.title}</h3>
                <p className="text-secondary-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Bizning qiymatlarimiz
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Biz ushbu tamoyillar asosida ishlaymiz va rivojlanamiz
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className={`flex items-start space-x-4 rounded-xl p-6 border ${value.color} transition-all duration-200`}>
                <div className="text-4xl">{value.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">{value.title}</h3>
                  <p className="text-secondary-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Bizning jamoa
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Professional mutaxassislar jamoasi sizning muvaffaqiyatingiz uchun ishlaydi
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-secondary-50 rounded-xl border border-secondary-200 overflow-hidden hover:border-primary-300 transition-all duration-200">
                <img 
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-secondary-600 text-sm leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Bizga qo'shiling!
          </h2>
          <p className="text-lg md:text-xl mb-8 text-primary-100">
            Minglab o'quvchilar qatorida o'z karyerangizni boshlang
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-4 rounded-lg font-medium hover:bg-secondary-50 transition-colors duration-200 flex items-center justify-center">
              Kurslarni ko'rish
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors duration-200">
              Biz bilan bog'lanish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;