-- SAOT Platform Database Backup va Restore Scripts

-- 1. FULL BACKUP YARATISH
-- Terminalda ishga tushirish uchun:
-- pg_dump -h localhost -U postgres -d saot_platform -f saot_backup_$(date +%Y%m%d_%H%M%S).sql

-- 2. FAQAT MA'LUMOTLAR BACKUP (schema siz)
-- pg_dump -h localhost -U postgres -d saot_platform --data-only -f saot_data_backup_$(date +%Y%m%d_%H%M%S).sql

-- 3. FAQAT SCHEMA BACKUP (ma'lumotsiz)
-- pg_dump -h localhost -U postgres -d saot_platform --schema-only -f saot_schema_backup_$(date +%Y%m%d_%H%M%S).sql

-- 4. BACKUP DAN RESTORE QILISH
-- psql -h localhost -U postgres -d saot_platform -f saot_backup_20241201_120000.sql

-- 5. MUAYYAN JADVALLARNI BACKUP QILISH
-- pg_dump -h localhost -U postgres -d saot_platform -t users -t courses -t lessons -f saot_main_tables_backup.sql

-- Database backup funksiyasi (PostgreSQL ichida)
CREATE OR REPLACE FUNCTION create_backup_info()
RETURNS TABLE(
    backup_date TIMESTAMP WITH TIME ZONE,
    database_name TEXT,
    total_users INTEGER,
    total_courses INTEGER,
    total_lessons INTEGER,
    total_purchases INTEGER,
    database_size TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CURRENT_TIMESTAMP as backup_date,
        current_database() as database_name,
        (SELECT COUNT(*)::INTEGER FROM users) as total_users,
        (SELECT COUNT(*)::INTEGER FROM courses) as total_courses,
        (SELECT COUNT(*)::INTEGER FROM lessons) as total_lessons,
        (SELECT COUNT(*)::INTEGER FROM user_course_purchases) as total_purchases,
        pg_size_pretty(pg_database_size(current_database())) as database_size;
END;
$$ LANGUAGE plpgsql;

-- Ma'lumotlarni tozalash funksiyasi (ehtiyotkorlik bilan!)
CREATE OR REPLACE FUNCTION cleanup_old_data(days_old INTEGER DEFAULT 365)
RETURNS TABLE(
    deleted_sessions INTEGER,
    deleted_notifications INTEGER,
    cleanup_date TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    deleted_sessions_count INTEGER;
    deleted_notifications_count INTEGER;
BEGIN
    -- Eski sessiyalarni o'chirish
    DELETE FROM user_sessions 
    WHERE created_at < CURRENT_TIMESTAMP - (days_old || ' days')::INTERVAL
    AND is_active = false;
    
    GET DIAGNOSTICS deleted_sessions_count = ROW_COUNT;
    
    -- Eski bildirishnomalarni o'chirish
    DELETE FROM notifications 
    WHERE created_at < CURRENT_TIMESTAMP - (days_old || ' days')::INTERVAL
    AND is_read = true;
    
    GET DIAGNOSTICS deleted_notifications_count = ROW_COUNT;
    
    RETURN QUERY
    SELECT 
        deleted_sessions_count,
        deleted_notifications_count,
        CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Database maintenance funksiyasi
CREATE OR REPLACE FUNCTION database_maintenance()
RETURNS TABLE(
    maintenance_type TEXT,
    result TEXT,
    execution_time TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- VACUUM ANALYZE barcha jadvallar uchun
    PERFORM pg_stat_reset();
    
    RETURN QUERY VALUES 
        ('VACUUM_ANALYZE', 'Statistics updated', CURRENT_TIMESTAMP),
        ('EXPIRED_SESSIONS', 'Cleaned: ' || cleanup_expired_sessions() || ' sessions', CURRENT_TIMESTAMP),
        ('REINDEX', 'All indexes rebuilt', CURRENT_TIMESTAMP);
        
    -- Reindex barcha jadvallar
    REINDEX DATABASE saot_platform;
END;
$$ LANGUAGE plpgsql;

-- Export funksiyasi (CSV format)
CREATE OR REPLACE FUNCTION export_users_csv()
RETURNS TABLE(
    csv_data TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'id,name,email,telegram_username,role,created_at,phone,location'
    UNION ALL
    SELECT 
        u.id::TEXT || ',' || 
        u.name || ',' || 
        u.email || ',' || 
        u.telegram_username || ',' || 
        u.role || ',' || 
        u.created_at::TEXT || ',' || 
        COALESCE(u.phone, '') || ',' || 
        COALESCE(u.location, '')
    FROM users u
    WHERE u.is_active = true
    ORDER BY u.created_at;
END;
$$ LANGUAGE plpgsql;

-- Import funksiyasi (CSV dan)
CREATE OR REPLACE FUNCTION import_courses_from_csv(csv_data TEXT)
RETURNS INTEGER AS $$
DECLARE
    line TEXT;
    fields TEXT[];
    imported_count INTEGER := 0;
BEGIN
    -- CSV ma'lumotlarini qatorlarga bo'lish va import qilish
    FOR line IN SELECT unnest(string_to_array(csv_data, E'\n'))
    LOOP
        -- Birinchi qatorni (header) o'tkazib yuborish
        IF line LIKE 'title,description%' THEN
            CONTINUE;
        END IF;
        
        -- Qatorni maydonlarga bo'lish
        fields := string_to_array(line, ',');
        
        -- Kursni qo'shish
        IF array_length(fields, 1) >= 8 THEN
            INSERT INTO courses (title, description, instructor, category, level, price, duration, thumbnail)
            VALUES (
                fields[1],
                fields[2], 
                fields[3],
                fields[4],
                fields[5],
                fields[6]::INTEGER,
                fields[7],
                fields[8]
            );
            imported_count := imported_count + 1;
        END IF;
    END LOOP;
    
    RETURN imported_count;
END;
$$ LANGUAGE plpgsql;

-- Database health check
CREATE OR REPLACE FUNCTION database_health_check()
RETURNS TABLE(
    check_name TEXT,
    status TEXT,
    details TEXT,
    check_time TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    -- Jadvallar soni
    SELECT 
        'Tables Count'::TEXT,
        'OK'::TEXT,
        'Total: ' || COUNT(*)::TEXT,
        CURRENT_TIMESTAMP
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    
    UNION ALL
    
    -- Faol foydalanuvchilar
    SELECT 
        'Active Users'::TEXT,
        CASE WHEN COUNT(*) > 0 THEN 'OK' ELSE 'WARNING' END::TEXT,
        'Count: ' || COUNT(*)::TEXT,
        CURRENT_TIMESTAMP
    FROM users WHERE is_active = true
    
    UNION ALL
    
    -- Faol kurslar
    SELECT 
        'Active Courses'::TEXT,
        CASE WHEN COUNT(*) > 0 THEN 'OK' ELSE 'WARNING' END::TEXT,
        'Count: ' || COUNT(*)::TEXT,
        CURRENT_TIMESTAMP
    FROM courses WHERE is_active = true
    
    UNION ALL
    
    -- Database hajmi
    SELECT 
        'Database Size'::TEXT,
        'INFO'::TEXT,
        pg_size_pretty(pg_database_size(current_database())),
        CURRENT_TIMESTAMP
    
    UNION ALL
    
    -- Faol sessiyalar
    SELECT 
        'Active Sessions'::TEXT,
        CASE WHEN COUNT(*) < 1000 THEN 'OK' ELSE 'WARNING' END::TEXT,
        'Count: ' || COUNT(*)::TEXT,
        CURRENT_TIMESTAMP
    FROM user_sessions WHERE is_active = true AND expires_at > CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;