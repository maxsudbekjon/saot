# EduPlatform - Online Kurs Platformasi

Professional online ta'lim platformasi - PostgreSQL database va to'lov tizimi bilan.

## 📁 Loyiha Tuzilmasi

```
src/
├── components/           # React komponentlar
│   ├── Admin/           # Admin panel komponentlari
│   │   ├── AdminPanel.tsx
│   │   └── AddCourseModal.tsx
│   ├── Auth/            # Autentifikatsiya komponentlari
│   │   ├── LoginModal.tsx
│   │   └── RegisterModal.tsx
│   ├── Course/          # Kurs bilan bog'liq komponentlar
│   │   ├── CourseCard.tsx
│   │   ├── CourseDetail.tsx
│   │   └── CourseList.tsx
│   ├── Dashboard/       # Dashboard komponentlari
│   │   └── Dashboard.tsx
│   ├── Layout/          # Layout komponentlari
│   │   ├── Header.tsx
│   │   └── Hero.tsx
│   ├── Pages/           # Sahifa komponentlari
│   │   └── About.tsx
│   └── Profile/         # Profil komponentlari
│       └── ProfileModal.tsx
├── config/              # Konfiguratsiya fayllari
│   └── database.ts      # Database sozlamalari
├── contexts/            # React Context fayllari
│   └── AuthContext.tsx  # Autentifikatsiya context
├── data/               # Mock ma'lumotlar
│   ├── courses.ts
│   └── lessons.ts
├── services/           # Xizmat fayllari
│   ├── database.service.ts  # Database xizmatlari
│   └── payment.service.ts   # To'lov xizmatlari
├── types/              # TypeScript turlari
│   └── index.ts
├── App.tsx             # Asosiy App komponenti
└── main.tsx           # Entry point
```

## 🗄️ Database Sozlash (PostgreSQL)

### 1. PostgreSQL o'rnatish
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Windows
# PostgreSQL rasmiy saytidan yuklab oling
```

### 2. Database yaratish
```sql
-- PostgreSQL ga kirish
sudo -u postgres psql

-- Database yaratish
CREATE DATABASE eduplatform_dev;
CREATE USER eduplatform_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE eduplatform_dev TO eduplatform_user;
```

### 3. Environment Variables
`.env` fayl yarating:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eduplatform_dev
DB_USER=eduplatform_user
DB_PASSWORD=your_password
DB_SSL=false

# To'lov tizimi
CLICK_MERCHANT_ID=your_click_merchant_id
CLICK_SECRET_KEY=your_click_secret_key
PAYME_MERCHANT_ID=your_payme_merchant_id
PAYME_SECRET_KEY=your_payme_secret_key
UZCARD_TERMINAL_ID=your_uzcard_terminal_id
UZCARD_SECRET_KEY=your_uzcard_secret_key
```

## 💳 To'lov Tizimi Sozlash

### Click.uz integratsiyasi
1. `src/services/payment.service.ts` faylida `ClickPaymentProvider` klassini sozlang
2. Click merchant ID va secret key ni environment variables ga qo'shing
3. Webhook URL ni Click panelida sozlang

### Payme integratsiyasi
1. `PaymePaymentProvider` klassini sozlang
2. Payme merchant ID ni olish uchun Payme bilan bog'laning
3. Webhook endpoint yarating

### Uzcard integratsiyasi
1. `UzcardPaymentProvider` klassini sozlang
2. Uzcard terminal ID va secret key ni oling

## 🚀 Loyihani Ishga Tushirish

### 1. Dependencies o'rnatish
```bash
npm install
```

### 2. Database jadvallarini yaratish
```bash
# PostgreSQL ga kirish va jadvallarni yaratish
psql -U eduplatform_user -d eduplatform_dev -f src/config/database.sql
```

### 3. Development server ishga tushirish
```bash
npm run dev
```

## 🔐 Demo Hisoblar

- **Admin**: admin@eduplatform.uz / password
- **User**: user@eduplatform.uz / password

## 📋 Asosiy Funksiyalar

### ✅ Amalga oshirilgan
- [x] User authentication (login/register)
- [x] Role-based access (admin/user)
- [x] Course management
- [x] Payment system integration
- [x] Course access control
- [x] Admin panel
- [x] User profile management
- [x] Responsive design

### 🔄 Kurs Kirish Logikasi
1. **Bepul darslar**: Barcha foydalanuvchilar ko'ra oladi
2. **Premium darslar**: Faqat to'lov qilgan foydalanuvchilar
3. **Qulf ikonkasi**: To'lov qilmagan foydalanuvchilar uchun
4. **To'lov tugmasi**: Kursni sotib olish uchun

## 🛠️ Texnologiyalar

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Database**: PostgreSQL
- **Authentication**: JWT-style (localStorage)
- **Payment**: Click.uz, Payme, Uzcard
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📝 Database Schema

### Users jadvali
- id, name, email, password_hash
- avatar, role, phone, bio, location
- created_at, updated_at

### Courses jadvali
- id, title, description, instructor
- duration, lessons_count, students_count
- rating, price, thumbnail, category, level
- tags, video_url, is_active

### Lessons jadvali
- id, course_id, title, description
- duration, video_url, order_number
- is_free, created_at

### User_course_purchases jadvali
- id, user_id, course_id
- purchase_date, payment_amount
- payment_method, payment_status
- transaction_id

## 🔧 Sozlash va Customization

### Database o'zgartirish
`src/config/database.ts` faylida database sozlamalarini o'zgartiring.

### To'lov tizimi o'zgartirish
`src/services/payment.service.ts` faylida to'lov providerlarini sozlang.

### Yangi kurs qo'shish
Admin panel orqali yoki database ga to'g'ridan-to'g'ri qo'shing.

## 📞 Yordam

Savollar bo'lsa, loyiha README faylini o'qing yoki kod kommentlarini ko'ring.

## 📄 Litsenziya

Bu loyiha MIT litsenziyasi ostida tarqatiladi.