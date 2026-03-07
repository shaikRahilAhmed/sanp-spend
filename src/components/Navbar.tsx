
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/MongoAuthContext";
import { Menu, X, Home, Upload, PieChart, TrendingUp, MessageCircle, Crown, LogOut, DollarSign } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate("/auth?mode=login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="text-xl font-bold cursor-pointer flex items-center" 
            onClick={() => handleNavigation("/")}
          >
            <span className="text-blue-600">snap</span>Spend
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/")}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/expense-tracker")}
                >
                  Add Expense
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/analyzer")}
                >
                  Upload
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/results")}
                >
                  Results
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/insights")}
                >
                  Insights
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/chatbot")}
                  className="text-blue-600 hover:text-blue-700"
                >
                  💬 AI Advisor
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/premium")}
                  className="text-yellow-600 hover:text-yellow-700 font-semibold"
                >
                  👑 Premium
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/pricing")}
                >
                  Pricing
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/auth?mode=login")}
                >
                  Login
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate("/auth?mode=signup")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-lg font-bold">
                  <span className="text-blue-600">snap</span>Spend
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="p-4 bg-blue-50 border-b">
                  <p className="text-sm text-gray-600">Welcome back,</p>
                  <p className="font-semibold text-gray-900 truncate">{user.fullName}</p>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-4">
                {user ? (
                  <div className="space-y-1 px-2">
                    <button
                      onClick={() => handleNavigation("/")}
                      className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left"
                    >
                      <Home className="h-5 w-5 text-gray-600" />
                      <span>Dashboard</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavigation("/expense-tracker")}
                      className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left"
                    >
                      <DollarSign className="h-5 w-5 text-gray-600" />
                      <span>Add Expense</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavigation("/analyzer")}
                      className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left"
                    >
                      <Upload className="h-5 w-5 text-gray-600" />
                      <span>Upload Statement</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavigation("/results")}
                      className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left"
                    >
                      <PieChart className="h-5 w-5 text-gray-600" />
                      <span>Results</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavigation("/insights")}
                      className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left"
                    >
                      <TrendingUp className="h-5 w-5 text-gray-600" />
                      <span>Insights</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavigation("/chatbot")}
                      className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-blue-50 text-left text-blue-600"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-semibold">AI Advisor</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavigation("/premium")}
                      className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-yellow-50 text-left text-yellow-600"
                    >
                      <Crown className="h-5 w-5" />
                      <span className="font-semibold">Premium</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 px-2">
                    <button
                      onClick={() => handleNavigation("/pricing")}
                      className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left"
                    >
                      <Crown className="h-5 w-5 text-gray-600" />
                      <span>Pricing</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavigation("/auth?mode=login")}
                      className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100 text-left"
                    >
                      <span>Login</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavigation("/auth?mode=signup")}
                      className="w-full px-3 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-left font-semibold"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>

              {/* Sign Out Button */}
              {user && (
                <div className="p-4 border-t">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
