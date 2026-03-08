# Render Deployment Guide - SnapSpend

## Quick Deploy (5 Minutes)

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push
```

### Step 2: Deploy Backend on Render

1. Go to https://render.com and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `snapspend-backend`
   - **Region**: Singapore (or closest to you)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. **Add Environment Variables** (click "Advanced" or go to Environment tab):
   ```
   MONGODB_URI = mongodb+srv://srahil:lenovov098@cluster0.8pqzcvl.mongodb.net/expense-tracker?retryWrites=true&w=majority
   GEMINI_API_KEY = AIzaSyD9WVGe4iyK5SgQbnVQHeBzPr08yKc7N4k
   JWT_SECRET = snapspend-super-secret-jwt-key-production-2026
   NODE_ENV = production
   PORT = 5000
   FRONTEND_URL = https://snapspend.onrender.com
   ```

6. Click **"Create Web Service"**
7. Wait 3-5 minutes for deployment
8. **Copy your backend URL** (e.g., `https://snapspend-backend.onrender.com`)
9. Test it: Open `https://snapspend-backend.onrender.com/api/hello` - should see JSON response

### Step 3: Deploy Frontend on Render

1. Click **"New +"** → **"Static Site"**
2. Connect same GitHub repository
3. Configure:
   - **Name**: `snapspend`
   - **Region**: Singapore
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Add Environment Variable**:
   ```
   VITE_API_URL = https://snapspend-backend.onrender.com
   ```
   (Use YOUR backend URL from Step 2)

5. Click **"Create Static Site"**
6. Wait 3-5 minutes for deployment
7. **Copy your frontend URL** (e.g., `https://snapspend.onrender.com`)

### Step 4: Update Backend FRONTEND_URL

1. Go back to your **backend service** on Render
2. Click **"Environment"** in left sidebar
3. Update `FRONTEND_URL` to your actual frontend URL from Step 3
4. Click **"Save Changes"** (it will auto-redeploy)

### Step 5: Test Your App

1. Open your frontend URL: `https://snapspend.onrender.com`
2. Try signing up/logging in
3. Upload a CSV file
4. Check if everything works!

## Troubleshooting

### Backend won't start?
- Check logs in Render dashboard
- Verify MongoDB URI is correct (must include `/expense-tracker` database name)
- Make sure all environment variables are set

### Frontend can't connect to backend?
- Check `VITE_API_URL` is set correctly
- Make sure backend URL uses `https://` not `http://`
- Check backend CORS settings allow your frontend URL

### MongoDB connection fails?
Your MongoDB URI should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
```
NOT:
```
mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
```

### Free tier limitations:
- Backend sleeps after 15 min of inactivity (first request takes 30-60 seconds)
- 750 hours/month free
- Services auto-sleep when not in use

## Environment Variables Reference

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://srahil:lenovov098@cluster0.8pqzcvl.mongodb.net/expense-tracker?retryWrites=true&w=majority
GEMINI_API_KEY=AIzaSyD9WVGe4iyK5SgQbnVQHeBzPr08yKc7N4k
JWT_SECRET=snapspend-super-secret-jwt-key-production-2026
NODE_ENV=production
FRONTEND_URL=https://snapspend.onrender.com
```

### Frontend
```env
VITE_API_URL=https://snapspend-backend.onrender.com
```

## Need Help?

1. Check Render logs: Dashboard → Your Service → Logs
2. Check browser console for frontend errors (F12)
3. Test backend directly: `https://your-backend.onrender.com/api/hello`
