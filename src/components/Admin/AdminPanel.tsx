import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { courses } from '../../data/courses';
import AddCourseModal from './AddCourseModal';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [showAddCourse, setShowAddCourse] = useState(false);

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Kirish taqiqlangan</h1>
        <p className="text-gray-600">Bu sahifaga faqat adminlar kira oladi.</p>
      </div>
    );
  }

  const stats = [
    { label: 'Jami kurslar', value: courses.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Jami talabalar', value: '2,340', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Oylik daromad', value: '$12,450', icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'O\'sish', value: '+23%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Platform boshqaruvi va statistika</p>
        </div>
        <button
          onClick={() => setShowAddCourse(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Yangi kurs qo'shish</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Courses Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Kurslar boshqaruvi</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Kurs</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Kategoriya</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Narx</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Talabalar</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Reyting</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500">{course.instructor}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{course.category}</td>
                  <td className="py-4 px-4 text-gray-700">{course.price.toLocaleString()} so'm</td>
                  <td className="py-4 px-4 text-gray-700">{course.students.toLocaleString()}</td>
                  <td className="py-4 px-4 text-gray-700">{course.rating}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Course Modal */}
      <AddCourseModal
        isOpen={showAddCourse}
        onClose={() => setShowAddCourse(false)}
      />
    </div>
  );
};

export default AdminPanel;