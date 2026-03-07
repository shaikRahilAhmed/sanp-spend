
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp } from "lucide-react";
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

const Insights = () => {
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

  // Calculate month-over-month changes
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return { value: '0.0', increase: false };
    const percentage = ((current - previous) / previous) * 100;
    return {
      value: percentage.toFixed(1),
      increase: percentage > 0
    };
  };

  // Get insights for top 3 categories
  const insights = categoryData.slice(0, 3).map(cat => {
    const currentMonthData = monthlySpending[monthlySpending.length - 1];
    const previousMonthData = monthlySpending[monthlySpending.length - 2];
    
    const current = currentMonthData?.[cat.category] || 0;
    const previous = previousMonthData?.[cat.category] || 0;
    
    return {
      category: cat.category,
      change: calculateChange(current, previous),
      message: `Your ${cat.category.toLowerCase()} expenses have ${current > previous ? 'increased' : 'decreased'} compared to last month.`
    };
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-gray-600">You need to be logged in to view your spending insights.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading your insights...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Spending Insights</h1>
        <div className="text-center py-12 expense-card">
          <h2 className="text-2xl font-bold mb-4">No Expenses Yet</h2>
          <p className="text-gray-600 mb-6">Start adding expenses to see your insights here.</p>
          <a href="/expense-tracker" className="text-expense-blue hover:underline">
            Add Your First Expense →
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold">Spending Insights</h1>
      
      {/* Key Insights */}
      {insights.length > 0 && monthlySpending.length >= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight) => (
            <Card key={insight.category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{insight.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold">{Math.abs(Number(insight.change.value))}%</div>
                  <div 
                    className={`flex items-center ${
                      insight.change.increase ? 'text-red-500' : 'text-green-500'
                    }`}
                  >
                    {insight.change.increase ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {insight.change.increase ? 'More' : 'Less'}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{insight.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Spending Trends */}
      {monthlySpending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Spending Trends</CardTitle>
            <CardDescription>See how your spending has changed over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monthly">
              <div className="flex justify-end mb-4">
                <TabsList>
                  <TabsTrigger value="weekly">Recent</TabsTrigger>
                  <TabsTrigger value="monthly">All Time</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="weekly" className="h-[400px]">
                <BarChart data={monthlySpending.slice(-4)} />
              </TabsContent>
              
              <TabsContent value="monthly" className="h-[400px]">
                <BarChart data={monthlySpending} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      {/* Category Analysis */}
      {categoryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown Analysis</CardTitle>
            <CardDescription>Detailed analysis of your spending categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categoryData.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{category.category}</h4>
                    <span>{formatCurrency(category.total)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {category.percentage.toFixed(1)}% of your total expenses
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Savings Opportunities */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Savings Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights[0] && (
                <div className="expense-card">
                  <h3 className="text-lg font-medium mb-2">Reduce {insights[0].category} Expenses</h3>
                  <p className="text-gray-600">
                    Your {insights[0].category.toLowerCase()} spending is {insights[0].change.increase ? 'up' : 'down'} {Math.abs(Number(insights[0].change.value))}% from last month. 
                    {insights[0].category === 'Food' && ' Consider meal planning to reduce costs.'}
                    {insights[0].category === 'Travel' && ' Look for opportunities to use public transportation or carpooling.'}
                    {insights[0].category === 'Shopping' && ' Try to limit impulse purchases and stick to a shopping list.'}
                    {insights[0].category === 'Entertainment' && ' Review your subscriptions to identify services you may not be using frequently.'}
                  </p>
                </div>
              )}
              
              {categoryData.find(c => c.category === 'Travel') && (
                <div className="expense-card">
                  <h3 className="text-lg font-medium mb-2">Transportation Savings</h3>
                  <p className="text-gray-600">
                    Look for opportunities to use public transportation or carpooling to reduce travel expenses.
                  </p>
                </div>
              )}
              
              {categoryData.find(c => c.category === 'Entertainment') && (
                <div className="expense-card">
                  <h3 className="text-lg font-medium mb-2">Subscription Audit</h3>
                  <p className="text-gray-600">
                    Review your entertainment subscriptions to identify services you may not be using frequently.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Insights;
