import { Button } from "./ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  onNavigateHome?: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary, onNavigateHome }: ErrorFallbackProps) {
  const handleRefresh = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-[#1a1625] dark:to-[#231d2e] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Friendly illustration */}
        <div className="text-center mb-8 animate-in zoom-in duration-500">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center border-4 border-purple-200 dark:border-purple-700/30">
            <div className="text-6xl">😅</div>
          </div>
          
          <h2 className="text-purple-900 dark:text-purple-200 mb-3">
            Oops! Something went sideways
          </h2>
          
          <p className="text-purple-600 dark:text-purple-400 mb-2">
            Don't worry - this happens sometimes! Your data is safe.
          </p>
          
          <p className="text-purple-500 dark:text-purple-500 text-sm">
            Take a deep breath, and let's try again 💜
          </p>
        </div>

        {/* Error details (optional, for debugging) */}
        {error && process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border-2 border-red-200 dark:border-red-700/30 mb-6">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-red-900 dark:text-red-200 font-medium text-sm mb-1">
                  Error Details (Dev Mode)
                </h4>
                <p className="text-red-700 dark:text-red-300 text-xs font-mono break-all">
                  {error.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleRefresh}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full border-2 border-purple-300 dark:border-purple-700/30 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Home
          </Button>
        </div>

        {/* Helpful tip */}
        <div className="mt-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-4 border-2 border-teal-200 dark:border-teal-700/30">
          <p className="text-teal-800 dark:text-teal-300 text-sm">
            💡 <strong>Still having trouble?</strong> Try clearing your browser cache or using a different browser. Your data is stored locally and won't be lost!
          </p>
        </div>
      </div>
    </div>
  );
}
