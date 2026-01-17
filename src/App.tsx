import { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import HomeScreen from './components/HomeScreen';
import ChatbotInterface from './components/ChatbotInterface';
import ChatbotSelector from './components/ChatbotSelector';
import SelfCareTracker from './components/SelfCareTracker';
import FanClubPage from './components/FanClubPage';
import AccountPage from './components/AccountPageNew';
import GardenScreen from './components/GardenScreen';
import XPShopScreen from './components/XPShopScreen';
import OnboardingTutorial from './components/OnboardingTutorial';
import JourneySelection from './components/JourneySelection';
import AdvancedFeaturesPrompt from './components/AdvancedFeaturesPrompt';
import AuthScreen from './components/AuthScreen';
import OfflineIndicator from './components/OfflineIndicator';
import ScreenReaderAnnouncer from './components/ScreenReaderAnnouncer';
import { ThemeProvider } from './components/ThemeContext';
import { Toaster } from './components/ui/sonner';
import { initNotificationSystem } from './utils/notificationService';
import { initAccessibilityPreferences } from './components/AccessibilitySettings';
import { setJourneyMode, getJourneyPreferences, setAdvancedFeaturesPromptSeen, hasSeenAdvancedFeaturesPrompt, type JourneyMode } from './utils/userJourney';
import teddyBearIcon from 'figma:asset/91fec4f9ee723ba1154def76a0261e8b2f36ec9b.png';
import sunIcon from 'figma:asset/8477b7615928e9707724f0741e3c792f5c6f1884.png';
import hotAirBalloonIcon from 'figma:asset/beb891181ee199ea6ff028acadbd43858e477e35.png';

type Screen = 'auth' | 'welcome' | 'home' | 'chatbot-selector' | 'chatbot-mental' | 'chatbot-motivation' | 'chatbot-selfcare' | 'tracker' | 'fanclub' | 'account' | 'garden' | 'xp-shop';

interface ChatbotConfig {
  name: string;
  color: string;
  icon: string;
}

const chatbotConfigs: Record<string, ChatbotConfig> = {
  'chatbot-mental': {
    name: 'Aura - Mental Health Support',
    color: 'bg-gradient-to-r from-purple-600 to-indigo-600',
    icon: hotAirBalloonIcon
  },
  'chatbot-motivation': {
    name: 'Spark - Motivational Support',
    color: 'bg-gradient-to-r from-[#f6339a] to-[#e60076]',
    icon: sunIcon
  },
  'chatbot-selfcare': {
    name: 'Zen - Self-Care Chatbot',
    color: 'bg-gradient-to-r from-teal-500 to-cyan-600',
    icon: teddyBearIcon
  }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    return isAuthenticated === 'true' ? 'welcome' : 'auth';
  });
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    return isAuthenticated === 'true' ? ['welcome'] : ['auth'];
  });
  const [newAITask, setNewAITask] = useState<any>(null);
  const [highlightTaskId, setHighlightTaskId] = useState<number | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    // Check if user has seen onboarding before and is authenticated
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    return isAuthenticated === 'true' && !hasSeenOnboarding;
  });
  const [showJourneySelection, setShowJourneySelection] = useState<boolean>(() => {
    // Show journey selection if user hasn't selected their mode yet
    const journeyPrefs = getJourneyPreferences();
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    return isAuthenticated === 'true' && hasSeenOnboarding === 'true' && !journeyPrefs.selectedTimestamp;
  });
  const [showAdvancedFeaturesPrompt, setShowAdvancedFeaturesPrompt] = useState<boolean>(false);
  const [selectedJourneyMode, setSelectedJourneyMode] = useState<JourneyMode | null>(null);

  // Initialize notification system on app load
  useEffect(() => {
    initNotificationSystem();
    initAccessibilityPreferences();
  }, []);

  // Handle authentication success
  const handleAuthSuccess = (user: any) => {
    console.log('User authenticated:', user);
    // Navigate to welcome screen
    setNavigationHistory(['welcome']);
    setCurrentScreen('welcome');
  };

  // Handle skip authentication (guest mode)
  const handleSkipAuth = () => {
    // Check if guest user needs to see onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    
    // Navigate to welcome screen
    setNavigationHistory(['welcome']);
    setCurrentScreen('welcome');
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const handleSkipOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const handleShowOnboarding = () => {
    setShowOnboarding(true);
  };

  const handleLogout = () => {
    // Clear all user-specific data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('tomochaUser');
    localStorage.removeItem('hasSeenOnboarding');
    
    // Reset app state to auth screen
    setCurrentScreen('auth');
    setNavigationHistory(['auth']);
    setShowOnboarding(false);
  };

  const handleGetStarted = () => {
    setNavigationHistory(prev => [...prev, 'home']);
    setCurrentScreen('home');
  };

  const handleNavigate = (screen: string, data?: any) => {
    const newScreen = screen as Screen;
    setNavigationHistory(prev => [...prev, newScreen]);
    setCurrentScreen(newScreen);
    
    // Handle AI task creation data
    if (data?.newTask) {
      setNewAITask(data.newTask);
    } else {
      setNewAITask(null);
    }
    
    // Handle task highlighting
    if (data?.highlightTaskId) {
      setHighlightTaskId(data.highlightTaskId);
    } else {
      setHighlightTaskId(null);
    }
  };

  const handleBack = () => {
    // Remove current screen from history
    const newHistory = [...navigationHistory];
    newHistory.pop(); // Remove current screen
    
    // Clear highlight when navigating back
    setHighlightTaskId(null);
    
    if (newHistory.length > 0) {
      const previousScreen = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentScreen(previousScreen);
    } else {
      // Fallback to home if history is empty
      setNavigationHistory(['home']);
      setCurrentScreen('home');
    }
  };

  const handleAdvancedFeaturesPromptSeen = () => {
    setAdvancedFeaturesPromptSeen();
    setShowAdvancedFeaturesPrompt(false);
  };

  return (
    <ThemeProvider>
      <div className="max-w-md mx-auto min-h-screen bg-white dark:bg-[#1a1625] shadow-2xl">
        {currentScreen === 'auth' && (
          <AuthScreen onAuthSuccess={handleAuthSuccess} onSkip={handleSkipAuth} />
        )}
        
        {currentScreen === 'welcome' && (
          <WelcomeScreen onGetStarted={handleGetStarted} />
        )}
        
        {currentScreen === 'home' && (
          <HomeScreen onNavigate={handleNavigate} />
        )}
        
        {currentScreen === 'chatbot-selector' && (
          <ChatbotSelector 
            onSelect={(chatbot) => {
              setNavigationHistory(prev => [...prev, chatbot as Screen]);
              setCurrentScreen(chatbot as Screen);
            }}
            onBack={handleBack}
            onNavigate={handleNavigate}
          />
        )}
        
        {(currentScreen === 'chatbot-mental' || 
          currentScreen === 'chatbot-motivation' || 
          currentScreen === 'chatbot-selfcare') && (
          <ChatbotInterface 
            onBack={handleBack}
            onNavigate={handleNavigate}
            botName={chatbotConfigs[currentScreen].name}
            botColor={chatbotConfigs[currentScreen].color}
            botIcon={chatbotConfigs[currentScreen].icon}
          />
        )}
        
        {currentScreen === 'tracker' && (
          <SelfCareTracker onBack={handleBack} onNavigate={handleNavigate} newAITask={newAITask} highlightTaskId={highlightTaskId} />
        )}
        
        {currentScreen === 'fanclub' && (
          <FanClubPage onBack={handleBack} onNavigate={handleNavigate} />
        )}
        
        {currentScreen === 'account' && (
          <AccountPage onBack={handleBack} onNavigate={handleNavigate} onShowTutorial={handleShowOnboarding} onLogout={handleLogout} />
        )}
        
        {currentScreen === 'garden' && (
          <GardenScreen onBack={handleBack} onNavigate={handleNavigate} />
        )}
        
        {currentScreen === 'xp-shop' && (
          <XPShopScreen onBack={handleBack} onNavigate={handleNavigate} />
        )}
        
        {showOnboarding && (
          <OnboardingTutorial 
            onComplete={handleCompleteOnboarding}
            onSkip={handleSkipOnboarding}
          />
        )}
        
        {showJourneySelection && (
          <JourneySelection 
            onComplete={(mode) => {
              setJourneyMode(mode);
              setSelectedJourneyMode(mode);
              setShowJourneySelection(false);
              
              // Show advanced features prompt if user hasn't seen it
              if (!hasSeenAdvancedFeaturesPrompt()) {
                setShowAdvancedFeaturesPrompt(true);
              }
            }}
          />
        )}
        
        {showAdvancedFeaturesPrompt && selectedJourneyMode && (
          <AdvancedFeaturesPrompt 
            journeyMode={selectedJourneyMode}
            onDecide={(enabled) => {
              setAdvancedFeaturesPromptSeen(enabled);
              setShowAdvancedFeaturesPrompt(false);
            }}
          />
        )}
        
        <OfflineIndicator />
        <Toaster position="top-center" />
        <ScreenReaderAnnouncer />
      </div>
    </ThemeProvider>
  );
}