import { Button } from "./ui/button";
import Group from "../imports/Group2.tsx";

export default function WelcomeScreen({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 via-purple-50 to-white dark:from-[#2d2438] dark:via-[#1a1625] dark:to-[#231d2e] px-6">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        {/* Logo/Mascot */}
        <div className="w-32 h-32 mb-8">
          <Group />
        </div>
        
        {/* App Name */}
        <h1 className="text-purple-900 dark:text-purple-200 text-center mb-4">
          Tomocha
        </h1>
        
        {/* Welcome Message */}
        <p className="text-purple-700 dark:text-purple-300 text-center mb-12 px-4">
          Your companion for mental wellness, self-care, and positive growth
        </p>
        
        {/* Decorative Elements */}
        <div className="flex gap-3 mb-16">
          <div className="w-3 h-3 rounded-full bg-purple-400 dark:bg-purple-500 animate-pulse" style={{ animationDelay: "0s" }} />
          <div className="w-3 h-3 rounded-full bg-peach-400 dark:bg-peach-500 animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="w-3 h-3 rounded-full bg-teal-400 dark:bg-teal-500 animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
      
      {/* Get Started Button */}
      <div className="w-full max-w-md pb-8">
        <Button 
          onClick={onGetStarted}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 dark:from-purple-700 dark:to-purple-600 hover:from-purple-700 hover:to-purple-600 dark:hover:from-purple-800 dark:hover:to-purple-700 text-white py-6 rounded-2xl shadow-lg"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
