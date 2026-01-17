import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, Eye, Palette, Keyboard } from "lucide-react";
import { toast } from "sonner";

interface AccessibilitySettingsProps {
  onClose: () => void;
}

export interface AccessibilityPreferences {
  highContrastMode: boolean;
  reducedMotion: boolean;
  keyboardNavigationHelp: boolean;
}

export const getDefaultAccessibilityPreferences = (): AccessibilityPreferences => ({
  highContrastMode: false,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  keyboardNavigationHelp: false
});

export const getAccessibilityPreferences = (): AccessibilityPreferences => {
  const saved = localStorage.getItem('accessibilityPreferences');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Always check system preference for reduced motion
      const systemPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return {
        ...parsed,
        reducedMotion: parsed.reducedMotion || systemPrefersReducedMotion
      };
    } catch {
      return getDefaultAccessibilityPreferences();
    }
  }
  return getDefaultAccessibilityPreferences();
};

export const saveAccessibilityPreferences = (prefs: AccessibilityPreferences) => {
  localStorage.setItem('accessibilityPreferences', JSON.stringify(prefs));
  
  // Apply preferences to document
  if (prefs.highContrastMode) {
    document.documentElement.classList.add('high-contrast');
  } else {
    document.documentElement.classList.remove('high-contrast');
  }
  
  if (prefs.reducedMotion) {
    document.documentElement.classList.add('reduce-motion');
  } else {
    document.documentElement.classList.remove('reduce-motion');
  }
};

// Initialize accessibility preferences on app load
export const initAccessibilityPreferences = () => {
  const prefs = getAccessibilityPreferences();
  saveAccessibilityPreferences(prefs);
  
  // Listen for system preference changes
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', (e) => {
    const currentPrefs = getAccessibilityPreferences();
    currentPrefs.reducedMotion = e.matches;
    saveAccessibilityPreferences(currentPrefs);
    window.dispatchEvent(new CustomEvent('accessibilityPreferencesUpdated', { detail: currentPrefs }));
  });
};

export default function AccessibilitySettings({ onClose }: AccessibilitySettingsProps) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(getAccessibilityPreferences());
  const [systemPrefersReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const handleSave = () => {
    saveAccessibilityPreferences(preferences);
    toast.success('✨ Accessibility preferences saved!');
    
    // Dispatch event for components to listen
    window.dispatchEvent(new CustomEvent('accessibilityPreferencesUpdated', { detail: preferences }));
    
    onClose();
  };

  const handlePreferenceChange = <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    setPreferences({ ...preferences, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#2d2438] rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 px-6 py-6 relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close accessibility settings"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-white">Accessibility</h3>
              <p className="text-white/90">Enhanced viewing & navigation options</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* High Contrast Mode */}
          <div className="mb-6">
            <h4 className="text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              High Contrast Mode
            </h4>
            <p className="text-purple-600 dark:text-purple-400 text-sm mb-4">
              Enhanced contrast for users with visual processing difficulties or low vision
            </p>
            
            <button
              onClick={() => handlePreferenceChange('highContrastMode', !preferences.highContrastMode)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                preferences.highContrastMode
                  ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-400 dark:border-purple-500 shadow-md'
                  : 'bg-white dark:bg-[#1a1625] border-purple-200 dark:border-purple-700/30 hover:border-purple-300 dark:hover:border-purple-600/50'
              }`}
              aria-pressed={preferences.highContrastMode}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-purple-900 dark:text-purple-200 font-medium">
                      {preferences.highContrastMode ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm">
                    {preferences.highContrastMode 
                      ? '✓ Stronger borders, bolder text, higher color contrast' 
                      : 'Standard contrast with soft colors'}
                  </p>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.highContrastMode ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.highContrastMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </div>
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="mb-6">
            <h4 className="text-purple-900 dark:text-purple-200 mb-3">Motion Preferences</h4>
            <p className="text-purple-600 dark:text-purple-400 text-sm mb-4">
              Control animations and movement for comfort and focus
            </p>
            
            {systemPrefersReducedMotion && (
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-3 border-2 border-teal-200 dark:border-teal-700/30 mb-3">
                <p className="text-teal-800 dark:text-teal-300 text-sm">
                  ✓ Your system settings indicate a preference for reduced motion. This setting is automatically enabled.
                </p>
              </div>
            )}
            
            <button
              onClick={() => handlePreferenceChange('reducedMotion', !preferences.reducedMotion)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                preferences.reducedMotion
                  ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-400 dark:border-purple-500 shadow-md'
                  : 'bg-white dark:bg-[#1a1625] border-purple-200 dark:border-purple-700/30 hover:border-purple-300 dark:hover:border-purple-600/50'
              }`}
              aria-pressed={preferences.reducedMotion}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-purple-900 dark:text-purple-200 font-medium">
                      Reduce Motion
                    </span>
                  </div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm">
                    {preferences.reducedMotion 
                      ? '✓ Minimal animations, subtle color changes' 
                      : 'Full animations and transitions'}
                  </p>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.reducedMotion ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </div>
            </button>
          </div>

          {/* Keyboard Navigation Help */}
          <div className="mb-6">
            <h4 className="text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Keyboard Navigation
            </h4>
            <p className="text-purple-600 dark:text-purple-400 text-sm mb-4">
              Visual hints for keyboard-only navigation
            </p>
            
            <button
              onClick={() => handlePreferenceChange('keyboardNavigationHelp', !preferences.keyboardNavigationHelp)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                preferences.keyboardNavigationHelp
                  ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-400 dark:border-purple-500 shadow-md'
                  : 'bg-white dark:bg-[#1a1625] border-purple-200 dark:border-purple-700/30 hover:border-purple-300 dark:hover:border-purple-600/50'
              }`}
              aria-pressed={preferences.keyboardNavigationHelp}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-purple-900 dark:text-purple-200 font-medium">
                      Show Focus Indicators
                    </span>
                  </div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm">
                    {preferences.keyboardNavigationHelp 
                      ? '✓ Enhanced focus outlines for Tab navigation' 
                      : 'Standard focus indicators'}
                  </p>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.keyboardNavigationHelp ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.keyboardNavigationHelp ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </div>
            </button>
          </div>

          {/* Keyboard shortcuts guide */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border-2 border-indigo-200 dark:border-indigo-700/30">
            <h5 className="text-indigo-900 dark:text-indigo-200 mb-2 text-sm font-medium">
              ⌨️ Keyboard Shortcuts
            </h5>
            <ul className="text-indigo-800 dark:text-indigo-300 text-sm space-y-1">
              <li><strong>Tab:</strong> Navigate between interactive elements</li>
              <li><strong>Shift + Tab:</strong> Navigate backwards</li>
              <li><strong>Enter/Space:</strong> Activate buttons and links</li>
              <li><strong>Escape:</strong> Close dialogs and modals</li>
              <li><strong>Arrow Keys:</strong> Navigate within lists and menus</li>
            </ul>
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
