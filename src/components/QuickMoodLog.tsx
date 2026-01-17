import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { X, Heart, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { announce } from "./ScreenReaderAnnouncer";

interface QuickMoodLogProps {
  onClose: () => void;
  onSave: (mood: number, emotions: string[], note: string, type: 'morning' | 'evening' | 'moment') => void;
  logType?: 'morning' | 'evening' | 'moment';
}

const emotionOptions = [
  { label: "Happy", emoji: "😊", color: "bg-yellow-100 border-yellow-300 text-yellow-800" },
  { label: "Calm", emoji: "😌", color: "bg-blue-100 border-blue-300 text-blue-800" },
  { label: "Energized", emoji: "⚡", color: "bg-orange-100 border-orange-300 text-orange-800" },
  { label: "Grateful", emoji: "🙏", color: "bg-green-100 border-green-300 text-green-800" },
  { label: "Anxious", emoji: "😰", color: "bg-purple-100 border-purple-300 text-purple-800" },
  { label: "Sad", emoji: "😢", color: "bg-indigo-100 border-indigo-300 text-indigo-800" },
  { label: "Angry", emoji: "😠", color: "bg-red-100 border-red-300 text-red-800" },
  { label: "Tired", emoji: "😴", color: "bg-gray-100 border-gray-300 text-gray-800" },
  { label: "Stressed", emoji: "😣", color: "bg-pink-100 border-pink-300 text-pink-800" },
  { label: "Overwhelmed", emoji: "😵", color: "bg-rose-100 border-rose-300 text-rose-800" },
  { label: "Lonely", emoji: "😔", color: "bg-slate-100 border-slate-300 text-slate-800" },
  { label: "Hopeful", emoji: "🌟", color: "bg-teal-100 border-teal-300 text-teal-800" }
];

const quickMoodFaces = [
  { value: 20, emoji: "😭", label: "Very Bad", color: "from-red-500 to-red-600" },
  { value: 40, emoji: "😔", label: "Bad", color: "from-orange-500 to-orange-600" },
  { value: 60, emoji: "😐", label: "Okay", color: "from-yellow-500 to-yellow-600" },
  { value: 80, emoji: "😊", label: "Good", color: "from-teal-500 to-teal-600" },
  { value: 100, emoji: "😄", label: "Great", color: "from-green-500 to-green-600" }
];

export default function QuickMoodLog({ onClose, onSave, logType = 'moment' }: QuickMoodLogProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const logTypeLabels = {
    morning: { title: "Morning Check-In", icon: "🌅", description: "How are you starting your day?" },
    evening: { title: "Evening Reflection", icon: "🌙", description: "How was your day overall?" },
    moment: { title: "Quick Mood Log", icon: "💭", description: "How are you feeling right now?" }
  };

  const currentType = logTypeLabels[logType];

  const toggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== emotion));
    } else {
      if (selectedEmotions.length < 5) {
        setSelectedEmotions([...selectedEmotions, emotion]);
      } else {
        toast.error("You can select up to 5 emotions");
      }
    }
  };

  const handleSave = () => {
    if (selectedMood === null) {
      toast.error("Please select how you're feeling");
      return;
    }

    onSave(selectedMood, selectedEmotions, note, logType);
    
    const moodLabel = quickMoodFaces.find(f => f.value === selectedMood)?.label || "logged";
    announce(`Mood ${moodLabel} recorded with ${selectedEmotions.length} emotions`, 'assertive');
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#2d2438] rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 px-6 py-6 relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close mood log"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-3xl">
              {currentType.icon}
            </div>
            <div>
              <h3 className="text-white">{currentType.title}</h3>
              <p className="text-white/90 text-sm">{currentType.description}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Quick Mood Faces */}
          <div className="mb-6">
            <h4 className="text-purple-900 dark:text-purple-200 mb-3">Overall Feeling</h4>
            <div className="grid grid-cols-5 gap-2">
              {quickMoodFaces.map((face) => (
                <button
                  key={face.value}
                  onClick={() => setSelectedMood(face.value)}
                  className={`p-3 rounded-2xl border-2 transition-all ${
                    selectedMood === face.value
                      ? 'border-purple-400 dark:border-purple-500 shadow-lg scale-110 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30'
                      : 'border-purple-200 dark:border-purple-700/30 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-[#1a1625]'
                  }`}
                  aria-label={`Feeling ${face.label}`}
                  aria-pressed={selectedMood === face.value}
                >
                  <div className="text-3xl mb-1">{face.emoji}</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">{face.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Emotion Tags */}
          <div className="mb-6">
            <h4 className="text-purple-900 dark:text-purple-200 mb-2">What emotions are present?</h4>
            <p className="text-purple-600 dark:text-purple-400 text-sm mb-3">
              Select up to 5 emotions (optional)
            </p>
            <div className="flex flex-wrap gap-2">
              {emotionOptions.map((emotion) => (
                <button
                  key={emotion.label}
                  onClick={() => toggleEmotion(emotion.label)}
                  className={`px-3 py-2 rounded-full border-2 text-sm transition-all ${
                    selectedEmotions.includes(emotion.label)
                      ? `${emotion.color} shadow-md scale-105`
                      : 'bg-white dark:bg-[#1a1625] border-purple-200 dark:border-purple-700/30 text-purple-700 dark:text-purple-300 hover:border-purple-300'
                  }`}
                  aria-pressed={selectedEmotions.includes(emotion.label)}
                >
                  <span className="mr-1">{emotion.emoji}</span>
                  {emotion.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div className="mb-6">
            <h4 className="text-purple-900 dark:text-purple-200 mb-2">Anything you want to note?</h4>
            <p className="text-purple-600 dark:text-purple-400 text-sm mb-3">Optional - what's on your mind?</p>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's contributing to how you feel? Any insights or thoughts..."
              className="min-h-24 border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100"
            />
          </div>

          {/* Context-specific tips */}
          {logType === 'morning' && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border-2 border-amber-200 dark:border-amber-700/30 mb-4">
              <p className="text-amber-800 dark:text-amber-300 text-sm">
                ☀️ <strong>Morning Tip:</strong> This sets your baseline for the day. You can log again if your mood shifts significantly!
              </p>
            </div>
          )}

          {logType === 'evening' && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border-2 border-indigo-200 dark:border-indigo-700/30 mb-4">
              <p className="text-indigo-800 dark:text-indigo-300 text-sm">
                🌙 <strong>Reflection:</strong> How did today go overall? This helps spot patterns over time.
              </p>
            </div>
          )}

          {logType === 'moment' && (
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-4 border-2 border-teal-200 dark:border-teal-700/30 mb-4">
              <p className="text-teal-800 dark:text-teal-300 text-sm">
                💡 <strong>Quick Log:</strong> Capturing how you feel in this moment helps track mood patterns throughout the day.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-purple-50 dark:bg-purple-900/20 border-t-2 border-purple-200 dark:border-purple-700/30 flex-shrink-0">
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={selectedMood === null}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50"
            >
              <Heart className="w-4 h-4 mr-2" />
              Save Check-In
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
