# ✅ Deployment Checklist

Use this checklist to track your deployment progress.

---

## Pre-Deployment

- [ ] All code committed to GitHub
- [ ] Repository is public or accessible
- [ ] `.env` files are in `.gitignore`
- [ ] Have Gemini API key ready
- [ ] Have 30-45 minutes available

---

## Part 1: MongoDB Atlas (Database)

- [ ] Created MongoDB Atlas account
- [ ] Clicked "Build a Database"
- [ ] Selected **"Shared"** (M0 FREE) deployment option
- [ ] Clicked "Create" under Shared
- [ ] Selected AWS provider
- [ ] Selected closest region
- [ ] Cluster name: `snapspend-cluster` (or default)
- [ ] Clicked "Create Deployment"
- [ ] Created database user: `snapspend-admin`
- [ ] Saved password securely
- [ ] Added IP whitelist: `0.0.0.0/0`
- [ ] Copied connection string
- [ ] Replaced `<password>` in connection string
- [ ] Added `/snapspend` to connection string
- [ ] Tested connection string format

**My MongoDB URI:**
```
mongodb+srv://snapspend-admin:_______@snapspend-cluster._____.mongodb.net/snapspend?retryWrites=true&w=majority
```

---

## Part 2: Render.com (Backend)

- [ ] Created Render account with GitHub
- [ ] Created new Web Service
- [ ] Connected GitHub repository
- [ ] Set root directory: `backend`
- [ ] Set build command: `npm install`
- [ ] Set start command: `npm start`
- [ ] Selected Free tier
- [ ] Added environment variable: `PORT=5000`
- [ ] Added environment variable: `MONGODB_URI`
- [ ] Added environment variable: `JWT_SECRET`
- [ ] Added environment variable: `GEMINI_API_KEY`
- [ ] Added environment variable: `NODE_ENV=production`
- [ ] Clicked "Create Web Service"
- [ ] Waited for deployment (5-10 min)
- [ ] Deployment successful (green checkmark)
- [ ] Tested: `/api/hello` endpoint works
- [ ] Saved backend URL

**My Backend URL:**
```
https://snapspend-backend.onrender.com
```

---

## Part 3: Vercel (Frontend)

- [ ] Created Vercel account with GitHub
- [ ] Imported GitHub repository
- [ ] Framework detected: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Added environment variable: `VITE_API_URL`
- [ ] VITE_API_URL value: `https://YOUR-BACKEND.onrender.com/api`
- [ ] Clicked "Deploy"
- [ ] Waited for deployment (2-3 min)
- [ ] Deployment successful
- [ ] Saved frontend URL

**My Frontend URL:**
```
https://snapspend.vercel.app
```

---

## Part 4: Final Configuration

- [ ] Added `FRONTEND_URL` to Render environment variables
- [ ] Render redeployed automatically
- [ ] Waited for redeploy (2-3 min)

---

## Part 5: Testing

- [ ] Visited frontend URL
- [ ] Signed up with new account
- [ ] Login works
- [ ] Can add expense
- [ ] Expense appears in dashboard
- [ ] Can upload CSV file
- [ ] CSV data appears in expenses
- [ ] Chatbot responds
- [ ] Insights page shows data
- [ ] Results page shows charts
- [ ] Premium page loads
- [ ] Pricing page loads
- [ ] Mobile responsive works
- [ ] Sidebar works on mobile

---

## Part 6: Documentation

- [ ] Updated README with live URLs
- [ ] Saved all credentials securely
- [ ] Documented any custom changes
- [ ] Shared app URL with team/judges

---

## Troubleshooting Completed

If you faced issues, mark what you fixed:

- [ ] Fixed MongoDB connection error
- [ ] Fixed CORS error
- [ ] Fixed environment variable typo
- [ ] Fixed build error
- [ ] Redeployed backend
- [ ] Redeployed frontend
- [ ] Cleared browser cache

---

## Final Status

**Deployment Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Complete

**All Services Running:**
- Database (MongoDB Atlas): ⬜ Running
- Backend (Render): ⬜ Running
- Frontend (Vercel): ⬜ Running

**App is Live:** ⬜ Yes | ⬜ No

---

## Share Your Success! 🎉

Once everything is checked:

1. Share your live URL: `https://snapspend.vercel.app`
2. Test with friends/family
3. Add to your portfolio
4. Submit to hackathon
5. Celebrate! 🎊

---

**Deployment Date:** _______________

**Time Taken:** _______________

**Issues Faced:** _______________

**Notes:** _______________
