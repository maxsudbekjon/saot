-- SAOT Platform Demo Ma'lumotlari
-- Bu faylni database yaratgandan keyin ishga tushiring

-- Categories qo'shish
INSERT INTO categories (name, description, icon, color) VALUES
('Dasturlash', 'Backend, Frontend va Full Stack development kurslari', '💻', 'blue'),
('Video Montaj', 'Adobe Premiere Pro, After Effects va boshqa video editing dasturlari', '🎬', 'purple'),
('Grafik Dizayn', 'Photoshop, Illustrator, Figma va dizayn asoslari', '🎨', 'pink'),
('Marketing', 'Digital marketing, SMM, SEO va reklama strategiyalari', '📈', 'green'),
('Til O''rganish', 'Ingliz tili, Rus tili va boshqa xorijiy tillar', '🗣️', 'orange'),
('Web Dizayn', 'UI/UX dizayn, Figma, web interface yaratish', '🌐', 'indigo')
ON CONFLICT (name) DO NOTHING;

-- Admin foydalanuvchi yaratish
INSERT INTO users (name, email, telegram_username, password_hash, role, phone, bio, location) VALUES
('Admin Foydalanuvchi', 'admin@saot.uz', 'admin_saot', crypt('admin123', gen_salt('bf')), 'admin', '+998901234567', 'SAOT platform administratori', 'Toshkent, O''zbekiston'),
('Alijon Karimov', 'alijon@saot.uz', 'alijon_dev', crypt('password', gen_salt('bf')), 'user', '+998901234568', 'Dasturlashni o''rganuvchi', 'Samarqand, O''zbekiston'),
('Madina Usmanova', 'madina@saot.uz', 'madina_designer', crypt('password', gen_salt('bf')), 'user', '+998901234569', 'Grafik dizayner', 'Buxoro, O''zbekiston')
ON CONFLICT (telegram_username) DO NOTHING;

-- Demo kurslar qo'shish
INSERT INTO courses (title, description, instructor, instructor_avatar, duration, lessons_count, students_count, rating, price, thumbnail, category, level, tags, access_duration_days) VALUES
('Python Dasturlash - Noldan Professionalgacha', 'Python dasturlash tilini noldan o''rganing. Backend development, data science va automation uchun zarur bo''lgan barcha bilimlar. Django va Flask framework lari bilan web development.', 'Alijon Karimov', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', '15 soat', 52, 3240, 4.9, 399000, 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800', 'Dasturlash', 'Boshlang''ich', ARRAY['Python', 'Backend', 'Django', 'Flask', 'API'], 180),

('Video Montaj - Adobe Premiere Pro', 'Professional video montaj qilishni o''rganing. Adobe Premiere Pro dasturida mukammal videolar yarating. Color correction, audio editing va export settings.', 'Madina Usmanova', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150', '20 soat', 65, 2890, 4.8, 299000, 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800', 'Video Montaj', 'O''rta', ARRAY['Premiere Pro', 'Video', 'Montaj', 'Adobe'], 180),

('Grafik Dizayn - Photoshop va Illustrator', 'Professional grafik dizayn yaratishni o''rganing. Logo, banner va reklama materiallari tayyorlash. Adobe Creative Suite bilan ishlash.', 'Bobur Rahimov', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150', '18 soat', 48, 1850, 4.7, 349000, 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800', 'Grafik Dizayn', 'Boshlang''ich', ARRAY['Photoshop', 'Illustrator', 'Dizayn', 'Logo'], 180),

('Digital Marketing va SMM', 'Ijtimoiy tarmoqlarda marketing, content yaratish va reklama strategiyalari o''rganing. Instagram, Facebook, Telegram marketing.', 'Zarina Abdullayeva', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', '16 soat', 55, 3200, 4.6, 249000, 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800', 'Marketing', 'Boshlang''ich', ARRAY['SMM', 'Digital Marketing', 'Instagram', 'Facebook'], 180),

('Web Dizayn - Figma va UI/UX', 'Zamonaviy web dizayn yaratish, Figma dasturida ishlash va foydalanuvchi tajribasi dizayni. Responsive design va prototyping.', 'Dilshod Tursunov', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150', '22 soat', 68, 1670, 4.8, 399000, 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800', 'Web Dizayn', 'O''rta', ARRAY['Figma', 'UI/UX', 'Web Dizayn', 'Prototyping'], 180),

('Ingliz Tili - Umumiy Kurs', 'Ingliz tilini noldan o''rganing. Grammatika, lug''at va gapirish ko''nikmalarini rivojlantiring. IELTS va TOEFL tayyorgarlik.', 'Nargiza Ismoilova', 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150', '25 soat', 75, 4500, 4.9, 199000, 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=800', 'Til O''rganish', 'Boshlang''ich', ARRAY['Ingliz Tili', 'Grammar', 'Speaking', 'Vocabulary'], 180),

('React.js - Frontend Development', 'Zamonaviy React.js bilan frontend development. Hooks, Context API, Redux va Next.js framework lari bilan ishlash.', 'Jasur Abdullayev', 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150', '30 soat', 85, 2100, 4.8, 499000, 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800', 'Dasturlash', 'O''rta', ARRAY['React', 'JavaScript', 'Frontend', 'Next.js'], 180),

('After Effects - Motion Graphics', 'Adobe After Effects bilan motion graphics va visual effects yaratish. Animation, compositing va professional video effects.', 'Aziza Karimova', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150', '24 soat', 72, 1450, 4.7, 449000, 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800', 'Video Montaj', 'Yuqori', ARRAY['After Effects', 'Motion Graphics', 'Animation', 'VFX'], 180)

ON CONFLICT DO NOTHING;

-- Darslar qo'shish (har bir kurs uchun)
-- Python kursi darslari
INSERT INTO lessons (course_id, title, description, duration, video_url, order_number, is_free) 
SELECT 
    c.id,
    lesson_data.title,
    lesson_data.description,
    lesson_data.duration,
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    lesson_data.order_number,
    lesson_data.is_free
FROM courses c,
(VALUES 
    ('Python ga kirish va muhitni sozlash', 'Python dasturlash tili bilan tanishish va ishchi muhitni sozlash', '15:30', 1, true),
    ('O''zgaruvchilar va ma''lumot turlari', 'Python da o''zgaruvchilar va asosiy ma''lumot turlari', '22:45', 2, true),
    ('Shartli operatorlar', 'If, elif, else operatorlari bilan ishlash', '28:15', 3, false),
    ('Sikllar (for va while)', 'For va while sikllari bilan ishlash', '35:20', 4, false),
    ('Funksiyalar', 'Funksiyalar yaratish va ulardan foydalanish', '18:45', 5, false),
    ('Ro''yxatlar (Lists)', 'Python da ro''yxatlar bilan ishlash', '25:30', 6, false),
    ('Lug''atlar (Dictionaries)', 'Dictionary ma''lumot tuzilmasi', '20:15', 7, false),
    ('Fayllar bilan ishlash', 'Fayllarni o''qish va yozish', '30:45', 8, false),
    ('OOP asoslari', 'Object Oriented Programming tamoyillari', '40:20', 9, false),
    ('Django framework ga kirish', 'Web development uchun Django', '45:30', 10, false)
) AS lesson_data(title, description, duration, order_number, is_free)
WHERE c.title = 'Python Dasturlash - Noldan Professionalgacha';

-- Video Montaj kursi darslari
INSERT INTO lessons (course_id, title, description, duration, video_url, order_number, is_free) 
SELECT 
    c.id,
    lesson_data.title,
    lesson_data.description,
    lesson_data.duration,
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    lesson_data.order_number,
    lesson_data.is_free
FROM courses c,
(VALUES 
    ('Adobe Premiere Pro ga kirish', 'Premiere Pro interfeysi va asosiy vositalar', '20:30', 1, true),
    ('Video import va timeline', 'Video fayllarni import qilish va timeline da ishlash', '25:15', 2, true),
    ('Video kesish va tahrirlash', 'Video kliplarni kesish va tahrirlash usullari', '30:45', 3, false),
    ('Audio bilan ishlash', 'Audio track lar va ovoz tahrirlash', '28:20', 4, false),
    ('Transitions va Effects', 'Video o''tish effektlari va vizual effektlar', '35:10', 5, false),
    ('Color Correction', 'Rang tuzatish va color grading', '32:45', 6, false),
    ('Titles va Graphics', 'Matn va grafik elementlar qo''shish', '27:30', 7, false),
    ('Export va Rendering', 'Tayyor videoni export qilish', '22:15', 8, false)
) AS lesson_data(title, description, duration, order_number, is_free)
WHERE c.title = 'Video Montaj - Adobe Premiere Pro';

-- Demo sotib olishlar
INSERT INTO user_course_purchases (user_id, course_id, payment_amount, expires_at)
SELECT 
    u.id,
    c.id,
    c.price,
    CURRENT_TIMESTAMP + INTERVAL '180 days'
FROM users u, courses c
WHERE u.telegram_username = 'alijon_dev' 
AND c.title IN ('Python Dasturlash - Noldan Professionalgacha', 'Video Montaj - Adobe Premiere Pro');

-- Demo progress
INSERT INTO user_course_progress (user_id, course_id, lesson_id, completed, completed_at)
SELECT 
    u.id,
    l.course_id,
    l.id,
    true,
    CURRENT_TIMESTAMP - INTERVAL '1 day'
FROM users u, lessons l, courses c
WHERE u.telegram_username = 'alijon_dev'
AND l.course_id = c.id
AND c.title = 'Python Dasturlash - Noldan Professionalgacha'
AND l.order_number <= 3;

-- Demo reviews
INSERT INTO course_reviews (user_id, course_id, rating, comment, is_approved)
SELECT 
    u.id,
    c.id,
    5,
    'Juda yaxshi kurs! O''qituvchi tushunarli tushuntiradi.',
    true
FROM users u, courses c
WHERE u.telegram_username = 'alijon_dev'
AND c.title = 'Python Dasturlash - Noldan Professionalgacha';

-- Kurs statistikasini yangilash
UPDATE courses SET 
    lessons_count = (
        SELECT COUNT(*) 
        FROM lessons 
        WHERE lessons.course_id = courses.id AND lessons.is_active = true
    ),
    rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM course_reviews 
        WHERE course_reviews.course_id = courses.id AND is_approved = true
    );