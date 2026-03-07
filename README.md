# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/266ab390-37ad-4e92-98d4-191319f5ee51

## Features

This is a full-stack financial management application with:

### Existing Features
- **Transaction Analyzer**: Upload CSV files to analyze and categorize transactions using AI
- **Financial Chatbot**: Ask questions about your finances and get AI-powered advice
- **Insights Dashboard**: View analytics and spending patterns
- **Authentication**: Secure sign-in/sign-up with Supabase

### New: Expense Tracker (Hackathon Feature)
- **Add Expenses**: Simple form to track daily expenses
- **View All Expenses**: List of all expenses with details
- **Total Calculation**: Real-time total of all expenses
- **Filter by Category**: Bonus feature to filter expenses
- **Full Stack**: Node.js + Express + MongoDB backend with React frontend

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB installed and running
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
```

2. **Setup Backend:**
```sh
cd backend
npm install
```

3. **Configure Environment:**
Create `backend/.env` file:
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/expense-tracker
```

4. **Start MongoDB:**
```sh
# Windows: Start MongoDB service from Services
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
```

5. **Run the Application:**

Terminal 1 - Backend:
```sh
cd backend
npm start
```

Terminal 2 - Frontend:
```sh
npm run dev
```

6. **Access the Application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Expense Tracker API

### POST /api/expenses
Add a new expense
```json
{
  "title": "Lunch",
  "amount": 150,
  "category": "Food",
  "date": "2026-03-04"
}
```

### GET /api/expenses
Fetch all expenses

See `EXPENSE_TRACKER_SETUP.md` for detailed setup instructions.

## Technologies

- **Frontend**: Vite, TypeScript, React, shadcn-ui, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (Expense Tracker), Supabase (Authentication)
- **AI**: Google Gemini API

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/266ab390-37ad-4e92-98d4-191319f5ee51) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Node.js & Express
- MongoDB

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/266ab390-37ad-4e92-98d4-191319f5ee51) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
