import { useState, useEffect } from "react";
import { WifiOff, Wifi, Database } from "lucide-react";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showMessage && isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
      <div className={`px-4 py-3 rounded-full shadow-lg border-2 backdrop-blur-sm ${
        isOnline 
          ? 'bg-green-100/90 dark:bg-green-900/90 border-green-300 dark:border-green-700'
          : 'bg-amber-100/90 dark:bg-amber-900/90 border-amber-300 dark:border-amber-700'
      }`}>
        <div className="flex items-center gap-3">
          {isOnline ? (
            <>
              <Wifi className="w-5 h-5 text-green-700 dark:text-green-300" />
              <div className="flex items-center gap-2">
                <span className="text-green-900 dark:text-green-200 text-sm font-medium">
                  Back Online
                </span>
              </div>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-amber-700 dark:text-amber-300" />
              <div className="flex items-center gap-2">
                <span className="text-amber-900 dark:text-amber-200 text-sm font-medium">
                  Offline Mode
                </span>
                <span className="text-amber-700 dark:text-amber-400 text-xs">
                  • Your data is safe & synced locally
                </span>
              </div>
              <Database className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
