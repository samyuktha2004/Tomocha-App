import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, TrendingUp, Calendar } from "lucide-react";

interface MoodHistoryProps {
  onClose: () => void;
}

interface MoodEntry {
  id: string;
  mood: number;
  emotions: string[];
  note: string;
  type: 'morning' | 'evening' | 'moment';
  timestamp: string;
  date: string;
}

const moodLabels: { [key: number]: { label: string; emoji: string; color: string } } = {
  20: { label: "Very Bad", emoji: "😭", color: "from-red-500 to-red-600" },
  40: { label: "Bad", emoji: "😔", color: "from-orange-500 to-orange-600" },
  60: { label: "Okay", emoji: "😐", color: "from-yellow-500 to-yellow-600" },
  80: { label: "Good", emoji: "😊", color: "from-teal-500 to-teal-600" },
  100: { label: "Great", emoji: "😄", color: "from-green-500 to-green-600" }
};

const typeLabels = {
  morning: { label: "Morning", icon: "🌅", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  evening: { label: "Evening", icon: "🌙", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300" },
  moment: { label: "Quick Log", icon: "💭", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" }
};

export default function MoodHistory({ onClose }: MoodHistoryProps) {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadEntries();
  }, [selectedDate]);

  const loadEntries = () => {
    const allEntries = localStorage.getItem('moodHistory');
    if (allEntries) {
      try {
        const parsed: MoodEntry[] = JSON.parse(allEntries);
        // Filter by selected date
        const filtered = parsed.filter(entry => entry.date === selectedDate);
        // Sort by timestamp (most recent first)
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setEntries(filtered);
      } catch {
        setEntries([]);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getAverageMood = () => {
    if (entries.length === 0) return null;
    const sum = entries.reduce((acc, entry) => acc + entry.mood, 0);
    const avg = sum / entries.length;
    // Find closest mood label
    const closest = Object.keys(moodLabels).reduce((prev, curr) => 
      Math.abs(Number(curr) - avg) < Math.abs(Number(prev) - avg) ? curr : prev
    );
    return { avg, label: moodLabels[Number(closest)] };
  };

  const average = getAverageMood();

  // Get unique dates with entries
  const getDatesWithEntries = (): string[] => {
    const allEntries = localStorage.getItem('moodHistory');
    if (!allEntries) return [];
    try {
      const parsed: MoodEntry[] = JSON.parse(allEntries);
      const dates = [...new Set(parsed.map(e => e.date))];
      return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    } catch {
      return [];
    }
  };

  const datesWithEntries = getDatesWithEntries();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#2d2438] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 px-6 py-6 relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close mood history"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-white">Mood History</h3>
              <p className="text-white/90 text-sm">Track your emotional patterns</p>
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="p-6 border-b-2 border-purple-200 dark:border-purple-700/30 bg-purple-50 dark:bg-purple-900/20">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <label className="text-purple-900 dark:text-purple-200 font-medium">Select Date</label>
          </div>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 dark:border-purple-700/30 bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-200"
          >
            {datesWithEntries.length > 0 ? (
              datesWithEntries.map(date => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </option>
              ))
            ) : (
              <option value={selectedDate}>Today - No entries yet</option>
            )}
          </select>

          {/* Daily Summary */}
          {average && entries.length > 0 && (
            <div className="mt-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm mb-1">Daily Average</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{average.label.emoji}</span>
                    <span className="text-purple-900 dark:text-purple-200 font-medium">{average.label.label}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-purple-600 dark:text-purple-400 text-sm">Check-ins</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">{entries.length}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {entries.length > 0 ? (
            <div className="space-y-4">
              {entries.map((entry) => {
                const moodInfo = moodLabels[entry.mood];
                const typeInfo = typeLabels[entry.type];
                
                return (
                  <div
                    key={entry.id}
                    className="bg-white dark:bg-[#1a1625] rounded-xl p-5 border-2 border-purple-200 dark:border-purple-700/30 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{moodInfo.emoji}</div>
                        <div>
                          <h4 className="text-purple-900 dark:text-purple-200 font-medium">{moodInfo.label}</h4>
                          <p className="text-purple-600 dark:text-purple-400 text-sm">{formatTime(entry.timestamp)}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${typeInfo.color}`}>
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                    </div>

                    {entry.emotions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-purple-600 dark:text-purple-400 text-sm mb-2">Emotions:</p>
                        <div className="flex flex-wrap gap-2">
                          {entry.emotions.map((emotion, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/30"
                            >
                              {emotion}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {entry.note && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700/30">
                        <p className="text-purple-800 dark:text-purple-300 text-sm italic">
                          "{entry.note}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-8 border-2 border-purple-200 dark:border-purple-700/30 text-center">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-purple-600 dark:text-purple-400 mb-2">
                No mood check-ins for this day
              </p>
              <p className="text-purple-500 dark:text-purple-500 text-sm">
                Select a different date or log your first check-in!
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-t-2 border-teal-200 dark:border-teal-700/30">
          <p className="text-teal-800 dark:text-teal-300 text-sm">
            💡 <strong>Pattern Recognition:</strong> Multiple check-ins per day help identify triggers, see what helps, and track how mood changes with activities and time of day.
          </p>
        </div>
      </div>
    </div>
  );
}
