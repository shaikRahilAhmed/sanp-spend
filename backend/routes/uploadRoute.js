const express = require('express');
const multer = require('multer');
const csvParser = require('../utils/csvParser');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const Expense = require('../models/Expense');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Simple CSV Upload without AI (for testing)
router.post('/upload-csv-simple', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`[SIMPLE-UPLOAD] Processing file for user: ${req.userId}`);

    // Parse CSV
    const csvText = req.file.buffer.toString();
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return res.status(400).json({ error: 'CSV file is empty or invalid' });
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    console.log('[SIMPLE-UPLOAD] Headers:', headers);

    // Find column indices
    const dateIdx = headers.findIndex(h => h.includes('date'));
    const descIdx = headers.findIndex(h => h.includes('desc') || h.includes('title') || h.includes('narration'));
    const amountIdx = headers.findIndex(h => h.includes('amount') || h.includes('debit'));
    
    if (dateIdx === -1 || descIdx === -1 || amountIdx === -1) {
      return res.status(400).json({ 
        error: 'CSV must have Date, Description, and Amount columns',
        found: { date: dateIdx !== -1, description: descIdx !== -1, amount: amountIdx !== -1 }
      });
    }

    // Simple category mapping
    const categorizeTransaction = (description) => {
      const desc = description.toLowerCase();
      if (desc.includes('food') || desc.includes('restaurant') || desc.includes('cafe') || desc.includes('starbucks') || desc.includes('mcdonald')) return 'Food';
      if (desc.includes('uber') || desc.includes('ola') || desc.includes('taxi') || desc.includes('transport') || desc.includes('petrol')) return 'Travel';
      if (desc.includes('amazon') || desc.includes('flipkart') || desc.includes('shop') || desc.includes('mall')) return 'Shopping';
      if (desc.includes('bill') || desc.includes('electric') || desc.includes('water') || desc.includes('internet') || desc.includes('mobile')) return 'Bills';
      if (desc.includes('movie') || desc.includes('netflix') || desc.includes('spotify') || desc.includes('game')) return 'Entertainment';
      if (desc.includes('hospital') || desc.includes('doctor') || desc.includes('medical') || desc.includes('pharmacy')) return 'Health';
      if (desc.includes('grocery') || desc.includes('supermarket') || desc.includes('mart')) return 'Groceries';
      return 'Other';
    };

    // Parse transactions
    const savedExpenses = [];
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim());
        
        const dateStr = values[dateIdx];
        const description = values[descIdx];
        const amountStr = values[amountIdx];

        if (!dateStr || !description || !amountStr) continue;

        // Parse amount
        const amount = parseFloat(amountStr.replace(/[^0-9.-]/g, ''));
        if (isNaN(amount) || amount <= 0) continue;

        // Parse date
        let date;
        try {
          date = new Date(dateStr);
          if (isNaN(date.getTime())) {
            // Try DD-MM-YYYY format
            const parts = dateStr.split(/[-/]/);
            if (parts.length === 3) {
              date = new Date(parts[2], parts[1] - 1, parts[0]);
            }
          }
        } catch (e) {
          date = new Date();
        }

        const category = categorizeTransaction(description);

        const expense = new Expense({
          userId: req.userId,
          title: description,
          amount: amount,
          category: category,
          date: date
        });

        await expense.save();
        savedExpenses.push(expense);
        console.log(`[SIMPLE-UPLOAD] Saved: ${description} - ₹${amount} - ${category}`);
      } catch (err) {
        console.error('[SIMPLE-UPLOAD] Error parsing line:', err.message);
      }
    }

    console.log(`[SIMPLE-UPLOAD] Saved ${savedExpenses.length} expenses`);

    res.json({
      message: `Successfully imported ${savedExpenses.length} transactions`,
      count: savedExpenses.length,
      expenses: savedExpenses
    });

  } catch (error) {
    console.error('[SIMPLE-UPLOAD] Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to process CSV',
      details: error.message 
    });
  }
});

// Test Gemini API endpoint
router.get('/test-gemini', async (req, res) => {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not set in .env' });
    }

    console.log('[TEST] Testing Gemini API...');
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        contents: [{
          parts: [{ text: "Say 'Hello, API is working!'" }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    console.log('[TEST] Gemini response:', text);
    
    res.json({ 
      success: true, 
      message: 'Gemini API is working!',
      response: text 
    });
  } catch (error) {
    console.error('[TEST] Error:', error.message);
    if (error.response) {
      console.error('[TEST] Status:', error.response.status);
      console.error('[TEST] Data:', JSON.stringify(error.response.data));
    }
    res.status(500).json({ 
      error: 'Gemini API test failed',
      details: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
});

// CSV Upload (existing)
router.post('/upload', upload.single('csv'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer.toString();
    const parsedData = await csvParser(fileBuffer);
    res.json(parsedData);
  } catch (err) {
    console.error("Parsing error:", err);
    res.status(500).json({ error: "Error parsing CSV" });
  }
});

// PDF/CSV Upload with Gemini AI Categorization
router.post('/upload-statement', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileType = req.file.mimetype;
    let extractedText = '';

    console.log(`[UPLOAD] File type: ${fileType}, User: ${req.userId}`);

    // Extract text based on file type
    if (fileType === 'application/pdf') {
      // Parse PDF
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text;
      console.log(`[UPLOAD] Extracted ${extractedText.length} characters from PDF`);
    } else if (fileType === 'text/csv' || req.file.originalname.endsWith('.csv')) {
      // Parse CSV
      extractedText = req.file.buffer.toString();
      console.log(`[UPLOAD] Extracted ${extractedText.length} characters from CSV`);
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload PDF or CSV.' });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from file' });
    }

    // Use Gemini AI to extract and categorize transactions
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Limit text size to avoid API limits
    const textToAnalyze = extractedText.substring(0, 20000);

    const prompt = `You are a financial transaction analyzer. Extract ALL expense transactions from this bank statement.

IMPORTANT RULES:
1. Extract ONLY debit/expense transactions (money going OUT)
2. Ignore credit/deposit transactions (money coming IN)
3. Return ONLY valid JSON array, no markdown, no explanation
4. Each transaction must have: title, amount, category, date

Categories to use: Food, Travel, Shopping, Bills, Entertainment, Health, Groceries, Other

Return this exact JSON format:
[
  {
    "title": "Transaction description",
    "amount": 150.50,
    "category": "Food",
    "date": "2024-03-07"
  }
]

Bank Statement:
${textToAnalyze}`;

    console.log('[UPLOAD] Sending to Gemini API...');
    console.log('[UPLOAD] Text length:', textToAnalyze.length);

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        contents: [{ 
          parts: [{ text: prompt }] 
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 1,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      }
    );

    if (!geminiResponse.data || !geminiResponse.data.candidates) {
      console.error('[UPLOAD] Invalid Gemini response structure:', geminiResponse.data);
      return res.status(500).json({ error: 'Invalid response from AI service' });
    }

    const responseText = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    console.log('[UPLOAD] Gemini response received');
    console.log('[UPLOAD] Response preview:', responseText.substring(0, 300));

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = responseText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.substring(7);
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.substring(3);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.substring(0, jsonText.length - 3);
    }
    jsonText = jsonText.trim();

    let transactions;
    try {
      transactions = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('[UPLOAD] JSON parse error:', parseError.message);
      console.error('[UPLOAD] Attempted to parse:', jsonText.substring(0, 500));
      return res.status(500).json({ 
        error: 'Failed to parse AI response. The PDF might have complex formatting.',
        details: 'Try converting your PDF to CSV or use a simpler statement format.'
      });
    }

    console.log(`[UPLOAD] Parsed ${transactions.length} transactions`);

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ 
        error: 'No transactions found in the statement',
        hint: 'Make sure the PDF contains transaction details with dates, descriptions, and amounts.'
      });
    }

    // Save transactions to database
    const savedExpenses = [];
    for (const transaction of transactions) {
      try {
        const expense = new Expense({
          userId: req.userId,
          title: transaction.title || transaction.description || 'Unknown',
          amount: parseFloat(transaction.amount),
          category: transaction.category || 'Other',
          date: new Date(transaction.date)
        });
        await expense.save();
        savedExpenses.push(expense);
      } catch (err) {
        console.error('Error saving transaction:', err);
      }
    }

    console.log(`[UPLOAD] Saved ${savedExpenses.length} expenses for user ${req.userId}`);

    res.json({
      message: `Successfully imported ${savedExpenses.length} transactions`,
      count: savedExpenses.length,
      expenses: savedExpenses
    });

  } catch (error) {
    console.error('[UPLOAD] Error:', error.message);
    if (error.response) {
      console.error('[UPLOAD] API Response Status:', error.response.status);
      console.error('[UPLOAD] API Response Data:', JSON.stringify(error.response.data).substring(0, 500));
    }
    
    let errorMessage = 'Failed to process statement';
    
    if (error.response?.status === 400) {
      errorMessage = 'Invalid API request. Please check your Gemini API key.';
    } else if (error.response?.status === 403) {
      errorMessage = 'API key is invalid or expired. Please update your GEMINI_API_KEY in .env file.';
    } else if (error.response?.status === 404) {
      errorMessage = 'Gemini API model not found. Using correct model now.';
    } else if (error.message.includes('JSON')) {
      errorMessage = 'Error parsing AI response. The PDF might have complex formatting.';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. The file might be too large. Try a smaller file.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: error.message 
    });
  }
});

module.exports = router;
