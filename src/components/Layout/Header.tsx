import React, { useState } from 'react';
import { BookOpen, User, Search, Menu, X, LogOut, Settings, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../Auth/LoginModal';
import RegisterModal from '../Auth/RegisterModal';
import ProfileModal from '../Profile/ProfileModal';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, isMenuOpen, setIsMenuOpen }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Bosh sahifa' },
    { id: 'courses', label: 'Barcha kurslar' },
    ...(isAuthenticated ? [{ id: 'my-courses', label: 'Mening kurslarim' }] : []),
    ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin panel' }] : []),
    { id: 'about', label: 'Biz haqimizda' }
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    onViewChange('home');
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => onViewChange('home')}
            >
              <div className="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-700 transition-colors duration-200">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-secondary-900">SAOT</span>
                <div className="text-xs text-secondary-600">Sifatli Arzon Online Ta'lim</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    currentView === item.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Search and User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Kurs qidirish..."
                  className="pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white text-sm w-64"
                />
              </div>
              
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-sm">{user?.name}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 animate-scale-in">
                      <div className="px-4 py-3 border-b border-secondary-100">
                        <p className="text-sm font-medium text-secondary-900">{user?.name}</p>
                        <p className="text-xs text-secondary-600">@{user?.telegramUsername}</p>
                      </div>
                      <button
                        onClick={() => {
                          onViewChange('my-courses');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center space-x-2"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Mening kurslarim</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowProfile(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center space-x-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Profil sozlamalari</span>
                      </button>
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => {
                            onViewChange('admin');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center space-x-2"
                        >
                          <Shield className="h-4 w-4" />
                          <span>Admin panel</span>
                        </button>
                      )}
                      <hr className="my-1 border-secondary-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Chiqish</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2 font-medium"
                >
                  <User className="h-4 w-4" />
                  <span>Kirish</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6 text-secondary-600" /> : <Menu className="h-6 w-6 text-secondary-600" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-secondary-200 py-4 animate-slide-up">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onViewChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      currentView === item.id
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              
              <div className="mt-4 px-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Kurs qidirish..."
                    className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
                
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                      <img
                        src={user?.avatar}
                        alt={user?.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-secondary-900">{user?.name}</div>
                        <div className="text-sm text-secondary-600">@{user?.telegramUsername}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfile(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-secondary-700 hover:bg-secondary-50 rounded-lg"
                    >
                      Profil sozlamalari
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Chiqish
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowLogin(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
                  >
                    Kirish
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
      
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
      
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
};

export default Header;