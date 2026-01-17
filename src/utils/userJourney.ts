// User journey mode management
export type JourneyMode = 'motivation' | 'growth' | 'support' | 'all';

export interface JourneyPreferences {
  mode: JourneyMode;
  medicalFeaturesEnabled: boolean;
  selectedTimestamp: string;
  hasSeenAdvancedFeaturesPrompt: boolean;
}

export const getDefaultJourneyPreferences = (): JourneyPreferences => ({
  mode: 'all',
  medicalFeaturesEnabled: false,
  selectedTimestamp: new Date().toISOString(),
  hasSeenAdvancedFeaturesPrompt: false
});

export const getJourneyPreferences = (): JourneyPreferences => {
  const saved = localStorage.getItem('journeyPreferences');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return getDefaultJourneyPreferences();
    }
  }
  return getDefaultJourneyPreferences();
};

export const saveJourneyPreferences = (prefs: JourneyPreferences) => {
  localStorage.setItem('journeyPreferences', JSON.stringify(prefs));
};

export const setJourneyMode = (mode: JourneyMode) => {
  const prefs = getJourneyPreferences();
  prefs.mode = mode;
  prefs.selectedTimestamp = new Date().toISOString();
  
  // Don't auto-enable/disable - let user decide via prompt
  saveJourneyPreferences(prefs);
};

export const setAdvancedFeaturesPromptSeen = (enabled: boolean) => {
  const prefs = getJourneyPreferences();
  prefs.hasSeenAdvancedFeaturesPrompt = true;
  prefs.medicalFeaturesEnabled = enabled;
  saveJourneyPreferences(prefs);
};

export const hasSeenAdvancedFeaturesPrompt = (): boolean => {
  const prefs = getJourneyPreferences();
  return prefs.hasSeenAdvancedFeaturesPrompt;
};

export const toggleMedicalFeatures = (enabled: boolean) => {
  const prefs = getJourneyPreferences();
  prefs.medicalFeaturesEnabled = enabled;
  saveJourneyPreferences(prefs);
};

export const isMedicalFeaturesEnabled = (): boolean => {
  const prefs = getJourneyPreferences();
  return prefs.medicalFeaturesEnabled;
};

// Feature visibility helpers
export const shouldShowMedicineReminders = (): boolean => {
  return isMedicalFeaturesEnabled();
};

export const shouldShowResetPlan = (): boolean => {
  // Always available but named differently based on mode
  return true;
};

export const shouldShowSupportBuddy = (): boolean => {
  return isMedicalFeaturesEnabled();
};

export const shouldShowSOSProminent = (): boolean => {
  const prefs = getJourneyPreferences();
  return prefs.mode === 'support' || prefs.mode === 'all';
};

// Get feature names based on mode
export const getFeatureNames = () => {
  const prefs = getJourneyPreferences();
  
  return {
    resetPlan: prefs.mode === 'support' ? 'Personal Reset Plan' : 'Wellness Safeguards',
    courageTracker: prefs.mode === 'motivation' ? 'Bold Moves' : prefs.mode === 'growth' ? 'Growth Challenges' : 'Courage Tracker',
    moodLog: prefs.mode === 'motivation' ? 'Vibe Check' : 'Mood Log',
    chatbotAura: prefs.mode === 'support' ? 'Aura - Thoughtful Companion' : 'Aura - Reflection Guide',
    sos: prefs.mode === 'support' ? 'Need Support Now' : 'Resources & Support'
  };
};

// Get default progress language based on mode
export const getDefaultProgressLanguage = (): 'xp' | 'moments' | 'steps' | 'points' => {
  const prefs = getJourneyPreferences();
  
  switch (prefs.mode) {
    case 'motivation':
      return 'xp';
    case 'growth':
      return 'steps';
    case 'support':
      return 'moments';
    case 'all':
    default:
      return 'xp';
  }
};