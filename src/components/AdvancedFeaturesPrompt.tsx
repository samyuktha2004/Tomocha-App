import { Button } from "./ui/button";
import { Shield, Pill, Users, Sparkles } from "lucide-react";

interface AdvancedFeaturesPromptProps {
  journeyMode: 'motivation' | 'growth' | 'support' | 'all';
  onDecide: (enabled: boolean) => void;
}

export default function AdvancedFeaturesPrompt({ journeyMode, onDecide }: AdvancedFeaturesPromptProps) {
  const getModeEmoji = () => {
    switch (journeyMode) {
      case 'motivation': return '💪';
      case 'growth': return '🌱';
      case 'support': return '💜';
      case 'all': return '✨';
    }
  };

  const getModeName = () => {
    switch (journeyMode) {
      case 'motivation': return 'Daily Motivation & Inspiration';
      case 'growth': return 'Personal Growth & Wellness';
      case 'support': return 'Emotional Support & Well-being';
      case 'all': return 'Full Experience';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-purple-50 to-white dark:from-[#1a1625] dark:to-[#231d2e] p-6 animate-in fade-in duration-300">
      <div className="max-w-lg w-full animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center border-4 border-purple-200 dark:border-purple-700/30">
            <span className="text-3xl">{getModeEmoji()}</span>
          </div>
          
          <h2 className="text-purple-900 dark:text-purple-200 mb-2">
            Journey Selected!
          </h2>
          
          <p className="text-purple-600 dark:text-purple-400 text-sm">
            {getModeName()}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-[#2d2438] rounded-3xl shadow-2xl border-2 border-purple-200 dark:border-purple-700/30 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-purple-900 dark:text-purple-200">
                Advanced Support Features
              </h3>
              <p className="text-purple-600 dark:text-purple-400 text-sm">
                Optional tools for extra support
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/30">
              <Pill className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-purple-900 dark:text-purple-200 font-medium text-sm">
                  Medicine Reminders
                </h4>
                <p className="text-purple-600 dark:text-purple-400 text-xs">
                  Track vitamins, supplements, or medications
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/30">
              <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-purple-900 dark:text-purple-200 font-medium text-sm">
                  Personal Reset Plan
                </h4>
                <p className="text-purple-600 dark:text-purple-400 text-xs">
                  Early warning signs for work stress or setbacks
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/30">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-purple-900 dark:text-purple-200 font-medium text-sm">
                  Support Buddy
                </h4>
                <p className="text-purple-600 dark:text-purple-400 text-xs">
                  Assign an accountability partner for check-ins
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-3 border border-teal-200 dark:border-teal-700/30">
            <p className="text-teal-800 dark:text-teal-300 text-xs text-center">
              💡 You can change this anytime in Settings
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => onDecide(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Yes, Enable Them
          </Button>

          <Button
            onClick={() => onDecide(false)}
            variant="outline"
            className="w-full border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            No Thanks, Maybe Later
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-purple-500 dark:text-purple-500 text-xs text-center mt-4">
          Almost there! One more quick question...
        </p>
      </div>
    </div>
  );
}
