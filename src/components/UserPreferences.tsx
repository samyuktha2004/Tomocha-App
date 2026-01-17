import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X, Sparkles, Settings } from "lucide-react";
import { toast } from "sonner";

interface UserPreferencesProps {
  onClose: () => void;
  onPreferencesUpdate?: () => void;
}

export interface AppPreferences {
  progressLanguage: 'xp' | 'moments' | 'steps' | 'points' | 'custom';
  customProgressLabel?: string;
  enableAnimations: boolean;
  colorIntensity: 'vibrant' | 'soft' | 'minimal';
}

const progressLanguageOptions = [
  { 
    value: 'xp' as const, 
    label: 'XP (Experience Points)', 
    icon: '⚡',
    description: 'Gamified progress tracking'
  },
  { 
    value: 'moments' as const, 
    label: 'Self-Care Moments', 
    icon: '✨',
    description: 'Gentle, mindful language'
  },
  { 
    value: 'steps' as const, 
    label: 'Healing Steps', 
    icon: '🌱',
    description: 'Recovery-focused journey'
  },
  { 
    value: 'points' as const, 
    label: 'Wellness Points', 
    icon: '💚',
    description: 'Health-centered tracking'
  },
  { 
    value: 'custom' as const, 
    label: 'Custom Label', 
    icon: '✏️',
    description: 'Create your own progress term'
  }
];

const colorIntensityOptions = [
  {
    value: 'vibrant' as const,
    label: 'Vibrant',
    description: 'Bold, energizing colors',
    preview: 'from-purple-500 to-pink-500'
  },
  {
    value: 'soft' as const,
    label: 'Soft',
    description: 'Gentle, calming pastels',
    preview: 'from-purple-300 to-pink-300'
  },
  {
    value: 'minimal' as const,
    label: 'Minimal',
    description: 'Subtle, low-contrast',
    preview: 'from-purple-200 to-pink-200'
  }
];

export const getDefaultPreferences = (): AppPreferences => ({
  progressLanguage: 'xp',
  enableAnimations: true,
  colorIntensity: 'vibrant'
});

export const getUserPreferences = (): AppPreferences => {
  const saved = localStorage.getItem('userPreferences');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return getDefaultPreferences();
    }
  }
  return getDefaultPreferences();
};

export const saveUserPreferences = (prefs: AppPreferences) => {
  localStorage.setItem('userPreferences', JSON.stringify(prefs));
};

export const getProgressLabel = (prefs?: AppPreferences) => {
  const preferences = prefs || getUserPreferences();
  switch (preferences.progressLanguage) {
    case 'moments':
      return { singular: 'Moment', plural: 'Moments', icon: '✨' };
    case 'steps':
      return { singular: 'Step', plural: 'Steps', icon: '🌱' };
    case 'points':
      return { singular: 'Point', plural: 'Points', icon: '💚' };
    case 'xp':
    default:
      return { singular: 'XP', plural: 'XP', icon: '⚡' };
    case 'custom':
      return { singular: preferences.customProgressLabel || 'Custom', plural: preferences.customProgressLabel || 'Custom', icon: '✏️' };
  }
};

export default function UserPreferences({ onClose, onPreferencesUpdate }: UserPreferencesProps) {
  const [preferences, setPreferences] = useState<AppPreferences>(getUserPreferences());

  const handleSave = () => {
    saveUserPreferences(preferences);
    toast.success('✨ Preferences saved!');
    
    // Trigger app-wide refresh
    if (onPreferencesUpdate) {
      onPreferencesUpdate();
    }
    
    // Dispatch custom event for components to listen
    window.dispatchEvent(new CustomEvent('preferencesUpdated', { detail: preferences }));
    
    onClose();
  };

  const handlePreferenceChange = <K extends keyof AppPreferences>(
    key: K,
    value: AppPreferences[K]
  ) => {
    setPreferences({ ...preferences, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#2d2438] rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 px-6 py-6 relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close preferences"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-white">Your Preferences</h3>
              <p className="text-white/90">Personalize your experience</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Progress Language */}
          <div className="mb-8">
            <h4 className="text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Progress Language
            </h4>
            <p className="text-purple-600 dark:text-purple-400 text-sm mb-4">
              Choose the language that resonates most with your self-care journey
            </p>
            
            <div className="space-y-3">
              {progressLanguageOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePreferenceChange('progressLanguage', option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    preferences.progressLanguage === option.value
                      ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-400 dark:border-purple-500 shadow-md'
                      : 'bg-white dark:bg-[#1a1625] border-purple-200 dark:border-purple-700/30 hover:border-purple-300 dark:hover:border-purple-600/50'
                  }`}
                  aria-pressed={preferences.progressLanguage === option.value}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-purple-900 dark:text-purple-200 font-medium">
                          {option.label}
                        </span>
                        {preferences.progressLanguage === option.value && (
                          <span className="text-purple-600 dark:text-purple-400 text-sm">✓</span>
                        )}
                      </div>
                      <p className="text-purple-600 dark:text-purple-400 text-sm">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Progress Label Input */}
            {preferences.progressLanguage === 'custom' && (
              <div className="mt-4">
                <Input
                  value={preferences.customProgressLabel || ''}
                  onChange={(e) => handlePreferenceChange('customProgressLabel', e.target.value)}
                  placeholder="Enter your custom progress label"
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Animations */}
          <div className="mb-8">
            <h4 className="text-purple-900 dark:text-purple-200 mb-3">Visual Effects</h4>
            <p className="text-purple-600 dark:text-purple-400 text-sm mb-4">
              Control celebration animations and visual intensity
            </p>
            
            <button
              onClick={() => handlePreferenceChange('enableAnimations', !preferences.enableAnimations)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                preferences.enableAnimations
                  ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-400 dark:border-purple-500'
                  : 'bg-white dark:bg-[#1a1625] border-purple-200 dark:border-purple-700/30'
              }`}
              aria-pressed={preferences.enableAnimations}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-purple-900 dark:text-purple-200 font-medium">
                      Celebration Animations
                    </span>
                  </div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm">
                    {preferences.enableAnimations 
                      ? '✨ Enabled - Confetti and celebration effects' 
                      : '🔇 Disabled - Quiet, subtle celebrations'}
                  </p>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.enableAnimations ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.enableAnimations ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </div>
            </button>
          </div>

          {/* Color Intensity */}
          <div className="mb-6">
            <h4 className="text-purple-900 dark:text-purple-200 mb-3">Color Intensity</h4>
            <p className="text-purple-600 dark:text-purple-400 text-sm mb-4">
              Adjust color saturation for visual comfort
            </p>
            
            <div className="space-y-3">
              {colorIntensityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePreferenceChange('colorIntensity', option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    preferences.colorIntensity === option.value
                      ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-400 dark:border-purple-500 shadow-md'
                      : 'bg-white dark:bg-[#1a1625] border-purple-200 dark:border-purple-700/30 hover:border-purple-300 dark:hover:border-purple-600/50'
                  }`}
                  aria-pressed={preferences.colorIntensity === option.value}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.preview} flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-purple-900 dark:text-purple-200 font-medium">
                          {option.label}
                        </span>
                        {preferences.colorIntensity === option.value && (
                          <span className="text-purple-600 dark:text-purple-400 text-sm">✓</span>
                        )}
                      </div>
                      <p className="text-purple-600 dark:text-purple-400 text-sm">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4 border-2 border-teal-200 dark:border-teal-700/30">
            <p className="text-teal-800 dark:text-teal-300 text-sm">
              💡 <strong>Tip:</strong> These settings help make Tomocha work better for you, whether you prefer energizing gamification or gentle, calming language.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-purple-50 dark:bg-purple-900/20 border-t-2 border-purple-200 dark:border-purple-700/30 flex-shrink-0">
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
            >
              Save Preferences
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}