import { useState, useEffect, useMemo, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import BottomNav from "./BottomNav";
import ChatbotSelector from "./ChatbotSelector";
import GardenScreen from "./GardenScreen";
import DataVisualization from "./DataVisualization";
import Group from "../imports/Group2.tsx";
import { getProfileAvatar } from "../utils/userData";
import { useTheme } from "./ThemeContext";
import { Sun, Moon, Sparkles, Star, CheckCircle2, Circle, Heart, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { getUserPreferences, getProgressLabel, type AppPreferences } from "./UserPreferences";

interface SelfCareTrackerProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  newAITask?: any;
  highlightTaskId?: number | null;
}

interface Task {
  id: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  xp: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  color: string;
  duration: string;
  isNew?: boolean;
  aiGenerated?: boolean;
}

export default function SelfCareTracker({ onBack, onNavigate, newAITask, highlightTaskId }: SelfCareTrackerProps) {
  const [showChatbotSelector, setShowChatbotSelector] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState<string>("");
  const [showDataViz, setShowDataViz] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [currentRatingTask, setCurrentRatingTask] = useState<Task | null>(null);
  const [taskRating, setTaskRating] = useState(0);
  const [userPrefs, setUserPrefs] = useState<AppPreferences>(getUserPreferences());
  
  // Listen for preference updates
  useEffect(() => {
    const handlePreferenceUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<AppPreferences>;
      setUserPrefs(customEvent.detail || getUserPreferences());
    };
    
    window.addEventListener('preferencesUpdated', handlePreferenceUpdate as EventListener);
    return () => {
      window.removeEventListener('preferencesUpdated', handlePreferenceUpdate as EventListener);
    };
  }, []);
  
  // Get progress label based on user preferences
  const progressLabel = getProgressLabel(userPrefs);

  // Load profile avatar from localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('profileAvatar');
    if (savedAvatar) {
      setProfileAvatar(savedAvatar);
    }
  }, []);
  
  // Get mood from localStorage (set by HomeScreen daily check-in)
  const [userMood, setUserMood] = useState<number>(() => {
    const savedMood = localStorage.getItem('dailyMood');
    return savedMood ? parseInt(savedMood) : 50; // Default to neutral
  });

  // Get completion streak
  const [completionStreak, setCompletionStreak] = useState(() => {
    const savedStreak = localStorage.getItem('completionStreak');
    return savedStreak ? parseInt(savedStreak) : 0;
  });

  // State for highlighting a specific task
  const [highlightedTaskId, setHighlightedTaskId] = useState<number | null>(null);
  const taskRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  // Define mood-specific task sets
  const highDistressTasks: Task[] = [
    { id: 101, title: "Grounding Exercise (5-4-3-2-1)", description: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste", icon: "🌿", completed: false, xp: 15, difficulty: 'Beginner', color: "from-teal-400 to-teal-500", duration: "5 min" },
    { id: 102, title: "Deep Breathing", description: "Breathe in for 4, hold for 4, out for 6. Repeat 5 times", icon: "🌬️", completed: false, xp: 10, difficulty: 'Beginner', color: "from-blue-400 to-blue-500", duration: "3 min" },
    { id: 103, title: "Self-Compassion Affirmation", description: "Say: 'I am doing my best, and that is enough'", icon: "💙", completed: false, xp: 10, difficulty: 'Beginner', color: "from-indigo-400 to-indigo-500", duration: "2 min" },
    { id: 104, title: "Safe Space Visualization", description: "Close your eyes and imagine your safest, most peaceful place", icon: "🏝️", completed: false, xp: 15, difficulty: 'Beginner', color: "from-cyan-400 to-cyan-500", duration: "7 min" },
    { id: 105, title: "Gentle Body Scan", description: "Lie down and slowly notice sensations from head to toe", icon: "🧘‍♀️", completed: false, xp: 15, difficulty: 'Intermediate', color: "from-purple-400 to-purple-500", duration: "10 min" },
    { id: 106, title: "Listen to Calming Music", description: "Put on soothing sounds or nature audio", icon: "🎵", completed: false, xp: 10, difficulty: 'Beginner', color: "from-violet-400 to-violet-500", duration: "10 min" },
    { id: 107, title: "Sip Warm Tea or Water", description: "Mindfully drink something warm and comforting", icon: "☕", completed: false, xp: 10, difficulty: 'Beginner', color: "from-amber-400 to-amber-500", duration: "5 min" },
    { id: 108, title: "Write Your Feelings", description: "Free-write without judgment for a few minutes", icon: "📝", completed: false, xp: 15, difficulty: 'Intermediate', color: "from-pink-400 to-pink-500", duration: "10 min" },
    { id: 109, title: "Gentle Neck Stretches", description: "Slowly roll your neck and shoulders", icon: "💆", completed: false, xp: 10, difficulty: 'Beginner', color: "from-rose-400 to-rose-500", duration: "5 min" },
    { id: 110, title: "Call or Text a Trusted Friend", description: "Reach out to someone who makes you feel safe", icon: "📞", completed: false, xp: 20, difficulty: 'Intermediate', color: "from-emerald-400 to-emerald-500", duration: "15 min" }
  ];

  const neutralTasks: Task[] = [
    { id: 201, title: "5-Minute Meditation", description: "Quick mindfulness to center yourself", icon: "🧘‍♀️", completed: false, xp: 10, difficulty: 'Beginner', color: "from-purple-400 to-purple-500", duration: "5 min" },
    { id: 202, title: "Gratitude Journal", description: "Write 3 things you're grateful for", icon: "📝", completed: false, xp: 10, difficulty: 'Beginner', color: "from-pink-400 to-pink-500", duration: "5 min" },
    { id: 203, title: "Breathing Exercise", description: "Box breathing for calm and focus", icon: "🌬️", completed: false, xp: 10, difficulty: 'Beginner', color: "from-teal-400 to-teal-500", duration: "3 min" },
    { id: 204, title: "Gentle Stretching", description: "Release tension with simple stretches", icon: "🤸‍♀️", completed: false, xp: 15, difficulty: 'Intermediate', color: "from-blue-400 to-blue-500", duration: "10 min" },
    { id: 205, title: "Mindful Meal", description: "Eat slowly and savor your food", icon: "🥗", completed: false, xp: 15, difficulty: 'Intermediate', color: "from-green-400 to-green-500", duration: "15 min" },
    { id: 206, title: "Nature Walk", description: "Connect with the outdoors", icon: "🌳", completed: false, xp: 20, difficulty: 'Intermediate', color: "from-emerald-400 to-emerald-500", duration: "20 min" },
    { id: 207, title: "Creative Expression", description: "Draw, write, or create something", icon: "🎨", completed: false, xp: 25, difficulty: 'Advanced', color: "from-orange-400 to-orange-500", duration: "30 min" },
    { id: 208, title: "Social Connection", description: "Have a meaningful conversation", icon: "💬", completed: false, xp: 25, difficulty: 'Advanced', color: "from-indigo-400 to-indigo-500", duration: "30 min" },
    { id: 209, title: "Evening Reflection", description: "Review your day with kindness", icon: "🌙", completed: false, xp: 20, difficulty: 'Intermediate', color: "from-violet-400 to-violet-500", duration: "10 min" },
    { id: 210, title: "Yoga Session", description: "Full body-mind practice", icon: "🧘", completed: false, xp: 30, difficulty: 'Advanced', color: "from-rose-400 to-rose-500", duration: "45 min" }
  ];

  const highEnergyTasks: Task[] = [
    { id: 301, title: "Quick Morning Stretch", description: "Wake up your body with simple stretches", icon: "🌅", completed: false, xp: 10, difficulty: 'Beginner', color: "from-amber-400 to-amber-500", duration: "5 min" },
    { id: 302, title: "Energizing Breathwork", description: "Practice quick energizing breathing techniques", icon: "🌬️", completed: false, xp: 10, difficulty: 'Beginner', color: "from-cyan-400 to-cyan-500", duration: "3 min" },
    { id: 303, title: "Victory Journal", description: "Write down 3 things you're excited to accomplish today", icon: "📓", completed: false, xp: 10, difficulty: 'Beginner', color: "from-yellow-400 to-yellow-500", duration: "5 min" },
    { id: 304, title: "Dance Party", description: "Move your body to your favorite upbeat songs", icon: "💃", completed: false, xp: 20, difficulty: 'Intermediate', color: "from-pink-400 to-pink-500", duration: "15 min" },
    { id: 305, title: "20-Minute Run or Jog", description: "Get your heart pumping with cardio", icon: "🏃‍♀️", completed: false, xp: 25, difficulty: 'Advanced', color: "from-red-400 to-red-500", duration: "20 min" },
    { id: 306, title: "Tackle a Challenging Goal", description: "Work on something you've been putting off", icon: "🎯", completed: false, xp: 30, difficulty: 'Advanced', color: "from-blue-500 to-blue-600", duration: "30 min" },
    { id: 307, title: "Social Activity", description: "Meet up with friends or join a group activity", icon: "👥", completed: false, xp: 25, difficulty: 'Intermediate', color: "from-purple-400 to-purple-500", duration: "60 min" },
    { id: 308, title: "Creative Project", description: "Paint, write, make music, or craft something", icon: "🎨", completed: false, xp: 25, difficulty: 'Intermediate', color: "from-rose-400 to-rose-500", duration: "30 min" },
    { id: 309, title: "Learn Something New", description: "Start a new skill, hobby, or online course", icon: "📚", completed: false, xp: 30, difficulty: 'Advanced', color: "from-indigo-500 to-indigo-600", duration: "30 min" },
    { id: 310, title: "Power Yoga Flow", description: "Energizing yoga sequence to build strength", icon: "🧘", completed: false, xp: 25, difficulty: 'Advanced', color: "from-teal-500 to-teal-600", duration: "30 min" }
  ];

  // Get mood category and select appropriate task set
  const getMoodBasedTasks = (mood: number): Task[] => {
    if (mood <= 33) {
      return highDistressTasks;
    } else if (mood <= 66) {
      return neutralTasks;
    } else {
      return highEnergyTasks;
    }
  };

  const [tasks, setTasks] = useState<Task[]>(() => {
    // Try to load saved tasks first
    const savedTasks = localStorage.getItem('selfCareTasks');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    // Otherwise load based on current mood
    const mood = parseInt(localStorage.getItem('dailyMood') || '50');
    return getMoodBasedTasks(mood);
  });

  // Default tasks to reset to (kept for backward compatibility)
  const defaultTasks: Task[] = neutralTasks;

  // Add new AI task if provided
  useEffect(() => {
    if (newAITask) {
      setTasks(prevTasks => {
        // Check if task already exists
        const exists = prevTasks.some(task => task.id === newAITask.id);
        if (!exists) {
          return [newAITask, ...prevTasks];
        }
        return prevTasks;
      });
    }
  }, [newAITask]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('selfCareTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handle highlighting and scrolling to a specific task
  useEffect(() => {
    if (highlightTaskId && tasks.length > 0) {
      // Try to find task by ID first
      let taskToHighlight = tasks.find(t => t.id === highlightTaskId);
      
      // If not found by ID, try to find by title (for cross-mood-set compatibility)
      if (!taskToHighlight) {
        // Get the task title from all possible task sets
        const allPossibleTasks = [...highDistressTasks, ...neutralTasks, ...highEnergyTasks];
        const referenceTask = allPossibleTasks.find(t => t.id === highlightTaskId);
        
        if (referenceTask) {
          // Find by matching title in current task set
          taskToHighlight = tasks.find(t => t.title === referenceTask.title);
        }
      }
      
      if (taskToHighlight) {
        setHighlightedTaskId(taskToHighlight.id);
        
        // Scroll to the task after a brief delay to ensure rendering is complete
        setTimeout(() => {
          const taskElement = taskRefs.current[taskToHighlight!.id];
          if (taskElement) {
            taskElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center'
            });
          }
        }, 300);
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
          setHighlightedTaskId(null);
        }, 3000);
      }
    }
  }, [highlightTaskId, tasks]);

  // Update mood from localStorage when component mounts or becomes visible
  useEffect(() => {
    // Read mood immediately when component mounts
    const savedMood = localStorage.getItem('dailyMood');
    if (savedMood) {
      setUserMood(parseInt(savedMood));
    }
    
    const handleStorageChange = () => {
      const savedMood = localStorage.getItem('dailyMood');
      if (savedMood) {
        setUserMood(parseInt(savedMood));
      }
    };
    
    // Also listen for visibility change (when user returns to this tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const savedMood = localStorage.getItem('dailyMood');
        if (savedMood) {
          setUserMood(parseInt(savedMood));
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Listen for task reset from mood check-in
  useEffect(() => {
    const checkForReset = () => {
      const resetTimestamp = localStorage.getItem('resetTasks');
      const lastResetCheck = localStorage.getItem('lastResetCheck');
      
      // If there's a reset timestamp and it's different from our last check
      if (resetTimestamp && resetTimestamp !== lastResetCheck) {
        // Get the current mood and load appropriate task set
        const savedMood = localStorage.getItem('dailyMood');
        const mood = savedMood ? parseInt(savedMood) : 50;
        
        // Load fresh mood-based tasks
        const freshTasks = getMoodBasedTasks(mood);
        setTasks(freshTasks);
        
        // Update the completion streak
        const newStreak = localStorage.getItem('completionStreak');
        if (newStreak) {
          setCompletionStreak(parseInt(newStreak));
        }
        
        // Update mood
        if (savedMood) {
          setUserMood(parseInt(savedMood));
        }
        
        // Mark this reset as processed
        localStorage.setItem('lastResetCheck', resetTimestamp);
      }
    };
    
    // Check on mount
    checkForReset();
    
    // Also check when component becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkForReset();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Calculate XP and progress
  const totalXP = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.xp, 0);
  const maxPossibleXP = tasks.reduce((sum, t) => sum + t.xp, 0); // Total XP from all tasks (180)
  const dailyGoalXP = maxPossibleXP; // Set goal to max possible XP
  const progress = Math.min((totalXP / dailyGoalXP) * 100, 100);

  // Save daily progress data for analytics
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const completedTasksCount = tasks.filter(t => t.completed).length;
    
    // Save today's data
    localStorage.setItem(`mood_${today}`, userMood.toString());
    localStorage.setItem(`xp_${today}`, totalXP.toString());
    localStorage.setItem(`tasks_${today}`, completedTasksCount.toString());
  }, [tasks, totalXP, userMood]);

  const toggleTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    // If completing task, show rating dialog
    if (!task.completed) {
      setCurrentRatingTask(task);
      setTaskRating(0);
      setShowRatingDialog(true);
      return;
    }
    
    // If uncompleting, just toggle
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(t => {
        if (t.id === id) {
          return { ...t, completed: !t.completed };
        }
        return t;
      });
      return updatedTasks;
    });
  };
  
  // Handle task rating submission
  const handleRatingSubmit = () => {
    if (!currentRatingTask) return;
    
    // Complete the task
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === currentRatingTask.id) {
          const newCompleted = true;
          // Update streak when completing a task
          const newStreak = completionStreak + 1;
          setCompletionStreak(newStreak);
          localStorage.setItem('completionStreak', newStreak.toString());
          return { ...task, completed: newCompleted };
        }
        return task;
      });
      return updatedTasks;
    });
    
    // Track task completion and rating
    const taskStats = JSON.parse(localStorage.getItem('taskEffectiveness') || '{}');
    const taskKey = currentRatingTask.title; // Use title as key for cross-mood tracking
    
    if (!taskStats[taskKey]) {
      taskStats[taskKey] = {
        completionCount: 0,
        totalRating: 0,
        ratings: []
      };
    }
    
    taskStats[taskKey].completionCount += 1;
    
    // Only track rating if user provided one (rating > 0)
    if (taskRating > 0) {
      taskStats[taskKey].totalRating += taskRating;
      taskStats[taskKey].ratings.push({
        rating: taskRating,
        date: new Date().toISOString()
      });
    }
    
    localStorage.setItem('taskEffectiveness', JSON.stringify(taskStats));
    
    // Show success message
    if (taskRating > 0) {
      toast.success(`✨ Task completed! Thanks for rating it ${taskRating}/5 stars.`);
    } else {
      toast.success(`✨ Task completed! +${currentRatingTask.xp} XP`);
    }
    
    setShowRatingDialog(false);
    setCurrentRatingTask(null);
    setTaskRating(0);
  };
  
  // Skip rating and just complete task
  const handleSkipRating = () => {
    handleRatingSubmit(); // Will complete without rating
  };
  
  // Get task recommendations based on completion frequency and ratings
  const getRecommendedTasks = useMemo(() => {
    const taskStats = JSON.parse(localStorage.getItem('taskEffectiveness') || '{}');
    
    // Get all available tasks across all mood sets
    const allTasks = [...highDistressTasks, ...neutralTasks, ...highEnergyTasks];
    
    // Calculate effectiveness score for each task
    const scoredTasks = allTasks
      .map(task => {
        const stats = taskStats[task.title];
        if (!stats || stats.completionCount === 0) return null;
        
        const avgRating = stats.ratings.length > 0 
          ? stats.totalRating / stats.ratings.length 
          : 3; // Default to neutral if no ratings
        
        // Effectiveness score: completion count * average rating
        const effectivenessScore = stats.completionCount * avgRating;
        
        return {
          task,
          completionCount: stats.completionCount,
          avgRating,
          effectivenessScore
        };
      })
      .filter(Boolean)
      .sort((a, b) => (b?.effectivenessScore || 0) - (a?.effectivenessScore || 0))
      .slice(0, 3); // Top 3 recommendations
    
    return scoredTasks as Array<{
      task: Task;
      completionCount: number;
      avgRating: number;
      effectivenessScore: number;
    }>;
  }, [tasks]);

  const handleChatbotSelect = (chatbot: string) => {
    setShowChatbotSelector(false);
    onNavigate(chatbot);
  };

  // Get mood-based message
  const getMoodMessage = () => {
    if (userMood <= 33) {
      return {
        title: "🌸 Gentle Care Today",
        message: "You're in High Distress mode. We've curated gentle, grounding tasks to help you feel safe and supported.",
        from: "— Aura",
        badge: "High Distress Tasks"
      };
    } else if (userMood <= 66) {
      return {
        title: "✨ Balanced Journey",
        message: "You're in Neutral mode. Here's a balanced mix of tasks to maintain your wellbeing and build momentum.",
        from: "— Zen",
        badge: "Neutral Tasks"
      };
    } else {
      return {
        title: "🚀 High Energy Flow",
        message: "You're in High Energy mode! Time for challenging activities that match your positive momentum.",
        from: "— Spark",
        badge: "High Energy Tasks"
      };
    }
  };

  const moodMessage = getMoodMessage();

  // Get difficulty badge style
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 border-2 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/30';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-700 border-2 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/30';
      case 'Advanced Challenge':
        return 'bg-purple-100 text-purple-700 border-2 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700/30';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const { theme } = useTheme();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white dark:from-[#1a1625] dark:via-[#231d2e] dark:to-[#231d2e] pb-32">
      {/* Header with XP Counter */}
      <div className="bg-gradient-to-r from-purple-100 to-purple-50 dark:from-[#3d2f52] dark:to-[#2d2438] px-6 py-6 pt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-purple-900 dark:text-purple-200">Self-Care Journey</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-purple-200/50 dark:bg-purple-900/30 backdrop-blur-sm rounded-full px-4 py-2 border-2 border-purple-300 dark:border-purple-600">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400" />
              <span className="text-purple-900 dark:text-purple-200">{totalXP} XP</span>
            </div>
            <button 
              onClick={() => onNavigate('account')} 
              className="cursor-pointer"
              aria-label="View account settings"
            >
              <Avatar className="w-10 h-10 border-2 border-purple-300 dark:border-purple-600">
                <AvatarImage src={profileAvatar} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-500">
                  <div className="w-6 h-6">
                    <Group />
                  </div>
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>

        {/* Daily Progress Bar */}
        <div className="bg-purple-200/50 dark:bg-purple-900/30 backdrop-blur-sm rounded-2xl p-4 border-2 border-purple-300 dark:border-purple-600">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-purple-900 dark:text-purple-200 mb-1">Daily Progress</h3>
              <p className="text-purple-600 dark:text-purple-400">Goal: {dailyGoalXP} XP</p>
            </div>
            <div className="text-right">
              <div className="text-purple-900 dark:text-purple-200">{totalXP} / {dailyGoalXP}</div>
              <div className="text-purple-600 dark:text-purple-400">{Math.round(progress)}%</div>
            </div>
          </div>
          <div className="bg-purple-300 dark:bg-purple-800/50 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-1"
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && (
                <Star className="w-3 h-3 text-white fill-white" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mood-based message */}
      <div className="px-6 pt-6">
        <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/20 rounded-2xl p-5 border-2 border-purple-200 dark:border-purple-700/30 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-purple-900 dark:text-purple-200">{moodMessage.title}</h3>
            <span className="hidden">
              {moodMessage.badge}
            </span>
          </div>
          <p className="text-purple-700 dark:text-purple-300 mb-1">{moodMessage.message}</p>
          <p className="text-purple-600 dark:text-purple-400 mb-2">{moodMessage.from}</p>
          
          {/* Mood indicator */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-purple-200 dark:border-purple-700/30">
            <span className="text-purple-600 dark:text-purple-400">Current Mood:</span>
            <span className="text-3xl">
              {(() => {
                const moodEmojis = ["😞", "😕", "😐", "🙂", "😊"];
                const currentMoodIndex = Math.floor((userMood / 100) * 4);
                return moodEmojis[currentMoodIndex];
              })()}
            </span>
          </div>
        </div>
      </div>

      {/* Data Visualization Section - Collapsible */}
      <div className="px-6 pt-4">
        <Collapsible open={showDataViz} onOpenChange={setShowDataViz}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full bg-white dark:bg-[#2d2438] border-2 border-purple-200 dark:border-purple-700/30 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-400 dark:hover:border-purple-600 transition-all rounded-2xl p-4 shadow-sm"
              aria-label={showDataViz ? "Hide data visualization charts" : "Show data visualization charts with mood trends, XP progress, and task completion"}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h3 className="text-purple-900 dark:text-purple-200 truncate">View Progress Analytics</h3>
                    <p className="text-purple-600 dark:text-purple-400 truncate">See charts & trends</p>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-2">
                  {showDataViz ? (
                    <ChevronUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 bg-white dark:bg-[#2d2438] rounded-2xl shadow-lg border-2 border-purple-200 dark:border-purple-700/30 overflow-hidden">
              <DataVisualization />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Tasks List */}
      <div className="px-6 py-6">
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <button
              key={task.id}
              ref={(el) => (taskRefs.current[task.id] = el)}
              onClick={() => toggleTask(task.id)}
              aria-label={`${task.completed ? 'Unmark' : 'Mark'} ${task.title} as ${task.completed ? 'incomplete' : 'complete'}. ${task.description}. ${task.difficulty} difficulty, ${task.xp} XP, ${task.duration}`}
              aria-pressed={task.completed}
              className={`w-full bg-white dark:bg-[#2d2438] rounded-2xl p-5 shadow-md hover:shadow-xl transition-all border-2 active:scale-[0.98] relative ${
                task.completed 
                  ? 'border-green-400 dark:border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' 
                  : task.isNew && task.aiGenerated
                  ? 'border-amber-400 dark:border-amber-600 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 ring-4 ring-amber-200 dark:ring-amber-600/30 animate-[pulse_2s_ease-in-out_3]'
                  : highlightedTaskId === task.id
                  ? 'border-purple-500 dark:border-purple-400 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 ring-4 ring-purple-300 dark:ring-purple-600/50 scale-[1.02] animate-[pulse_1s_ease-in-out_2]'
                  : 'border-purple-200 dark:border-purple-700/30 hover:border-purple-400 dark:hover:border-purple-600 hover:scale-[1.02]'
              }`}
            >
              {/* AI Badge for new tasks */}
              {task.isNew && task.aiGenerated && !task.completed && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-bounce">
                  <Sparkles className="w-3 h-3 fill-white" />
                  <span className="text-xs">NEW!</span>
                </div>
              )}
              
              <div className="flex items-start gap-4">
                {/* Completion Circle - Large and tappable */}
                <div className="flex-shrink-0 mt-1">
                  {task.completed ? (
                    <div className="relative">
                      <CheckCircle2 className="w-10 h-10 text-green-500 fill-green-500 drop-shadow-md" />
                      <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-30 animate-pulse"></div>
                    </div>
                  ) : (
                    <Circle className="w-10 h-10 text-purple-300 hover:text-purple-500 transition-colors" strokeWidth={2.5} />
                  )}
                </div>

                {/* Task Icon */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-white/20 dark:bg-white/10 border-2 border-white/30 flex items-center justify-center ${task.completed ? 'opacity-60' : ''}`}>
                  <span className="text-3xl">{task.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="flex items-start gap-2">
                    <h4 className={`flex-1 mb-1 ${task.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-purple-900 dark:text-purple-200'}`}>
                      {task.title}
                    </h4>
                    {task.aiGenerated && !task.completed && (
                      <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1 shrink-0">
                        <Sparkles className="w-3 h-3" />
                        AI
                      </span>
                    )}
                  </div>
                  <p className={`mb-2 ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-purple-600 dark:text-purple-300'}`}>
                    {task.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${getDifficultyBadge(task.difficulty)}`}>
                      {task.difficulty === 'Advanced Challenge' ? 'Advanced' : task.difficulty}
                    </span>
                    <span className="text-purple-500 dark:text-purple-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-purple-400 text-purple-400" />
                      +{task.xp} XP
                    </span>
                    <span className="text-purple-400 dark:text-purple-500">• {task.duration}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Encouragement based on progress */}
        {totalXP >= dailyGoalXP && (
          <div className="mt-6 bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:via-yellow-800/10 dark:to-yellow-900/20 rounded-2xl p-6 border-2 border-yellow-300 dark:border-yellow-700/30 shadow-lg">
            <div className="text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-yellow-900 dark:text-yellow-200 mb-2">Daily Goal Achieved!</h3>
              <p className="text-yellow-800 dark:text-yellow-300">
                Amazing work! You've completed your daily self-care goal. Keep going or rest—you deserve it!
              </p>
            </div>
          </div>
        )}

        {totalXP < dailyGoalXP && totalXP > 0 && (
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-5 border-2 border-purple-200 dark:border-purple-700/30 text-center">
            <p className="text-purple-700 dark:text-purple-300">
              <span className="text-purple-900 dark:text-purple-200">Keep going! </span>
              You're {dailyGoalXP - totalXP} XP away from your daily goal 💪
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        currentPage="tracker"
        onNavigate={onNavigate}
        onChatClick={() => setShowChatbotSelector(true)}
      />

      {/* Chatbot Selector Modal */}
      {showChatbotSelector && (
        <ChatbotSelector 
          onSelect={handleChatbotSelect}
          onClose={() => setShowChatbotSelector(false)}
        />
      )}

      {/* Floating Action Button - My Growing Garden */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-50">
        <div className="w-full max-w-md relative">
          <button
            onClick={() => onNavigate('garden')}
            className="absolute bottom-28 right-4 md:right-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-xl transition-all hover:scale-110 active:scale-95 p-3 md:p-4 flex items-center gap-2 md:gap-3 border-2 border-white group pointer-events-auto"
            aria-label="View My Growing Garden - See your unlocked pets and progress"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 md:w-6 md:h-6 fill-white group-hover:animate-pulse" />
            </div>
            <span className="pr-1 md:pr-2 text-sm md:text-base whitespace-nowrap">My Growing Garden!</span>
          </button>
        </div>
      </div>
      
      {/* Task Rating Dialog */}
      {showRatingDialog && currentRatingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#2d2438] rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 px-6 py-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-3xl">{currentRatingTask.icon}</span>
                </div>
                <div>
                  <h3 className="text-white">Task Complete!</h3>
                  <p className="text-white/90">{currentRatingTask.title}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-purple-900 dark:text-purple-200 mb-4 text-center">
                  How helpful was this task for you?
                </p>
                
                <div className="flex justify-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setTaskRating(rating)}
                      className={`transition-all ${
                        taskRating >= rating
                          ? 'text-yellow-400 scale-125'
                          : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300 hover:scale-110'
                      }`}
                      aria-label={`Rate ${rating} stars`}
                    >
                      <Star className={`w-10 h-10 ${taskRating >= rating ? 'fill-yellow-400' : ''}`} />
                    </button>
                  ))}
                </div>
                
                <p className="text-center text-purple-600 dark:text-purple-400 text-sm">
                  {taskRating === 0 && 'Optional - helps us personalize your experience'}
                  {taskRating === 1 && 'Not very helpful'}
                  {taskRating === 2 && 'Slightly helpful'}
                  {taskRating === 3 && 'Moderately helpful'}
                  {taskRating === 4 && 'Very helpful'}
                  {taskRating === 5 && 'Extremely helpful!'}
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700/30 mb-6">
                <p className="text-purple-800 dark:text-purple-300 text-sm">
                  💡 Your ratings help us recommend the most effective tasks for you in the future.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleRatingSubmit}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full py-6 shadow-lg"
                >
                  {taskRating > 0 ? `Submit Rating & Earn +${currentRatingTask.xp} XP` : `Skip Rating & Earn +${currentRatingTask.xp} XP`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}