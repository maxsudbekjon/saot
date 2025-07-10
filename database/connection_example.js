// SAOT Platform - Database Connection Example
// Node.js da PostgreSQL bilan ishlash uchun

const { Pool } = require('pg');
require('dotenv').config();

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'saot',
  user: process.env.DB_USER || 'maxsud',
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20, // maksimal connection lar
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Database Service Class
class DatabaseService {
  
  // Foydalanuvchi autentifikatsiyasi
  async authenticateUser(telegramUsername, password) {
    const query = 'SELECT * FROM check_user_password($1, $2)';
    const result = await pool.query(query, [telegramUsername, password]);
    return result.rows[0];
  }

  // Foydalanuvchi ma'lumotlarini olish
  async getUserByTelegram(telegramUsername) {
    const query = 'SELECT * FROM get_user_by_telegram($1)';
    const result = await pool.query(query, [telegramUsername]);
    return result.rows[0];
  }

  // Barcha kurslarni olish
  async getAllCourses(limit = 50, offset = 0) {
    const query = `
      SELECT 
        c.*,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as review_count
      FROM courses c
      LEFT JOIN course_reviews r ON c.id = r.course_id AND r.is_approved = true
      WHERE c.is_active = true
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  // Kurs tafsilotlarini olish
  async getCourseById(courseId) {
    const query = `
      SELECT 
        c.*,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as review_count
      FROM courses c
      LEFT JOIN course_reviews r ON c.id = r.course_id AND r.is_approved = true
      WHERE c.id = $1 AND c.is_active = true
      GROUP BY c.id
    `;
    const result = await pool.query(query, [courseId]);
    return result.rows[0];
  }

  // Kurs darslarini olish
  async getCourseLessons(userId, courseId) {
    const query = 'SELECT * FROM get_course_lessons_with_access($1, $2)';
    const result = await pool.query(query, [userId, courseId]);
    return result.rows;
  }

  // Foydalanuvchi kurslarini olish
  async getUserCourses(userId) {
    const query = 'SELECT * FROM get_user_courses($1)';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Kurs sotib olish
  async purchaseCourse(userId, courseId, paymentAmount, paymentMethod = 'telegram_bot', transactionId = null) {
    const query = 'SELECT purchase_course($1, $2, $3, $4, $5)';
    const result = await pool.query(query, [userId, courseId, paymentAmount, paymentMethod, transactionId]);
    return result.rows[0].purchase_course;
  }

  // Darsni tugallash
  async completeLesson(userId, lessonId, watchTimeSeconds = 0) {
    const query = 'SELECT complete_lesson($1, $2, $3)';
    const result = await pool.query(query, [userId, lessonId, watchTimeSeconds]);
    return result.rows[0].complete_lesson;
  }

  // Kursga kirish huquqini tekshirish
  async checkCourseAccess(userId, courseId) {
    const query = 'SELECT check_course_access($1, $2)';
    const result = await pool.query(query, [userId, courseId]);
    return result.rows[0].check_course_access;
  }

  // Kurs progressini hisoblash
  async getCourseProgress(userId, courseId) {
    const query = 'SELECT calculate_course_progress($1, $2)';
    const result = await pool.query(query, [userId, courseId]);
    return result.rows[0].calculate_course_progress;
  }

  // Kurslarni qidirish
  async searchCourses(searchTerm, category = null, level = null, limit = 20) {
    let query = `
      SELECT 
        c.*,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as review_count
      FROM courses c
      LEFT JOIN course_reviews r ON c.id = r.course_id AND r.is_approved = true
      WHERE c.is_active = true
    `;
    const params = [];
    let paramCount = 0;

    if (searchTerm) {
      paramCount++;
      query += ` AND (c.title ILIKE $${paramCount} OR c.description ILIKE $${paramCount} OR $${paramCount} = ANY(c.tags))`;
      params.push(`%${searchTerm}%`);
    }

    if (category) {
      paramCount++;
      query += ` AND c.category = $${paramCount}`;
      params.push(category);
    }

    if (level) {
      paramCount++;
      query += ` AND c.level = $${paramCount}`;
      params.push(level);
    }

    query += ` GROUP BY c.id ORDER BY c.created_at DESC LIMIT $${paramCount + 1}`;
    params.push(limit);

    const result = await pool.query(query, params);
    return result.rows;
  }

  // Kategoriyalarni olish
  async getCategories() {
    const query = 'SELECT * FROM categories WHERE is_active = true ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  }

  // Foydalanuvchi yaratish
  async createUser(userData) {
    const { name, email, telegramUsername, password, phone = null, bio = null, location = null } = userData;
    const query = `
      INSERT INTO users (name, email, telegram_username, password_hash, phone, bio, location)
      VALUES ($1, $2, $3, crypt($4, gen_salt('bf')), $5, $6, $7)
      RETURNING id, name, email, telegram_username, role, avatar, created_at
    `;
    const result = await pool.query(query, [name, email, telegramUsername, password, phone, bio, location]);
    return result.rows[0];
  }

  // Sessiya yaratish
  async createSession(userId, deviceId, deviceInfo, ipAddress = null, userAgent = null) {
    const query = 'SELECT create_user_session($1, $2, $3, $4, $5)';
    const result = await pool.query(query, [userId, deviceId, JSON.stringify(deviceInfo), ipAddress, userAgent]);
    return result.rows[0].create_user_session;
  }

  // Sessiyani yangilash
  async updateSessionActivity(userId, deviceId) {
    const query = `
      UPDATE user_sessions 
      SET last_activity = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND device_id = $2 AND is_active = true
      RETURNING id
    `;
    const result = await pool.query(query, [userId, deviceId]);
    return result.rows.length > 0;
  }

  // Foydalanuvchi sessiyalarini olish
  async getUserSessions(userId) {
    const query = `
      SELECT id, device_id, device_info, login_time, last_activity, is_active
      FROM user_sessions
      WHERE user_id = $1 AND is_active = true AND expires_at > CURRENT_TIMESTAMP
      ORDER BY last_activity DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Boshqa sessiyalarni tugatish
  async terminateOtherSessions(userId, currentDeviceId) {
    const query = `
      UPDATE user_sessions 
      SET is_active = false
      WHERE user_id = $1 AND device_id != $2 AND is_active = true
    `;
    const result = await pool.query(query, [userId, currentDeviceId]);
    return result.rowCount;
  }

  // Platform statistikasi
  async getPlatformStats() {
    const query = 'SELECT * FROM get_platform_stats()';
    const result = await pool.query(query);
    return result.rows[0];
  }

  // Database health check
  async healthCheck() {
    const query = 'SELECT * FROM database_health_check()';
    const result = await pool.query(query);
    return result.rows;
  }

  // Eski ma'lumotlarni tozalash
  async cleanupOldData(daysOld = 365) {
    const query = 'SELECT * FROM cleanup_old_data($1)';
    const result = await pool.query(query, [daysOld]);
    return result.rows[0];
  }

  // Admin: Yangi kurs qo'shish
  async createCourse(courseData) {
    const {
      title, description, instructor, instructorAvatar, duration,
      price, thumbnail, category, level, tags, accessDurationDays = 180
    } = courseData;

    const query = `
      INSERT INTO courses (
        title, description, instructor, instructor_avatar, duration,
        price, thumbnail, category, level, tags, access_duration_days
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await pool.query(query, [
      title, description, instructor, instructorAvatar, duration,
      price, thumbnail, category, level, tags, accessDurationDays
    ]);

    return result.rows[0];
  }

  // Admin: Dars qo'shish
  async createLesson(lessonData) {
    const { courseId, title, description, duration, videoUrl, orderNumber, isFree = false } = lessonData;

    const query = `
      INSERT INTO lessons (course_id, title, description, duration, video_url, order_number, is_free)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(query, [
      courseId, title, description, duration, videoUrl, orderNumber, isFree
    ]);

    // Kurs darslar sonini yangilash
    await pool.query(
      'UPDATE courses SET lessons_count = (SELECT COUNT(*) FROM lessons WHERE course_id = $1 AND is_active = true) WHERE id = $1',
      [courseId]
    );

    return result.rows[0];
  }

  // Connection pool ni yopish
  async close() {
    await pool.end();
  }
}

// Error handling
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

module.exports = new DatabaseService();

// Usage example:
/*
const db = require('./database/connection_example');

async function example() {
  try {
    // Foydalanuvchi autentifikatsiyasi
    const user = await db.authenticateUser('alijon_dev', 'password');
    console.log('User:', user);

    // Kurslarni olish
    const courses = await db.getAllCourses(10, 0);
    console.log('Courses:', courses);

    // Kurs sotib olish
    const purchased = await db.purchaseCourse(user.user_id, courses[0].id, courses[0].price);
    console.log('Purchase result:', purchased);

  } catch (error) {
    console.error('Database error:', error);
  }
}

example();
*/