# snapSpend - Smart Expense Tracker

**Live Demo**: [Coming Soon - Deploy using guide below]

A full-stack financial management application with AI-powered insights, expense tracking, and smart categorization.

## 🚀 Quick Links

- **[Deployment Guide](DEPLOYMENT_STEPS.md)** - Step-by-step deployment to Vercel + Render
- **[Environment Variables](ENV_VARIABLES_REFERENCE.md)** - Complete reference for all env vars
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Track your deployment progress

---

## ✨ Features

### Core Features
- **Expense Tracker**: Add, view, and manage daily expenses
- **Smart Categorization**: AI-powered transaction categorization using Google Gemini
- **CSV/PDF Upload**: Upload bank statements for automatic expense import
- **Financial Chatbot**: Get personalized financial advice and insights
- **Analytics Dashboard**: View spending patterns, trends, and insights
- **Premium Features**: Advanced analytics, budget planning, and reports (demo)

### Technical Features
- **MongoDB Authentication**: Secure JWT-based user authentication
- **User Isolation**: Each user sees only their own data
- **Mobile Responsive**: Fully responsive with mobile sidebar
- **Real-time Updates**: Instant expense tracking and calculations
- **AI Integration**: Google Gemini for categorization and chatbot

---

## 🛠️ Technologies

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **AI**: Google Gemini API
- **Charts**: Recharts
- **File Upload**: Multer + pdf-parse

---

## 📦 Local Development Setup

### Prerequisites
- Node.js (v16+)
- MongoDB installed and running locally
- npm or yarn

### Installation

1. **Clone the repository:**
```sh
git clone <YOUR_GIT_URL>
cd snapspend
```

2. **Install frontend dependencies:**
```sh
npm install
```

3. **Install backend dependencies:**
```sh
cd backend
npm install
cd ..
```

4. **Setup environment variables:**

Create `backend/.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

5. **Start MongoDB:**
```sh
# Windows: Start MongoDB service from Services app
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
```

6. **Run the application:**

**Option 1: Using batch files (Windows)**
```sh
# Terminal 1 - Backend
start-backend.bat

# Terminal 2 - Frontend
start-frontend.bat
```

**Option 2: Manual start**
```sh
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend (from root)
npm run dev
```

7. **Access the application:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000

---

## 🌐 Deployment

### Deploy to Production (Free Tier)

Follow our comprehensive deployment guide:

1. **[Read DEPLOYMENT_STEPS.md](DEPLOYMENT_STEPS.md)** - Complete step-by-step guide
2. **[Check ENV_VARIABLES_REFERENCE.md](ENV_VARIABLES_REFERENCE.md)** - All environment variables
3. **[Use DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Track your progress

**Deployment Stack:**
- Frontend: Vercel (Free)
- Backend: Render.com (Free)
- Database: MongoDB Atlas (Free)
- **Total Cost: ₹0/month**

**Deployment Time:** 30-45 minutes

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Get current user

### Expenses
- `POST /api/expenses` - Add new expense
- `GET /api/expenses` - Get all user expenses
- `DELETE /api/expenses/:id` - Delete expense

### File Upload
- `POST /api/upload-statement` - Upload PDF/CSV with AI categorization
- `POST /api/upload-csv-simple` - Upload CSV with keyword categorization

### Chatbot
- `POST /api/chatbot/ask` - Ask financial questions

---

## 🎨 Project Structure

```
snapspend/
├── backend/
│   ├── models/          # MongoDB models (User, Expense)
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utilities (CSV parser)
│   └── server.js        # Express server
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── contexts/        # Auth context
│   ├── lib/             # Utilities
│   └── main.tsx         # Entry point
├── public/              # Static assets
└── deployment docs/     # Deployment guides
```

---

## 🔐 Security

- JWT tokens with 7-day expiry
- Bcrypt password hashing
- User data isolation
- CORS configuration
- Environment variable protection

---

## 📱 Features Showcase

### Dashboard
- Total expenses overview
- Category breakdown
- Recent transactions
- Spending trends

### Transaction Analyzer
- Upload bank statements (PDF/CSV)
- AI-powered categorization
- Automatic expense import
- Smart insights

### Financial Chatbot
- Ask about spending patterns
- Get savings suggestions
- Budget recommendations
- Financial health tips

### Premium (Demo)
- Advanced analytics
- AI insights
- Budget planning
- Export reports
- Recurring expenses
- Priority support

---

## 🤝 Contributing

This is a hackathon project. Feel free to fork and customize!

---

## 📄 License

MIT License - Feel free to use for your projects

---

## 🎯 Hackathon Notes

This project was built for a hackathon with these requirements:
- ✅ MongoDB backend
- ✅ Express API
- ✅ React frontend
- ✅ Full CRUD operations
- ✅ Bonus features (filtering, AI, chatbot)
- ✅ User authentication
- ✅ Mobile responsive
- ✅ Production deployment

---

## 📞 Support

For deployment help, check:
1. [DEPLOYMENT_STEPS.md](DEPLOYMENT_STEPS.md) - Detailed guide
2. [Troubleshooting section](DEPLOYMENT_STEPS.md#-common-issues--solutions)
3. Service logs (Render/Vercel dashboards)

---

**Built with ❤️ for smart expense tracking**
