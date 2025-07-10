-- SAOT Platform Database Schema
-- PostgreSQL uchun to'liq database tuzilmasi

-- Database yaratish (agar mavjud bo'lmasa)
CREATE DATABASE saot_platform;

-- Database ga ulanish
\c saot_platform;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users jadvali
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telegram_username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar TEXT DEFAULT 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    phone VARCHAR(20),
    bio TEXT,
    location VARCHAR(255),
    birth_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Courses jadvali
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    instructor VARCHAR(255) NOT NULL,
    instructor_avatar TEXT,
    duration VARCHAR(50),
    lessons_count INTEGER DEFAULT 0,
    students_count INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    price INTEGER NOT NULL CHECK (price >= 0),
    thumbnail TEXT,
    category VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('Boshlang''ich', 'O''rta', 'Yuqori')),
    tags TEXT[],
    video_url TEXT,
    is_active BOOLEAN DEFAULT true,
    access_duration_days INTEGER DEFAULT 180, -- 6 oy kirish
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lessons jadvali
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    duration VARCHAR(20),
    video_url TEXT,
    order_number INTEGER NOT NULL,
    is_free BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, order_number)
);

-- User Course Purchases jadvali
CREATE TABLE IF NOT EXISTS user_course_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    payment_amount INTEGER NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'telegram_bot',
    payment_status VARCHAR(20) DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(255),
    telegram_payment_id VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, course_id)
);

-- User Course Progress jadvali
CREATE TABLE IF NOT EXISTS user_course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    watch_time_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id, lesson_id)
);

-- User Sessions jadvali (qurilma boshqaruvi uchun)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    device_info JSONB,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days')
);

-- Categories jadvali (kurs kategoriyalari uchun)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Course Reviews jadvali
CREATE TABLE IF NOT EXISTS course_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- Notifications jadvali
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexlar (performance uchun)
CREATE INDEX IF NOT EXISTS idx_users_telegram_username ON users(telegram_username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_is_active ON courses(is_active);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at);
CREATE INDEX IF NOT EXISTS idx_courses_rating ON courses(rating);
CREATE INDEX IF NOT EXISTS idx_courses_price ON courses(price);

CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(course_id, order_number);
CREATE INDEX IF NOT EXISTS idx_lessons_is_free ON lessons(is_free);

CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON user_course_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_course_id ON user_course_purchases(course_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_course ON user_course_purchases(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON user_course_purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON user_course_purchases(purchase_date);

CREATE INDEX IF NOT EXISTS idx_progress_user_course ON user_course_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson ON user_course_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON user_course_progress(completed);

CREATE INDEX IF NOT EXISTS idx_sessions_user_device ON user_sessions(user_id, device_id);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON user_sessions(is_active, last_activity);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_reviews_course ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON course_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON course_reviews(is_approved);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- Triggers (updated_at ni avtomatik yangilash uchun)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON user_course_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views (tez-tez ishlatiladigan ma'lumotlar uchun)
CREATE OR REPLACE VIEW course_stats AS
SELECT 
    c.id,
    c.title,
    c.category,
    c.price,
    c.students_count,
    c.rating,
    COUNT(l.id) as actual_lessons_count,
    COUNT(CASE WHEN l.is_free = true THEN 1 END) as free_lessons_count,
    COUNT(p.id) as total_purchases,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as review_count
FROM courses c
LEFT JOIN lessons l ON c.id = l.course_id AND l.is_active = true
LEFT JOIN user_course_purchases p ON c.id = p.course_id AND p.is_active = true
LEFT JOIN course_reviews r ON c.id = r.course_id AND r.is_approved = true
WHERE c.is_active = true
GROUP BY c.id, c.title, c.category, c.price, c.students_count, c.rating;

CREATE OR REPLACE VIEW user_course_access AS
SELECT 
    u.id as user_id,
    u.telegram_username,
    c.id as course_id,
    c.title as course_title,
    p.purchase_date,
    p.expires_at,
    CASE 
        WHEN p.expires_at > CURRENT_TIMESTAMP OR p.expires_at IS NULL THEN true
        ELSE false
    END as has_access,
    COUNT(pr.id) as completed_lessons,
    COUNT(l.id) as total_lessons,
    CASE 
        WHEN COUNT(l.id) > 0 THEN ROUND((COUNT(CASE WHEN pr.completed THEN 1 END) * 100.0) / COUNT(l.id), 2)
        ELSE 0
    END as progress_percentage
FROM users u
JOIN user_course_purchases p ON u.id = p.user_id AND p.is_active = true
JOIN courses c ON p.course_id = c.id AND c.is_active = true
LEFT JOIN lessons l ON c.id = l.course_id AND l.is_active = true
LEFT JOIN user_course_progress pr ON u.id = pr.user_id AND l.id = pr.lesson_id AND pr.completed = true
GROUP BY u.id, u.telegram_username, c.id, c.title, p.purchase_date, p.expires_at;