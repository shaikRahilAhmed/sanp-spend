import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/MongoAuthContext";
import axios from "axios";
import PieChart from "@/components/charts/PieChart";

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

const RealDataDashboard = () => {
  const { token, user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = '/api';

  useEffect(() => {
    if (token) {
      fetchExpenses();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const categoryTotals = expenses.reduce((acc: any, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryTotals).map(([category, total]: [string, any]) => ({
    category,
    total,
    percentage: totalSpent > 0 ? (total / totalSpent) * 100 : 0,
    color: getColorForCategory(category)
  })).sort((a, b) => b.total - a.total);

  function getColorForCategory(category: string) {
    const colors: any = {
      'Food': '#ef4444',
      'Travel': '#3b82f6',
      'Shopping': '#8b5cf6',
      'Bills': '#f59e0b',
      'Entertainment': '#10b981',
      'Health': '#ec4899',
      'Groceries': '#14b8a6',
      'Other': '#6b7280'
    };
    return colors[category] || '#6b7280';
  }

  if (!user) {
    return (
      <div className="space-y-8">
        <section className="expense-card text-center py-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Welcome to <span className="text-expense-blue">snapSpend</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Track and manage your expenses. Sign in to get started!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-expense-blue hover:bg-blue-700">
              <Link to="/auth?mode=login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth?mode=signup">Sign Up</Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading your expenses...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="space-y-8">
        <section className="expense-card text-center py-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Welcome, <span className="text-expense-blue">{user.fullName}</span>!
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            You haven't added any expenses yet. Start tracking your spending now!
          </p>
          <Button asChild size="lg" className="bg-expense-blue hover:bg-blue-700">
            <Link to="/expense-tracker" className="flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Add Your First Expense
            </Link>
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <section className="expense-card text-center py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          Welcome back, <span className="text-expense-blue">{user.fullName}</span>!
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
          You have {expenses.length} expense{expenses.length !== 1 ? 's' : ''} totaling ₹{totalSpent.toFixed(2)}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
          <Button asChild size="lg" className="bg-expense-blue hover:bg-blue-700 w-full sm:w-auto">
            <Link to="/expense-tracker" className="flex items-center justify-center">
              <Upload className="mr-2 h-5 w-5" />
              Add Expense
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link to="/results" className="flex items-center justify-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              View Details
            </Link>
          </Button>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">₹{totalSpent.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{expenses.length}</div>
          </CardContent>
        </Card>

        {categoryData[0] && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Top Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold truncate">{categoryData[0].category}</div>
              <p className="text-xs text-gray-500 mt-1">₹{categoryData[0].total.toFixed(2)}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">₹{(totalSpent / expenses.length).toFixed(2)}</div>
          </CardContent>
        </Card>
      </section>

      {/* Recent Transactions and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <Link to="/expense-tracker" className="text-expense-blue hover:text-blue-700 text-sm flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.slice(0, 5).map((expense) => (
                <div key={expense._id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{expense.title}</h3>
                    <p className="text-sm text-gray-600">
                      {expense.category} • {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-lg font-bold">₹{expense.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Spending Breakdown */}
        {categoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Spending Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={categoryData} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RealDataDashboard;
