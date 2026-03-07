import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

const ExpenseTrackerStandalone = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses`);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to fetch expenses. Make sure backend is running.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Title should not be empty');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Amount must be a positive number');
      return;
    }

    if (!category.trim()) {
      toast.error('Category should not be empty');
      return;
    }

    if (!date) {
      toast.error('Date must be valid');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/expenses`, {
        title,
        amount: parseFloat(amount),
        category,
        date,
      });

      toast.success('Expense added successfully');

      setTitle('');
      setAmount('');
      setCategory('');
      setDate('');
      fetchExpenses();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const filteredExpenses = filterCategory === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.category.toLowerCase() === filterCategory.toLowerCase());

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categories = Array.from(new Set(expenses.map(e => e.category)));

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Expense Tracker</h1>
        <p className="text-gray-600 mt-2">Track your daily expenses - No login required!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Lunch"
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 150"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Food"
                />
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Adding...' : 'Add Expense'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              ₹{totalExpenses.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {filterCategory === 'all' ? 'All categories' : `Category: ${filterCategory}`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Expenses</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="filter">Filter:</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {filterCategory === 'all' 
                ? 'No expenses yet. Add your first expense above!' 
                : `No expenses in category: ${filterCategory}`}
            </p>
          ) : (
            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense._id}
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
                >
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTrackerStandalone;
