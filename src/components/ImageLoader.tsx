import { useState } from "react";
import { Loader2, ImageOff } from "lucide-react";

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

export default function ImageLoader({ 
  src, 
  alt, 
  className = "", 
  fallbackIcon,
  onLoad,
  onError 
}: ImageLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
    if (onError) onError();
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-200 dark:border-purple-700/30 rounded-xl ${className}`}>
        <div className="text-center p-6">
          {fallbackIcon || (
            <>
              <ImageOff className="w-8 h-8 text-purple-400 dark:text-purple-600 mx-auto mb-2" />
              <p className="text-purple-600 dark:text-purple-400 text-xs">
                Image unavailable
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700/30 rounded-xl ${className}`}>
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-purple-400 dark:text-purple-600 mx-auto mb-2 animate-spin" />
            <p className="text-purple-600 dark:text-purple-400 text-xs">
              Loading...
            </p>
          </div>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}

// Avatar-specific image loader with friendly fallback
export function AvatarImageLoader({ 
  src, 
  alt, 
  className = "",
  fallbackEmoji = "💜" 
}: { 
  src: string; 
  alt: string; 
  className?: string;
  fallbackEmoji?: string;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-500 dark:from-purple-600 dark:to-purple-700 ${className}`}>
        <span className="text-4xl">{fallbackEmoji}</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-500 dark:from-purple-600 dark:to-purple-700 ${className}`}>
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
      />
    </div>
  );
}

// Pet/Garden image loader with friendly fallback
export function PetImageLoader({ 
  src, 
  alt, 
  className = "",
  fallbackEmoji = "🐾" 
}: { 
  src: string; 
  alt: string; 
  className?: string;
  fallbackEmoji?: string;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 border-2 border-green-200 dark:border-green-700/30 rounded-2xl ${className}`}>
        <div className="text-center p-4">
          <span className="text-5xl block mb-2">{fallbackEmoji}</span>
          <p className="text-green-700 dark:text-green-400 text-xs">
            Pet is shy! 💚
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 border-2 border-green-200 dark:border-green-700/30 rounded-2xl ${className}`}>
          <Loader2 className="w-8 h-8 text-green-600 dark:text-green-400 animate-spin" />
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
      />
    </div>
  );
}
