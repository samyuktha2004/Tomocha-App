import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { X, Heart, Plus, Trash2, Check, TrendingUp, Award } from "lucide-react";
import { toast } from "sonner";
import { announce } from "./ScreenReaderAnnouncer";

interface CourageTrackerProps {
  onClose: () => void;
}

interface CourageMoment {
  id: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  date: string;
  category: string;
  notes: string;
}

interface GraduatedChallenge {
  id: string;
  title: string;
  steps: ChallengeStep[];
  category: 'social' | 'performance' | 'exposure' | 'custom';
  isActive: boolean;
  createdAt: string;
}

interface ChallengeStep {
  id: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  completed: boolean;
  completedDate?: string;
}

const categoryLabels = {
  social: { label: 'Social Situations', icon: '👥', color: 'from-purple-500 to-pink-500' },
  performance: { label: 'Performance/Speaking', icon: '🎤', color: 'from-indigo-500 to-purple-500' },
  exposure: { label: 'Exposure Practice', icon: '🌟', color: 'from-teal-500 to-cyan-500' },
  custom: { label: 'Custom Goal', icon: '🎯', color: 'from-amber-500 to-orange-500' }
};

const difficultyLabels = {
  1: { label: 'Very Easy', emoji: '😊', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  2: { label: 'Easy', emoji: '🙂', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300' },
  3: { label: 'Moderate', emoji: '😐', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  4: { label: 'Hard', emoji: '😰', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
  5: { label: 'Very Hard', emoji: '😱', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
};

export default function CourageTracker({ onClose }: CourageTrackerProps) {
  const [courageMoments, setCourageMoments] = useState<CourageMoment[]>([]);
  const [challenges, setChallenges] = useState<GraduatedChallenge[]>([]);
  const [showAddMoment, setShowAddMoment] = useState(false);
  const [showAddChallenge, setShowAddChallenge] = useState(false);
  const [newMoment, setNewMoment] = useState({
    description: "",
    difficulty: 3 as 1 | 2 | 3 | 4 | 5,
    category: "social",
    notes: ""
  });
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    category: 'social' as 'social' | 'performance' | 'exposure' | 'custom',
    steps: ["", "", ""]
  });

  useEffect(() => {
    // Load courage moments
    const savedMoments = localStorage.getItem('courageMoments');
    if (savedMoments) {
      try {
        setCourageMoments(JSON.parse(savedMoments));
      } catch {}
    }

    // Load challenges
    const savedChallenges = localStorage.getItem('graduatedChallenges');
    if (savedChallenges) {
      try {
        setChallenges(JSON.parse(savedChallenges));
      } catch {}
    }
  }, []);

  const saveMoments = (moments: CourageMoment[]) => {
    localStorage.setItem('courageMoments', JSON.stringify(moments));
    setCourageMoments(moments);
  };

  const saveChallenges = (challengesList: GraduatedChallenge[]) => {
    localStorage.setItem('graduatedChallenges', JSON.stringify(challengesList));
    setChallenges(challengesList);
  };

  const addCourageMoment = () => {
    if (!newMoment.description.trim()) {
      toast.error("Please describe your courage moment");
      return;
    }

    const moment: CourageMoment = {
      id: Date.now().toString(),
      description: newMoment.description,
      difficulty: newMoment.difficulty,
      date: new Date().toISOString(),
      category: newMoment.category,
      notes: newMoment.notes
    };

    const updatedMoments = [moment, ...courageMoments];
    saveMoments(updatedMoments);
    
    const diffLabel = difficultyLabels[newMoment.difficulty];
    toast.success(`🎉 Courage moment logged! Difficulty: ${diffLabel.label}`);
    announce(`Courage moment added: ${newMoment.description}. Difficulty level ${newMoment.difficulty} out of 5.`, 'assertive');
    
    setNewMoment({ description: "", difficulty: 3, category: "social", notes: "" });
    setShowAddMoment(false);
  };

  const deleteCourageMoment = (id: string) => {
    const updatedMoments = courageMoments.filter(m => m.id !== id);
    saveMoments(updatedMoments);
    toast.info("Courage moment removed");
  };

  const addGraduatedChallenge = () => {
    if (!newChallenge.title.trim()) {
      toast.error("Please enter a challenge title");
      return;
    }

    const validSteps = newChallenge.steps.filter(s => s.trim());
    if (validSteps.length < 2) {
      toast.error("Please add at least 2 steps to your challenge");
      return;
    }

    const challenge: GraduatedChallenge = {
      id: Date.now().toString(),
      title: newChallenge.title,
      category: newChallenge.category,
      isActive: true,
      createdAt: new Date().toISOString(),
      steps: validSteps.map((step, index) => ({
        id: `${Date.now()}-${index}`,
        description: step,
        difficulty: (index + 1) as 1 | 2 | 3 | 4 | 5,
        completed: false
      }))
    };

    const updatedChallenges = [challenge, ...challenges];
    saveChallenges(updatedChallenges);
    toast.success("Graduated challenge created!");
    
    setNewChallenge({ title: "", category: 'social', steps: ["", "", ""] });
    setShowAddChallenge(false);
  };

  const completeStep = (challengeId: string, stepId: string) => {
    const updatedChallenges = challenges.map(challenge => {
      if (challenge.id === challengeId) {
        const updatedSteps = challenge.steps.map(step => {
          if (step.id === stepId && !step.completed) {
            announce(`Step completed: ${step.description}`, 'assertive');
            toast.success("🎉 Step completed! You're making progress!");
            return { ...step, completed: true, completedDate: new Date().toISOString() };
          }
          return step;
        });
        return { ...challenge, steps: updatedSteps };
      }
      return challenge;
    });
    saveChallenges(updatedChallenges);
  };

  const deleteChallenge = (id: string) => {
    const updatedChallenges = challenges.filter(c => c.id !== id);
    saveChallenges(updatedChallenges);
    toast.info("Challenge removed");
  };

  const totalCourageMoments = courageMoments.length;
  const averageDifficulty = courageMoments.length > 0
    ? (courageMoments.reduce((sum, m) => sum + m.difficulty, 0) / courageMoments.length).toFixed(1)
    : 0;
  const completedSteps = challenges.reduce((sum, c) => 
    sum + c.steps.filter(s => s.completed).length, 0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-[#2d2438] rounded-3xl shadow-2xl max-w-4xl w-full my-8 animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 dark:from-pink-600 dark:to-rose-600 px-6 py-6 relative flex-shrink-0 rounded-t-3xl">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close courage tracker"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <div>
              <h3 className="text-white">Courage Tracker</h3>
              <p className="text-white/90 text-sm">Track brave moments & graduated challenges</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700/30">
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">{totalCourageMoments}</div>
              <div className="text-purple-600 dark:text-purple-400 text-sm">Courage Moments</div>
            </div>
            <div className="bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-xl p-4 border-2 border-teal-200 dark:border-teal-700/30">
              <div className="text-2xl font-bold text-teal-900 dark:text-teal-200">{completedSteps}</div>
              <div className="text-teal-600 dark:text-teal-400 text-sm">Steps Completed</div>
            </div>
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl p-4 border-2 border-amber-200 dark:border-amber-700/30">
              <div className="text-2xl font-bold text-amber-900 dark:text-amber-200">{averageDifficulty}</div>
              <div className="text-amber-600 dark:text-amber-400 text-sm">Avg Difficulty</div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-5 border-2 border-pink-200 dark:border-pink-700/30 mb-6">
            <h4 className="text-pink-900 dark:text-pink-200 mb-2 font-medium">
              💪 Building Courage Gradually
            </h4>
            <p className="text-pink-800 dark:text-pink-300 text-sm mb-3">
              For anxiety recovery, exposure therapy works best when you start small and build up. Track individual brave moments OR create graduated challenges to systematically face fears.
            </p>
            <ul className="text-pink-700 dark:text-pink-400 text-sm space-y-1">
              <li>✓ Celebrate every step, no matter how small</li>
              <li>✓ Rate difficulty honestly - it's personal to you</li>
              <li>✓ Notice patterns in what builds confidence</li>
              <li>✓ Share progress with your therapist or support buddy</li>
            </ul>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => setShowAddMoment(!showAddMoment)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Courage Moment
            </Button>
            <Button
              onClick={() => setShowAddChallenge(!showAddChallenge)}
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Challenge
            </Button>
          </div>

          {/* Add Courage Moment Form */}
          {showAddMoment && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border-2 border-purple-200 dark:border-purple-700/30 mb-6">
              <h4 className="text-purple-900 dark:text-purple-200 mb-4">✨ New Courage Moment</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-purple-700 dark:text-purple-300 text-sm mb-2 block">
                    What did you do?
                  </label>
                  <Input
                    value={newMoment.description}
                    onChange={(e) => setNewMoment({ ...newMoment, description: e.target.value })}
                    placeholder="e.g., Made eye contact with cashier, spoke up in meeting..."
                    className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100"
                  />
                </div>

                <div>
                  <label className="text-purple-700 dark:text-purple-300 text-sm mb-2 block">
                    How difficult was it?
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((level) => {
                      const diff = difficultyLabels[level as 1 | 2 | 3 | 4 | 5];
                      return (
                        <button
                          key={level}
                          onClick={() => setNewMoment({ ...newMoment, difficulty: level as 1 | 2 | 3 | 4 | 5 })}
                          className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                            newMoment.difficulty === level
                              ? 'border-purple-400 dark:border-purple-500 shadow-md scale-105'
                              : 'border-purple-200 dark:border-purple-700/30 hover:border-purple-300'
                          } ${diff.color}`}
                        >
                          <div className="text-2xl mb-1">{diff.emoji}</div>
                          <div className="text-xs">{level}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-purple-700 dark:text-purple-300 text-sm mb-2 block">
                    Notes (Optional)
                  </label>
                  <Textarea
                    value={newMoment.notes}
                    onChange={(e) => setNewMoment({ ...newMoment, notes: e.target.value })}
                    placeholder="How did it feel? What helped?"
                    className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100 min-h-20"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={addCourageMoment}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    Save Moment
                  </Button>
                  <Button
                    onClick={() => setShowAddMoment(false)}
                    variant="outline"
                    className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Add Graduated Challenge Form */}
          {showAddChallenge && (
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-5 border-2 border-teal-200 dark:border-teal-700/30 mb-6">
              <h4 className="text-teal-900 dark:text-teal-200 mb-4">🎯 New Graduated Challenge</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-teal-700 dark:text-teal-300 text-sm mb-2 block">
                    Challenge Title
                  </label>
                  <Input
                    value={newChallenge.title}
                    onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                    placeholder="e.g., Attend Social Events, Public Speaking Practice..."
                    className="border-teal-200 dark:border-teal-700/30 dark:bg-slate-800 dark:text-teal-100"
                  />
                </div>

                <div>
                  <label className="text-teal-700 dark:text-teal-300 text-sm mb-2 block">
                    Category
                  </label>
                  <select
                    value={newChallenge.category}
                    onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border-2 border-teal-200 dark:border-teal-700/30 bg-white dark:bg-slate-800 text-teal-900 dark:text-teal-200"
                  >
                    {Object.entries(categoryLabels).map(([key, { label, icon }]) => (
                      <option key={key} value={key}>{icon} {label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-teal-700 dark:text-teal-300 text-sm mb-2 block">
                    Steps (Easy → Challenging)
                  </label>
                  {newChallenge.steps.map((step, index) => (
                    <div key={index} className="mb-2">
                      <Input
                        value={step}
                        onChange={(e) => {
                          const updatedSteps = [...newChallenge.steps];
                          updatedSteps[index] = e.target.value;
                          setNewChallenge({ ...newChallenge, steps: updatedSteps });
                        }}
                        placeholder={`Step ${index + 1} (${index === 0 ? 'Easiest' : index === 2 ? 'Hardest' : 'Medium'})`}
                        className="border-teal-200 dark:border-teal-700/30 dark:bg-slate-800 dark:text-teal-100"
                      />
                    </div>
                  ))}
                  <Button
                    onClick={() => setNewChallenge({ ...newChallenge, steps: [...newChallenge.steps, ""] })}
                    variant="outline"
                    size="sm"
                    className="border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 mt-2"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Step
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={addGraduatedChallenge}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                  >
                    Create Challenge
                  </Button>
                  <Button
                    onClick={() => setShowAddChallenge(false)}
                    variant="outline"
                    className="border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Graduated Challenges */}
          {challenges.length > 0 && (
            <div className="mb-6">
              <h4 className="text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Your Graduated Challenges
              </h4>
              <div className="space-y-4">
                {challenges.map((challenge) => {
                  const category = categoryLabels[challenge.category];
                  const completedCount = challenge.steps.filter(s => s.completed).length;
                  const progress = (completedCount / challenge.steps.length) * 100;
                  
                  return (
                    <div
                      key={challenge.id}
                      className="bg-white dark:bg-[#1a1625] rounded-xl p-5 border-2 border-purple-200 dark:border-purple-700/30"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{category.icon}</span>
                            <h5 className="text-purple-900 dark:text-purple-200 font-medium">
                              {challenge.title}
                            </h5>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-purple-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${category.color} transition-all duration-500`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-purple-600 dark:text-purple-400 text-sm">
                              {completedCount}/{challenge.steps.length}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteChallenge(challenge.id)}
                          className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full p-2 transition-colors ml-2"
                          aria-label="Delete challenge"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {challenge.steps.map((step, index) => (
                          <div
                            key={step.id}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              step.completed
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/30'
                                : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => completeStep(challenge.id, step.id)}
                                disabled={step.completed}
                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  step.completed
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-purple-300 dark:border-purple-600 hover:border-purple-500'
                                }`}
                                aria-label={step.completed ? "Step completed" : "Mark step as complete"}
                              >
                                {step.completed && <Check className="w-4 h-4 text-white" />}
                              </button>
                              <div className="flex-1">
                                <p className={`text-sm ${
                                  step.completed
                                    ? 'text-green-800 dark:text-green-300 line-through'
                                    : 'text-purple-800 dark:text-purple-300'
                                }`}>
                                  Step {index + 1}: {step.description}
                                </p>
                                {step.completedDate && (
                                  <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                                    ✓ Completed {new Date(step.completedDate).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${difficultyLabels[step.difficulty].color}`}>
                                {difficultyLabels[step.difficulty].emoji}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {completedCount === challenge.steps.length && (
                        <div className="mt-4 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg p-3 border-2 border-amber-200 dark:border-amber-700/30">
                          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                            <Award className="w-5 h-5" />
                            <span className="font-medium">Challenge Complete! You did it! 🎉</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Courage Moments */}
          {courageMoments.length > 0 && (
            <div>
              <h4 className="text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Recent Courage Moments
              </h4>
              <div className="space-y-3">
                {courageMoments.slice(0, 10).map((moment) => {
                  const diff = difficultyLabels[moment.difficulty];
                  return (
                    <div
                      key={moment.id}
                      className="bg-white dark:bg-[#1a1625] rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-purple-900 dark:text-purple-200 mb-2">
                            {moment.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${diff.color}`}>
                              {diff.emoji} {diff.label}
                            </span>
                            <span className="text-purple-600 dark:text-purple-400 text-xs">
                              {new Date(moment.date).toLocaleDateString()}
                            </span>
                          </div>
                          {moment.notes && (
                            <p className="text-purple-600 dark:text-purple-400 text-sm mt-2 italic">
                              "{moment.notes}"
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteCourageMoment(moment.id)}
                          className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full p-1 transition-colors ml-2"
                          aria-label="Delete courage moment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {courageMoments.length === 0 && challenges.length === 0 && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-8 border-2 border-purple-200 dark:border-purple-700/30 text-center">
              <div className="text-4xl mb-3">💜</div>
              <p className="text-purple-600 dark:text-purple-400 mb-2">
                Start tracking your courage journey!
              </p>
              <p className="text-purple-500 dark:text-purple-500 text-sm">
                Log individual brave moments or create graduated challenges to systematically build confidence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
