import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, User, Settings, Bell, Shield, Eye, BookOpen, LogOut, Sparkles, Activity } from 'lucide-react';
import BottomNav from './BottomNav';
import AvatarSelector from './AvatarSelector';
import MedicineManager from './MedicineManager';
import CopingStrategiesManager from './CopingStrategiesManager';
import NotificationSettings from './NotificationSettings';
import UserPreferences from './UserPreferences';
import SupportBuddy from './SupportBuddy';
import PrivacyData from './PrivacyData';
import AccessibilitySettings from './AccessibilitySettings';
import RelapsePreventionPlan from './RelapsePreventionPlan';
import MedicalFeaturesToggle from './MedicalFeaturesToggle';
import AccountSection, { CompactAccountSection } from './AccountSection';
import { toast } from 'sonner';
import { useTheme } from "./ThemeContext";
import { getUserData, saveUserData, isGuestUser } from '../utils/userData';
import { isMedicalFeaturesEnabled } from '../utils/userJourney';

interface AccountPageProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onShowTutorial?: () => void;
  onLogout?: () => void;
}

export default function AccountPage({ onBack, onNavigate, onShowTutorial, onLogout }: AccountPageProps) {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showMedicineManager, setShowMedicineManager] = useState(false);
  const [showCopingManager, setShowCopingManager] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserPreferences, setShowUserPreferences] = useState(false);
  const [showSupportBuddy, setShowSupportBuddy] = useState(false);
  const [showPrivacyData, setShowPrivacyData] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showResetPlan, setShowResetPlan] = useState(false);
  const [showMedicalToggle, setShowMedicalToggle] = useState(false);
  const [medicalFeaturesOn, setMedicalFeaturesOn] = useState(isMedicalFeaturesEnabled());

  const [userData, setUserData] = useState(getUserData());
  const { theme } = useTheme();

  useEffect(() => {
    const handleMedicalFeaturesUpdate = () => {
      setMedicalFeaturesOn(isMedicalFeaturesEnabled());
    };

    window.addEventListener('medicalFeaturesUpdated', handleMedicalFeaturesUpdate);
    return () => window.removeEventListener('medicalFeaturesUpdated', handleMedicalFeaturesUpdate);
  }, []);

  const handleAvatarUpdate = (newAvatar: string) => {
    const updated = { ...userData, avatar: newAvatar };
    saveUserData(updated);
    setUserData(updated);
    toast.success('✨ Avatar updated!');
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      toast.success('👋 See you soon!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-[#1a1625] dark:to-[#231d2e] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white px-6 py-8">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white hover:bg-white/20 mb-4 -ml-2"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAvatarSelector(true)}
            className="relative group"
            aria-label="Change avatar"
          >
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <User className="w-6 h-6 text-white" />
            </div>
          </button>

          <div>
            <h2 className="text-white mb-1">{userData.name}</h2>
            <p className="text-white/90 text-sm">{userData.email || 'Guest User'}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-4">
        {/* Profile & Preferences - Combined Settings */}
        <AccountSection
          icon={<Settings className="w-6 h-6 text-white" />}
          title="App Settings"
          description="Personalize your experience with custom progress language, animation preferences, color intensity, and accessibility options."
          color="from-purple-500 to-indigo-500"
          borderColor="border-purple-200 dark:border-purple-700/30"
          buttonLabel="Personalization"
          buttonIcon={<Sparkles className="w-5 h-5 mr-2" />}
          buttonColor="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          onButtonClick={() => setShowUserPreferences(true)}
        >
          <div className="space-y-2">
            <CompactAccountSection
              icon={<Eye className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
              title="Accessibility"
              buttonLabel="Open"
              buttonIcon={<Eye className="w-4 h-4" />}
              buttonColor="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
              borderColor="border-teal-200 dark:border-teal-700/30"
              onButtonClick={() => setShowAccessibility(true)}
            />
          </div>
        </AccountSection>

        {/* Notifications */}
        <AccountSection
          icon={<Bell className="w-6 h-6 text-white" />}
          title="Notifications"
          description="Manage reminder schedules, Do Not Disturb hours, and notification preferences for tasks, mood check-ins, and more."
          color="from-pink-500 to-rose-500"
          borderColor="border-pink-200 dark:border-pink-700/30"
          buttonLabel="Notification Settings"
          buttonIcon={<Bell className="w-5 h-5 mr-2" />}
          buttonColor="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          onButtonClick={() => setShowNotifications(true)}
        />

        {/* Wellness Tools */}
        <AccountSection
          icon={<Activity className="w-6 h-6 text-white" />}
          title="Wellness Tools"
          description="Manage your wellness practices, comfort strategies, and personal reset plan for staying on track."
          color="from-green-500 to-teal-500"
          borderColor="border-green-200 dark:border-green-700/30"
          buttonLabel="Manage Strategies"
          buttonIcon={<Activity className="w-5 h-5 mr-2" />}
          buttonColor="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
          onButtonClick={() => setShowCopingManager(true)}
        >
          <div className="space-y-2">
            <CompactAccountSection
              icon={<Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
              title="Personal Reset Plan"
              buttonLabel="Open"
              buttonIcon={<Shield className="w-4 h-4" />}
              buttonColor="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              borderColor="border-amber-200 dark:border-amber-700/30"
              onButtonClick={() => setShowResetPlan(true)}
            />
          </div>
        </AccountSection>

        {/* Enable/Disable Advanced Features - Always Visible */}
        <AccountSection
          icon={<Settings className="w-6 h-6 text-white" />}
          title="Advanced Support Features"
          description={medicalFeaturesOn 
            ? "Medicine reminders, support buddy, and reset plan are currently enabled. You can disable them anytime." 
            : "Optional tools like medicine reminders, support buddy, and personal reset plan. Enable them if you'd like extra support."}
          color="from-purple-500 to-pink-500"
          borderColor="border-purple-200 dark:border-purple-700/30"
          buttonLabel={medicalFeaturesOn ? "Manage Features" : "Enable Features"}
          buttonIcon={<Shield className="w-5 h-5 mr-2" />}
          buttonColor="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          onButtonClick={() => setShowMedicalToggle(true)}
        >
          {medicalFeaturesOn && (
            <div className="space-y-2">
              <CompactAccountSection
                icon={<Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                title="Medicine Reminders"
                buttonLabel="Open"
                buttonIcon={<Activity className="w-4 h-4" />}
                buttonColor="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                borderColor="border-indigo-200 dark:border-indigo-700/30"
                onButtonClick={() => setShowMedicineManager(true)}
              />
              <CompactAccountSection
                icon={<User className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                title="Support Buddy"
                buttonLabel="Open"
                buttonIcon={<User className="w-4 h-4" />}
                buttonColor="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                borderColor="border-blue-200 dark:border-blue-700/30"
                onButtonClick={() => setShowSupportBuddy(true)}
              />
            </div>
          )}
        </AccountSection>

        {/* Privacy & Data */}
        <AccountSection
          icon={<Shield className="w-6 h-6 text-white" />}
          title="Privacy & Your Data"
          description="See what we track locally, export your data, or delete everything with one click. Your data stays on your device."
          color="from-cyan-500 to-blue-500"
          borderColor="border-cyan-200 dark:border-cyan-700/30"
          buttonLabel="Privacy Settings"
          buttonIcon={<Shield className="w-5 h-5 mr-2" />}
          buttonColor="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          onButtonClick={() => setShowPrivacyData(true)}
        />

        {/* Tutorial */}
        {onShowTutorial && (
          <CompactAccountSection
            icon={<BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
            title="Show Tutorial Again"
            buttonLabel="Start"
            buttonIcon={<BookOpen className="w-4 h-4" />}
            buttonColor="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600"
            borderColor="border-teal-200 dark:border-teal-700/30"
            onButtonClick={onShowTutorial}
          />
        )}

        {/* Logout */}
        {!isGuestUser() && (
          <CompactAccountSection
            icon={<LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />}
            title="Log Out"
            buttonLabel="Log Out"
            buttonIcon={<LogOut className="w-4 h-4" />}
            buttonColor="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            borderColor="border-red-200 dark:border-red-700/30"
            onButtonClick={handleLogout}
          />
        )}
      </div>

      <BottomNav currentScreen="account" onNavigate={onNavigate} />

      {/* Modals */}
      {showAvatarSelector && (
        <AvatarSelector
          currentAvatar={userData.avatar}
          onSelect={handleAvatarUpdate}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
      {showMedicineManager && (
        <MedicineManager onClose={() => setShowMedicineManager(false)} />
      )}
      {showCopingManager && (
        <CopingStrategiesManager onClose={() => setShowCopingManager(false)} />
      )}
      {showNotifications && (
        <NotificationSettings onClose={() => setShowNotifications(false)} />
      )}
      {showUserPreferences && (
        <UserPreferences
          onClose={() => setShowUserPreferences(false)}
          onPreferencesUpdate={() => window.location.reload()}
        />
      )}
      {showSupportBuddy && (
        <SupportBuddy onClose={() => setShowSupportBuddy(false)} />
      )}
      {showPrivacyData && (
        <PrivacyData onClose={() => setShowPrivacyData(false)} />
      )}
      {showAccessibility && (
        <AccessibilitySettings onClose={() => setShowAccessibility(false)} />
      )}
      {showResetPlan && (
        <RelapsePreventionPlan onClose={() => setShowResetPlan(false)} />
      )}
      {showMedicalToggle && (
        <MedicalFeaturesToggle
          onClose={() => setShowMedicalToggle(false)}
          onUpdate={() => setMedicalFeaturesOn(isMedicalFeaturesEnabled())}
        />
      )}
    </div>
  );
}