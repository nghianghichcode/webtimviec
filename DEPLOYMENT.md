# 🚀 Deployment Guide - StudentJobs

Hướng dẫn chi tiết để deploy StudentJobs lên các nền tảng cloud khác nhau.

## 📋 Prerequisites

- Node.js >= 14.0.0
- Git
- Account trên platform muốn deploy (Heroku, Vercel, Railway, etc.)

## 🌐 Platform Options

### 1. 🟣 Heroku (Recommended)

#### Setup Heroku CLI
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login
```

#### Deploy to Heroku
```bash
# 1. Create Heroku app
heroku create your-app-name

# 2. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key-here
heroku config:set PORT=3000

# 3. Add buildpack for Node.js
heroku buildpacks:set heroku/nodejs

# 4. Deploy
git push heroku main

# 5. Initialize database
heroku run npm run init-db

# 6. Open app
heroku open
```

#### Heroku Configuration
```bash
# Scale dynos
heroku ps:scale web=1

# View logs
heroku logs --tail

# Run commands
heroku run bash
```

### 2. ⚡ Vercel (Serverless)

#### Setup Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

#### Deploy to Vercel
```bash
# 1. Deploy
vercel

# 2. Set environment variables in Vercel dashboard
# NODE_ENV=production
# JWT_SECRET=your-super-secret-jwt-key-here

# 3. Initialize database (run once)
vercel env add DB_FILENAME
```

#### Vercel Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 3. 🐳 Docker

#### Build and Run
```bash
# 1. Build Docker image
docker build -t studentjobs-web .

# 2. Run container
docker run -p 3000:3000 studentjobs-web

# 3. With environment variables
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret-key \
  studentjobs-web
```

#### Docker Compose
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. 🚂 Railway

#### Deploy to Railway
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy
railway up

# 4. Set environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-secret-key
```

### 5. ☁️ DigitalOcean App Platform

#### Deploy to DigitalOcean
```bash
# 1. Create app.yaml
# 2. Connect GitHub repository
# 3. Configure environment variables
# 4. Deploy
```

#### app.yaml Configuration
```yaml
name: studentjobs-web
services:
- name: web
  source_dir: /
  github:
    repo: yourusername/studentjobs-web
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: JWT_SECRET
    value: your-secret-key
```

## 🔧 Environment Variables

### Required Variables
```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
```

### Optional Variables
```env
DB_FILENAME=studentjobs.db
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=5242880
```

## 📊 Database Setup

### SQLite (Default)
```bash
# Initialize database
npm run init-db

# Database file will be created: studentjobs.db
```

### PostgreSQL (Production)
```env
# Environment variables for PostgreSQL
DATABASE_URL=postgresql://username:password@host:port/database
DB_HOST=your-postgres-host
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=studentjobs_db
DB_PORT=5432
```

## 🔒 Security Configuration

### SSL/HTTPS
```bash
# Heroku automatically provides SSL
# For other platforms, configure SSL certificates

# Let's Encrypt (free SSL)
certbot --nginx -d yourdomain.com
```

### Environment Security
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Set secure environment variables
export JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
```

## 📈 Performance Optimization

### Production Optimizations
```javascript
// Enable compression
app.use(compression());

// Set cache headers
app.use(express.static('public', {
  maxAge: '1d'
}));

// Database connection pooling
const pool = mysql.createPool({
  connectionLimit: 10,
  queueLimit: 0
});
```

### CDN Configuration
```bash
# CloudFlare
# 1. Add domain to CloudFlare
# 2. Configure DNS
# 3. Enable caching rules
# 4. Configure SSL/TLS
```

## 🔍 Monitoring & Logging

### Health Checks
```bash
# Check application health
curl https://your-app.herokuapp.com/api/health

# Expected response
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### Logging
```bash
# Heroku logs
heroku logs --tail

# Docker logs
docker logs container-name

# Vercel logs
vercel logs
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```bash
# Check database file exists
ls -la studentjobs.db

# Initialize database
npm run init-db
```

#### 2. Port Binding Error
```bash
# Check if port is available
netstat -tulpn | grep :3000

# Use different port
PORT=3001 npm start
```

#### 3. Environment Variables
```bash
# Check environment variables
echo $NODE_ENV
echo $JWT_SECRET

# Set environment variables
export NODE_ENV=production
export JWT_SECRET=your-secret-key
```

#### 4. Build Failures
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm start

# Specific debug namespace
DEBUG=app:* npm start
```

## 📱 Mobile Deployment

### PWA Configuration
```javascript
// service-worker.js
const CACHE_NAME = 'studentjobs-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/script.js',
  '/manifest.json'
];
```

### Mobile App (Future)
```bash
# React Native setup
npx react-native init StudentJobsApp

# Flutter setup
flutter create studentjobs_app
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
```

### Automated Deployment
```bash
# Setup webhook
# 1. Configure GitHub webhook
# 2. Set up auto-deploy on push
# 3. Configure staging/production environments
```

## 📊 Analytics & Monitoring

### Application Monitoring
```bash
# New Relic
npm install newrelic

# Sentry
npm install @sentry/node

# LogRocket
npm install logrocket
```

### Performance Monitoring
```bash
# PM2 for process management
npm install -g pm2
pm2 start server.js --name studentjobs
pm2 monit
```

## 🎯 Production Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database initialized
- [ ] SSL certificate configured
- [ ] Domain configured
- [ ] CDN configured
- [ ] Monitoring setup
- [ ] Backup strategy
- [ ] Security audit

### Post-deployment
- [ ] Health check passes
- [ ] Database accessible
- [ ] API endpoints working
- [ ] Frontend loading
- [ ] Mobile responsive
- [ ] Performance optimized
- [ ] Security headers
- [ ] Error handling

## 📞 Support

### Deployment Support
- **Documentation**: [Wiki](https://github.com/yourusername/studentjobs-web/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/studentjobs-web/issues)
- **Email**: dev@studentjobs.vn

### Platform Support
- **Heroku**: [Heroku Support](https://help.heroku.com/)
- **Vercel**: [Vercel Support](https://vercel.com/support)
- **Railway**: [Railway Support](https://railway.app/support)

---

**Happy Deploying!** 🚀

*For more information, visit [https://studentjobs.vn](https://studentjobs.vn)*
