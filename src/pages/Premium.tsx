import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/MongoAuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Crown, Lock, TrendingUp, PieChart, Calendar, 
  Target, Zap, CheckCircle, AlertCircle, Sparkles 
} from "lucide-react";
import axios from "axios";

const Premium = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);

  const API_URL = '/api';

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const expenses = response.data;
      const total = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
      
      setStats({
        total,
        count: expenses.length
      });

      // Check if user is premium (for demo, always false)
      setIsPremium(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access premium features
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center space-x-2">
            <Crown className="h-12 w-12 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Premium Dashboard
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock advanced analytics, AI-powered insights, and exclusive features
          </p>
        </div>

        {/* Premium Status Banner */}
        {!isPremium && (
          <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-400 rounded-full p-3">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Upgrade to Premium</h3>
                    <p className="text-gray-600">Get unlimited access to all features for just ₹299/month</p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/pricing')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Premium Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Advanced Analytics */}
          <Card className={`${!isPremium ? 'opacity-60' : ''} relative overflow-hidden`}>
            {!isPremium && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                PRO
              </div>
            )}
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <CardTitle>Advanced Analytics</CardTitle>
              </div>
              <CardDescription>Deep dive into your spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Predictive spending forecasts</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Trend analysis & comparisons</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Custom date range reports</span>
                </div>
              </div>
              {!isPremium && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                  <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upgrade to unlock</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className={`${!isPremium ? 'opacity-60' : ''} relative overflow-hidden`}>
            {!isPremium && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                PRO
              </div>
            )}
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-blue-600" />
                <CardTitle>AI-Powered Insights</CardTitle>
              </div>
              <CardDescription>Smart recommendations just for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Personalized savings tips</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Anomaly detection alerts</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Budget optimization</span>
                </div>
              </div>
              {!isPremium && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                  <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upgrade to unlock</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget Planning */}
          <Card className={`${!isPremium ? 'opacity-60' : ''} relative overflow-hidden`}>
            {!isPremium && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                PRO
              </div>
            )}
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-green-600" />
                <CardTitle>Smart Budget Planning</CardTitle>
              </div>
              <CardDescription>Set and track financial goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Category-wise budgets</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Goal tracking & alerts</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Savings milestones</span>
                </div>
              </div>
              {!isPremium && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                  <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upgrade to unlock</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Export & Reports */}
          <Card className={`${!isPremium ? 'opacity-60' : ''} relative overflow-hidden`}>
            {!isPremium && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                PRO
              </div>
            )}
            <CardHeader>
              <div className="flex items-center space-x-2">
                <PieChart className="h-6 w-6 text-indigo-600" />
                <CardTitle>Export & Reports</CardTitle>
              </div>
              <CardDescription>Download detailed reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>PDF & Excel exports</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Monthly summary reports</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Tax-ready statements</span>
                </div>
              </div>
              {!isPremium && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                  <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upgrade to unlock</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recurring Expenses */}
          <Card className={`${!isPremium ? 'opacity-60' : ''} relative overflow-hidden`}>
            {!isPremium && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                PRO
              </div>
            )}
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-red-600" />
                <CardTitle>Recurring Expenses</CardTitle>
              </div>
              <CardDescription>Track subscriptions & bills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Auto-detect subscriptions</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Payment reminders</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Subscription optimization</span>
                </div>
              </div>
              {!isPremium && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                  <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upgrade to unlock</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Priority Support */}
          <Card className={`${!isPremium ? 'opacity-60' : ''} relative overflow-hidden`}>
            {!isPremium && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                PRO
              </div>
            )}
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-yellow-600" />
                <CardTitle>Priority Support</CardTitle>
              </div>
              <CardDescription>Get help when you need it</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>24/7 chat support</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Dedicated account manager</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Early access to features</span>
                </div>
              </div>
              {!isPremium && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                  <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upgrade to unlock</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        {!isPremium && (
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <CardContent className="p-12 text-center">
              <Crown className="h-16 w-16 text-yellow-300 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Ready to Upgrade?</h2>
              <p className="text-lg mb-8 opacity-90">
                Join thousands of users who are taking control of their finances with Premium
              </p>
              <Button 
                onClick={() => navigate('/pricing')}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-6 text-lg"
              >
                View Pricing Plans
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Premium;
