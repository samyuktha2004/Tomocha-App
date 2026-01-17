import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, Plus, Heart, Edit2, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface CopingStrategy {
  id: string;
  title: string;
  description: string;
  category: 'grounding' | 'breathing' | 'distraction' | 'self-soothing' | 'social';
  createdAt: string;
}

interface CopingStrategiesManagerProps {
  onClose: () => void;
}

const categoryConfig = {
  grounding: { emoji: '🌍', label: 'Grounding', color: 'from-teal-500 to-cyan-500' },
  breathing: { emoji: '🌬️', label: 'Breathing', color: 'from-blue-500 to-indigo-500' },
  distraction: { emoji: '🎯', label: 'Distraction', color: 'from-purple-500 to-pink-500' },
  'self-soothing': { emoji: '💆', label: 'Self-Soothing', color: 'from-pink-500 to-rose-500' },
  social: { emoji: '🤝', label: 'Social Support', color: 'from-green-500 to-emerald-500' }
};

const defaultStrategies: CopingStrategy[] = [
  {
    id: 'default-1',
    title: '5-4-3-2-1 Grounding',
    description: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste',
    category: 'grounding',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-2',
    title: 'Box Breathing',
    description: 'Breathe in for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat.',
    category: 'breathing',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-3',
    title: 'Call a Trusted Friend',
    description: 'Reach out to someone who understands and can provide support',
    category: 'social',
    createdAt: new Date().toISOString()
  }
];

export default function CopingStrategiesManager({ onClose }: CopingStrategiesManagerProps) {
  const [strategies, setStrategies] = useState<CopingStrategy[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStrategy, setNewStrategy] = useState({
    title: '',
    description: '',
    category: 'grounding' as CopingStrategy['category']
  });

  useEffect(() => {
    const saved = localStorage.getItem('copingStrategies');
    if (saved) {
      setStrategies(JSON.parse(saved));
    } else {
      setStrategies(defaultStrategies);
      localStorage.setItem('copingStrategies', JSON.stringify(defaultStrategies));
    }
  }, []);

  const saveStrategies = (updatedStrategies: CopingStrategy[]) => {
    setStrategies(updatedStrategies);
    localStorage.setItem('copingStrategies', JSON.stringify(updatedStrategies));
  };

  const handleAdd = () => {
    if (!newStrategy.title.trim() || !newStrategy.description.trim()) {
      toast.error('Please fill in both title and description');
      return;
    }

    const strategy: CopingStrategy = {
      id: `strategy-${Date.now()}`,
      ...newStrategy,
      createdAt: new Date().toISOString()
    };

    saveStrategies([...strategies, strategy]);
    setIsAdding(false);
    setNewStrategy({ title: '', description: '', category: 'grounding' });
    toast.success('✨ Coping strategy added!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this coping strategy?')) {
      saveStrategies(strategies.filter(s => s.id !== id));
      toast.success('Coping strategy deleted');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#2d2438] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 px-6 py-6 relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close coping strategies manager"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-white">My Coping Strategies</h3>
              <p className="text-white/90">Pre-write what helps you in crisis moments</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-6">
            <p className="text-purple-900 dark:text-purple-200 mb-2">
              💜 Having your strategies written beforehand makes them easier to access when you need them most.
            </p>
            <p className="text-purple-600 dark:text-purple-400 text-sm">
              These will be easily accessible during difficult moments to remind you what helps.
            </p>
          </div>

          {/* Add New Strategy */}
          {isAdding ? (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 border-2 border-purple-200 dark:border-purple-700/30 mb-4">
              <h4 className="text-purple-900 dark:text-purple-200 mb-3">Add New Strategy</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="text-purple-700 dark:text-purple-300 text-sm mb-1 block">Category</label>
                  <select
                    value={newStrategy.category}
                    onChange={(e) => setNewStrategy({ ...newStrategy, category: e.target.value as CopingStrategy['category'] })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-purple-200 dark:border-purple-700/30 bg-white dark:bg-[#2d2438] text-purple-900 dark:text-purple-200"
                  >
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.emoji} {config.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-purple-700 dark:text-purple-300 text-sm mb-1 block">Title</label>
                  <input
                    type="text"
                    value={newStrategy.title}
                    onChange={(e) => setNewStrategy({ ...newStrategy, title: e.target.value })}
                    placeholder="e.g., My Favorite Grounding Technique"
                    className="w-full px-3 py-2 rounded-xl border-2 border-purple-200 dark:border-purple-700/30 bg-white dark:bg-[#2d2438] text-purple-900 dark:text-purple-200 placeholder:text-purple-400"
                  />
                </div>

                <div>
                  <label className="text-purple-700 dark:text-purple-300 text-sm mb-1 block">Description / Steps</label>
                  <textarea
                    value={newStrategy.description}
                    onChange={(e) => setNewStrategy({ ...newStrategy, description: e.target.value })}
                    placeholder="Describe what you do, step by step..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border-2 border-purple-200 dark:border-purple-700/30 bg-white dark:bg-[#2d2438] text-purple-900 dark:text-purple-200 placeholder:text-purple-400 resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleAdd}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Strategy
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAdding(false);
                      setNewStrategy({ title: '', description: '', category: 'grounding' });
                    }}
                    variant="outline"
                    className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setIsAdding(true)}
              className="w-full mb-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Coping Strategy
            </Button>
          )}

          {/* Strategy List */}
          <div className="space-y-3">
            {strategies.length === 0 ? (
              <div className="text-center py-8 text-purple-600 dark:text-purple-400">
                <p>No coping strategies yet.</p>
                <p className="text-sm mt-1">Add your first strategy above!</p>
              </div>
            ) : (
              strategies.map((strategy) => {
                const config = categoryConfig[strategy.category];
                return (
                  <div
                    key={strategy.id}
                    className="bg-white dark:bg-[#1a1625] rounded-2xl p-4 border-2 border-purple-200 dark:border-purple-700/30 hover:border-purple-300 dark:hover:border-purple-600/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{config.emoji}</span>
                        <div>
                          <h4 className="text-purple-900 dark:text-purple-200">{strategy.title}</h4>
                          <span className="text-xs text-purple-600 dark:text-purple-400">{config.label}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(strategy.id)}
                        className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Delete strategy"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-purple-700 dark:text-purple-300 text-sm whitespace-pre-wrap">
                      {strategy.description}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-purple-50 dark:bg-purple-900/20 border-t-2 border-purple-200 dark:border-purple-700/30 flex-shrink-0">
          <p className="text-purple-700 dark:text-purple-300 text-sm text-center">
            💡 Tip: These strategies will be suggested when you're in distress mode
          </p>
        </div>
      </div>
    </div>
  );
}
