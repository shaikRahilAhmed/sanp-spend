# 🔐 Environment Variables Reference

## Backend Environment Variables (Render.com)

Add these in Render.com → Your Service → Environment tab:

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `5000` | Server port |
| `MONGODB_URI` | `mongodb+srv://snapspend-admin:PASSWORD@cluster.mongodb.net/snapspend?retryWrites=true&w=majority` | MongoDB Atlas connection string |
| `JWT_SECRET` | `snapspend-super-secret-jwt-key-production-2026-secure` | Secret key for JWT tokens (change this!) |
| `GEMINI_API_KEY` | `AIzaSyD9WVGe4iyK5SgQbnVQHeBzPr08yKc7N4k` | Google Gemini API key |
| `NODE_ENV` | `production` | Environment mode |
| `FRONTEND_URL` | `https://snapspend.vercel.app` | Your Vercel frontend URL |

---

## Frontend Environment Variables (Vercel)

Add these in Vercel → Your Project → Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://snapspend-backend.onrender.com/api` | Your Render backend URL with /api |

---

## Local Development (.env files)

### Backend (.env in backend folder)
```env
PORT=5000
GEMINI_API_KEY=AIzaSyD9WVGe4iyK5SgQbnVQHeBzPr08yKc7N4k
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

### Frontend (.env in root folder) - Optional for local dev
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Important Notes

1. **Never commit .env files** to Git
2. **Change JWT_SECRET** in production to something unique
3. **MongoDB URI** must include database name `/snapspend`
4. **VITE_API_URL** must end with `/api`
5. **FRONTEND_URL** should not end with `/`

---

## How to Get These Values

### MongoDB URI
1. Go to MongoDB Atlas
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy connection string
5. Replace `<password>` with your actual password
6. Add `/snapspend` before the `?`

### Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### Backend URL (Render)
- After deploying to Render, copy the URL from dashboard
- Format: `https://your-service-name.onrender.com`

### Frontend URL (Vercel)
- After deploying to Vercel, copy the URL from dashboard
- Format: `https://your-project-name.vercel.app`

---

## Testing Your Configuration

### Test Backend
```bash
curl https://your-backend-url.onrender.com/api/hello
```
Should return: `{"message":"Hello Saurabh from server!"}`

### Test Frontend
Visit your Vercel URL and try:
1. Sign up
2. Add expense
3. View dashboard

If all works, configuration is correct! ✅
