// PostgreSQL Database Configuration
// Bu faylni o'zingizning database ma'lumotlaringiz bilan o'zgartiring

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

-- Indexlar performance uchun
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_course ON user_course_purchases(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON user_course_progress(user_id, course_id);
`;

// Demo ma'lumotlarni kiritish
export const INSERT_DEMO_DATA_SQL = `
-- Demo users
INSERT INTO users (name, email, password_hash, avatar, role, phone, bio, location) VALUES
('Admin User', 'admin@eduplatform.uz', '$2b$10$hash_here', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', 'admin', '+998901234567', 'Platform administratori', 'Toshkent, O''zbekiston'),
('Alijon Karimov', 'user@eduplatform.uz', '$2b$10$hash_here', 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150', 'user', '+998901234568', 'Dasturlashni o''rganuvchi', 'Samarqand, O''zbekiston')
ON CONFLICT (email) DO NOTHING;

-- Demo courses
INSERT INTO courses (title, description, instructor, instructor_avatar, duration, lessons_count, students_count, rating, price, thumbnail, category, level, tags) VALUES
('Python Dasturlash Asoslari', 'Noldan boshlab Python dasturlash tilini o''rganing. Algoritmlar, ma''lumotlar tuzilmasi va amaliy loyihalar.', 'Alijon Karimov', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', '12 soat', 48, 2340, 4.8, 299000, 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800', 'Dasturlash', 'Boshlang''ich', ARRAY['Python', 'Dasturlash', 'Algoritmlar']),
('Web Development - Full Stack', 'HTML, CSS, JavaScript va React bilan zamonaviy web saytlar yarating. Backend uchun Node.js.', 'Madina Usmanova', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150', '25 soat', 72, 1890, 4.9, 449000, 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800', 'Web Development', 'O''rta', ARRAY['React', 'Node.js', 'Full Stack'])
ON CONFLICT DO NOTHING;
`;