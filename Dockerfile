# استخدام صورة Node.js الرسمية كصورة أساسية
FROM node:20-alpine AS base

# تثبيت التبعيات فقط عند الحاجة
FROM base AS deps
# تثبيت libc6-compat و openssl لبعض الحزم التي تحتاجها
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# نسخ ملفات التبعيات
COPY package.json package-lock.json* ./
# تثبيت جميع التبعيات (للبناء)
RUN npm ci

# تثبيت تبعيات الإنتاج فقط
FROM base AS deps-prod
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# بناء التطبيق
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# توليد Prisma Client
RUN npx prisma generate

# تعطيل telemetry في Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# بناء التطبيق للإنتاج
RUN npm run build

# صورة الإنتاج - تحتوي فقط على الملفات المطلوبة للتشغيل
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# تثبيت openssl لـ Prisma
RUN apk add --no-cache openssl

# إنشاء مستخدم غير root للأمان
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# نسخ التبعيات للإنتاج فقط
COPY --from=deps-prod --chown=nextjs:nodejs /app/node_modules ./node_modules

# نسخ Prisma Client المولد من مرحلة البناء
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# نسخ الملفات المطلوبة
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# نسخ Prisma schema
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

# فتح المنفذ
EXPOSE 3020

ENV PORT 3020
ENV HOSTNAME "0.0.0.0"

# تشغيل التطبيق
CMD ["npx", "next", "start"]

