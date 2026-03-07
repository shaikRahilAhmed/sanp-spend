
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/MongoAuthContext';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import Landing from '@/pages/Landing';
import RealDataDashboard from '@/pages/RealDataDashboard';
import Auth from '@/pages/Auth';
import Results from '@/pages/Results';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Insights from '@/pages/Insights';
import TransactionAnalyzer from '@/pages/TransactionAnalyzer';
import FinancialChatbot from '@/pages/FinancialChatbot';
import ExpenseTracker from '@/pages/ExpenseTracker';
import Premium from '@/pages/Premium';
import Pricing from '@/pages/Pricing';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pb-8">
              <Routes>
                <Route path="/" element={<RealDataDashboard />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/results" element={<Results />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/analyzer" element={<TransactionAnalyzer />} />
                <Route path="/chatbot" element={<FinancialChatbot />} />
                <Route path="/expense-tracker" element={<ExpenseTracker />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
