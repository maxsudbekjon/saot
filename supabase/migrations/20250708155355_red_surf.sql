-- SAOT Platform Database Functions
-- Foydali funksiyalar va stored procedures

-- Foydalanuvchi parolini tekshirish funksiyasi
CREATE OR REPLACE FUNCTION check_user_password(
    p_telegram_username VARCHAR,
    p_password VARCHAR
) RETURNS TABLE(
    user_id UUID,
    user_name VARCHAR,
    user_email VARCHAR,
    user_role VARCHAR,
    is_valid BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        (u.password_hash = crypt(p_password, u.password_hash)) as is_valid
    FROM users u
    WHERE u.telegram_username = p_telegram_username 
    AND u.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Foydalanuvchining kursga kirish huquqini tekshirish
CREATE OR REPLACE FUNCTION check_course_access(
    p_user_id UUID,
    p_course_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    has_access BOOLEAN := false;
BEGIN
    SELECT EXISTS(
        SELECT 1 
        FROM user_course_purchases p
        WHERE p.user_id = p_user_id 
        AND p.course_id = p_course_id
        AND p.is_active = true
        AND (p.expires_at IS NULL OR p.expires_at > CURRENT_TIMESTAMP)
    ) INTO has_access;
    
    RETURN has_access;
END;
$$ LANGUAGE plpgsql;

-- Kurs progressini hisoblash
CREATE OR REPLACE FUNCTION calculate_course_progress(
    p_user_id UUID,
    p_course_id UUID
) RETURNS DECIMAL AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
    progress_percentage DECIMAL;
BEGIN
    -- Jami darslar soni
    SELECT COUNT(*) INTO total_lessons
    FROM lessons l
    WHERE l.course_id = p_course_id AND l.is_active = true;
    
    -- Tugallangan darslar soni
    SELECT COUNT(*) INTO completed_lessons
    FROM user_course_progress p
    WHERE p.user_id = p_user_id 
    AND p.course_id = p_course_id 
    AND p.completed = true;
    
    -- Progress foizini hisoblash
    IF total_lessons > 0 THEN
        progress_percentage := ROUND((completed_lessons * 100.0) / total_lessons, 2);
    ELSE
        progress_percentage := 0;
    END IF;
    
    RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql;

-- Darsni tugallash funksiyasi
CREATE OR REPLACE FUNCTION complete_lesson(
    p_user_id UUID,
    p_lesson_id UUID,
    p_watch_time_seconds INTEGER DEFAULT 0
) RETURNS BOOLEAN AS $$
DECLARE
    lesson_course_id UUID;
    has_access BOOLEAN;
BEGIN
    -- Darsning kurs ID sini olish
    SELECT course_id INTO lesson_course_id
    FROM lessons
    WHERE id = p_lesson_id;
    
    -- Foydalanuvchining kursga kirish huquqini tekshirish
    SELECT check_course_access(p_user_id, lesson_course_id) INTO has_access;
    
    IF NOT has_access THEN
        RETURN false;
    END IF;
    
    -- Progress ni yangilash yoki yaratish
    INSERT INTO user_course_progress (user_id, course_id, lesson_id, completed, completed_at, watch_time_seconds)
    VALUES (p_user_id, lesson_course_id, p_lesson_id, true, CURRENT_TIMESTAMP, p_watch_time_seconds)
    ON CONFLICT (user_id, course_id, lesson_id)
    DO UPDATE SET 
        completed = true,
        completed_at = CURRENT_TIMESTAMP,
        watch_time_seconds = GREATEST(user_course_progress.watch_time_seconds, p_watch_time_seconds),
        updated_at = CURRENT_TIMESTAMP;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Kurs sotib olish funksiyasi
CREATE OR REPLACE FUNCTION purchase_course(
    p_user_id UUID,
    p_course_id UUID,
    p_payment_amount INTEGER,
    p_payment_method VARCHAR DEFAULT 'telegram_bot',
    p_transaction_id VARCHAR DEFAULT NULL,
    p_telegram_payment_id VARCHAR DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    course_access_days INTEGER;
BEGIN
    -- Kursning kirish muddatini olish
    SELECT access_duration_days INTO course_access_days
    FROM courses
    WHERE id = p_course_id AND is_active = true;
    
    IF course_access_days IS NULL THEN
        RETURN false;
    END IF;
    
    -- Sotib olishni yozib olish
    INSERT INTO user_course_purchases (
        user_id, 
        course_id, 
        payment_amount, 
        payment_method, 
        transaction_id, 
        telegram_payment_id,
        expires_at
    )
    VALUES (
        p_user_id, 
        p_course_id, 
        p_payment_amount, 
        p_payment_method, 
        p_transaction_id, 
        p_telegram_payment_id,
        CURRENT_TIMESTAMP + (course_access_days || ' days')::INTERVAL
    )
    ON CONFLICT (user_id, course_id)
    DO UPDATE SET 
        payment_amount = p_payment_amount,
        payment_method = p_payment_method,
        transaction_id = p_transaction_id,
        telegram_payment_id = p_telegram_payment_id,
        expires_at = CURRENT_TIMESTAMP + (course_access_days || ' days')::INTERVAL,
        is_active = true;
    
    -- Kurs statistikasini yangilash
    UPDATE courses 
    SET students_count = students_count + 1
    WHERE id = p_course_id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Foydalanuvchining barcha kurslarini olish
CREATE OR REPLACE FUNCTION get_user_courses(p_user_id UUID)
RETURNS TABLE(
    course_id UUID,
    course_title VARCHAR,
    course_thumbnail TEXT,
    course_instructor VARCHAR,
    course_category VARCHAR,
    purchase_date TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    has_access BOOLEAN,
    progress_percentage DECIMAL,
    total_lessons INTEGER,
    completed_lessons INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.title,
        c.thumbnail,
        c.instructor,
        c.category,
        p.purchase_date,
        p.expires_at,
        (p.expires_at IS NULL OR p.expires_at > CURRENT_TIMESTAMP) as has_access,
        calculate_course_progress(p_user_id, c.id) as progress_percentage,
        (SELECT COUNT(*)::INTEGER FROM lessons l WHERE l.course_id = c.id AND l.is_active = true) as total_lessons,
        (SELECT COUNT(*)::INTEGER FROM user_course_progress pr WHERE pr.user_id = p_user_id AND pr.course_id = c.id AND pr.completed = true) as completed_lessons
    FROM user_course_purchases p
    JOIN courses c ON p.course_id = c.id
    WHERE p.user_id = p_user_id 
    AND p.is_active = true
    AND c.is_active = true
    ORDER BY p.purchase_date DESC;
END;
$$ LANGUAGE plpgsql;

-- Kurs darslarini olish (kirish huquqi bilan)
CREATE OR REPLACE FUNCTION get_course_lessons_with_access(
    p_user_id UUID,
    p_course_id UUID
)
RETURNS TABLE(
    lesson_id UUID,
    lesson_title VARCHAR,
    lesson_description TEXT,
    lesson_duration VARCHAR,
    lesson_order INTEGER,
    is_free BOOLEAN,
    is_accessible BOOLEAN,
    is_completed BOOLEAN,
    completed_at TIMESTAMP WITH TIME ZONE,
    watch_time_seconds INTEGER
) AS $$
DECLARE
    has_course_access BOOLEAN;
BEGIN
    -- Kursga kirish huquqini tekshirish
    SELECT check_course_access(p_user_id, p_course_id) INTO has_course_access;
    
    RETURN QUERY
    SELECT 
        l.id,
        l.title,
        l.description,
        l.duration,
        l.order_number,
        l.is_free,
        (l.is_free OR has_course_access) as is_accessible,
        COALESCE(pr.completed, false) as is_completed,
        pr.completed_at,
        COALESCE(pr.watch_time_seconds, 0) as watch_time_seconds
    FROM lessons l
    LEFT JOIN user_course_progress pr ON l.id = pr.lesson_id AND pr.user_id = p_user_id
    WHERE l.course_id = p_course_id 
    AND l.is_active = true
    ORDER BY l.order_number;
END;
$$ LANGUAGE plpgsql;

-- Telegram username orqali foydalanuvchi ma'lumotlarini olish
CREATE OR REPLACE FUNCTION get_user_by_telegram(p_telegram_username VARCHAR)
RETURNS TABLE(
    user_id UUID,
    user_name VARCHAR,
    user_email VARCHAR,
    user_role VARCHAR,
    user_avatar TEXT,
    user_phone VARCHAR,
    user_bio TEXT,
    user_location VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    purchased_courses_count INTEGER,
    completed_courses_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.avatar,
        u.phone,
        u.bio,
        u.location,
        u.created_at,
        (SELECT COUNT(*)::INTEGER FROM user_course_purchases p WHERE p.user_id = u.id AND p.is_active = true) as purchased_courses_count,
        (SELECT COUNT(DISTINCT pr.course_id)::INTEGER 
         FROM user_course_progress pr 
         JOIN lessons l ON pr.lesson_id = l.id
         WHERE pr.user_id = u.id 
         AND pr.completed = true
         GROUP BY pr.course_id
         HAVING COUNT(*) = (SELECT COUNT(*) FROM lessons WHERE course_id = pr.course_id AND is_active = true)
        ) as completed_courses_count
    FROM users u
    WHERE u.telegram_username = p_telegram_username 
    AND u.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Sessiya yaratish funksiyasi
CREATE OR REPLACE FUNCTION create_user_session(
    p_user_id UUID,
    p_device_id VARCHAR,
    p_device_info JSONB,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    session_id UUID;
    active_sessions_count INTEGER;
BEGIN
    -- Faol sessiyalar sonini tekshirish
    SELECT COUNT(*) INTO active_sessions_count
    FROM user_sessions
    WHERE user_id = p_user_id 
    AND is_active = true 
    AND expires_at > CURRENT_TIMESTAMP;
    
    -- Maksimal 2 ta sessiyaga ruxsat
    IF active_sessions_count >= 2 THEN
        -- Eng eski sessiyani o'chirish
        UPDATE user_sessions 
        SET is_active = false
        WHERE id = (
            SELECT id 
            FROM user_sessions 
            WHERE user_id = p_user_id AND is_active = true
            ORDER BY last_activity ASC 
            LIMIT 1
        );
    END IF;
    
    -- Yangi sessiya yaratish
    INSERT INTO user_sessions (user_id, device_id, device_info, ip_address, user_agent)
    VALUES (p_user_id, p_device_id, p_device_info, p_ip_address, p_user_agent)
    RETURNING id INTO session_id;
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Eski sessiyalarni tozalash
CREATE OR REPLACE FUNCTION cleanup_expired_sessions() RETURNS INTEGER AS $$
DECLARE
    cleaned_count INTEGER;
BEGIN
    UPDATE user_sessions 
    SET is_active = false
    WHERE expires_at < CURRENT_TIMESTAMP 
    AND is_active = true;
    
    GET DIAGNOSTICS cleaned_count = ROW_COUNT;
    RETURN cleaned_count;
END;
$$ LANGUAGE plpgsql;

-- Platform statistikasi
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS TABLE(
    total_users INTEGER,
    total_courses INTEGER,
    total_purchases INTEGER,
    total_revenue BIGINT,
    active_users_today INTEGER,
    popular_category VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM users WHERE is_active = true) as total_users,
        (SELECT COUNT(*)::INTEGER FROM courses WHERE is_active = true) as total_courses,
        (SELECT COUNT(*)::INTEGER FROM user_course_purchases WHERE is_active = true) as total_purchases,
        (SELECT COALESCE(SUM(payment_amount), 0) FROM user_course_purchases WHERE is_active = true) as total_revenue,
        (SELECT COUNT(DISTINCT user_id)::INTEGER 
         FROM user_sessions 
         WHERE last_activity > CURRENT_TIMESTAMP - INTERVAL '1 day' 
         AND is_active = true) as active_users_today,
        (SELECT c.category 
         FROM courses c 
         JOIN user_course_purchases p ON c.id = p.course_id 
         WHERE c.is_active = true AND p.is_active = true
         GROUP BY c.category 
         ORDER BY COUNT(*) DESC 
         LIMIT 1) as popular_category;
END;
$$ LANGUAGE plpgsql;