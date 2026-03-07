import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User, TrendingUp, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/MongoAuthContext";
import { useNavigate } from "react-router-dom";

interface ChatMessage {
  question: string;
  answer: string;
  timestamp: Date;
}

export default function FinancialChatbot() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [expenseStats, setExpenseStats] = useState<any>(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (token) {
      fetchExpenseStats();
    }
  }, [token]);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const fetchExpenseStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const expenses = response.data;
      
      // Calculate stats
      const total = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
      const byCategory = expenses.reduce((acc: any, e: any) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {});
      
      setExpenseStats({
        total,
        count: expenses.length,
        byCategory,
        expenses: expenses.slice(0, 10)
      });
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !token) return;

    setLoading(true);
    const userQuestion = question;
    setQuestion("");

    try {
      console.log('[CHATBOT] Sending question:', userQuestion);
      console.log('[CHATBOT] API URL:', `${API_URL}/chatbot/ask`);
      console.log('[CHATBOT] Token exists:', !!token);

      const response = await axios.post(
        `${API_URL}/chatbot/ask`,
        { question: userQuestion },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('[CHATBOT] Response received:', response.data);

      const newAnswer = response.data.answer;
      setChatHistory((prev) => [...prev, { 
        question: userQuestion, 
        answer: newAnswer,
        timestamp: new Date()
      }]);
    } catch (error: any) {
      console.error("[CHATBOT] Error:", error);
      console.error("[CHATBOT] Error response:", error.response?.data);
      console.error("[CHATBOT] Error status:", error.response?.status);
      
      let errorMessage = "I'm sorry, I couldn't process your question. ";
      
      if (error.response?.status === 401) {
        errorMessage += "Please sign in again.";
      } else if (error.response?.status === 500) {
        errorMessage += "There was a server error. Please try again.";
      } else if (error.response?.data?.answer) {
        errorMessage = error.response.data.answer;
      } else {
        errorMessage += "Please make sure you have some expenses added to your account.";
      }
      
      setChatHistory((prev) => [
        ...prev, 
        { 
          question: userQuestion, 
          answer: errorMessage,
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    setQuestion(q);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to chat with your AI financial advisor
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Stats */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Your Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {expenseStats ? (
                <>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{expenseStats.total.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Transactions</p>
                    <p className="text-2xl font-bold text-green-600">
                      {expenseStats.count}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Top Categories</h4>
                    <div className="space-y-2">
                      {Object.entries(expenseStats.byCategory)
                        .sort(([, a]: any, [, b]: any) => b - a)
                        .slice(0, 5)
                        .map(([category, amount]: any) => (
                          <div key={category} className="flex justify-between text-sm">
                            <span className="text-gray-600">{category}</span>
                            <span className="font-semibold">₹{amount.toFixed(0)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading your data...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Questions */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg">Quick Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "How can I reduce my spending?",
                "What's my biggest expense?",
                "Give me savings tips",
                "Analyze my spending pattern",
                "Should I create a budget?"
              ].map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full text-left justify-start text-sm"
                  onClick={() => handleQuickQuestion(q)}
                >
                  {q}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Chat */}
        <div className="lg:col-span-2">
          <Card className="shadow-2xl border-0 h-[85vh] flex flex-col">
            {/* Header */}
            <CardHeader className="border-b border-gray-200 bg-white rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    AI Financial Advisor
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Personalized insights based on your expenses
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
              {chatHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    Hi {user.fullName}! 👋
                  </h3>
                  <p className="text-gray-600 mb-6">
                    I'm your AI financial advisor. Ask me anything about your spending!
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 max-w-md mx-auto">
                    <h4 className="font-semibold text-blue-900 mb-3">I can help you with:</h4>
                    <ul className="text-sm text-blue-800 space-y-2 text-left">
                      <li>💰 Analyzing your spending patterns</li>
                      <li>📊 Identifying areas to save money</li>
                      <li>🎯 Setting financial goals</li>
                      <li>💡 Providing personalized tips</li>
                      <li>📈 Tracking your progress</li>
                    </ul>
                  </div>
                </div>
              ) : (
                chatHistory.map((chat, index) => (
                  <div key={index} className="space-y-4">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="flex items-start space-x-3 max-w-lg">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-md">
                          <p className="text-sm leading-relaxed">{chat.question}</p>
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3 max-w-lg">
                        <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm px-5 py-3 shadow-md">
                          <p className="text-sm leading-relaxed whitespace-pre-line">
                            {chat.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-3 shadow-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </CardContent>

            {/* Input Form */}
            <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
              <form onSubmit={handleSubmit} className="flex space-x-3">
                <Input
                  type="text"
                  className="flex-1 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                  placeholder="Ask me about your finances..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={loading}
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 px-6 rounded-lg"
                  disabled={loading || !question.trim()}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
