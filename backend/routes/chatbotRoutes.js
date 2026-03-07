const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const Expense = require('../models/Expense');

// Simple rule-based responses (fallback if Gemini fails)
const getSimpleResponse = (question, stats) => {
  const q = question.toLowerCase();
  
  if (q.includes('reduce') || q.includes('save') || q.includes('cut')) {
    const topCat = Object.entries(stats.categoryTotals)
      .sort(([, a], [, b]) => b - a)[0];
    return `Based on your spending, here are some tips to reduce expenses:\n\n1. Your biggest expense is ${topCat[0]} (₹${topCat[1].toFixed(0)}). Try to reduce this by 20% to save ₹${(topCat[1] * 0.2).toFixed(0)} per month.\n\n2. Track your daily expenses more carefully to identify unnecessary purchases.\n\n3. Set a monthly budget of ₹${(stats.monthlyAverage * 0.8).toFixed(0)} (20% less than your current average of ₹${stats.monthlyAverage.toFixed(0)}).\n\n4. Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings.`;
  }
  
  if (q.includes('biggest') || q.includes('most') || q.includes('top')) {
    const topCat = Object.entries(stats.categoryTotals)
      .sort(([, a], [, b]) => b - a)[0];
    return `Your biggest expense category is ${topCat[0]} with ₹${topCat[1].toFixed(2)} spent, which is ${((topCat[1] / stats.totalSpent) * 100).toFixed(1)}% of your total expenses.\n\nHere's your complete breakdown:\n${Object.entries(stats.categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .map(([cat, amt], i) => `${i + 1}. ${cat}: ₹${amt.toFixed(0)} (${((amt / stats.totalSpent) * 100).toFixed(1)}%)`)
      .join('\n')}`;
  }
  
  if (q.includes('budget') || q.includes('plan')) {
    return `Based on your spending of ₹${stats.totalSpent.toFixed(0)} across ${stats.count} transactions, here's a suggested budget:\n\n${Object.entries(stats.categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .map(([cat, amt]) => `• ${cat}: ₹${(amt * 0.9).toFixed(0)} (reduce by 10%)`)
      .join('\n')}\n\nTotal Budget: ₹${(stats.totalSpent * 0.9).toFixed(0)}\nPotential Savings: ₹${(stats.totalSpent * 0.1).toFixed(0)} per month`;
  }
  
  if (q.includes('pattern') || q.includes('analyze') || q.includes('spending')) {
    return `Here's your spending analysis:\n\n📊 Total Spent: ₹${stats.totalSpent.toFixed(2)}\n📝 Transactions: ${stats.count}\n📅 Monthly Average: ₹${stats.monthlyAverage.toFixed(2)}\n\nTop 3 Categories:\n1. ${Object.entries(stats.categoryTotals).sort(([, a], [, b]) => b - a).slice(0, 3).map(([cat, amt], i) => `${cat}: ₹${amt.toFixed(0)}`).join('\n')}\n\nYou're spending most on ${Object.keys(stats.categoryTotals).sort((a, b) => stats.categoryTotals[b] - stats.categoryTotals[a])[0]}. Consider setting limits for this category.`;
  }
  
  if (q.includes('tip') || q.includes('advice') || q.includes('suggest')) {
    return `Here are personalized financial tips based on your ₹${stats.totalSpent.toFixed(0)} spending:\n\n💡 Track every expense daily\n💡 Set category-wise budgets\n💡 Review your spending weekly\n💡 Reduce impulse purchases\n💡 Use cash for discretionary spending\n💡 Automate savings (save 20% of income)\n💡 Compare prices before buying\n💡 Cook at home more often\n\nYour monthly average is ₹${stats.monthlyAverage.toFixed(0)}. Try to reduce it by 15% to save ₹${(stats.monthlyAverage * 0.15).toFixed(0)} per month!`;
  }
  
  return `I can help you with:\n\n• Analyzing your spending patterns\n• Identifying your biggest expenses\n• Suggesting ways to save money\n• Creating a budget plan\n• Giving financial tips\n\nYou've spent ₹${stats.totalSpent.toFixed(2)} across ${stats.count} transactions. Your top category is ${Object.keys(stats.categoryTotals).sort((a, b) => stats.categoryTotals[b] - stats.categoryTotals[a])[0]}.\n\nTry asking: "How can I reduce my spending?" or "What's my biggest expense?"`;
};

// Chatbot endpoint - uses user's actual expenses
router.post('/ask', authMiddleware, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question is required' });
    }

    console.log(`[CHATBOT] User ${req.userId} asked: ${question}`);

    // Fetch user's expenses
    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });

    if (expenses.length === 0) {
      return res.json({
        answer: "I notice you don't have any expenses recorded yet. Start by adding some expenses or uploading your bank statement, and I'll be able to give you personalized financial advice!"
      });
    }

    // Calculate statistics
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryTotals = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    // Calculate monthly average
    const dates = expenses.map(e => new Date(e.date));
    const oldestDate = new Date(Math.min(...dates));
    const newestDate = new Date(Math.max(...dates));
    const monthsDiff = Math.max(1, (newestDate - oldestDate) / (1000 * 60 * 60 * 24 * 30));
    const monthlyAverage = totalSpent / monthsDiff;

    const stats = {
      totalSpent,
      count: expenses.length,
      monthlyAverage,
      categoryTotals
    };

    // Try Gemini AI first, fallback to simple responses
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (geminiApiKey) {
      try {
        // Recent transactions (last 5)
        const recentTransactions = expenses.slice(0, 5).map(e => 
          `${e.title} (${e.category}): ₹${e.amount}`
        ).join('\n');

        const topCategory = Object.entries(categoryTotals)
          .sort(([, a], [, b]) => b - a)[0];

        // Build context for Gemini
        const context = `You are a helpful financial advisor. Analyze this user's spending data and answer their question.

USER'S FINANCIAL DATA:
- Total Expenses: ₹${totalSpent.toFixed(2)}
- Number of Transactions: ${expenses.length}
- Monthly Average: ₹${monthlyAverage.toFixed(2)}
- Top Spending Category: ${topCategory[0]} (₹${topCategory[1].toFixed(2)})

Category Breakdown:
${Object.entries(categoryTotals)
  .sort(([, a], [, b]) => b - a)
  .map(([cat, amt]) => `- ${cat}: ₹${amt.toFixed(2)} (${((amt / totalSpent) * 100).toFixed(1)}%)`)
  .join('\n')}

Recent Transactions:
${recentTransactions}

USER'S QUESTION: "${question}"

INSTRUCTIONS:
- Give personalized, actionable advice based on their actual data
- Be friendly, supportive, and encouraging
- Use specific numbers from their data
- Keep responses concise (2-3 paragraphs max)
- Format response in plain text, no markdown or bold text`;

        console.log('[CHATBOT] Trying Gemini API...');

        const geminiResponse = await axios.post(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            contents: [{
              parts: [{ text: context }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
            }
          },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000
          }
        );

        const answer = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (answer) {
          console.log('[CHATBOT] Gemini response generated');
          return res.json({ answer: answer.trim() });
        }
      } catch (geminiError) {
        console.error('[CHATBOT] Gemini API failed, using fallback:', geminiError.message);
      }
    }

    // Fallback to simple rule-based responses
    console.log('[CHATBOT] Using simple response');
    const answer = getSimpleResponse(question, stats);
    res.json({ answer });

  } catch (error) {
    console.error('[CHATBOT] Error:', error.message);
    
    res.status(500).json({ 
      error: 'Failed to process your question',
      answer: "I'm sorry, I encountered an error. Please try asking your question in a different way."
    });
  }
});

module.exports = router;
