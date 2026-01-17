import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Calendar, TrendingUp, Target, Sparkles } from 'lucide-react';

interface DataVisualizationProps {
  onClose?: () => void;
}

// Mood emoji mapping
const getMoodEmoji = (value: number) => {
  if (value <= 20) return '😞';
  if (value <= 40) return '😔';
  if (value <= 60) return '😐';
  if (value <= 80) return '🙂';
  return '😊';
};

const getMoodLabel = (value: number) => {
  if (value <= 33) return 'High Distress';
  if (value <= 66) return 'Neutral';
  return 'High Energy';
};

export default function DataVisualization({ onClose }: DataVisualizationProps) {
  const [moodData, setMoodData] = useState<any[]>([]);
  const [xpData, setXpData] = useState<any[]>([]);
  const [taskCompletionData, setTaskCompletionData] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalXP: 0,
    avgMood: 0,
    totalTasks: 0,
    streak: 0
  });

  useEffect(() => {
    // Load historical data from localStorage
    const loadHistoricalData = () => {
      // Get mood history (last 7 days)
      const moodHistory = [];
      const xpHistory = [];
      const taskHistory = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Get stored data for this day
        const storedMood = localStorage.getItem(`mood_${dateKey}`);
        const storedXP = localStorage.getItem(`xp_${dateKey}`);
        const storedTasks = localStorage.getItem(`tasks_${dateKey}`);
        
        // Use actual data if available, otherwise use 0 for past days
        const mood = storedMood ? parseInt(storedMood) : 0;
        const xp = storedXP ? parseInt(storedXP) : 0;
        const tasks = storedTasks ? parseInt(storedTasks) : 0;
        
        // Only add non-zero data or today's data
        if (mood > 0 || xp > 0 || tasks > 0 || i === 0) {
          moodHistory.push({
            day: dayName,
            mood: mood,
            emoji: getMoodEmoji(mood),
            label: getMoodLabel(mood),
            fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          });
          
          xpHistory.push({
            day: dayName,
            xp: xp,
            cumulative: xpHistory.length > 0 ? xpHistory[xpHistory.length - 1].cumulative + xp : xp
          });
          
          // Calculate pending tasks (assuming 10 total tasks)
          const pendingTasks = Math.max(0, 10 - tasks);
          
          taskHistory.push({
            day: dayName,
            completed: tasks,
            pending: pendingTasks
          });
        }
      }
      
      setMoodData(moodHistory);
      setXpData(xpHistory);
      setTaskCompletionData(taskHistory);
      
      // Category breakdown - calculate from actual completed tasks
      // For now, we'll use sample data since we don't track categories yet
      const categories = [
        { name: 'Mindfulness', value: Math.floor(15 + Math.random() * 15), color: '#a78bfa' },
        { name: 'Physical', value: Math.floor(10 + Math.random() * 15), color: '#60a5fa' },
        { name: 'Social', value: Math.floor(5 + Math.random() * 10), color: '#34d399' },
        { name: 'Creative', value: Math.floor(8 + Math.random() * 12), color: '#fb7185' },
        { name: 'Rest', value: Math.floor(10 + Math.random() * 10), color: '#fbbf24' }
      ];
      setCategoryBreakdown(categories);
      
      // Calculate stats from actual data
      const totalXP = xpHistory.reduce((sum, item) => sum + item.xp, 0);
      const validMoods = moodHistory.filter(item => item.mood > 0);
      const avgMood = validMoods.length > 0 
        ? Math.round(validMoods.reduce((sum, item) => sum + item.mood, 0) / validMoods.length)
        : 50;
      const totalTasks = taskHistory.reduce((sum, item) => sum + item.completed, 0);
      const streak = parseInt(localStorage.getItem('completionStreak') || '0');
      
      setStats({
        totalXP,
        avgMood,
        totalTasks,
        streak
      });
    };
    
    // Load initially
    loadHistoricalData();
    
    // Also reload when component becomes visible (to catch updates from other tabs/sessions)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadHistoricalData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Set up an interval to refresh data every 10 seconds when visible
    const refreshInterval = setInterval(() => {
      if (!document.hidden) {
        loadHistoricalData();
      }
    }, 10000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(refreshInterval);
    };
  }, []);

  // Custom tooltip for mood chart
  const MoodTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#2d2438] p-3 rounded-lg shadow-lg border-2 border-purple-200 dark:border-purple-700/30">
          <p className="text-purple-900 dark:text-purple-200">{payload[0].payload.fullDate}</p>
          <p className="text-purple-700 dark:text-purple-300 flex items-center gap-2">
            <span className="text-2xl">{payload[0].payload.emoji}</span>
            <span>{payload[0].payload.label}</span>
          </p>
          <p className="text-purple-600 dark:text-purple-400 text-sm">Mood Score: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for XP chart
  const XPTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#2d2438] p-3 rounded-lg shadow-lg border-2 border-purple-200 dark:border-purple-700/30">
          <p className="text-purple-900 dark:text-purple-200">{payload[0].payload.day}</p>
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <p className="text-purple-700 dark:text-purple-300">+{payload[0].value} XP</p>
          </div>
          <p className="text-purple-600 dark:text-purple-400 text-sm">Total: {payload[1]?.value} XP</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-2 border-purple-200 dark:border-purple-700/30 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Total XP (7d)
            </CardDescription>
            <CardTitle className="text-purple-900 dark:text-purple-200">{stats.totalXP}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-2 border-purple-200 dark:border-purple-700/30 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Avg Mood
            </CardDescription>
            <CardTitle className="text-blue-900 dark:text-blue-200 flex items-center gap-2">
              {getMoodEmoji(stats.avgMood)}
              <span className="text-sm">{getMoodLabel(stats.avgMood)}</span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-2 border-purple-200 dark:border-purple-700/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-green-600 dark:text-green-400 flex items-center gap-1">
              <Target className="w-4 h-4" />
              Tasks Done
            </CardDescription>
            <CardTitle className="text-green-900 dark:text-green-200">{stats.totalTasks}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-2 border-purple-200 dark:border-purple-700/30 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-orange-600 dark:text-orange-400 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Streak
            </CardDescription>
            <CardTitle className="text-orange-900 dark:text-orange-200">{stats.streak} 🔥</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="mood" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-purple-100 dark:bg-purple-900/30">
          <TabsTrigger 
            value="mood"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
          >
            Mood
          </TabsTrigger>
          <TabsTrigger 
            value="xp"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
          >
            XP Progress
          </TabsTrigger>
          <TabsTrigger 
            value="tasks"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
          >
            Tasks
          </TabsTrigger>
        </TabsList>

        {/* Mood Trends Chart */}
        <TabsContent value="mood" className="mt-4">
          <Card className="border-2 border-purple-200 dark:border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-purple-900 dark:text-purple-200">Mood Trends (Last 7 Days)</CardTitle>
              <CardDescription className="text-purple-600 dark:text-purple-400">
                Track how your emotional state has changed over the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={moodData}>
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#9333ea"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9333ea"
                    style={{ fontSize: '12px' }}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<MoodTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#a855f7" 
                    strokeWidth={3}
                    fill="url(#moodGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              
              {/* Mood Legend */}
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                  <span className="text-xs text-purple-700 dark:text-purple-300">High Distress (0-33)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-purple-700 dark:text-purple-300">Neutral (34-66)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-xs text-purple-700 dark:text-purple-300">High Energy (67-100)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* XP Progress Chart */}
        <TabsContent value="xp" className="mt-4">
          <Card className="border-2 border-purple-200 dark:border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-purple-900 dark:text-purple-200 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                XP Growth
              </CardTitle>
              <CardDescription className="text-purple-600 dark:text-purple-400">
                Your experience points earned over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={xpData}>
                  <defs>
                    <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#9333ea"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9333ea"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip content={<XPTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="xp" 
                    stroke="#eab308" 
                    strokeWidth={2}
                    fill="url(#xpGradient)"
                    name="Daily XP"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cumulative" 
                    stroke="#a855f7" 
                    strokeWidth={2}
                    fill="url(#cumulativeGradient)"
                    name="Total XP"
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs text-purple-700 dark:text-purple-300">Daily XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-xs text-purple-700 dark:text-purple-300">Cumulative XP</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Task Completion Chart */}
        <TabsContent value="tasks" className="mt-4 space-y-4">
          <Card className="border-2 border-purple-200 dark:border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-purple-900 dark:text-purple-200">Task Completion</CardTitle>
              <CardDescription className="text-purple-600 dark:text-purple-400">
                Daily task completion over the last week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={taskCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#9333ea"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9333ea"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '2px solid #e9d5ff',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="completed" 
                    fill="#10b981" 
                    name="Completed"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar 
                    dataKey="pending" 
                    fill="#f59e0b" 
                    name="Pending"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Breakdown Pie Chart */}
          <Card className="border-2 border-purple-200 dark:border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-purple-900 dark:text-purple-200">Task Categories</CardTitle>
              <CardDescription className="text-purple-600 dark:text-purple-400">
                Distribution of completed tasks by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              {/* Category Legend */}
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {categoryBreakdown.map((category, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-xs text-purple-700 dark:text-purple-300">
                      {category.name} ({category.value})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}