import { useState } from "react";
import { Button } from "./ui/button";
import { X, Pill, Shield, Users } from "lucide-react";
import { toast } from "sonner";
import { toggleMedicalFeatures, isMedicalFeaturesEnabled } from "../utils/userJourney";

interface MedicalFeaturesToggleProps {
  onClose: () => void;
  onUpdate?: () => void;
}

export default function MedicalFeaturesToggle({ onClose, onUpdate }: MedicalFeaturesToggleProps) {
  const [enabled, setEnabled] = useState(isMedicalFeaturesEnabled());

  const handleSave = () => {
    toggleMedicalFeatures(enabled);
    toast.success(enabled ? '✅ Advanced support features enabled' : '💜 Features updated');
    
    if (onUpdate) {
      onUpdate();
    }
    
    // Dispatch event for other components
    window.dispatchEvent(new Event('medicalFeaturesUpdated'));
    
    onClose();
  };

  const features = [
    {
      icon: <Pill className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      title: 'Medicine Reminders',
      description: 'Track medications and get daily reminder notifications'
    },
    {
      icon: <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      title: 'Personal Reset Plan',
      description: 'Create early warning signs tracker and action steps for setbacks'
    },
    {
      icon: <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      title: 'Support Buddy System',
      description: 'Assign a trusted contact for wellness check-ins and accountability'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#2d2438] rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 px-6 py-6 relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close advanced features"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-white">Advanced Support Features</h3>
              <p className="text-white/90 text-sm">Optional tools for extra support</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                enabled
                  ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-400 dark:border-purple-500 shadow-md'
                  : 'bg-white dark:bg-[#1a1625] border-purple-200 dark:border-purple-700/30 hover:border-purple-300'
              }`}
              aria-pressed={enabled}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-purple-900 dark:text-purple-200 font-medium">
                      {enabled ? 'Enabled ✓' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm">
                    {enabled 
                      ? 'Advanced support features are active and visible' 
                      : 'Basic features only - you can enable these anytime'}
                  </p>
                </div>
                <div className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  enabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </div>
            </button>
          </div>

          {/* Features List */}
          <div className="mb-6">
            <h4 className="text-purple-900 dark:text-purple-200 mb-3 font-medium">
              What gets enabled:
            </h4>
            <div className="space-y-3">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    enabled
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700/30'
                      : 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/30 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {feature.icon}
                    <div className="flex-1">
                      <h5 className="text-purple-900 dark:text-purple-200 font-medium text-sm mb-1">
                        {feature.title}
                      </h5>
                      <p className="text-purple-600 dark:text-purple-400 text-xs">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-4 border-2 border-teal-200 dark:border-teal-700/30">
            <p className="text-teal-800 dark:text-teal-300 text-sm">
              💡 <strong>You're in control:</strong> Enable or disable these features anytime. Your choice doesn't define you - it just personalizes your experience.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-purple-50 dark:bg-purple-900/20 border-t-2 border-purple-200 dark:border-purple-700/30 flex-shrink-0">
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Save Preferences
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
