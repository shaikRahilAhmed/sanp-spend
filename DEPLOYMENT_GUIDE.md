# 🚀 snapSpend Deployment Guide

## Overview
- **Frontend**: Vercel (React app)
- **Backend**: Render.com (Node.js API)
- **Database**: MongoDB Atlas (Cloud database)

---

## Part 1: Deploy MongoDB to Cloud (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. You'll see three deployment options:
   - **Serverless** (pay as you go)
   - **Dedicated** (paid)
   - **Shared** (FREE) ← Choose this one!
4. Click "Create" under the **Shared** (M0) option
5. Choose cloud provider: AWS (recommended)
6. Choose region: Closest to you (Mumbai/Singapore)
7. Cluster name: `snapspend-cluster` (or leave default)
8. Click "Create Deployment" or "Create Cluster" (takes 3-5 minutes)

### Step 2: Create Database User
1. Go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `snapspend-admin`
5. Password: Generate a secure password (SAVE THIS!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 3: Whitelist IP Address
1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 4: Get Connection String
1. Go to "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://snapspend-admin:<password>@snapspend-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name at the end: `/snapspend`
   ```
   mongodb+srv://snapspend-admin:YOUR_PASSWORD@snapspend-cluster.xxxxx.mongodb.net/snapspend?retryWrites=true&w=majority
   ```

**SAVE THIS CONNECTION STRING!** You'll need it for backend deployment.

---

## Part 2: Deploy Backend to Render.com

### Step 1: Prepare Backend for Deployment

1. Create `backend/.gitignore` if not exists:
```
node_modules/
.env
uploads/
*.log
```

2. Update `backend/package.json` - add start script:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  }
}
```

3. Create `backend/vercel.json` (if you want to use Vercel for backend):
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
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Step 2: Deploy to Render.com (Recommended for Backend)

1. Go to https://render.com/
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `snapspend-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main` or `master`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

6. **Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://snapspend-admin:YOUR_PASSWORD@snapspend-cluster.xxxxx.mongodb.net/snapspend?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
   GEMINI_API_KEY=AIzaSyD9WVGe4iyK5SgQbnVQHeBzPr08yKc7N4k
   NODE_ENV=production
   ```

7. Click "Create Web Service"
8. Wait 5-10 minutes for deployment
9. Your backend URL will be: `https://snapspend-backend.onrender.com`

**SAVE THIS BACKEND URL!**

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Update Frontend API URL

1. Create `frontend/.env.production`:
```env
VITE_API_URL=https://snapspend-backend.onrender.com/api
```

2. Update all API calls to use environment variable (already done in your code):
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Step 2: Create `vercel.json` in Root

Create `vercel.json` in project root:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 3: Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? snapspend
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**Option B: Using Vercel Dashboard**
1. Go to https://vercel.com/
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. **Environment Variables**:
   ```
   VITE_API_URL=https://snapspend-backend.onrender.com/api
   ```

7. Click "Deploy"
8. Wait 2-3 minutes
9. Your app will be live at: `https://snapspend.vercel.app`

---

## Part 4: Update CORS in Backend

After deployment, update `backend/server.js`:

```javascript
const cors = require("cors");

// Update CORS to allow your Vercel domain
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:5173',
    'https://snapspend.vercel.app',  // Add your Vercel URL
    'https://snapspend-*.vercel.app'  // Allow preview deployments
  ],
  credentials: true
}));
```

Redeploy backend after this change.

---

## Part 5: Test Your Deployment

### Test Backend
```bash
# Test health endpoint
curl https://snapspend-backend.onrender.com/api/hello

# Should return: {"message":"Hello Saurabh from server!"}
```

### Test Frontend
1. Visit: `https://snapspend.vercel.app`
2. Sign up with new account
3. Add an expense
4. Upload a CSV
5. Check chatbot
6. Verify all features work

---

## 🔒 Security Checklist

- [ ] Changed JWT_SECRET to a strong random string
- [ ] MongoDB user has strong password
- [ ] CORS configured with specific domains
- [ ] .env files not committed to Git
- [ ] API keys stored in environment variables
- [ ] MongoDB network access configured

---

## 📊 Free Tier Limits

### MongoDB Atlas (Free)
- 512 MB storage
- Shared RAM
- No credit card required
- Perfect for hackathons/demos

### Render.com (Free)
- 750 hours/month
- Sleeps after 15 min inactivity
- Wakes up on request (takes 30 seconds)
- 512 MB RAM

### Vercel (Free)
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Global CDN

---

## 🐛 Troubleshooting

### Backend not connecting to MongoDB
- Check connection string has correct password
- Verify IP whitelist includes 0.0.0.0/0
- Check MongoDB Atlas cluster is running

### Frontend can't reach Backend
- Verify VITE_API_URL is correct
- Check CORS settings in backend
- Open browser console for errors

### Render backend sleeping
- First request takes 30 seconds (cold start)
- Upgrade to paid plan ($7/month) for always-on

### Vercel build fails
- Check build logs in Vercel dashboard
- Verify all dependencies in package.json
- Check Node version compatibility

---

## 🎉 Your Live URLs

After deployment, you'll have:

- **Frontend**: https://snapspend.vercel.app
- **Backend**: https://snapspend-backend.onrender.com
- **Database**: MongoDB Atlas (cloud)

Share your frontend URL with anyone! 🚀

---

## 💰 Cost Breakdown

- MongoDB Atlas: **FREE** (512 MB)
- Render.com: **FREE** (with sleep)
- Vercel: **FREE** (100 GB bandwidth)

**Total Cost: ₹0/month** 🎉

Perfect for hackathons, demos, and portfolios!
