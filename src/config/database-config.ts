// Database Configuration va SQL Queries
// Bu faylni o'zgartirib database sozlamalarini boshqarishingiz mumkin

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

// Development uchun local database
export const DEV_DATABASE_CONFIG: DatabaseConfig = {
  host: 'localhost',
  port: 5432,
  database: 'eduplatform_dev',
  user: 'postgres',
  password: 'your_password_here',
  ssl: false
};

// Production uchun database (environment variables dan olinadi)
export const PROD_DATABASE_CONFIG: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'eduplatform_prod',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true'
};

// Joriy muhitga qarab database config ni tanlash
export const getDatabaseConfig = (): DatabaseConfig => {
  return process.env.NODE_ENV === 'production' 
    ? PROD_DATABASE_CONFIG 
    : DEV_DATABASE_CONFIG;
};

// Database jadvallarini yaratish uchun SQL
export const CREATE_TABLES_SQL = `
-- Users jadvali
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  phone VARCHAR(20),
  bio TEXT,
  location VARCHAR(255),
  birth_date DATE,
  telegram_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses jadvali
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  instructor_avatar VARCHAR(500),
  duration VARCHAR(50),
  lessons_count INTEGER DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  price INTEGER NOT NULL,
  thumbnail VARCHAR(500),
  category VARCHAR(100),
  level VARCHAR(20) CHECK (level IN ('Boshlang''ich', 'O''rta', 'Yuqori')),
  tags TEXT[], -- PostgreSQL array
  video_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons jadvali
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(20),
  video_url VARCHAR(500),
  order_number INTEGER NOT NULL,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Course Purchases jadvali (to'lovlar)
CREATE TABLE IF NOT EXISTS user_course_purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_amount INTEGER NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'completed',
  transaction_id VARCHAR(255),
  telegram_payment_id VARCHAR(255),
  UNIQUE(user_id, course_id)
);

-- User Course Progress jadvali
CREATE TABLE IF NOT EXISTS user_course_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  progress_percentage INTEGER DEFAULT 0,
  UNIQUE(user_id, course_id, lesson_id)
);

-- User Sessions jadvali (qurilma sessiyalari)
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  device_id VARCHAR(255) NOT NULL,
  device_info JSONB,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- Indexlar performance uchun
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(course_id, order_number);
CREATE INDEX IF NOT EXISTS idx_purchases_user_course ON user_course_purchases(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON user_course_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_device ON user_sessions(user_id, device_id);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON user_sessions(is_active, last_activity);
`;

// Demo ma'lumotlarni kiritish
export const INSERT_DEMO_DATA_SQL = `
-- Demo users
INSERT INTO users (name, email, password_hash, avatar, role, phone, bio, location, telegram_id) VALUES
('Admin Foydalanuvchi', 'admin@eduplatform.uz', '$2b$10$hash_here', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', 'admin', '+998901234567', 'Platform administratori', 'Toshkent, O''zbekiston', '123456789'),
('Alijon Karimov', 'user@eduplatform.uz', '$2b$10$hash_here', 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150', 'user', '+998901234568', 'Dasturlashni o''rganuvchi', 'Samarqand, O''zbekiston', '987654321')
ON CONFLICT (email) DO NOTHING;

-- Demo courses
INSERT INTO courses (title, description, instructor, instructor_avatar, duration, lessons_count, students_count, rating, price, thumbnail, category, level, tags) VALUES
('Python Dasturlash Asoslari', 'Noldan boshlab Python dasturlash tilini o''rganing. Algoritmlar, ma''lumotlar tuzilmasi va amaliy loyihalar.', 'Alijon Karimov', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', '12 soat', 48, 2340, 4.8, 299000, 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800', 'Backend Development', 'Boshlang''ich', ARRAY['Python', 'Dasturlash', 'Algoritmlar']),
('Web Development - Full Stack', 'HTML, CSS, JavaScript va React bilan zamonaviy web saytlar yarating. Backend uchun Node.js.', 'Madina Usmanova', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150', '25 soat', 72, 1890, 4.9, 449000, 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800', 'Full Stack Development', 'O''rta', ARRAY['React', 'Node.js', 'Full Stack']),
('Data Science va Machine Learning', 'Ma''lumotlar tahlili, statistika va machine learning algoritmlari. Python va TensorFlow ishlatish.', 'Bobur Rahimov', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150', '35 soat', 95, 1450, 4.7, 599000, 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800', 'Data Science', 'Yuqori', ARRAY['Machine Learning', 'Python', 'AI']),
('Mobile App Development - Flutter', 'Android va iOS uchun bir vaqtda mobile ilovalar yarating. Flutter va Dart tili.', 'Zarina Abdullayeva', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', '20 soat', 65, 980, 4.6, 399000, 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=800', 'Mobile Development', 'O''rta', ARRAY['Flutter', 'Mobile', 'Cross-platform'])
ON CONFLICT DO NOTHING;

-- Demo lessons
INSERT INTO lessons (course_id, title, description, duration, video_url, order_number, is_free) VALUES
(1, 'Python ga kirish va muhitni sozlash', 'Python dasturlash tili bilan tanishish va ishchi muhitni sozlash', '15:30', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 1, true),
(1, 'O''zgaruvchilar va ma''lumot turlari', 'Python da o''zgaruvchilar va asosiy ma''lumot turlari', '22:45', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 2, true),
(1, 'Shartli operatorlar', 'If, elif, else operatorlari bilan ishlash', '28:15', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 3, false),
(1, 'Sikllar (for va while)', 'For va while sikllari bilan ishlash', '35:20', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 4, false),
(2, 'HTML asoslari', 'HTML teglar va tuzilma', '20:30', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 1, true),
(2, 'CSS bilan dizayn', 'CSS selektorlar va stillar', '25:15', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 2, true),
(2, 'JavaScript asoslari', 'JavaScript sintaksis va asosiy tushunchalar', '30:45', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 3, false)
ON CONFLICT DO NOTHING;
`;

// Database connection funksiyalari
export const connectToDatabase = async (config: DatabaseConfig) => {
  // Bu yerda real database connection logic bo'ladi
  // PostgreSQL, MySQL yoki boshqa database uchun
  console.log('Database ga ulanish:', config);
};

// Database migration funksiyalari
export const runMigrations = async () => {
  // Migration fayllarini ishga tushirish
  console.log('Database migrations ishga tushirilmoqda...');
};

// Database backup funksiyalari
export const createBackup = async (backupPath: string) => {
  // Database backup yaratish
  console.log('Database backup yaratilmoqda:', backupPath);
};

// Database statistika
export const getDatabaseStats = async () => {
  return {
    totalUsers: 0,
    totalCourses: 0,
    totalLessons: 0,
    totalPurchases: 0,
    databaseSize: '0 MB'
  };
};