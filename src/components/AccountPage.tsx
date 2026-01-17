import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { ArrowLeft, Save, Edit2, Camera, BookOpen, LogOut, Bell, BellOff, Pill, Heart, Settings, Shield, UserPlus, Eye, TrendingUp } from 'lucide-react';
import Group from '../imports/Group2.tsx';
import BottomNav from './BottomNav';
import ChatbotSelector from './ChatbotSelector';
import AvatarSelector from './AvatarSelector';
import MedicineManager from './MedicineManager';
import CopingStrategiesManager from './CopingStrategiesManager';
import NotificationSettings from './NotificationSettings';
import UserPreferences from './UserPreferences';
import SupportBuddy from './SupportBuddy';
import PrivacyData from './PrivacyData';
import AccessibilitySettings from './AccessibilitySettings';
import RelapsePreventionPlan from './RelapsePreventionPlan';
import CourageTracker from './CourageTracker';
import { toast } from 'sonner';
import { useTheme } from "./ThemeContext";
import { getUserData, saveUserData, isGuestUser, type UserData } from '../utils/userData';
import femaleAvatar from "figma:asset/1f21835aef261596edd4a071395aa54fec27f0ec.png";
import maleAvatar from "figma:asset/d45279d0d3190d4d628d3a08758f90d7d9e5d466.png";
import {
  getNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
  sendTestNotification,
  initNotificationSystem,
  areNotificationsSupported,
  getNotificationPermission,
  type NotificationSettings as NotificationSettingsType
} from '../utils/notificationService';

interface AccountPageProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onShowTutorial?: () => void;
  onLogout?: () => void;
}

export default function AccountPage({ onBack, onNavigate, onShowTutorial, onLogout }: AccountPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showChatbotSelector, setShowChatbotSelector] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showMedicineManager, setShowMedicineManager] = useState(false);
  const [showCopingStrategies, setShowCopingStrategies] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showUserPreferences, setShowUserPreferences] = useState(false);
  const [showSupportBuddy, setShowSupportBuddy] = useState(false);
  const [showPrivacyData, setShowPrivacyData] = useState(false);
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);
  const [showRelapsePreventionPlan, setShowRelapsePreventionPlan] = useState(false);
  const [showCourageTracker, setShowCourageTracker] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState<string>("");
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsType>(getNotificationSettings());
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(getNotificationPermission());
  
  const [formData, setFormData] = useState({
    // Personal Details  
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "prefer-not-to-say",
    
    // Health Data
    medicalConditions: "",
    medications: "",
    allergies: "",
    therapistName: "",
    therapistPhone: "",
    primaryCareProvider: "",
    
    // Emergency Contact
    emergencyName: "",
    emergencyRelationship: "",
    emergencyPhone: "",
    emergencyEmail: ""
  });

  // Load profile avatar and user data from localStorage on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('profileAvatar');
    if (savedAvatar) {
      setProfileAvatar(savedAvatar);
    }
    
    // Load user data from tomochaUser or individual fields
    const userData = getUserData();
    const savedFirstName = localStorage.getItem('userFirstName');
    
    // Build form data with placeholders
    const isGuest = isGuestUser();
    
    setFormData({
      // Personal Details
      firstName: savedFirstName || userData?.firstName || (isGuest ? "" : ""),
      lastName: userData?.lastName || (isGuest ? "" : ""),
      email: userData?.email || (isGuest ? "" : ""),
      phone: userData?.phone || "",
      dateOfBirth: userData?.dateOfBirth || "",
      gender: userData?.gender || "prefer-not-to-say",
      
      // Health Data
      medicalConditions: userData?.medicalConditions || "",
      medications: userData?.medications || "",
      allergies: userData?.allergies || "",
      therapistName: userData?.therapist?.name || "",
      therapistPhone: userData?.therapist?.phone || "",
      primaryCareProvider: userData?.primaryCareProvider || "",
      
      // Emergency Contact (take first one if exists)
      emergencyName: userData?.emergencyContacts?.[0]?.name || "",
      emergencyRelationship: userData?.emergencyContacts?.[0]?.relationship || "",
      emergencyPhone: userData?.emergencyContacts?.[0]?.phone || "",
      emergencyEmail: "" // Email not in original schema, leave empty
    });
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Auto-assign avatar based on gender selection
    if (field === 'gender' && !profileAvatar) {
      if (value === 'female') {
        setProfileAvatar(femaleAvatar);
        localStorage.setItem('profileAvatar', femaleAvatar);
      } else if (value === 'male') {
        setProfileAvatar(maleAvatar);
        localStorage.setItem('profileAvatar', maleAvatar);
      }
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save first name to localStorage for personalization
    localStorage.setItem('userFirstName', formData.firstName);
    toast.success("Profile updated successfully!");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChatbotSelect = (chatbot: string) => {
    setShowChatbotSelector(false);
    onNavigate(chatbot);
  };

  const handleChangePhoto = () => {
    setShowAvatarSelector(true);
  };

  const handleAvatarSelect = (avatar: string) => {
    setProfileAvatar(avatar);
    localStorage.setItem('profileAvatar', avatar);
    toast.success("Profile picture updated!");
  };

  const handleLogout = () => {
    // Clear authentication and all user data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('tomochaUser');
    localStorage.removeItem('hasSeenOnboarding');
    
    toast.success("Logged out successfully! See you soon! 💜", {
      duration: 2000
    });
    
    // Use callback if provided, otherwise reload
    if (onLogout) {
      setTimeout(() => {
        onLogout();
      }, 500);
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleNotificationPermissionChange = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotificationPermission('granted');
        // Enable notifications in settings
        const newSettings = { ...notificationSettings, enabled: true };
        setNotificationSettings(newSettings);
        saveNotificationSettings(newSettings);
        initNotificationSystem();
        toast.success("Notifications enabled! You'll receive daily reminders.");
      } else {
        setNotificationPermission('denied');
        toast.error("Notification permission denied. Please enable in browser settings.");
      }
    } else {
      const newSettings = { ...notificationSettings, enabled: false };
      setNotificationSettings(newSettings);
      saveNotificationSettings(newSettings);
      setNotificationPermission('denied');
      toast.info("Notifications disabled.");
    }
  };

  const handleNotificationSettingsChange = (field: keyof NotificationSettingsType, value: boolean | string) => {
    const newSettings = { ...notificationSettings, [field]: value };
    setNotificationSettings(newSettings);
    saveNotificationSettings(newSettings);
    toast.success("Notification settings updated!");
  };

  const handleSendTestNotification = () => {
    if (notificationPermission === 'granted') {
      sendTestNotification();
      toast.info("Test notification sent!");
    } else {
      toast.error("Please enable notifications first!");
    }
  };

  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-[#1a1625] dark:to-[#231d2e] pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-100 to-purple-50 dark:from-[#3d2f52] dark:to-[#2d2438] px-6 py-4 pt-12 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack} 
              className="hover:bg-purple-200 dark:hover:bg-purple-900/30"
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="w-6 h-6 text-purple-900 dark:text-purple-200" />
            </Button>
            <h2 className="text-purple-900 dark:text-purple-200">My Account</h2>
          </div>
          {!isEditing ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleEdit}
              className="hover:bg-purple-200 dark:hover:bg-purple-900/30"
              aria-label="Edit account information"
            >
              <Edit2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              onClick={handleSave}
              className="hover:bg-purple-200 dark:hover:bg-purple-900/30 text-purple-900 dark:text-purple-200"
              aria-label="Save account changes"
            >
              <Save className="w-5 h-5 mr-2" />
              Save
            </Button>
          )}
        </div>
      </div>

      {/* Profile Picture Section */}
      <div className="px-6 py-8 flex flex-col items-center">
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-purple-300 dark:border-purple-700">
            <AvatarImage src={profileAvatar} />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-500">
              <div className="w-24 h-24">
                <Group />
              </div>
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <button 
              onClick={handleChangePhoto}
              className="absolute bottom-0 right-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
              aria-label="Change profile picture"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
        <h3 className="text-purple-900 dark:text-purple-200 mt-4">{formData.firstName} {formData.lastName}</h3>
        <p className="text-purple-600 dark:text-purple-400">{formData.email}</p>
      </div>

      {/* Form Sections */}
      <div className="px-6 space-y-6">
        {/* Personal Details Section */}
        <div className="bg-white dark:bg-[#2d2438] rounded-2xl p-6 shadow-md border-2 border-purple-200 dark:border-purple-700/30">
          <h3 className="text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
            <span className="text-2xl">👤</span>
            Personal Details
          </h3>
          <Separator className="mb-4 bg-purple-200 dark:bg-purple-700/30" />
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-purple-700 dark:text-purple-300">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100 disabled:opacity-100 disabled:cursor-default"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-purple-700 dark:text-purple-300">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100 disabled:opacity-100 disabled:cursor-default"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-700 dark:text-purple-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100 disabled:opacity-100 disabled:cursor-default"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-purple-700 dark:text-purple-300">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100 disabled:opacity-100 disabled:cursor-default"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-purple-700 dark:text-purple-300">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                  className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100 disabled:opacity-100 disabled:cursor-default"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-purple-700 dark:text-purple-300">Gender</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => handleInputChange('gender', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="gender" className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Health Data Section */}
        <div className="bg-white dark:bg-[#2d2438] rounded-2xl p-6 shadow-md border-2 border-purple-200 dark:border-purple-700/30">
          <h3 className="text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            Health Information
          </h3>
          <Separator className="mb-4 bg-purple-200 dark:bg-purple-700/30" />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medicalConditions" className="text-purple-700 dark:text-purple-300">Medical Conditions</Label>
              <Textarea
                id="medicalConditions"
                value={formData.medicalConditions}
                onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                disabled={!isEditing}
                className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100 disabled:opacity-100 disabled:cursor-default min-h-20"
                placeholder="List any medical conditions..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medications" className="text-purple-700 dark:text-purple-300">Current Medications</Label>
              <Textarea
                id="medications"
                value={formData.medications}
                onChange={(e) => handleInputChange('medications', e.target.value)}
                disabled={!isEditing}
                className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100 disabled:opacity-100 disabled:cursor-default min-h-20"
                placeholder="List your medications and dosages..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies" className="text-purple-700 dark:text-purple-300">Allergies</Label>
              <Input
                id="allergies"
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                disabled={!isEditing}
                className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100 disabled:opacity-100 disabled:cursor-default"
                placeholder="List any allergies..."
              />
            </div>

            <Separator className="my-4 bg-purple-100 dark:bg-purple-800/30" />

            <div className="space-y-2">
              <Label htmlFor="therapistName" className="text-purple-700 dark:text-purple-300">Therapist Name</Label>
              <Input
                id="therapistName"
                value={formData.therapistName}
                onChange={(e) => handleInputChange('therapistName', e.target.value)}
                disabled={!isEditing}
                className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100 disabled:opacity-100 disabled:cursor-default"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="therapistPhone" className="text-purple-700 dark:text-purple-300">Therapist Phone</Label>
              <Input
                id="therapistPhone"
                type="tel"
                value={formData.therapistPhone}
                onChange={(e) => handleInputChange('therapistPhone', e.target.value)}
                disabled={!isEditing}
                className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100 disabled:opacity-100 disabled:cursor-default"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryCareProvider" className="text-purple-700 dark:text-purple-300">Primary Care Provider</Label>
              <Input
                id="primaryCareProvider"
                value={formData.primaryCareProvider}
                onChange={(e) => handleInputChange('primaryCareProvider', e.target.value)}
                disabled={!isEditing}
                className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100 disabled:opacity-100 disabled:cursor-default"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="bg-white dark:bg-[#2d2438] rounded-2xl p-6 shadow-md border-2 border-red-200 dark:border-red-700/30">
          <h3 className="text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
            <span className="text-2xl">🚨</span>
            Emergency Contact
          </h3>
          <Separator className="mb-4 bg-red-200 dark:bg-red-700/30" />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyName" className="text-purple-700 dark:text-purple-300">Contact Name</Label>
              <Input
                id="emergencyName"
                value={formData.emergencyName}
                onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                disabled={!isEditing}
                className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100 disabled:opacity-100 disabled:cursor-default"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyRelationship" className="text-purple-700 dark:text-purple-300">Relationship</Label>
              <Input
                id="emergencyRelationship"
                value={formData.emergencyRelationship}
                onChange={(e) => handleInputChange('emergencyRelationship', e.target.value)}
                disabled={!isEditing}
                className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100 disabled:opacity-100 disabled:cursor-default"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyPhone" className="text-purple-700 dark:text-purple-300">Phone Number</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                disabled={!isEditing}
                className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100 disabled:opacity-100 disabled:cursor-default"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyEmail" className="text-purple-700 dark:text-purple-300">Email</Label>
              <Input
                id="emergencyEmail"
                type="email"
                value={formData.emergencyEmail}
                onChange={(e) => handleInputChange('emergencyEmail', e.target.value)}
                disabled={!isEditing}
                className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100 disabled:opacity-100 disabled:cursor-default"
              />
            </div>
          </div>
        </div>
        
        {/* Coping Strategies Section */}
        <div className="bg-white dark:bg-[#2d2438] rounded-2xl p-6 shadow-md border-2 border-purple-200 dark:border-purple-700/30">
          <h3 className="text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Coping Strategies
          </h3>
          <Separator className="mb-4 bg-purple-200 dark:bg-purple-700/30" />
          
          <p className="text-purple-700 dark:text-purple-300 mb-4">
            Pre-write your personal coping strategies to have them ready during difficult moments.
          </p>
          
          <Button
            onClick={() => setShowCopingStrategies(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-md"
            aria-label="Manage coping strategies"
          >
            <Heart className="w-5 h-5 mr-2" />
            Manage Coping Strategies
          </Button>
        </div>
        
        {/* Advanced Notification Settings */}
        <div className="bg-white dark:bg-[#2d2438] rounded-2xl p-6 shadow-md border-2 border-purple-200 dark:border-purple-700/30">
          <h3 className="text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
            <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Advanced Notifications
          </h3>
          <Separator className="mb-4 bg-purple-200 dark:bg-purple-700/30" />
          
          <p className="text-purple-700 dark:text-purple-300 mb-4">
            Configure Do Not Disturb hours and smart scheduling to get reminders when you're most receptive.
          </p>
          
          <Button
            onClick={() => setShowNotificationSettings(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0 shadow-md"
            aria-label="Configure notification settings"
          >
            <Bell className="w-5 h-5 mr-2" />
            Configure Notifications
          </Button>
        </div>
        
        {/* Support Buddy */}
        <div className="bg-white dark:bg-[#2d2438] rounded-2xl p-6 shadow-md border-2 border-purple-200 dark:border-purple-700/30">
          <h3 className="text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Support Buddy
          </h3>
          <Separator className="mb-4 bg-purple-200 dark:bg-purple-700/30" />
          
          <p className="text-purple-700 dark:text-purple-300 mb-4">
            Add a trusted friend or family member who gets gentle wellness check alerts if you haven't checked in for 3+ days. No personal data is shared.
          </p>
          
          <Button
            onClick={() => setShowSupportBuddy(true)}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-md"
            aria-label="Manage support buddy"
          >
            <Heart className="w-5 h-5 mr-2" />
            Manage Support Buddy
          </Button>
        </div>
        
        {/* User Preferences */}
        <div className="bg-white dark:bg-[#2d2438] rounded-2xl p-6 shadow-md border-2 border-purple-200 dark:border-purple-700/30">
          <h3 className="text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
            <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Personalization
          </h3>
          <Separator className="mb-4 bg-purple-200 dark:bg-purple-700/30" />
          
          <p className="text-purple-700 dark:text-purple-300 mb-4">
            Customize progress language, animation preferences, and color intensity for your comfort.
          </p>
          
          <Button
            onClick={() => setShowUserPreferences(true)}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 shadow-md"
            aria-label="Open personalization settings"
          >
            <Settings className="w-5 h-5 mr-2" />
            Personalization Settings
          </Button>
        </div>
        
        {/* Privacy & Data */}
        <div className="bg-white dark:bg-[#2d2438] rounded-2xl p-6 shadow-md border-2 border-indigo-200 dark:border-indigo-700/30">
          <h3 className="text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Privacy & Your Data
          </h3>
          <Separator className="mb-4 bg-indigo-200 dark:bg-indigo-700/30" />
          
          <p className="text-purple-700 dark:text-purple-300 mb-4">
            See what we track (locally), what we never track, and manage your data with one-click export or deletion.
          </p>
          
          <Button
            onClick={() => setShowPrivacyData(true)}
            className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white border-0 shadow-md"
            aria-label="View privacy and data settings"
          >
            <Shield className="w-5 h-5 mr-2" />
            Privacy & Data Settings
          </Button>
        </div>

        {/* Accessibility Settings */}
        <div className="bg-white dark:bg-[#2d2438] rounded-2xl p-6 shadow-md border-2 border-teal-200 dark:border-teal-700/30">
          <h3 className="text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            Accessibility
          </h3>
          <Separator className="mb-4 bg-teal-200 dark:bg-teal-700/30" />
          
          <p className="text-purple-700 dark:text-purple-300 mb-4">
            High contrast mode, reduced motion, keyboard navigation, and screen reader support for an accessible experience.
          </p>
          
          <Button
            onClick={() => setShowAccessibilitySettings(true)}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 shadow-md"
            aria-label="Open accessibility settings"
          >
            <Eye className="w-5 h-5 mr-2" />
            Accessibility Settings
          </Button>
        </div>

        {/* Relapse Prevention Plan */}
        <div className="bg-white dark:bg-[#2d2438] rounded-2xl p-6 shadow-md border-2 border-amber-200 dark:border-amber-700/30">
          <h3 className="text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            Relapse Prevention
          </h3>
          <Separator className="mb-4 bg-amber-200 dark:bg-amber-700/30" />
          
          <p className="text-purple-700 dark:text-purple-300 mb-4">
            Identify early warning signs and create action steps. Especially valuable for depression, anxiety, and addiction recovery.
          </p>
          
          <Button
            onClick={() => setShowRelapsePreventionPlan(true)}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-md"
            aria-label="Open relapse prevention plan"
          >
            <Shield className="w-5 h-5 mr-2" />
            Manage Prevention Plan
          </Button>
        </div>

        {/* Courage Tracker */}
        <div className="bg-white dark:bg-[#2d2438] rounded-2xl p-6 shadow-md border-2 border-pink-200 dark:border-pink-700/30">
          <h3 className="text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            Courage Tracker
          </h3>
          <Separator className="mb-4 bg-pink-200 dark:bg-pink-700/30" />
          
          <p className="text-purple-700 dark:text-purple-300 mb-4">
            Track brave moments and create graduated challenges for anxiety exposure. Build confidence step by step.
          </p>
          
          <Button
            onClick={() => setShowCourageTracker(true)}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-md"
            aria-label="Open courage tracker"
          >
            <Heart className="w-5 h-5 mr-2" />
            Track Courage
          </Button>
        </div>

        {/* Tutorial Section */}
        {onShowTutorial && (
          <div className="bg-white dark:bg-[#2d2438] rounded-2xl p-6 shadow-md border-2 border-purple-200 dark:border-purple-700/30">
            <h3 className="text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              App Tutorial
            </h3>
            <Separator className="mb-4 bg-purple-200 dark:bg-purple-700/30" />
            
            <p className="text-purple-700 dark:text-purple-300 mb-4">
              Need a refresher on how Tomocha works? Replay the interactive tutorial to learn about mood tracking, XP, chatbots, and your garden!
            </p>
            
            <Button
              onClick={onShowTutorial}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-md"
              aria-label="Replay app tutorial"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Replay Tutorial
            </Button>
          </div>
        )}

        {/* Logout Section */}
        {onLogout && (
          <div className="bg-white dark:bg-[#2d2438] rounded-2xl p-6 shadow-md border-2 border-purple-200 dark:border-purple-700/30">
            <h3 className="text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
              <LogOut className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Account Actions
            </h3>
            <Separator className="mb-4 bg-purple-200 dark:bg-purple-700/30" />
            
            <p className="text-purple-700 dark:text-purple-300 mb-4">
              Need to sign out? You can log back in anytime with your email and password.
            </p>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-2 border-purple-300 dark:border-purple-700/30 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 shadow-sm"
              aria-label="Logout from your account"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        )}

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-300 dark:border-purple-700/30">
          <p className="text-purple-900 dark:text-purple-200 text-center">
            🔒 Your health data is encrypted and stored securely. We never share your personal information without your explicit consent.
          </p>
        </div>

        {/* Notification Settings */}
        {areNotificationsSupported() && (
          <div className="bg-white dark:bg-[#2d2438] rounded-2xl p-6 shadow-md border-2 border-purple-200 dark:border-purple-700/30">
            <h3 className="text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Notification Settings
            </h3>
            <Separator className="mb-4 bg-purple-200 dark:bg-purple-700/30" />
            
            <div className="space-y-6">
              {/* Master toggle */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-700/30">
                <div className="flex-1">
                  <Label className="text-purple-900 dark:text-purple-200">Enable Notifications</Label>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Allow Tomocha to send you reminders</p>
                </div>
                <Switch
                  checked={notificationSettings.enabled}
                  onCheckedChange={(checked) => handleNotificationPermissionChange(checked)}
                  aria-label="Enable or disable all notifications"
                />
              </div>

              {notificationSettings.enabled && (
                <>
                  {/* Daily Reminder */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-purple-700 dark:text-purple-300">💜 Daily Reminder</Label>
                        <p className="text-sm text-purple-600 dark:text-purple-400">Start your self-care journey each day</p>
                      </div>
                      <Switch
                        checked={notificationSettings.dailyReminder}
                        onCheckedChange={(checked) => handleNotificationSettingsChange('dailyReminder', checked)}
                        aria-label="Toggle daily reminder notifications"
                      />
                    </div>
                    {notificationSettings.dailyReminder && (
                      <div className="ml-4">
                        <Label htmlFor="dailyReminderTime" className="text-sm text-purple-600 dark:text-purple-400">Time</Label>
                        <Input
                          id="dailyReminderTime"
                          type="time"
                          value={notificationSettings.dailyReminderTime}
                          onChange={(e) => handleNotificationSettingsChange('dailyReminderTime', e.target.value)}
                          className="mt-1 border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100"
                          aria-label="Set time for daily reminder"
                        />
                      </div>
                    )}
                  </div>

                  {/* Mood Check-in */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-purple-700 dark:text-purple-300">😊 Mood Check-in</Label>
                        <p className="text-sm text-purple-600 dark:text-purple-400">Remind me to log how I'm feeling</p>
                      </div>
                      <Switch
                        checked={notificationSettings.moodCheckIn}
                        onCheckedChange={(checked) => handleNotificationSettingsChange('moodCheckIn', checked)}
                        aria-label="Toggle mood check-in notifications"
                      />
                    </div>
                    {notificationSettings.moodCheckIn && (
                      <div className="ml-4">
                        <Label htmlFor="moodCheckInTime" className="text-sm text-purple-600 dark:text-purple-400">Time</Label>
                        <Input
                          id="moodCheckInTime"
                          type="time"
                          value={notificationSettings.moodCheckInTime}
                          onChange={(e) => handleNotificationSettingsChange('moodCheckInTime', e.target.value)}
                          className="mt-1 border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100"
                          aria-label="Set time for mood check-in"
                        />
                      </div>
                    )}
                  </div>

                  {/* Task Reminders */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-purple-700 dark:text-purple-300">⭐ Task Reminders</Label>
                        <p className="text-sm text-purple-600 dark:text-purple-400">Don't forget your self-care tasks</p>
                      </div>
                      <Switch
                        checked={notificationSettings.taskReminders}
                        onCheckedChange={(checked) => handleNotificationSettingsChange('taskReminders', checked)}
                        aria-label="Toggle task reminder notifications"
                      />
                    </div>
                    {notificationSettings.taskReminders && (
                      <div className="ml-4">
                        <Label htmlFor="taskReminderTime" className="text-sm text-purple-600 dark:text-purple-400">Time</Label>
                        <Input
                          id="taskReminderTime"
                          type="time"
                          value={notificationSettings.taskReminderTime}
                          onChange={(e) => handleNotificationSettingsChange('taskReminderTime', e.target.value)}
                          className="mt-1 border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100"
                          aria-label="Set time for task reminders"
                        />
                      </div>
                    )}
                  </div>

                  {/* Medicine Reminders */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-purple-700 dark:text-purple-300">💊 Medicine Reminders</Label>
                        <p className="text-sm text-purple-600 dark:text-purple-400">Get reminders for your medications</p>
                      </div>
                      <Switch
                        checked={notificationSettings.medicineReminders}
                        onCheckedChange={(checked) => handleNotificationSettingsChange('medicineReminders', checked)}
                        aria-label="Toggle medicine reminder notifications"
                      />
                    </div>
                  </div>

                  <Separator className="bg-purple-200 dark:bg-purple-700/30" />

                  {/* Test notification button */}
                  <Button
                    onClick={handleSendTestNotification}
                    variant="outline"
                    className="w-full border-2 border-purple-300 dark:border-purple-700/30 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                    aria-label="Send test notification"
                  >
                    <Bell className="w-5 h-5 mr-2" />
                    Send Test Notification
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Medicine Manager */}
      {areNotificationsSupported() && notificationSettings.enabled && notificationSettings.medicineReminders && (
        <div className="px-6 pb-6">
          <div className="bg-white dark:bg-[#2d2438] rounded-2xl p-6 shadow-md border-2 border-purple-200 dark:border-purple-700/30">
            <MedicineManager />
          </div>
        </div>
      )}

      {/* Avatar Selector Modal */}
      {showAvatarSelector && (
        <AvatarSelector
          currentAvatar={profileAvatar}
          onSelect={handleAvatarSelect}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}

      {/* Chatbot Selector Modal */}
      {showChatbotSelector && (
        <ChatbotSelector 
          onSelect={handleChatbotSelect}
          onClose={() => setShowChatbotSelector(false)}
        />
      )}
      
      {/* Coping Strategies Manager Modal */}
      {showCopingStrategies && (
        <CopingStrategiesManager
          onClose={() => setShowCopingStrategies(false)}
        />
      )}
      
      {/* Notification Settings Modal */}
      {showNotificationSettings && (
        <NotificationSettings
          onClose={() => setShowNotificationSettings(false)}
        />
      )}

      {/* User Preferences Modal */}
      {showUserPreferences && (
        <UserPreferences
          onClose={() => setShowUserPreferences(false)}
        />
      )}
      
      {/* Support Buddy Modal */}
      {showSupportBuddy && (
        <SupportBuddy
          onClose={() => setShowSupportBuddy(false)}
        />
      )}
      
      {/* Privacy & Data Modal */}
      {showPrivacyData && (
        <PrivacyData
          onClose={() => setShowPrivacyData(false)}
        />
      )}

      {/* Accessibility Settings Modal */}
      {showAccessibilitySettings && (
        <AccessibilitySettings
          onClose={() => setShowAccessibilitySettings(false)}
        />
      )}

      {/* Relapse Prevention Plan Modal */}
      {showRelapsePreventionPlan && (
        <RelapsePreventionPlan
          onClose={() => setShowRelapsePreventionPlan(false)}
        />
      )}

      {/* Courage Tracker Modal */}
      {showCourageTracker && (
        <CourageTracker
          onClose={() => setShowCourageTracker(false)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav 
        currentPage="account"
        onNavigate={onNavigate}
        onChatClick={() => setShowChatbotSelector(true)}
      />
    </div>
  );
}