import { useState, useMemo, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Group from "../imports/Group2.tsx";
import ChatbotSelector from "./ChatbotSelector";
import BottomNav from "./BottomNav";
import SOSConfirmationDialog from "./SOSConfirmationDialog";
import { useTheme } from "./ThemeContext";
import { toast } from "sonner";
import { getUserFirstName, getProfileAvatar } from "../utils/userData";
import teddyBearIcon from 'figma:asset/91fec4f9ee723ba1154def76a0261e8b2f36ec9b.png';
import sunIcon from 'figma:asset/8477b7615928e9707724f0741e3c792f5c6f1884.png';
import hotAirBalloonIcon from 'figma:asset/beb891181ee199ea6ff028acadbd43858e477e35.png';

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const [moodValue, setMoodValue] = useState([50]);
  const [showChatbotSelector, setShowChatbotSelector] = useState(false);
  const [showSOSConfirmation, setShowSOSConfirmation] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  
  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  
  // Load profile avatar and user data from localStorage
  useEffect(() => {
    const savedAvatar = getProfileAvatar();
    if (savedAvatar) {
      setProfileAvatar(savedAvatar);
    }
    
    // Load user's first name dynamically
    const firstName = getUserFirstName();
    setUserName(firstName);
    
    // Load saved mood if it exists
    const savedMood = localStorage.getItem('dailyMood');
    if (savedMood) {
      setMoodValue([parseInt(savedMood)]);
    }
  }, []);
  
  // Save mood to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dailyMood', moodValue[0].toString());
  }, [moodValue]);
  
  const moodEmojis = ["😞", "😕", "😐", "🙂", "😊"];
  const currentMoodIndex = Math.floor((moodValue[0] / 100) * 4);

  // Get mood category text
  const getMoodCategory = (mood: number) => {
    if (mood <= 33) {
      return { category: "High Distress", emoji: "😞", color: "from-blue-400 to-blue-500" };
    } else if (mood <= 66) {
      return { category: "Neutral", emoji: "😐", color: "from-purple-400 to-purple-500" };
    } else {
      return { category: "High Energy", emoji: "😊", color: "from-green-400 to-emerald-500" };
    }
  };

  const currentMoodCategory = getMoodCategory(moodValue[0]);
  
  // Emotion tags for granular emotional awareness
  const emotionTags = useMemo(() => {
    const mood = moodValue[0];
    
    if (mood <= 33) {
      return [
        { emoji: '😰', label: 'Anxious' },
        { emoji: '😔', label: 'Sad' },
        { emoji: '😞', label: 'Lonely' },
        { emoji: '😫', label: 'Overwhelmed' },
        { emoji: '😣', label: 'Frustrated' },
        { emoji: '😖', label: 'Stressed' }
      ];
    } else if (mood <= 66) {
      return [
        { emoji: '😌', label: 'Calm' },
        { emoji: '🤔', label: 'Thoughtful' },
        { emoji: '😐', label: 'Neutral' },
        { emoji: '🙂', label: 'Content' },
        { emoji: '😊', label: 'Peaceful' },
        { emoji: '🤗', label: 'Grateful' }
      ];
    } else {
      return [
        { emoji: '😄', label: 'Happy' },
        { emoji: '✨', label: 'Hopeful' },
        { emoji: '🌟', label: 'Inspired' },
        { emoji: '💪', label: 'Motivated' },
        { emoji: '🎉', label: 'Excited' },
        { emoji: '🥰', label: 'Loved' }
      ];
    }
  }, [moodValue]);
  
  const toggleEmotion = (emotionLabel: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotionLabel) 
        ? prev.filter(e => e !== emotionLabel)
        : [...prev, emotionLabel]
    );
  };
  
  // Save emotions to localStorage
  useEffect(() => {
    if (selectedEmotions.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`emotions_${today}`, JSON.stringify(selectedEmotions));
    }
  }, [selectedEmotions]);
  
  // Load saved emotions for today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const savedEmotions = localStorage.getItem(`emotions_${today}`);
    if (savedEmotions) {
      setSelectedEmotions(JSON.parse(savedEmotions));
    }
  }, []);
  
  // Generate personalized tasks based on mood - matching actual tracker tasks
  const personalizedTasks = useMemo(() => {
    const mood = moodValue[0];
    
    if (mood <= 33) {
      // High Distress - gentle, supportive tasks (matching SelfCareTracker highDistressTasks)
      return [
        { id: 102, emoji: "🌬️", title: "Deep Breathing", description: "Breathe in for 4, hold for 4, out for 6" },
        { id: 106, emoji: "🎵", title: "Listen to Calming Music", description: "Put on soothing sounds or nature audio" },
        { id: 107, emoji: "☕", title: "Sip Warm Tea or Water", description: "Mindfully drink something warm" }
      ];
    } else if (mood <= 66) {
      // Neutral - balanced tasks (matching SelfCareTracker neutralTasks)
      return [
        { id: 203, emoji: "🌬️", title: "Breathing Exercise", description: "Box breathing for calm and focus" },
        { id: 202, emoji: "📝", title: "Gratitude Journal", description: "Write 3 things you're grateful for" },
        { id: 206, emoji: "🌳", title: "Nature Walk", description: "Connect with the outdoors" }
      ];
    } else {
      // High Energy - energizing, productive tasks (matching SelfCareTracker highEnergyTasks)
      return [
        { id: 305, emoji: "🏃‍♀️", title: "20-Minute Run or Jog", description: "Get your heart pumping with cardio" },
        { id: 306, emoji: "🎯", title: "Tackle a Challenging Goal", description: "Work on something you've been putting off" },
        { id: 308, emoji: "🎨", title: "Creative Project", description: "Paint, write, make music, or craft" }
      ];
    }
  }, [moodValue]);

  const handleChatbotSelect = (chatbot: string) => {
    setShowChatbotSelector(false);
    onNavigate(chatbot);
  };

  // Daily quote that changes based on day of year and user preference
  const dailyQuote = useMemo(() => {
    const quotes = {
      motivation: [
        { text: "Every small step forward is progress worth celebrating.", author: "Unknown" },
        { text: "You are stronger than you think, braver than you believe.", author: "A.A. Milne" },
        { text: "Your mental health is a priority, not a luxury.", author: "Unknown" },
        { text: "Progress, not perfection, is what we're after.", author: "Unknown" },
        { text: "Be gentle with yourself. You're doing the best you can.", author: "Unknown" },
        { text: "Small steps in the right direction can become the biggest leap of your life.", author: "Unknown" },
        { text: "Your journey is unique, and so is your timeline.", author: "Unknown" }
      ],
      calm: [
        { text: "In the midst of movement and chaos, keep stillness inside of you.", author: "Deepak Chopra" },
        { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
        { text: "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.", author: "Oprah Winfrey" },
        { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
        { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
        { text: "Calm mind brings inner strength and self-confidence.", author: "Dalai Lama" },
        { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" }
      ],
      growth: [
        { text: "Healing is not linear, and that's perfectly okay.", author: "Unknown" },
        { text: "You are allowed to be both a masterpiece and a work in progress.", author: "Sophia Bush" },
        { text: "Growth begins at the end of your comfort zone.", author: "Unknown" },
        { text: "Your story isn't over yet. Keep going.", author: "Unknown" },
        { text: "Difficult roads often lead to beautiful destinations.", author: "Unknown" },
        { text: "The only way out is through.", author: "Robert Frost" },
        { text: "You've survived 100% of your worst days. You're doing great.", author: "Unknown" }
      ]
    };

    // Simple preference selection - you could make this dynamic based on user settings
    const preferences = ['motivation', 'calm', 'growth'];
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const preferenceIndex = dayOfYear % preferences.length;
    const selectedCategory = preferences[preferenceIndex] as keyof typeof quotes;
    const categoryQuotes = quotes[selectedCategory];
    const quoteIndex = dayOfYear % categoryQuotes.length;
    
    return categoryQuotes[quoteIndex];
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-[#1a1625] dark:to-[#231d2e]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-100 to-purple-50 dark:from-[#3d2f52] dark:to-[#2d2438] px-6 pt-12 pb-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-purple-900 dark:text-purple-200">{getGreeting()}, {userName}!</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded-xl bg-purple-200/50 dark:bg-purple-900/30 hover:bg-purple-300 dark:hover:bg-purple-800/50 border-2 border-purple-300 dark:border-purple-700 transition-all hover:scale-105 active:scale-95" 
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              ) : (
                <Moon className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              )}
            </button>
            <button 
              onClick={() => onNavigate('account')} 
              className="cursor-pointer"
              aria-label="View account settings"
            >
              <Avatar className="w-12 h-12 border-2 border-purple-300 dark:border-purple-600">
                <AvatarImage src={profileAvatar} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-500">
                  <div className="w-8 h-8">
                    <Group />
                  </div>
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 pb-32 space-y-6">
        {/* Daily Quote */}
        <div className="bg-gradient-to-br from-gold-100 to-peach-100 dark:from-gold-200/10 dark:to-peach-200/10 rounded-3xl p-6 border-2 border-gold-200 dark:border-gold-300/20 shadow-md">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">💫</span>
            <div className="flex-1">
              <p className="text-purple-900 dark:text-purple-200 italic mb-2">"{dailyQuote.text}"</p>
              <p className="text-purple-600 dark:text-purple-300">— {dailyQuote.author}</p>
            </div>
          </div>
        </div>

        {/* Daily Check-in Card */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-500 dark:from-purple-900/80 dark:to-purple-800/70 rounded-3xl p-6 text-white shadow-lg border-2 border-purple-600 dark:border-purple-700/50">
          <h3 className="text-white mb-3">Your Daily Check-in</h3>
          <p className="text-[rgb(239,221,255)] dark:text-purple-300 mb-4">How are you feeling today?</p>
          
          <div className="flex justify-between mb-4 text-3xl">
            {moodEmojis.map((emoji, i) => (
              <span 
                key={i} 
                className={`transition-all ${i === currentMoodIndex ? 'scale-125' : 'opacity-50 scale-90'}`}
              >
                {emoji}
              </span>
            ))}
          </div>
          
          <Slider 
            value={moodValue} 
            onValueChange={setMoodValue}
            max={100}
            step={1}
            className="mb-2"
          />
          
          {/* Mood Category Indicator */}
          <div className="mt-3 mb-2 bg-white/10 rounded-2xl p-3 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentMoodCategory.emoji}</span>
                <div>
                  <p className="text-white/80 text-sm">You'll receive:</p>
                  <p className="text-white">{currentMoodCategory.category} Tasks</p>
                </div>
              </div>
              <div className="text-3xl opacity-50">
                {moodValue[0] <= 33 ? '🌸' : moodValue[0] <= 66 ? '✨' : '🚀'}
              </div>
            </div>
          </div>
          
          {/* Emotion Tags */}
          <div className="mt-4 mb-2">
            <p className="text-white/90 text-sm mb-3">What specific emotions are you feeling? (optional)</p>
            <div className="flex flex-wrap gap-2">
              {emotionTags.map((emotion) => (
                <button
                  key={emotion.label}
                  onClick={() => toggleEmotion(emotion.label)}
                  className={`px-3 py-2 rounded-full text-sm transition-all ${
                    selectedEmotions.includes(emotion.label)
                      ? 'bg-white text-purple-600 shadow-md scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                  }`}
                  aria-label={`Toggle ${emotion.label} emotion`}
                  aria-pressed={selectedEmotions.includes(emotion.label)}
                >
                  <span className="mr-1">{emotion.emoji}</span>
                  {emotion.label}
                </button>
              ))}
            </div>
            {selectedEmotions.length > 0 && (
              <p className="text-white/70 text-xs mt-3">
                ✨ Naming your emotions helps you understand and manage them better
              </p>
            )}
          </div>
          
          <Button 
            className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30"
            variant="outline"
            onClick={() => {
              // Save mood and trigger reset
              localStorage.setItem('dailyMood', moodValue[0].toString());
              localStorage.setItem('resetTasks', Date.now().toString()); // Trigger reset
              localStorage.setItem('completionStreak', '0'); // Reset streak
              
              const taskType = moodValue[0] <= 33 ? 'gentle, supportive' : moodValue[0] <= 66 ? 'balanced' : 'energizing, challenging';
              
              toast.success(`✨ Check-in saved! Loading ${taskType} tasks for you.`, {
                duration: 2500,
              });
              setTimeout(() => {
                onNavigate('tracker');
              }, 300);
            }}
          >
            Submit Check-in
          </Button>
        </div>

        {/* I Need Company Button */}
        <div className="bg-gradient-to-r from-coral-500 to-coral-400 dark:from-[#6b300c] dark:to-[#5a2809] rounded-3xl p-6 shadow-xl border-2 border-coral-600 dark:border-orange-600 hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]">
          <button 
            onClick={() => setShowSOSConfirmation(true)}
            className="w-full text-left"
            aria-label="I need 8 minutes of company - Connect with Aura for immediate support"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-white dark:bg-orange-500/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">🤝</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-1">I Need 8 Minutes of Company</h3>
                <p className="text-white/90 dark:text-white/85">Connect with Aura for support right now</p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white/20 dark:bg-orange-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Chatbot Cards */}
        <div>
          <h3 className="text-purple-900 dark:text-purple-200 mb-4">Your AI Companions</h3>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => onNavigate('chatbot-mental')}
              className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-900/70 dark:to-blue-800/60 rounded-2xl p-3 text-white shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-start min-h-[140px] border-2 border-blue-600 dark:border-blue-700/40"
              aria-label="Talk to Aura - Mental health support chatbot"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white/20 dark:bg-white/10 flex items-center justify-center flex-shrink-0 p-2 mb-3 mt-1">
                <img src={hotAirBalloonIcon} alt="Aura" className="w-full h-full object-contain" />
              </div>
              <span className="text-white text-center leading-snug text-xs px-1">Talk to Aura</span>
            </button>
            
            <button 
              onClick={() => onNavigate('chatbot-motivation')}
              className="bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-900/70 dark:to-pink-800/60 rounded-2xl p-3 text-white shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-start min-h-[140px] border-2 border-pink-600 dark:border-pink-700/40"
              aria-label="Boost Your Spirit - Motivational support chatbot"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white/20 dark:bg-white/10 flex items-center justify-center flex-shrink-0 p-2 mb-3 mt-1">
                <img src={sunIcon} alt="Spark" className="w-full h-full object-contain" />
              </div>
              <span className="text-white text-center leading-snug text-xs px-1">Boost Your Spirit</span>
            </button>
            
            <button 
              onClick={() => onNavigate('chatbot-selfcare')}
              className="bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-900/70 dark:to-teal-800/60 rounded-2xl p-3 text-white shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-start min-h-[140px] border-2 border-teal-600 dark:border-teal-700/40"
              aria-label="Cultivate Self-Care - Self-care guidance chatbot"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white/20 dark:bg-white/10 flex items-center justify-center flex-shrink-0 p-2 mb-3 mt-1">
                <img src={teddyBearIcon} alt="Zen" className="w-full h-full object-contain" />
              </div>
              <span className="text-white text-center leading-snug text-xs px-1">Cultivate Self-Care</span>
            </button>
          </div>
        </div>

        {/* Today's Focus Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-purple-900 dark:text-purple-200">Today's Focus</h3>
            <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
              {currentMoodCategory.category}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {personalizedTasks.map((task, index) => (
              <button
                key={index}
                onClick={() => onNavigate('tracker', { highlightTaskId: task.id })}
                aria-label={`${task.title} - ${task.description}`}
                className={`${
                  index === 0 
                    ? 'bg-gradient-to-br from-purple-200 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 border-2 border-purple-300 dark:border-purple-700/30 hover:from-purple-300 hover:to-purple-200 dark:hover:from-purple-800/40 dark:hover:to-purple-700/30'
                    : index === 1
                    ? 'bg-gradient-to-br from-peach-200 to-peach-100 dark:from-peach-300/10 dark:to-peach-200/5 border-2 border-peach-300 dark:border-peach-500/20 hover:from-peach-300 hover:to-peach-200 dark:hover:from-peach-300/20 dark:hover:to-peach-200/10'
                    : 'bg-gradient-to-br from-teal-200 to-teal-100 dark:from-teal-800/30 dark:to-teal-700/20 border-2 border-teal-300 dark:border-teal-700/30 hover:from-teal-300 hover:to-teal-200 dark:hover:from-teal-700/40 dark:hover:to-teal-600/30'
                } rounded-2xl p-4 flex flex-col items-start min-h-[110px] transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group`}
              >
                <div className="text-3xl mb-2 mt-1 group-hover:scale-110 transition-transform">{task.emoji}</div>
                <p className="text-purple-900 dark:text-purple-200 mb-1">{task.title}</p>
                <p className="text-purple-600 dark:text-purple-400 text-xs leading-snug">{task.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chatbot Selector Modal */}
      {showChatbotSelector && (
        <ChatbotSelector 
          onSelect={handleChatbotSelect}
          onClose={() => setShowChatbotSelector(false)}
        />
      )}

      {/* SOS Confirmation Dialog */}
      {showSOSConfirmation && (
        <SOSConfirmationDialog
          onConfirm={() => {
            setShowSOSConfirmation(false);
            // Set SOS flag in localStorage for Aura to detect
            localStorage.setItem('sosAlertSent', 'true');
            // Show toast notification
            toast.success('🚨 SOS Alert Sent! Your support circle has been notified.', {
              duration: 3000,
            });
            // Navigate to Aura chatbot
            setTimeout(() => {
              onNavigate('chatbot-mental');
            }, 500);
          }}
          onCancel={() => setShowSOSConfirmation(false)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav 
        currentPage="home"
        onNavigate={onNavigate}
        onChatClick={() => setShowChatbotSelector(true)}
        onSOSClick={() => setShowSOSConfirmation(true)}
      />
    </div>
  );
}