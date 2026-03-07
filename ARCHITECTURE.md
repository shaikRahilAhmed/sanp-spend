# 🏗️ snapSpend Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                    https://snapspend.vercel.app              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS Requests
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React + TypeScript + Vite                           │   │
│  │  - Dashboard                                         │   │
│  │  - Expense Tracker                                   │   │
│  │  - Transaction Analyzer                              │   │
│  │  - Financial Chatbot                                 │   │
│  │  - Insights & Results                                │   │
│  │  - Premium Features                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Environment Variables:                                      │
│  - VITE_API_URL                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ API Calls
                         │ (JWT Token in Headers)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              RENDER.COM (Backend API)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Node.js + Express                                   │   │
│  │                                                       │   │
│  │  Routes:                                             │   │
│  │  - /api/auth/* (signup, signin, me)                 │   │
│  │  - /api/expenses (CRUD operations)                  │   │
│  │  - /api/upload-statement (PDF/CSV)                  │   │
│  │  - /api/chatbot/ask (AI chatbot)                    │   │
│  │                                                       │   │
│  │  Middleware:                                         │   │
│  │  - CORS (allows Vercel domain)                      │   │
│  │  - JWT Authentication                                │   │
│  │  - Multer (file uploads)                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Environment Variables:                                      │
│  - PORT, MONGODB_URI, JWT_SECRET                            │
│  - GEMINI_API_KEY, NODE_ENV, FRONTEND_URL                  │
└────────────┬──────────────────────┬─────────────────────────┘
             │                      │
             │                      │ AI Requests
             │                      │
             │                      ▼
             │         ┌────────────────────────────┐
             │         │   GOOGLE GEMINI API        │
             │         │  - Transaction categorize  │
             │         │  - Financial advice        │
             │         │  - Smart insights          │
             │         └────────────────────────────┘
             │
             │ MongoDB Queries
             │ (Mongoose ODM)
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│              MONGODB ATLAS (Database)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Collections:                                        │   │
│  │                                                       │   │
│  │  users                                               │   │
│  │  ├─ _id                                              │   │
│  │  ├─ email (unique)                                   │   │
│  │  ├─ password (bcrypt hashed)                         │   │
│  │  ├─ fullName                                         │   │
│  │  └─ createdAt                                        │   │
│  │                                                       │   │
│  │  expenses                                            │   │
│  │  ├─ _id                                              │   │
│  │  ├─ userId (ref: users)                             │   │
│  │  ├─ title                                            │   │
│  │  ├─ amount                                           │   │
│  │  ├─ category                                         │   │
│  │  ├─ date                                             │   │
│  │  └─ createdAt                                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Cluster: snapspend-cluster (M0 Free Tier)                  │
│  Region: Mumbai / Singapore                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Authentication Flow
```
User → Frontend (Login Form)
  → Backend (/api/auth/signin)
    → MongoDB (verify credentials)
      → bcrypt.compare(password, hashedPassword)
        → Generate JWT Token
          → Return token to Frontend
            → Store in localStorage
              → Include in all future requests
```

### 2. Add Expense Flow
```
User → Frontend (Expense Form)
  → Backend (/api/expenses) + JWT Token
    → Auth Middleware (verify token)
      → Extract userId from token
        → MongoDB (save expense with userId)
          → Return saved expense
            → Update Frontend UI
```

### 3. Upload CSV/PDF Flow
```
User → Frontend (File Upload)
  → Backend (/api/upload-statement) + JWT Token + File
    → Auth Middleware (verify token)
      → Multer (save file temporarily)
        → Parse PDF/CSV
          → Google Gemini API (categorize transactions)
            → Save expenses to MongoDB with userId
              → Delete temp file
                → Return categorized data
                  → Update Frontend UI
```

### 4. Chatbot Flow
```
User → Frontend (Chat Input)
  → Backend (/api/chatbot/ask) + JWT Token + Question
    → Auth Middleware (verify token)
      → Fetch user's expenses from MongoDB
        → Calculate financial summary
          → Google Gemini API (generate advice)
            → Return AI response
              → Display in chat UI
```

---

## Security Layers

### 1. Authentication
- JWT tokens with 7-day expiry
- Bcrypt password hashing (10 rounds)
- Token stored in localStorage
- Token sent in Authorization header

### 2. Authorization
- Auth middleware on protected routes
- userId extracted from JWT token
- Data filtered by userId
- Users can only access their own data

### 3. CORS
- Whitelist specific domains
- Credentials allowed
- Regex for preview deployments
- Blocks unauthorized origins

### 4. Environment Variables
- Sensitive data in env vars
- Not committed to Git
- Different values for dev/prod
- Secure storage in hosting platforms

---

## Technology Stack

### Frontend (Vercel)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **State**: React Context API
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

### Backend (Render)
- **Runtime**: Node.js
- **Framework**: Express
- **Database ODM**: Mongoose
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **PDF Parsing**: pdf-parse
- **CSV Parsing**: csv-parser
- **HTTP Client**: Axios (for Gemini API)

### Database (MongoDB Atlas)
- **Type**: NoSQL Document Database
- **ODM**: Mongoose
- **Hosting**: MongoDB Atlas (Cloud)
- **Tier**: M0 Free (512 MB)

### AI (Google Gemini)
- **Model**: gemini-1.5-flash
- **Use Cases**: 
  - Transaction categorization
  - Financial advice
  - Smart insights

---

## Deployment Architecture

### Development
```
localhost:8080 (Frontend)
    ↓
localhost:5000 (Backend)
    ↓
localhost:27017 (MongoDB)
```

### Production
```
snapspend.vercel.app (Frontend)
    ↓
snapspend-backend.onrender.com (Backend)
    ↓
cluster.mongodb.net (MongoDB Atlas)
```

---

## Scalability Considerations

### Current (Free Tier)
- **Users**: ~100 concurrent
- **Expenses**: ~10,000 records
- **Requests**: ~100 req/min
- **Storage**: 512 MB

### If Scaling Needed
1. **MongoDB**: Upgrade to M10 ($0.08/hr)
2. **Render**: Upgrade to Starter ($7/mo)
3. **Vercel**: Pro plan ($20/mo)
4. **Add Redis**: For caching
5. **Add CDN**: For static assets

---

## Monitoring & Logs

### Vercel
- Build logs
- Function logs
- Analytics dashboard
- Error tracking

### Render
- Application logs
- Deployment logs
- Metrics dashboard
- Health checks

### MongoDB Atlas
- Query performance
- Connection stats
- Storage usage
- Alerts

---

## Backup Strategy

### MongoDB Atlas (Automatic)
- Continuous backups
- Point-in-time recovery
- 7-day retention (free tier)

### Code (Git)
- GitHub repository
- Version control
- Branch protection
- Automatic deployments

---

## Performance Optimization

### Frontend
- Code splitting (Vite)
- Lazy loading routes
- Image optimization
- Minification & compression

### Backend
- JWT token caching
- Database indexing (userId, email)
- Connection pooling
- Response compression

### Database
- Indexed queries
- Lean queries (select only needed fields)
- Aggregation pipelines
- Connection reuse

---

## Cost Breakdown (Free Tier)

| Service | Free Tier | Limits | Cost |
|---------|-----------|--------|------|
| Vercel | Yes | 100 GB bandwidth | ₹0 |
| Render | Yes | 750 hrs/mo, sleeps after 15min | ₹0 |
| MongoDB Atlas | Yes | 512 MB storage | ₹0 |
| Google Gemini | Yes | 60 requests/min | ₹0 |

**Total: ₹0/month**

---

## Future Enhancements

1. **Email Notifications** (SendGrid)
2. **SMS Alerts** (Twilio)
3. **Recurring Expenses** (Cron jobs)
4. **Budget Alerts** (Real-time)
5. **Export to Excel** (xlsx library)
6. **Multi-currency** (Exchange rates API)
7. **Receipt OCR** (Google Vision API)
8. **Bank Integration** (Plaid API)

---

**Architecture designed for scalability, security, and cost-efficiency** 🏗️
