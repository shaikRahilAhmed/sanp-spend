# 🚀 snapSpend - Complete Deployment Guide

## Quick Overview
- **Frontend**: Vercel (Free)
- **Backend**: Render.com (Free)
- **Database**: MongoDB Atlas (Free)
- **Total Cost**: ₹0/month

---

## 📋 Pre-Deployment Checklist

Before starting, make sure you have:
- [ ] GitHub account
- [ ] All code committed to GitHub repository
- [ ] Your Gemini API key ready
- [ ] 30-45 minutes of time

---

## STEP 1: Deploy Database (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Account
1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/GitHub (fastest)
3. Choose "Free" tier when prompted

### 1.2 Create Your Cluster
1. Click "Build a Database"
2. Choose "M0 FREE" tier
3. Select:
   - Provider: AWS
   - Region: Mumbai (ap-south-1) or closest to you
4. Cluster Name: `snapspend-cluster`
5. Click "Create Cluster" (takes 3-5 minutes)

### 1.3 Create Database User
1. You'll see a security quickstart
2. Choose "Username and Password"
3. Username: `snapspend-admin`
4. Password: Click "Autogenerate Secure Password"
5. **COPY AND SAVE THIS PASSWORD!** (You'll need it)
6. Click "Create User"

### 1.4 Setup Network Access
1. In the security quickstart, you'll see "Where would you like to connect from?"
2. Choose "My Local Environment"
3. Click "Add My Current IP Address"
4. Then click "Add Entry" and add: `0.0.0.0/0` (allows access from anywhere)
5. Click "Finish and Close"

### 1.5 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy the connection string (looks like):
   ```
   mongodb+srv://snapspend-admin:<password>@snapspend-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with the password you saved
6. Add `/snapspend` before the `?` to specify database name:
   ```
   mongodb+srv://snapspend-admin:YOUR_PASSWORD@snapspend-cluster.xxxxx.mongodb.net/snapspend?retryWrites=true&w=majority
   ```

**SAVE THIS COMPLETE CONNECTION STRING!**

---

## STEP 2: Deploy Backend (Render.com)

### 2.1 Create Render Account
1. Visit: https://render.com/
2. Click "Get Started"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### 2.2 Create New Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Connect your GitHub repository
4. If you don't see your repo, click "Configure account" and grant access

### 2.3 Configure Web Service
Fill in these details:

**Basic Settings:**
- Name: `snapspend-backend`
- Region: Singapore (or closest to you)
- Branch: `main` (or `master`)
- Root Directory: `backend`
- Runtime: `Node`

**Build & Deploy:**
- Build Command: `npm install`
- Start Command: `npm start`

**Instance Type:**
- Select "Free" (first option)

### 2.4 Add Environment Variables
Click "Advanced" → Scroll to "Environment Variables" → Click "Add Environment Variable"

Add these 5 variables:

1. **PORT**
   - Value: `5000`

2. **MONGODB_URI**
   - Value: `mongodb+srv://snapspend-admin:YOUR_PASSWORD@snapspend-cluster.xxxxx.mongodb.net/snapspend?retryWrites=true&w=majority`
   - (Use the connection string from Step 1.5)

3. **JWT_SECRET**
   - Value: `snapspend-super-secret-jwt-key-production-2026-secure`
   - (Or generate your own random string)

4. **GEMINI_API_KEY**
   - Value: `AIzaSyD9WVGe4iyK5SgQbnVQHeBzPr08yKc7N4k`
   - (Or use your own Gemini API key)

5. **NODE_ENV**
   - Value: `production`

### 2.5 Deploy Backend
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. You'll see logs in real-time
4. When you see "Server running on port 5000", it's ready!
5. Your backend URL will be: `https://snapspend-backend.onrender.com`

### 2.6 Test Backend
1. Copy your backend URL
2. Visit: `https://snapspend-backend.onrender.com/api/hello`
3. You should see: `{"message":"Hello Saurabh from server!"}`
4. If you see this, backend is working! ✅

**SAVE YOUR BACKEND URL!**

---

## STEP 3: Deploy Frontend (Vercel)

### 3.1 Create Vercel Account
1. Visit: https://vercel.com/
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. If you don't see it, click "Adjust GitHub App Permissions"

### 3.3 Configure Project
Vercel will auto-detect Vite. Verify these settings:

**Project Settings:**
- Framework Preset: `Vite`
- Root Directory: `./` (leave as is)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 3.4 Add Environment Variable
Click "Environment Variables" section:

Add this variable:
- **Key**: `VITE_API_URL`
- **Value**: `https://snapspend-backend.onrender.com/api`
  - (Use your backend URL from Step 2.5, add `/api` at the end)

### 3.5 Deploy Frontend
1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll see build logs
4. When done, you'll see "Congratulations!" 🎉
5. Your app URL will be: `https://snapspend.vercel.app` (or similar)

### 3.6 Test Frontend
1. Visit your Vercel URL
2. Try signing up with a new account
3. Add an expense
4. Check if data saves

**SAVE YOUR FRONTEND URL!**

---

## STEP 4: Update Backend CORS

Now that you have your frontend URL, update backend to allow it:

### 4.1 Update Environment Variable in Render
1. Go back to Render dashboard
2. Click on your `snapspend-backend` service
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://snapspend.vercel.app` (your Vercel URL)
6. Click "Save Changes"
7. Render will automatically redeploy (takes 2-3 minutes)

### 4.2 Verify Everything Works
1. Visit your Vercel URL
2. Sign up with a new account
3. Add expenses
4. Upload a CSV file
5. Try the chatbot
6. Check insights and results pages

If everything works, you're done! 🎉

---

## 🎯 Your Live URLs

After deployment, you'll have:

- **Live App**: https://snapspend.vercel.app
- **Backend API**: https://snapspend-backend.onrender.com
- **Database**: MongoDB Atlas (cloud)

---

## 🔒 Security Notes

1. **Never commit .env files** - They're in .gitignore
2. **Use strong JWT_SECRET** - Change from default
3. **MongoDB password** - Keep it secure
4. **Gemini API key** - Don't share publicly

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend shows "Application failed to respond"
**Solution**: 
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Make sure all environment variables are set

### Issue 2: Frontend can't connect to backend
**Solution**:
- Check VITE_API_URL is correct in Vercel
- Verify backend is running (visit /api/hello endpoint)
- Check browser console for CORS errors

### Issue 3: "Cannot connect to MongoDB"
**Solution**:
- Verify MongoDB Atlas cluster is running
- Check connection string has correct password
- Ensure IP whitelist includes 0.0.0.0/0

### Issue 4: Render backend is slow on first request
**Solution**:
- This is normal! Free tier sleeps after 15 minutes
- First request takes 30-50 seconds to wake up
- Subsequent requests are fast

### Issue 5: Vercel build fails
**Solution**:
- Check build logs in Vercel dashboard
- Verify package.json has all dependencies
- Try deploying again (sometimes it's a temporary issue)

---

## 💡 Pro Tips

1. **Custom Domain**: You can add your own domain in Vercel settings (free)
2. **Preview Deployments**: Every git push creates a preview URL
3. **Logs**: Check Render logs if backend has issues
4. **MongoDB Compass**: Download to view your database visually
5. **Keep Backend Awake**: Use a service like UptimeRobot to ping your backend every 5 minutes (prevents sleeping)

---

## 📊 Free Tier Limits

### MongoDB Atlas
- 512 MB storage
- Enough for ~10,000 expenses
- No credit card required

### Render.com
- 750 hours/month (enough for 24/7)
- Sleeps after 15 min inactivity
- 512 MB RAM

### Vercel
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Global CDN

---

## 🎉 You're Live!

Share your app with:
- Friends and family
- Hackathon judges
- Portfolio visitors
- Potential employers

Your snapSpend app is now live and accessible worldwide! 🌍

---

## 📞 Need Help?

If you face any issues:
1. Check the troubleshooting section above
2. Review Render/Vercel logs
3. Verify all environment variables
4. Make sure MongoDB cluster is running

---

**Total Deployment Time**: 30-45 minutes
**Total Cost**: ₹0/month
**Difficulty**: Easy 🟢

Good luck! 🚀
