# SAOT Platform Database Documentation

## Database Setup

### 1. PostgreSQL o'rnatish

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### macOS (Homebrew):
```bash
brew install postgresql
brew services start postgresql
```

#### Windows:
PostgreSQL rasmiy saytidan yuklab oling: https://www.postgresql.org/download/windows/

### 2. Database va User yaratish

```bash
# PostgreSQL ga kirish
sudo -u postgres psql

# Database yaratish
CREATE DATABASE saot_platform;
CREATE USER saot_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE saot_platform TO saot_user;

# Database ga ulanish
\c saot_platform;
GRANT ALL ON SCHEMA public TO saot_user;
```

### 3. Schema yaratish

```bash
# Schema faylini ishga tushirish
psql -U saot_user -d saot_platform -f database/schema.sql

# Demo ma'lumotlarni yuklash
psql -U saot_user -d saot_platform -f database/seed_data.sql

# Funksiyalarni yuklash
psql -U saot_user -d saot_platform -f database/functions.sql
```

## Database Tuzilmasi

### Asosiy Jadvallar

#### 1. `users` - Foydalanuvchilar
- `id` (UUID) - Primary key
- `name` (VARCHAR) - To'liq ism
- `email` (VARCHAR) - Email manzil
- `telegram_username` (VARCHAR) - Telegram username (unique)
- `password_hash` (VARCHAR) - Shifrlangan parol
- `role` (VARCHAR) - admin/user
- `avatar`, `phone`, `bio`, `location` - Qo'shimcha ma'lumotlar

#### 2. `courses` - Kurslar
- `id` (UUID) - Primary key
- `title` (VARCHAR) - Kurs nomi
- `description` (TEXT) - Tavsif
- `instructor` (VARCHAR) - O'qituvchi
- `price` (INTEGER) - Narx (so'm)
- `category` (VARCHAR) - Kategoriya
- `level` (VARCHAR) - Daraja
- `access_duration_days` (INTEGER) - Kirish muddati (kun)

#### 3. `lessons` - Darslar
- `id` (UUID) - Primary key
- `course_id` (UUID) - Kurs ID (foreign key)
- `title` (VARCHAR) - Dars nomi
- `order_number` (INTEGER) - Tartib raqami
- `is_free` (BOOLEAN) - Bepul darsmi
- `video_url` (TEXT) - Video manzil

#### 4. `user_course_purchases` - Sotib olishlar
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foydalanuvchi ID
- `course_id` (UUID) - Kurs ID
- `purchase_date` (TIMESTAMP) - Sotib olish sanasi
- `expires_at` (TIMESTAMP) - Tugash sanasi
- `payment_amount` (INTEGER) - To'lov miqdori

#### 5. `user_course_progress` - Progress
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foydalanuvchi ID
- `lesson_id` (UUID) - Dars ID
- `completed` (BOOLEAN) - Tugallanganmi
- `watch_time_seconds` (INTEGER) - Ko'rish vaqti

## Foydali Funksiyalar

### 1. Foydalanuvchi autentifikatsiyasi
```sql
SELECT * FROM check_user_password('alijon_dev', 'password');
```

### 2. Kursga kirish huquqini tekshirish
```sql
SELECT check_course_access('user_id', 'course_id');
```

### 3. Progress hisoblash
```sql
SELECT calculate_course_progress('user_id', 'course_id');
```

### 4. Kurs sotib olish
```sql
SELECT purchase_course('user_id', 'course_id', 399000, 'telegram_bot');
```

### 5. Foydalanuvchi kurslarini olish
```sql
SELECT * FROM get_user_courses('user_id');
```

## Backup va Restore

### Backup yaratish
```bash
# To'liq backup
pg_dump -h localhost -U saot_user -d saot_platform -f saot_backup_$(date +%Y%m%d_%H%M%S).sql

# Faqat ma'lumotlar
pg_dump -h localhost -U saot_user -d saot_platform --data-only -f saot_data_backup.sql

# Faqat schema
pg_dump -h localhost -U saot_user -d saot_platform --schema-only -f saot_schema_backup.sql
```

### Restore qilish
```bash
# Backup dan restore
psql -h localhost -U saot_user -d saot_platform -f saot_backup_20241201_120000.sql
```

## Maintenance

### 1. Eski ma'lumotlarni tozalash
```sql
SELECT * FROM cleanup_old_data(365); -- 1 yildan eski ma'lumotlar
```

### 2. Database maintenance
```sql
SELECT * FROM database_maintenance();
```

### 3. Health check
```sql
SELECT * FROM database_health_check();
```

### 4. Statistika
```sql
SELECT * FROM get_platform_stats();
```

## Environment Variables

`.env` faylida quyidagi o'zgaruvchilarni sozlang:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saot_platform
DB_USER=saot_user
DB_PASSWORD=your_secure_password
DB_SSL=false

# Production uchun
DB_HOST_PROD=your_production_host
DB_NAME_PROD=saot_platform_prod
DB_USER_PROD=your_prod_user
DB_PASSWORD_PROD=your_prod_password
```

## Security

### 1. Parol xavfsizligi
- Parollar `pgcrypto` extension bilan shifrlangan
- `crypt()` funksiyasi bcrypt algoritmi ishlatadi

### 2. SQL Injection himoyasi
- Barcha funksiyalar parameterized queries ishlatadi
- Input validation qo'shilgan

### 3. Kirish huquqlari
- Har bir foydalanuvchi faqat o'z ma'lumotlariga kirishi mumkin
- Admin huquqlari alohida tekshiriladi

## Performance Optimization

### 1. Indexlar
- Barcha foreign key larga index qo'shilgan
- Tez-tez qidiruv maydonlariga index
- Composite indexlar murakkab so'rovlar uchun

### 2. Views
- `course_stats` - kurs statistikasi
- `user_course_access` - foydalanuvchi kirish huquqlari

### 3. Monitoring
```sql
-- Sekin so'rovlarni topish
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Database hajmi
SELECT pg_size_pretty(pg_database_size('saot_platform'));

-- Jadval hajmlari
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Troubleshooting

### 1. Connection issues
```bash
# PostgreSQL ishlab turganini tekshirish
sudo systemctl status postgresql

# Port tekshirish
sudo netstat -plunt | grep postgres
```

### 2. Permission issues
```sql
-- User huquqlarini tekshirish
\du

-- Database huquqlarini berish
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO saot_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO saot_user;
```

### 3. Performance issues
```sql
-- Faol so'rovlar
SELECT * FROM pg_stat_activity WHERE state = 'active';

-- Lock lar
SELECT * FROM pg_locks WHERE NOT granted;
```

## Migration

Yangi o'zgarishlar uchun migration fayllar yarating:

```sql
-- migration_001_add_new_column.sql
ALTER TABLE courses ADD COLUMN difficulty_level INTEGER DEFAULT 1;
UPDATE courses SET difficulty_level = 1 WHERE level = 'Boshlang''ich';
UPDATE courses SET difficulty_level = 2 WHERE level = 'O''rta';
UPDATE courses SET difficulty_level = 3 WHERE level = 'Yuqori';
```

Migration ni ishga tushirish:
```bash
psql -U saot_user -d saot_platform -f migrations/migration_001_add_new_column.sql
```