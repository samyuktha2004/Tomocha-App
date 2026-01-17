import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { X, AlertTriangle, Shield, Plus, Trash2, Edit2, Save } from "lucide-react";
import { toast } from "sonner";

interface RelapsePreventionPlanProps {
  onClose: () => void;
}

interface WarningSign {
  id: string;
  sign: string;
  category: 'physical' | 'emotional' | 'behavioral' | 'social';
}

interface ActionStep {
  id: string;
  action: string;
  priority: 'immediate' | 'same-day' | 'within-week';
}

interface PreventionPlan {
  warningSignsEnabled: boolean;
  warningSign: WarningSign[];
  actionSteps: ActionStep[];
  emergencyContacts: string;
  lastUpdated: string;
}

const categoryLabels = {
  physical: { label: 'Physical', icon: '💪', color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/30' },
  emotional: { label: 'Emotional', icon: '💭', color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700/30' },
  behavioral: { label: 'Behavioral', icon: '🎯', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/30' },
  social: { label: 'Social', icon: '👥', color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/30' }
};

const priorityLabels = {
  immediate: { label: 'Immediate', icon: '🚨', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
  'same-day': { label: 'Same Day', icon: '⏰', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' },
  'within-week': { label: 'This Week', icon: '📅', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300' }
};

export default function RelapsePreventionPlan({ onClose }: RelapsePreventionPlanProps) {
  const [plan, setPlan] = useState<PreventionPlan>({
    warningSignsEnabled: false,
    warningSign: [],
    actionSteps: [],
    emergencyContacts: "",
    lastUpdated: new Date().toISOString()
  });

  const [editingWarningSign, setEditingWarningSign] = useState<string | null>(null);
  const [editingActionStep, setEditingActionStep] = useState<string | null>(null);
  const [newWarningSign, setNewWarningSign] = useState({ sign: "", category: 'emotional' as const });
  const [newActionStep, setNewActionStep] = useState({ action: "", priority: 'same-day' as const });

  useEffect(() => {
    const saved = localStorage.getItem('relapsePreventionPlan');
    if (saved) {
      try {
        setPlan(JSON.parse(saved));
      } catch {
        // Use default
      }
    }
  }, []);

  const savePlan = (updatedPlan: PreventionPlan) => {
    const planToSave = { ...updatedPlan, lastUpdated: new Date().toISOString() };
    localStorage.setItem('relapsePreventionPlan', JSON.stringify(planToSave));
    setPlan(planToSave);
  };

  const handleEnablePreventionPlan = (enabled: boolean) => {
    const updatedPlan = { ...plan, warningSignsEnabled: enabled };
    savePlan(updatedPlan);
    if (enabled) {
      toast.success("Relapse Prevention Plan enabled");
    }
  };

  const addWarningSign = () => {
    if (!newWarningSign.sign.trim()) {
      toast.error("Please enter a warning sign");
      return;
    }

    const warningSignObj: WarningSign = {
      id: Date.now().toString(),
      sign: newWarningSign.sign,
      category: newWarningSign.category
    };

    const updatedPlan = {
      ...plan,
      warningSign: [...plan.warningSign, warningSignObj]
    };
    savePlan(updatedPlan);
    setNewWarningSign({ sign: "", category: 'emotional' });
    toast.success("Warning sign added");
  };

  const deleteWarningSign = (id: string) => {
    const updatedPlan = {
      ...plan,
      warningSign: plan.warningSign.filter(s => s.id !== id)
    };
    savePlan(updatedPlan);
    toast.info("Warning sign removed");
  };

  const addActionStep = () => {
    if (!newActionStep.action.trim()) {
      toast.error("Please enter an action step");
      return;
    }

    const actionStepObj: ActionStep = {
      id: Date.now().toString(),
      action: newActionStep.action,
      priority: newActionStep.priority
    };

    const updatedPlan = {
      ...plan,
      actionSteps: [...plan.actionSteps, actionStepObj]
    };
    savePlan(updatedPlan);
    setNewActionStep({ action: "", priority: 'same-day' });
    toast.success("Action step added");
  };

  const deleteActionStep = (id: string) => {
    const updatedPlan = {
      ...plan,
      actionSteps: plan.actionSteps.filter(s => s.id !== id)
    };
    savePlan(updatedPlan);
    toast.info("Action step removed");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-[#2d2438] rounded-3xl shadow-2xl max-w-3xl w-full my-8 animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 px-6 py-6 relative flex-shrink-0 rounded-t-3xl">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close relapse prevention plan"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-white">Relapse Prevention Plan</h3>
              <p className="text-white/90 text-sm">Identify warning signs & action steps</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 max-h-[70vh]">
          {/* Important Disclaimer */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 border-2 border-amber-200 dark:border-amber-700/30 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-amber-900 dark:text-amber-200 mb-2 font-medium">
                  Important: Not a Guarantee
                </h4>
                <p className="text-amber-800 dark:text-amber-300 text-sm mb-3">
                  A relapse prevention plan is a <strong>supportive tool</strong>, not a 100% guarantee against relapse. Recovery is a journey with ups and downs. This plan helps you:
                </p>
                <ul className="text-amber-700 dark:text-amber-400 text-sm space-y-1 ml-4">
                  <li>• Recognize early warning signs</li>
                  <li>• Take predetermined action before things worsen</li>
                  <li>• Feel more in control of your recovery</li>
                  <li>• Reduce shame by planning ahead</li>
                </ul>
                <p className="text-amber-800 dark:text-amber-300 text-sm mt-3">
                  💜 <strong>Remember:</strong> If you do experience a setback, it doesn't mean failure. Reach out to your support system and healthcare providers.
                </p>
              </div>
            </div>
          </div>

          {/* Enable/Disable Toggle */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700/30 mb-6">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <h4 className="text-purple-900 dark:text-purple-200 mb-1">Enable Prevention Plan</h4>
                <p className="text-purple-600 dark:text-purple-400 text-sm">
                  Opt-in to track warning signs and action steps
                </p>
              </div>
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                plan.warningSignsEnabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              }`} onClick={() => handleEnablePreventionPlan(!plan.warningSignsEnabled)}>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    plan.warningSignsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </label>
          </div>

          {plan.warningSignsEnabled && (
            <>
              {/* Warning Signs Section */}
              <div className="mb-6">
                <h4 className="text-purple-900 dark:text-purple-200 mb-3">📍 Early Warning Signs</h4>
                <p className="text-purple-600 dark:text-purple-400 text-sm mb-4">
                  What patterns, feelings, or behaviors signal you might be struggling? Be specific.
                </p>

                {/* Add New Warning Sign */}
                <div className="bg-white dark:bg-[#1a1625] rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700/30 mb-4">
                  <div className="flex gap-2 mb-3">
                    <select
                      value={newWarningSign.category}
                      onChange={(e) => setNewWarningSign({ ...newWarningSign, category: e.target.value as any })}
                      className="px-3 py-2 rounded-lg border-2 border-purple-200 dark:border-purple-700/30 bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-200 text-sm"
                    >
                      {Object.entries(categoryLabels).map(([key, { label, icon }]) => (
                        <option key={key} value={key}>{icon} {label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newWarningSign.sign}
                      onChange={(e) => setNewWarningSign({ ...newWarningSign, sign: e.target.value })}
                      placeholder="e.g., Isolating from friends, sleeping too much, skipping meals..."
                      className="flex-1 border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100"
                      onKeyDown={(e) => e.key === 'Enter' && addWarningSign()}
                    />
                    <Button
                      onClick={addWarningSign}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Warning Signs List */}
                {plan.warningSign.length > 0 ? (
                  <div className="space-y-2">
                    {plan.warningSign.map((warning) => {
                      const category = categoryLabels[warning.category];
                      return (
                        <div
                          key={warning.id}
                          className={`p-3 rounded-xl border-2 ${category.color} flex items-start justify-between`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm">{category.icon}</span>
                              <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                {category.label}
                              </span>
                            </div>
                            <p className="text-purple-900 dark:text-purple-200 text-sm">
                              {warning.sign}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteWarningSign(warning.id)}
                            className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full p-1 transition-colors flex-shrink-0 ml-2"
                            aria-label="Delete warning sign"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700/30 text-center">
                    <p className="text-purple-600 dark:text-purple-400 text-sm">
                      No warning signs added yet. Start by identifying early patterns you've noticed.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Steps Section */}
              <div className="mb-6">
                <h4 className="text-purple-900 dark:text-purple-200 mb-3">⚡ Action Steps</h4>
                <p className="text-purple-600 dark:text-purple-400 text-sm mb-4">
                  What specific actions will you take when you notice warning signs?
                </p>

                {/* Add New Action Step */}
                <div className="bg-white dark:bg-[#1a1625] rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700/30 mb-4">
                  <div className="flex gap-2 mb-3">
                    <select
                      value={newActionStep.priority}
                      onChange={(e) => setNewActionStep({ ...newActionStep, priority: e.target.value as any })}
                      className="px-3 py-2 rounded-lg border-2 border-purple-200 dark:border-purple-700/30 bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-200 text-sm"
                    >
                      {Object.entries(priorityLabels).map(([key, { label, icon }]) => (
                        <option key={key} value={key}>{icon} {label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newActionStep.action}
                      onChange={(e) => setNewActionStep({ ...newActionStep, action: e.target.value })}
                      placeholder="e.g., Call my therapist, go for a walk, journal for 10 minutes..."
                      className="flex-1 border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100"
                      onKeyDown={(e) => e.key === 'Enter' && addActionStep()}
                    />
                    <Button
                      onClick={addActionStep}
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Steps List */}
                {plan.actionSteps.length > 0 ? (
                  <div className="space-y-2">
                    {plan.actionSteps.map((step) => {
                      const priority = priorityLabels[step.priority];
                      return (
                        <div
                          key={step.id}
                          className="p-3 rounded-xl border-2 border-purple-200 dark:border-purple-700/30 bg-white dark:bg-[#1a1625] flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${priority.color}`}>
                                {priority.icon} {priority.label}
                              </span>
                            </div>
                            <p className="text-purple-900 dark:text-purple-200 text-sm">
                              {step.action}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteActionStep(step.id)}
                            className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full p-1 transition-colors flex-shrink-0 ml-2"
                            aria-label="Delete action step"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700/30 text-center">
                    <p className="text-purple-600 dark:text-purple-400 text-sm">
                      No action steps added yet. Plan concrete actions you can take.
                    </p>
                  </div>
                )}
              </div>

              {/* Emergency Contacts */}
              <div className="mb-6">
                <h4 className="text-purple-900 dark:text-purple-200 mb-3">🚨 Emergency Support</h4>
                <p className="text-purple-600 dark:text-purple-400 text-sm mb-4">
                  Who can you reach out to in a crisis? (Optional)
                </p>
                <Textarea
                  value={plan.emergencyContacts}
                  onChange={(e) => {
                    const updatedPlan = { ...plan, emergencyContacts: e.target.value };
                    savePlan(updatedPlan);
                  }}
                  placeholder="Therapist: (555) 123-4567&#10;Sponsor: (555) 987-6543&#10;Crisis Line: 988&#10;Trusted Friend: Jane Doe (555) 555-5555"
                  className="min-h-24 border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100"
                />
              </div>

              {/* Helpful Tips */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-4 border-2 border-teal-200 dark:border-teal-700/30">
                <h5 className="text-teal-900 dark:text-teal-200 mb-2 text-sm font-medium">
                  💡 Tips for Success
                </h5>
                <ul className="text-teal-800 dark:text-teal-300 text-sm space-y-1">
                  <li>✓ Review this plan weekly when you're feeling stable</li>
                  <li>✓ Share it with your therapist, sponsor, or support buddy</li>
                  <li>✓ Update warning signs as you learn more about yourself</li>
                  <li>✓ Practice action steps even when you feel okay</li>
                  <li>✓ Be compassionate with yourself - recovery isn't linear</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-purple-50 dark:bg-purple-900/20 border-t-2 border-purple-200 dark:border-purple-700/30 flex-shrink-0 rounded-b-3xl">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
          >
            Done
          </Button>
          {plan.lastUpdated && (
            <p className="text-purple-600 dark:text-purple-400 text-xs text-center mt-3">
              Last updated: {new Date(plan.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
