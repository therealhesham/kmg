# -----------------------
# Base image with common dependencies
# -----------------------
    FROM node:20-alpine AS base

    # Install essential dependencies
    RUN apk add --no-cache libc6-compat openssl
    
    WORKDIR /app
    
    # -----------------------
    # Stage 1: Dependencies
    # -----------------------
    FROM base AS deps
    
    # Copy package manifests
    COPY package.json package-lock.json ./
    
    # Install all dependencies
    RUN npm ci
    
    # -----------------------
    # Stage 2: Builder
    # -----------------------
    FROM base AS builder
    
    # Copy dependencies from deps stage
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    # Generate Prisma client
    RUN npx prisma generate
    
    # Disable Next.js telemetry and build
    ENV NEXT_TELEMETRY_DISABLED=1
    RUN npm run build
    
    # -----------------------
    # Stage 3: Runner
    # -----------------------
    FROM base AS runner
    
    # Create non-root user
    RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
    
    USER nextjs
    WORKDIR /app
    
    # Copy only necessary files from builder
    COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
    COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
    COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
    COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
    COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
    COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
    
    # Create upload directory (as root before switching to nextjs user)
    USER root
    RUN mkdir -p public/companies && chown -R nextjs:nodejs public/companies
    USER nextjs
    
    # Environment variables
    ENV NODE_ENV=production
    ENV NEXT_TELEMETRY_DISABLED=1
    ENV PORT=3022
    ENV HOSTNAME="0.0.0.0"
    
    EXPOSE 3022
    
    # Start application
    CMD ["npx", "next", "start"]
    