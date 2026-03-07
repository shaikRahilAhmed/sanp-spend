import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PieChart from "@/components/charts/PieChart";
import BarChart from "@/components/charts/BarChart";
import { useAuth } from "@/contexts/MongoAuthContext";
import axios from "axios";

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

const Results = () => {
  const [view, setView] = useState("transactions");
  const { user, token } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

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

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

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

  // Calculate statistics from real data
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

  // Calculate monthly spending
  const monthlyData = expenses.reduce((acc: any, expense) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = {};
    }
    if (!acc[month][expense.category]) {
      acc[month][expense.category] = 0;
    }
    acc[month][expense.category] += expense.amount;
    return acc;
  }, {});

  const monthlySpending = Object.entries(monthlyData).map(([month, categories]: [string, any]) => ({
    month,
    ...categories
  }));

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-gray-600">You need to be logged in to view your expense analysis.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading your expense analysis...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Your Expense Analysis</h1>
        <div className="text-center py-12 expense-card">
          <h2 className="text-2xl font-bold mb-4">No Expenses Yet</h2>
          <p className="text-gray-600 mb-6">Start adding expenses to see your analysis here.</p>
          <a href="/expense-tracker" className="text-expense-blue hover:underline">
            Add Your First Expense →
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold">
        {user ? `Welcome back, ${user.fullName}` : 'Your Expense Analysis'}
      </h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
          </CardContent>
        </Card>
        
        {categoryData[0] && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Largest Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categoryData[0].category}</div>
              <p className="text-sm text-gray-500">{formatCurrency(categoryData[0].total)}</p>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalSpent / expenses.length)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Breakdown of your expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <PieChart data={categoryData} />
            </CardContent>
          </Card>
        )}
        
        {monthlySpending.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trends</CardTitle>
              <CardDescription>How your spending has changed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={monthlySpending} />
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Tabs and Transaction List */}
      <Card>
        <Tabs defaultValue="transactions" onValueChange={setView} value={view}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Expense Details</CardTitle>
              <TabsList>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="transactions">
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div key={expense._id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h3 className="font-semibold">{expense.title}</h3>
                      <p className="text-sm text-gray-600">
                        {expense.category} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-lg font-bold">{formatCurrency(expense.amount)}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="categories">
              <div className="space-y-4">
                {categoryData.map((category) => (
                  <div key={category.category} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-black">{category.category}</span>
                        <span className="text-black">{formatCurrency(category.total)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Results;
