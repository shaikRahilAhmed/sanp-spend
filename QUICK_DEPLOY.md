# ⚡ Quick Deploy Guide (15 Minutes)

This is the fastest way to get snapSpend live. Follow these exact steps.

---

## Step 1: MongoDB Atlas (5 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google
3. Click "Build a Database" → Choose "M0 FREE"
4. Click "Create"
5. Username: `snapspend-admin`
6. Click "Autogenerate Secure Password" → **COPY IT!**
7. Click "Create User"
8. Add IP: `0.0.0.0/0`
9. Click "Finish and Close"
10. Click "Connect" → "Connect your application"
11. Copy the connection string
12. Replace `<password>` with your password
13. Add `/snapspend` before the `?`

**Save this:** `mongodb+srv://snapspend-admin:YOUR_PASSWORD@cluster.mongodb.net/snapspend?retryWrites=true&w=majority`

---

## Step 2: Render Backend (5 minutes)

1. Go to: https://render.com/
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repo
5. Fill in:
   - Name: `snapspend-backend`
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Free tier
6. Add Environment Variables:
   ```
   PORT = 5000
   MONGODB_URI = [paste your MongoDB URI from Step 1]
   JWT_SECRET = snapspend-jwt-secret-2026
   GEMINI_API_KEY = AIzaSyD9WVGe4iyK5SgQbnVQHeBzPr08yKc7N4k
   NODE_ENV = production
   ```
7. Click "Create Web Service"
8. Wait 5 minutes
9. Copy your URL: `https://snapspend-backend.onrender.com`
10. Test: Visit `https://YOUR-URL.onrender.com/api/hello`

---

## Step 3: Vercel Frontend (5 minutes)

1. Go to: https://vercel.com/
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your repo
5. Add Environment Variable:
   ```
   VITE_API_URL = https://YOUR-BACKEND-URL.onrender.com/api
   ```
6. Click "Deploy"
7. Wait 2 minutes
8. Copy your URL: `https://snapspend.vercel.app`

---

## Step 4: Connect Frontend to Backend (2 minutes)

1. Go back to Render
2. Click your service
3. Go to "Environment"
4. Add:
   ```
   FRONTEND_URL = https://YOUR-VERCEL-URL.vercel.app
   ```
5. Save (auto-redeploys)

---

## Step 5: Test (2 minutes)

1. Visit your Vercel URL
2. Sign up
3. Add an expense
4. Done! 🎉

---

## Your URLs

- **App**: https://snapspend.vercel.app
- **API**: https://snapspend-backend.onrender.com

---

## Troubleshooting

**Backend not working?**
- Check Render logs
- Verify MongoDB URI is correct

**Frontend can't connect?**
- Check VITE_API_URL in Vercel
- Make sure it ends with `/api`

**Still stuck?**
- Read [DEPLOYMENT_STEPS.md](DEPLOYMENT_STEPS.md) for detailed guide

---

**Total Time: 15 minutes**
**Total Cost: ₹0**

🚀 You're live!
