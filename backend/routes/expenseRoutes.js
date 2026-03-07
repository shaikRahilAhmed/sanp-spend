const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/auth');

// POST /expenses - Add a new expense (protected)
router.post('/expenses', authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    console.log(`[POST /expenses] Adding expense for userId: ${req.userId}`);

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title should not be empty' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    if (!category || category.trim() === '') {
      return res.status(400).json({ error: 'Category should not be empty' });
    }

    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({ error: 'Date must be valid' });
    }

    const expense = new Expense({
      userId: req.userId,
      title,
      amount,
      category,
      date: new Date(date)
    });

    await expense.save();
    console.log(`[POST /expenses] Expense saved with _id: ${expense._id} for userId: ${req.userId}`);
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// GET /expenses - Get all expenses for logged-in user (protected)
router.get('/expenses', authMiddleware, async (req, res) => {
  try {
    console.log(`[GET /expenses] Fetching expenses for userId: ${req.userId}`);
    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
    console.log(`[GET /expenses] Found ${expenses.length} expenses for userId: ${req.userId}`);
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// GET /expenses/stats - Get expense statistics for logged-in user (protected)
router.get('/expenses/stats', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId });
    
    // Calculate total
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate by category
    const byCategory = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {});
    
    // Calculate monthly spending
    const byMonth = expenses.reduce((acc, expense) => {
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
    
    res.json({
      total,
      count: expenses.length,
      byCategory,
      byMonth,
      expenses: expenses.slice(0, 10) // Recent 10 transactions
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
