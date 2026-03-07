import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/MongoAuthContext";
import { useNavigate } from "react-router-dom";

export default function TransactionAnalyzer() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const fileInput = useRef<HTMLInputElement>(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const isPDF = file.type === 'application/pdf';
    const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');

    if (!isPDF && !isCSV) {
      setError('Please upload a PDF or CSV file');
      return;
    }

    if (!token) {
      setError('Please sign in to upload statements');
      return;
    }
    
    setUploading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      // Use AI endpoint for PDF, simple endpoint for CSV
      const endpoint = isPDF ? '/api/upload-statement' : '/api/upload-csv-simple';
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }
      
      const data = await response.json();
      setResult(data);
      
      // Show success message and redirect after 3 seconds
      setTimeout(() => {
        navigate('/results');
      }, 3000);
      
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to process file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto space-y-8 pt-20">
          <Card className="shadow-xl border-0">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
              <p className="text-gray-600 mb-6">
                Please sign in to upload and analyze your bank statements
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Upload Bank Statement
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your bank statement (PDF or CSV) and AI will automatically extract and categorize all your transactions
          </p>
        </div>

        {/* Upload Section */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Upload Your Statement</CardTitle>
            <CardDescription>
              Supports PDF and CSV formats. PDF uses AI extraction, CSV uses smart categorization.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.csv"
                ref={fileInput}
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              
              <Button
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                <Upload className="mr-2 h-5 w-5" />
                {uploading ? "Processing..." : "Choose PDF or CSV File"}
              </Button>
              
              <p className="text-sm text-gray-500 mt-4">
                Supported formats: PDF, CSV (Max 10MB)
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900">Upload Failed</h4>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 text-lg mb-2">
                      Success! {result.count} Transactions Imported
                    </h4>
                    <p className="text-green-700 mb-4">
                      Your transactions have been automatically categorized and added to your expense tracker.
                    </p>
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Total Transactions:</span> {result.count}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Status:</span> All saved to your account
                      </p>
                    </div>
                    <p className="text-sm text-green-600 mt-4 font-medium">
                      Redirecting to Results page...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Processing Indicator */}
            {uploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Processing Your Statement...</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      {fileInput.current?.files?.[0]?.name.endsWith('.pdf') 
                        ? 'AI is extracting and categorizing transactions from PDF. This may take 30-60 seconds.'
                        : 'Processing CSV and categorizing transactions...'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold mb-2">Upload Statement</h4>
                <p className="text-sm text-gray-600">
                  Upload PDF (AI extraction) or CSV (smart categorization)
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold mb-2">AI Processing</h4>
                <p className="text-sm text-gray-600">
                  Gemini AI extracts and categorizes all transactions
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold mb-2">View Insights</h4>
                <p className="text-sm text-gray-600">
                  See your expenses in Dashboard, Results, and Insights
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supported Categories */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Automatic Categorization</CardTitle>
            <CardDescription>
              AI automatically categorizes your transactions into these categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Groceries', 'Other'].map((category) => (
                <span 
                  key={category}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {category}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
