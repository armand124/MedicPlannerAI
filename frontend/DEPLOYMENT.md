# MedicPlannerAI - Complete Deployment Guide

This guide covers deploying both the frontend and backend of the MedicPlannerAI application.

## 🏗️ Architecture Overview

```
Frontend (React + Vite)     Backend (Node.js + Express)     Database (MongoDB)
┌─────────────────────┐    ┌──────────────────────────┐    ┌─────────────────┐
│  Port: 5173 (dev)  │◄──►│  Port: 3000 (dev)       │◄──►│  Local/Atlas    │
│  Port: 80/443 (prod)│    │  Port: 3000 (prod)      │    │  Port: 27017    │
└─────────────────────┘    └──────────────────────────┘    └─────────────────┘
```

## 🚀 Quick Start (Development)

### 1. Backend Setup
```bash
cd server
npm install
cp env.example .env
# Edit .env with your MongoDB URI
npm run seed  # Optional: Add sample data
npm run dev
```

### 2. Frontend Setup
```bash
cd website
npm install
# Create .env file with VITE_API_URL=http://localhost:3000/api
npm run dev
```

### 3. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health

## 🌐 Production Deployment

### Option 1: Traditional VPS/Server

#### Backend Deployment
```bash
# 1. Install Node.js and MongoDB
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y mongodb

# 2. Clone and setup
git clone <your-repo>
cd server
npm install --production
cp env.example .env
# Edit .env for production

# 3. Install PM2
npm install -g pm2

# 4. Start the application
pm2 start src/server.js --name "medicplannerai-api"
pm2 save
pm2 startup
```

#### Frontend Deployment
```bash
# 1. Build the frontend
cd website
npm install
npm run build

# 2. Serve with Nginx
sudo apt-get install nginx
sudo cp -r dist/* /var/www/html/

# 3. Configure Nginx
sudo nano /etc/nginx/sites-available/medicplannerai
```

Nginx Configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Docker Deployment

#### Backend Dockerfile
```dockerfile
# server/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
# website/Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  mongodb:
    image: mongo:7
    container_name: medicplannerai-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./server
    container_name: medicplannerai-backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password@mongodb:27017/medicplannerai?authSource=admin
      JWT_SECRET: your-production-secret
      FRONTEND_URL: http://localhost:80
    depends_on:
      - mongodb

  frontend:
    build: ./website
    container_name: medicplannerai-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

Deploy with Docker:
```bash
docker-compose up -d
```

### Option 3: Cloud Deployment

#### Heroku
```bash
# Backend
cd server
heroku create medicplannerai-api
heroku addons:create mongolab:sandbox
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set FRONTEND_URL=https://your-frontend.herokuapp.com
git push heroku main

# Frontend
cd website
heroku create medicplannerai-frontend
heroku config:set VITE_API_URL=https://medicplannerai-api.herokuapp.com/api
git push heroku main
```

#### Vercel (Frontend) + Railway (Backend)
```bash
# Frontend on Vercel
cd website
vercel --prod
# Set VITE_API_URL=https://your-railway-app.railway.app/api

# Backend on Railway
cd server
railway login
railway init
railway up
# Set MONGODB_URI and other environment variables
```

## 🔧 Environment Configuration

### Backend (.env)
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medicplannerai
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_NODE_ENV=production
```

## 🛡️ Security Checklist

### Backend Security
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Regular security updates

### Frontend Security
- [ ] Use HTTPS in production
- [ ] Validate all inputs
- [ ] Implement proper error handling
- [ ] Use secure token storage
- [ ] Regular dependency updates

## 📊 Monitoring & Maintenance

### Health Checks
- Backend: `GET /api/health`
- Frontend: Check if app loads correctly

### Logging
```bash
# PM2 logs
pm2 logs medicplannerai-api

# Docker logs
docker logs medicplannerai-backend
docker logs medicplannerai-frontend
```

### Database Backup
```bash
# MongoDB backup
mongodump --uri="mongodb://username:password@host:port/database" --out=backup/

# Restore
mongorestore --uri="mongodb://username:password@host:port/database" backup/
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check FRONTEND_URL in backend .env
   - Verify CORS configuration

2. **Database Connection**
   - Check MONGODB_URI format
   - Verify MongoDB is running
   - Check network connectivity

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate token format

4. **Build Errors**
   - Check Node.js version compatibility
   - Clear node_modules and reinstall
   - Verify environment variables

### Debug Commands
```bash
# Check backend health
curl http://localhost:3000/api/health

# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Check MongoDB connection
mongosh "mongodb://localhost:27017/medicplannerai"
```

## 📈 Performance Optimization

### Backend
- Enable gzip compression
- Use Redis for session storage
- Implement database indexing
- Add response caching

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize bundle size

## 🔄 CI/CD Pipeline

### GitHub Actions Example
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
      - name: Deploy to production
        run: |
          # Your deployment commands
```

---

**Ready to deploy!** 🚀 Choose your preferred deployment method and follow the steps above.
