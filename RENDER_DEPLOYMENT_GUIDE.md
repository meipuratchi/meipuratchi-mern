# 🚀 Render.com Deployment Guide

## 🎯 Fix for SPA Routing Issue

**Problem:** When you reload a page like `/registration` or `/engineering`, you get a blank page or 404 error.

**Solution:** The backend server needs to serve `index.html` for all non-API routes so React Router can handle the routing.

**Status:** ✅ **FIXED** - The server.js has been updated with the correct SPA fallback route.

---

## 📋 Deployment Steps for Render.com

### **1. Build Your Frontend**

Before deploying, build your frontend:

```bash
cd frontend
npm run build
```

This creates a `dist` folder with your production-ready files.

---

### **2. Render.com Configuration**

#### **Option A: Deploy as Web Service (Recommended)**

**Step 1: Create New Web Service**
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select `meipuratchi-mern` repository

**Step 2: Configure Build Settings**

```yaml
Name: meipuratchi-backend
Environment: Node
Region: Choose closest to your users
Branch: master
Root Directory: backend
Build Command: cd ../frontend && npm install && npm run build && cd ../backend && npm install
Start Command: node server.js
```

**Step 3: Environment Variables**

Add these in Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
```

**Step 4: Deploy**
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Your app will be live at: `https://your-app-name.onrender.com`

---

#### **Option B: Deploy Backend & Frontend Separately**

**Backend (Web Service):**
```yaml
Name: meipuratchi-backend
Root Directory: backend
Build Command: npm install
Start Command: node server.js
Environment Variables:
  - NODE_ENV=production
  - MONGO_URI=your_mongodb_uri
  - JWT_SECRET=your_secret
```

**Frontend (Static Site):**
```yaml
Name: meipuratchi-frontend
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

Then update frontend API URL to point to backend.

---

### **3. Verify Deployment**

After deployment, test these URLs:

✅ **Homepage:** `https://your-app.onrender.com/`
✅ **Registration:** `https://your-app.onrender.com/registration`
✅ **Engineering:** `https://your-app.onrender.com/engineering`
✅ **API Health:** `https://your-app.onrender.com/api/health`

**Reload each page** - they should all work now!

---

## 🔧 Troubleshooting

### **Issue: Still Getting Blank Page on Reload**

**Check 1: Build Command**
Make sure your build command includes building the frontend:
```bash
cd ../frontend && npm install && npm run build && cd ../backend && npm install
```

**Check 2: Environment Variables**
Verify `NODE_ENV=production` is set in Render dashboard.

**Check 3: Logs**
Check Render logs for errors:
- Go to your service dashboard
- Click "Logs" tab
- Look for errors

**Check 4: File Structure**
Ensure your repository structure is:
```
meipuratchi-mern/
├── backend/
│   ├── server.js
│   └── ...
└── frontend/
    ├── dist/          (created during build)
    └── ...
```

---

### **Issue: API Calls Failing**

**Check 1: CORS**
Ensure backend allows your frontend domain:

```javascript
// In server.js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.onrender.com'
  ],
  credentials: true
}));
```

**Check 2: API URL**
Update frontend API URL if deploying separately:

```javascript
// frontend/src/config.js or .env
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend.onrender.com'
  : 'http://localhost:5000';
```

---

### **Issue: MongoDB Connection Failed**

**Check 1: IP Whitelist**
In MongoDB Atlas:
1. Go to Network Access
2. Add IP: `0.0.0.0/0` (allow all)
3. Or add Render's IP addresses

**Check 2: Connection String**
Verify your `MONGO_URI` in Render:
```
mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

**Check 3: Database User**
Ensure the database user has read/write permissions.

---

### **Issue: Build Failing**

**Check 1: Node Version**
Specify Node version in `package.json`:

```json
{
  "engines": {
    "node": "18.x"
  }
}
```

**Check 2: Dependencies**
Ensure all dependencies are in `package.json`, not just `devDependencies`.

**Check 3: Build Logs**
Check Render build logs for specific errors.

---

## 🎯 Render.com Specific Configuration

### **render.yaml (Optional)**

Create `render.yaml` in root for infrastructure as code:

```yaml
services:
  - type: web
    name: meipuratchi
    env: node
    region: oregon
    plan: free
    buildCommand: cd frontend && npm install && npm run build && cd ../backend && npm install
    startCommand: cd backend && node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
```

---

## 📊 Performance Optimization

### **1. Enable Compression**

Add to `server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

Install:
```bash
npm install compression
```

### **2. Cache Static Assets**

Add to `server.js`:
```javascript
app.use(express.static(frontendDist, {
  maxAge: '1y',
  etag: false
}));
```

### **3. Enable Gzip**

Render automatically enables gzip compression.

---

## 🔒 Security Best Practices

### **1. Environment Variables**
- Never commit `.env` files
- Use Render's environment variables
- Rotate secrets regularly

### **2. CORS Configuration**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-app.onrender.com',
  credentials: true
}));
```

### **3. Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📱 Mobile Testing on Render

Once deployed, test on your Android phone:

1. **Open Chrome on Android**
2. **Navigate to:** `https://your-app.onrender.com`
3. **Test all routes:**
   - Homepage: `/`
   - Registration: `/registration`
   - Engineering: `/engineering`
   - Etc.
4. **Reload each page** - should work perfectly!

---

## 🚀 Deployment Checklist

Before deploying:

- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend runs locally with production build
- [ ] Environment variables documented
- [ ] MongoDB Atlas IP whitelist configured
- [ ] CORS configured for production domain
- [ ] All routes tested locally
- [ ] Mobile responsive tested
- [ ] API endpoints tested

After deploying:

- [ ] Homepage loads
- [ ] All routes work on reload
- [ ] API calls succeed
- [ ] MongoDB connected
- [ ] Mobile version works
- [ ] Performance is good
- [ ] No console errors

---

## 🎉 Success!

Your app should now work perfectly on Render.com with:
- ✅ All routes working on reload
- ✅ SPA routing handled correctly
- ✅ API calls working
- ✅ Mobile optimized
- ✅ Fast performance

---

## 📞 Quick Reference

**Build Command:**
```bash
cd ../frontend && npm install && npm run build && cd ../backend && npm install
```

**Start Command:**
```bash
node server.js
```

**Environment Variables:**
```
NODE_ENV=production
PORT=10000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

**Test URLs:**
- Homepage: `https://your-app.onrender.com/`
- Any route: `https://your-app.onrender.com/any-route`
- API: `https://your-app.onrender.com/api/health`

---

**Your app is now production-ready on Render.com! 🚀✨**
