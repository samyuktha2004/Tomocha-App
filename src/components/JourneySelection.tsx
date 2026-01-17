import { useState } from "react";
import { Button } from "./ui/button";
import { Sparkles, TrendingUp, Heart, Stars } from "lucide-react";

interface JourneySelectionProps {
  onComplete: (mode: 'motivation' | 'growth' | 'support' | 'all') => void;
}

const journeyOptions = [
  {
    mode: 'motivation' as const,
    icon: '💪',
    title: 'Daily Motivation & Inspiration',
    description: 'I want encouragement, goal tracking, and positive vibes',
    color: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-300 dark:border-amber-600',
    IconComponent: TrendingUp
  },
  {
    mode: 'growth' as const,
    icon: '🌱',
    title: 'Personal Growth & Wellness',
    description: "I'm working on building better habits and self-awareness",
    color: 'from-green-500 to-teal-500',
    borderColor: 'border-green-300 dark:border-green-600',
    IconComponent: Sparkles
  },
  {
    mode: 'support' as const,
    icon: '💜',
    title: 'Emotional Support & Well-being',
    description: "I'm navigating challenges and need extra support tools",
    color: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-300 dark:border-purple-600',
    IconComponent: Heart
  },
  {
    mode: 'all' as const,
    icon: '✨',
    title: 'All of the Above!',
    description: 'I want the full experience with all features unlocked',
    color: 'from-indigo-500 to-purple-500',
    borderColor: 'border-indigo-300 dark:border-indigo-600',
    IconComponent: Stars
  }
];

export default function JourneySelection({ onComplete }: JourneySelectionProps) {
  const [selectedMode, setSelectedMode] = useState<'motivation' | 'growth' | 'support' | 'all' | null>(null);

  const handleContinue = () => {
    if (selectedMode) {
      onComplete(selectedMode);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-[#1a1625] dark:to-[#231d2e] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full animate-in fade-in duration-500">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center border-4 border-purple-200 dark:border-purple-700/30">
            <span className="text-4xl">🌟</span>
          </div>
          
          <h2 className="text-purple-900 dark:text-purple-200 mb-3">
            Welcome to Tomocha!
          </h2>
          
          <p className="text-purple-600 dark:text-purple-400 mb-2">
            What brings you here today?
          </p>
          
          <p className="text-purple-500 dark:text-purple-500 text-sm">
            This helps us personalize your experience (you can change this anytime)
          </p>
        </div>

        {/* Journey Options */}
        <div className="space-y-4 mb-8">
          {journeyOptions.map((option) => {
            const Icon = option.IconComponent;
            const isSelected = selectedMode === option.mode;
            
            return (
              <button
                key={option.mode}
                onClick={() => setSelectedMode(option.mode)}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? `bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 ${option.borderColor} shadow-lg scale-[1.02]`
                    : 'bg-white dark:bg-[#2d2438] border-purple-200 dark:border-purple-700/30 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <span className="text-3xl">{option.icon}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-purple-900 dark:text-purple-200">
                        {option.title}
                      </h3>
                      {isSelected && (
                        <span className="text-purple-600 dark:text-purple-400">✓</span>
                      )}
                    </div>
                    <p className="text-purple-600 dark:text-purple-400 text-sm">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!selectedMode}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Continue to Tomocha
        </Button>

        {/* Info */}
        <div className="mt-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-4 border-2 border-teal-200 dark:border-teal-700/30">
          <p className="text-teal-800 dark:text-teal-300 text-sm text-center">
            💡 <strong>Don't worry!</strong> You can enable or disable any features later in Settings
          </p>
        </div>
      </div>
    </div>
  );
}
