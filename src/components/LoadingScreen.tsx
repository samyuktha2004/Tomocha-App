import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({ message = "Loading...", fullScreen = true }: LoadingScreenProps) {
  const containerClasses = fullScreen
    ? "min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-[#1a1625] dark:to-[#231d2e] flex items-center justify-center p-6"
    : "flex items-center justify-center p-12";

  return (
    <div className={containerClasses}>
      <div className="text-center animate-in fade-in duration-500">
        {/* Animated loading icon */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Outer circle */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-4 border-purple-200 dark:border-purple-700/30 animate-pulse"></div>
          
          {/* Inner spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-spin" />
          </div>
        </div>

        {/* Loading text */}
        <h3 className="text-purple-900 dark:text-purple-200 mb-2">
          {message}
        </h3>
        
        <p className="text-purple-600 dark:text-purple-400 text-sm">
          Just a moment... 💜
        </p>

        {/* Loading dots animation */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-2 h-2 rounded-full bg-purple-400 dark:bg-purple-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-purple-400 dark:bg-purple-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-purple-400 dark:bg-purple-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

// Inline loading component (for use within cards/sections)
export function InlineLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 p-8 text-purple-600 dark:text-purple-400">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">{message}</span>
    </div>
  );
}

// Mini loading spinner (for buttons, small areas)
export function MiniLoading() {
  return (
    <Loader2 className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" />
  );
}
