# 🏢 KMG Investment - Portfolio Website

موقع إلكتروني فاخر لشركة استثمار تضم عدة شركات تابعة، مع لوحة تحكم كاملة لإدارة المحتوى.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-7-green)
![MySQL](https://img.shields.io/badge/MySQL-8-orange)

## ✨ المميزات

- 🎨 **تصميم فاخر وأنيق** - واجهة مستخدم حديثة مع تأثيرات Glass Morphism
- 🏢 **عرض الشركات التابعة** - عرض لوجوهات الشركات مع تأثير "Coming Soon"
- 📧 **نظام الاشتراك** - جمع البريد الإلكتروني للمهتمين
- 🎛️ **لوحة تحكم كاملة** - إدارة الشركات والإعدادات بسهولة
- 🗄️ **قاعدة بيانات MySQL** - تخزين آمن ومنظم للبيانات
- 🔄 **API RESTful** - واجهات برمجية جاهزة للاستخدام
- 📱 **Responsive Design** - يعمل على جميع الأجهزة

## 🚀 البداية السريعة

### المتطلبات
- Node.js 18+
- MySQL 8.0+
- npm أو yarn

### التثبيت

```bash
# 1. تثبيت المكتبات
npm install

# 2. إنشاء قاعدة البيانات
# افتح MySQL وشغل:
CREATE DATABASE kmg_db;

# 3. إنشاء ملف .env
# انسخ المحتوى التالي وعدل البيانات:
DATABASE_URL="mysql://username:password@localhost:3306/kmg_db"

# 4. إعداد Prisma
npm run db:generate
npm run db:push

# 5. إضافة بيانات تجريبية (اختياري)
npm run db:seed

# 6. تشغيل المشروع
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

## 📚 التوثيق

- **[QUICKSTART.md](./QUICKSTART.md)** - دليل البداية السريعة (5 دقائق)
- **[SETUP.md](./SETUP.md)** - دليل التثبيت الكامل والتفصيلي
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - شرح هيكل المشروع بالتفصيل

## 🎯 الصفحات المتاحة

| الصفحة | الرابط | الوصف |
|--------|--------|-------|
| الرئيسية | `/` | الصفحة الرئيسية للموقع |
| لوحة التحكم | `/admin` | إدارة الشركات والإعدادات |

## 🛠️ التقنيات المستخدمة

### Frontend
- **Next.js 16** - React Framework
- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS 4** - Styling

### Backend
- **Next.js API Routes** - Backend API
- **Prisma** - ORM
- **MySQL** - Database

### الأدوات
- **ESLint** - Code Linting
- **PostCSS** - CSS Processing

## 📁 هيكل المشروع

```
kmg/
├── app/
│   ├── admin/              # لوحة التحكم
│   ├── api/                # API Routes
│   │   ├── companies/      # إدارة الشركات
│   │   ├── settings/       # إدارة الإعدادات
│   │   └── subscribers/    # إدارة المشتركين
│   └── page.tsx            # الصفحة الرئيسية
├── lib/
│   └── prisma.ts           # Prisma Client
├── prisma/
│   ├── schema.prisma       # Database Schema
│   └── seed.ts             # Seed Data
└── public/
    └── companies/          # لوجوهات الشركات
```

## 🎨 لوحة التحكم

لوحة تحكم شاملة تتيح لك:

### إدارة الشركات
- ✅ إضافة شركات جديدة
- ✅ تعديل معلومات الشركات
- ✅ حذف الشركات
- ✅ ترتيب عرض الشركات
- ✅ تفعيل/إيقاف "Coming Soon"

### إدارة الإعدادات
- ✅ تعديل عنوان الموقع
- ✅ تخصيص النصوص
- ✅ تعديل رسائل البريد الإلكتروني
- ✅ تخصيص Footer

### عرض المشتركين
- ✅ قائمة بجميع المشتركين
- ✅ تاريخ الاشتراك
- ✅ تصدير البيانات

## 📊 API Routes

### Companies
```
GET    /api/companies       # جلب جميع الشركات
POST   /api/companies       # إضافة شركة جديدة
GET    /api/companies/[id]  # جلب شركة محددة
PUT    /api/companies/[id]  # تحديث شركة
DELETE /api/companies/[id]  # حذف شركة
```

### Settings
```
GET /api/settings           # جلب الإعدادات
PUT /api/settings           # تحديث الإعدادات
```

### Subscribers
```
GET  /api/subscribers       # جلب جميع المشتركين
POST /api/subscribers       # إضافة مشترك جديد
```

## 🎨 التخصيص

### إضافة لوجو شركة
1. ضع الصورة في `public/companies/`
2. افتح لوحة التحكم
3. أضف الشركة مع المسار: `/companies/اسم-الملف.png`

### تعديل الألوان
عدل الألوان في `app/globals.css` و `tailwind.config.js`

### تعديل النصوص
استخدم لوحة التحكم في تبويب "Settings"

## 🔒 الأمان

⚠️ **مهم قبل النشر:**
- [ ] غير `NEXTAUTH_SECRET` في `.env`
- [ ] استخدم HTTPS
- [ ] أضف مصادقة للوحة التحكم
- [ ] فعّل CORS بشكل صحيح
- [ ] استخدم Environment Variables للبيانات الحساسة

## 🛠️ أوامر npm

```bash
npm run dev          # تشغيل في وضع التطوير
npm run build        # بناء للإنتاج
npm run start        # تشغيل في وضع الإنتاج
npm run lint         # فحص الأكواد

npm run db:generate  # توليد Prisma Client
npm run db:push      # دفع Schema إلى قاعدة البيانات
npm run db:studio    # فتح Prisma Studio
npm run db:seed      # إضافة بيانات تجريبية
```

## 🐛 حل المشاكل

### المشروع لا يعمل؟
```bash
# تأكد من تشغيل MySQL
# تحقق من ملف .env
npm run db:generate
npm run db:push
```

### الصور لا تظهر؟
- تأكد من وضع الصور في `public/companies/`
- تحقق من المسار في لوحة التحكم
- استخدم صيغة PNG أو JPG

### خطأ في قاعدة البيانات؟
```bash
# تأكد من إنشاء قاعدة البيانات
CREATE DATABASE kmg_db;

# أعد توليد Prisma Client
npm run db:generate
npm run db:push
```

## 📝 المساهمة

المساهمات مرحب بها! يرجى:
1. Fork المشروع
2. إنشاء Branch جديد
3. Commit التغييرات
4. Push إلى Branch
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع خاص بشركة KMG Investment.

## 📞 الدعم

للمساعدة أو الاستفسارات، يرجى التواصل مع فريق التطوير.

---

Made with ❤️ by KMG Development Team
