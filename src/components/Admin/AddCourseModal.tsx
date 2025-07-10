import React, { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    price: '',
    category: '',
    level: 'Boshlang\'ich' as 'Boshlang\'ich' | 'O\'rta' | 'Yuqori',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('New course data:', formData);
    alert('Kurs muvaffaqiyatli qo\'shildi!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Yangi kurs qo'shish</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kurs nomi
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O'qituvchi
              </label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategoriya
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              >
                <option value="">Kategoriyani tanlang</option>
                <option value="Dasturlash">Dasturlash</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Marketing">Marketing</option>
                <option value="Dizayn">Dizayn</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daraja
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              >
                <option value="Boshlang'ich">Boshlang'ich</option>
                <option value="O'rta">O'rta</option>
                <option value="Yuqori">Yuqori</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Davomiyligi
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Masalan: 12 soat"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Narx (so'm)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tavsif
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teglar (vergul bilan ajrating)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Python, Dasturlash, Algoritmlar"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kurs rasmi
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Rasm yuklash uchun bosing yoki shu yerga tashlang</p>
              <input type="file" className="hidden" accept="image/*" />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Kurs qo'shish</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Bekor qilish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;