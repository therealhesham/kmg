# Docker Setup Guide

This guide explains how to run the KMG application using Docker and Docker Compose.

## Prerequisites

- Docker installed on your system ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed ([Install Docker Compose](https://docs.docker.com/compose/install/))

## Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory with your configuration:

```bash
# MySQL Configuration
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=kmg
MYSQL_USER=kmguser
MYSQL_PASSWORD=kmgpassword
MYSQL_PORT=3306

# Application Configuration
APP_PORT=3000

# Database URL (used by Prisma)
DATABASE_URL=mysql://kmguser:kmgpassword@db:3306/kmg

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-characters

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete your database!)
docker-compose down -v
```

### 3. Access the Application

- Application: http://localhost:3000
- MySQL: localhost:3306

## Docker Commands

### Building the Image

```bash
# Build the Docker image
docker build -t kmg-app .

# Build with a specific tag
docker build -t kmg-app:v1.0.0 .
```

### Running Without Docker Compose

If you prefer to run containers manually:

```bash
# Create a network
docker network create kmg-network

# Run MySQL
docker run -d \
  --name kmg-mysql \
  --network kmg-network \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=kmg \
  -e MYSQL_USER=kmguser \
  -e MYSQL_PASSWORD=kmgpassword \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0

# Wait for MySQL to be ready (about 30 seconds)
sleep 30

# Run the application
docker run -d \
  --name kmg-app \
  --network kmg-network \
  -e DATABASE_URL=mysql://kmguser:kmgpassword@kmg-mysql:3306/kmg \
  -e JWT_SECRET=your-super-secret-jwt-key \
  -e CLOUDINARY_CLOUD_NAME=your_cloud_name \
  -e CLOUDINARY_API_KEY=your_api_key \
  -e CLOUDINARY_API_SECRET=your_api_secret \
  -p 3000:3000 \
  kmg-app
```

## Database Management

### Running Migrations

Migrations are automatically run when the container starts. To run them manually:

```bash
docker-compose exec app npx prisma migrate deploy
```

### Seeding the Database

```bash
docker-compose exec app npx prisma db seed
```

### Accessing Prisma Studio

```bash
docker-compose exec app npx prisma studio
```

Then open http://localhost:5555 in your browser.

### Database Backup

```bash
# Backup
docker-compose exec db mysqldump -u root -prootpassword kmg > backup.sql

# Restore
docker-compose exec -T db mysql -u root -prootpassword kmg < backup.sql
```

## Development vs Production

### Development Mode

For development, you might want to use volumes to enable hot-reloading:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    command: npm run dev
```

### Production Mode

The default `docker-compose.yml` is configured for production with:
- Optimized multi-stage builds
- Non-root user execution
- Health checks
- Automatic restarts

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs app

# Check if MySQL is ready
docker-compose logs db
```

### Database connection issues

```bash
# Verify MySQL is running
docker-compose ps

# Test MySQL connection
docker-compose exec db mysql -u kmguser -pkmgpassword kmg
```

### Reset everything

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove the built image
docker rmi kmg-app

# Start fresh
docker-compose up -d --build
```

### Permission issues with uploads

```bash
# Fix permissions for the companies directory
docker-compose exec app chown -R nextjs:nodejs /app/public/companies
```

## Performance Optimization

### Multi-stage Build Benefits

The Dockerfile uses a multi-stage build to:
1. **deps stage**: Install dependencies
2. **builder stage**: Build the application
3. **runner stage**: Run the optimized production build

This results in a smaller final image (~200MB vs ~1GB).

### Caching

Docker caches layers. To maximize cache efficiency:
- Dependencies are installed before copying source code
- Only changed layers are rebuilt

### Resource Limits

Add resource limits to `docker-compose.yml`:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## Security Best Practices

1. **Change default passwords** in production
2. **Use secrets management** for sensitive data
3. **Run as non-root user** (already configured)
4. **Keep images updated**: `docker-compose pull && docker-compose up -d`
5. **Use specific image tags** instead of `latest`
6. **Scan for vulnerabilities**: `docker scan kmg-app`

## Deployment

### Docker Hub

```bash
# Tag the image
docker tag kmg-app:latest yourusername/kmg-app:latest

# Push to Docker Hub
docker push yourusername/kmg-app:latest
```

### Cloud Platforms

- **AWS ECS**: Use the Dockerfile with ECS task definitions
- **Google Cloud Run**: Deploy directly from the Dockerfile
- **Azure Container Instances**: Use the built image
- **DigitalOcean App Platform**: Connect your repository

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Prisma Docker Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker)

