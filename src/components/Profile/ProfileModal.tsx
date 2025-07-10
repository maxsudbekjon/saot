import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Edit2, Save, Monitor, Smartphone, Trash2, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, terminateOtherDevices, getActiveSessions } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    bio: user?.profile?.bio || '',
    location: user?.profile?.location || '',
    birthDate: user?.profile?.birthDate || ''
  });

  useEffect(() => {
    if (isOpen && user) {
      loadActiveSessions();
    }
  }, [isOpen, user]);

  const loadActiveSessions = async () => {
    setLoadingSessions(true);
    try {
      const sessions = await getActiveSessions();
      setActiveSessions(sessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleSave = () => {
    if (user) {
      updateProfile({
        name: formData.name,
        email: formData.email,
        profile: {
          ...user.profile,
          phone: formData.phone,
          bio: formData.bio,
          location: formData.location,
          birthDate: formData.birthDate
        }
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.profile?.phone || '',
      bio: user?.profile?.bio || '',
      location: user?.profile?.location || '',
      birthDate: user?.profile?.birthDate || ''
    });
    setIsEditing(false);
  };

  const handleTerminateOtherDevices = async () => {
    const confirmed = confirm(
      '⚠️ Boshqa qurilmalardan chiqish\n\n' +
      'Bu amal barcha boshqa qurilmalardagi sessiyalarni tugatadi.\n' +
      'Davom etishni xohlaysizmi?'
    );
    
    if (confirmed) {
      const success = await terminateOtherDevices();
      if (success) {
        alert('✅ Boshqa qurilmalardan muvaffaqiyatli chiqildi!');
        loadActiveSessions();
      } else {
        alert('❌ Xatolik yuz berdi!');
      }
    }
  };

  const getDeviceIcon = (deviceInfo: any) => {
    if (deviceInfo.platform.toLowerCase().includes('mobile') || 
        deviceInfo.platform.toLowerCase().includes('android') ||
        deviceInfo.platform.toLowerCase().includes('iphone')) {
      return <Smartphone className="h-5 w-5" />;
    }
    return <Monitor className="h-5 w-5" />;
  };

  const formatLastActivity = (lastActivity: string) => {
    const now = new Date();
    const activity = new Date(lastActivity);
    const diffMinutes = Math.floor((now.getTime() - activity.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Hozir faol';
    if (diffMinutes < 60) return `${diffMinutes} daqiqa oldin`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} soat oldin`;
    return `${Math.floor(diffMinutes / 1440)} kun oldin`;
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Profil sozlamalari</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-6 mb-8">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-primary-200"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-gray-600 capitalize">{user.role}</p>
              <p className="text-sm text-gray-500">A'zo bo'lgan: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="ml-auto">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Tahrirlash</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <Save className="h-4 w-4" />
                    <span>Saqlash</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Bekor qilish
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Profile Form */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">Shaxsiy ma'lumotlar</h4>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To'liq ism
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email manzil
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon raqam
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="+998901234567"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manzil
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Shahar, Mamlakat"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tug'ilgan sana
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="O'zingiz haqingizda qisqacha..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Security & Sessions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Xavfsizlik</span>
                </h4>
                <button
                  onClick={loadActiveSessions}
                  className="text-sm text-blue-600 hover:text-blue-700"
                  disabled={loadingSessions}
                >
                  {loadingSessions ? 'Yuklanmoqda...' : 'Yangilash'}
                </button>
              </div>

              {/* Active Sessions */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-gray-900">Faol sessiyalar</h5>
                  <span className="text-sm text-gray-500">
                    {activeSessions.length}/2 qurilma
                  </span>
                </div>

                {loadingSessions ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeSessions.map((session, index) => (
                      <div key={session.id} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-blue-600">
                              {getDeviceIcon(session.deviceInfo)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {session.deviceInfo.browser} - {session.deviceInfo.platform}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatLastActivity(session.lastActivity)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {session.deviceId === localStorage.getItem('deviceId') && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                Joriy
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {activeSessions.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        Faol sessiyalar topilmadi
                      </div>
                    )}
                  </div>
                )}

                {activeSessions.length > 1 && (
                  <button
                    onClick={handleTerminateOtherDevices}
                    className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Boshqa qurilmalardan chiqish</span>
                  </button>
                )}
              </div>

              {/* Security Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h5 className="font-semibold text-blue-900 mb-2">Xavfsizlik ma'lumotlari</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Maksimal 2 ta qurilmada kirish mumkin</li>
                  <li>• Sessiya 30 daqiqa faolsizlikdan keyin tugaydi</li>
                  <li>• Shubhali faollik aniqlansa, barcha sessiyalar tugaydi</li>
                  <li>• Parolni muntazam o'zgartiring</li>
                </ul>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.enrolledCourses.length}</div>
                  <div className="text-sm text-gray-600">Yozilgan kurslar</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{user.completedCourses.length}</div>
                  <div className="text-sm text-gray-600">Tugallangan</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{user.paidCourses.length}</div>
                  <div className="text-sm text-gray-600">Sotib olingan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;