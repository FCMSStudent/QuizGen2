# QuizGen Deployment Guide

This document provides comprehensive instructions for deploying the QuizGen application to various platforms.

## Prerequisites

Before deploying, ensure you have:
- ✅ OpenAI API key
- ✅ Git repository set up
- ✅ Application built successfully (`npm run build`)

## Environment Variables

All deployment platforms require these environment variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=300
```

## Vercel Deployment (Recommended)

### Why Vercel?
- ✅ Seamless Next.js integration
- ✅ Automatic deployments from Git
- ✅ Built-in serverless functions
- ✅ Global CDN
- ✅ Free tier available

### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial QuizGen deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your QuizGen repository

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings
   - Navigate to "Environment Variables"
   - Add the required variables listed above

4. **Deploy**
   - Click "Deploy"
   - Wait for build completion
   - Access your live application URL

### Custom Domain (Optional)
- In Vercel dashboard, go to "Domains"
- Add your custom domain
- Follow DNS configuration instructions

## Railway Deployment

### Steps:

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Initialize**
   ```bash
   railway login
   railway init
   ```

3. **Add Environment Variables**
   ```bash
   railway variables set OPENAI_API_KEY=your_key_here
   railway variables set OPENAI_MODEL=gpt-3.5-turbo
   railway variables set OPENAI_MAX_TOKENS=300
   ```

4. **Deploy**
   ```bash
   railway up
   ```

## Render Deployment

### Steps:

1. **Connect Repository**
   - Go to [render.com](https://render.com)
   - Create new "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Node Version: 18+

3. **Environment Variables**
   - Add the required environment variables in Render dashboard

4. **Deploy**
   - Click "Create Web Service"

## DigitalOcean App Platform

### Steps:

1. **Create App**
   - Go to DigitalOcean App Platform
   - Create new app from GitHub

2. **Configure**
   - Select Node.js
   - Build Command: `npm run build`
   - Run Command: `npm start`

3. **Environment Variables**
   - Add required variables in app settings

4. **Deploy**
   - Review and create app

## Self-Hosted Deployment

### Using PM2 (Process Manager)

1. **Server Setup**
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd quizgen
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "quizgen" -- start
   pm2 save
   pm2 startup
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
   
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Using Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   
   CMD ["npm", "start"]
   ```

2. **Build and Run**
   ```bash
   docker build -t quizgen .
   docker run -p 3000:3000 \
     -e OPENAI_API_KEY=your_key_here \
     -e OPENAI_MODEL=gpt-3.5-turbo \
     -e OPENAI_MAX_TOKENS=300 \
     quizgen
   ```

## Environment-Specific Configurations

### Production Optimizations

1. **Next.js Configuration**
   ```javascript
   // next.config.js
   module.exports = {
     // ... existing config
     compress: true,
     poweredByHeader: false,
     generateEtags: false,
   }
   ```

2. **Performance Monitoring**
   - Add Vercel Analytics
   - Implement error tracking (Sentry)
   - Monitor API usage (OpenAI)

### Security Best Practices

1. **API Key Management**
   - Never commit API keys to version control
   - Use environment variables only
   - Rotate keys regularly
   - Monitor API usage for anomalies

2. **CORS Configuration**
   ```javascript
   // Add to API routes if needed
   const corsHeaders = {
     'Access-Control-Allow-Origin': 'your-domain.com',
     'Access-Control-Allow-Methods': 'POST, OPTIONS',
     'Access-Control-Allow-Headers': 'Content-Type',
   }
   ```

## Monitoring and Maintenance

### Health Checks

Create a health check endpoint:
```javascript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  })
}
```

### Backup Strategy

1. **User Data**: Export functionality already implemented
2. **Application Code**: Version control with Git
3. **Environment Variables**: Secure backup of configuration

### Updates and Maintenance

1. **Automated Deployments**
   - Set up GitHub Actions for CI/CD
   - Automatic deployments on main branch updates

2. **Dependency Updates**
   ```bash
   npm audit
   npm update
   ```

3. **Performance Monitoring**
   - Monitor build times
   - Track API response times
   - Monitor memory usage

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+ required)
   - Verify all dependencies installed
   - Check TypeScript compilation

2. **API Errors**
   - Verify OpenAI API key validity
   - Check API quota and billing
   - Monitor rate limits

3. **PDF Processing Issues**
   - Ensure sufficient memory allocation
   - Check file size limits
   - Verify OCR dependencies

### Debug Mode

Enable detailed logging:
```javascript
// Add to API routes
console.log('Debug info:', { timestamp: new Date(), data })
```

### Performance Issues

1. **Large PDF Files**
   - Implement file size limits
   - Add progress indicators
   - Consider chunked processing

2. **Slow OCR Processing**
   - Optimize image preprocessing
   - Consider using paid OCR services
   - Implement caching for processed files

## Support and Maintenance

### Monitoring Dashboard

Set up monitoring for:
- Application uptime
- API response times
- Error rates
- User activity

### Backup and Recovery

1. **Regular Backups**
   - Code repository (Git)
   - User data exports
   - Configuration backups

2. **Recovery Procedures**
   - Document rollback procedures
   - Test recovery processes
   - Maintain environment parity

---

**Need Help?**
- Check the main README.md for additional information
- Review error logs for specific issues
- Test deployment in staging environment first 