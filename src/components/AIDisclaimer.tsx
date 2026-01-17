import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, AlertTriangle, Heart, Phone } from "lucide-react";

interface AIDisclaimerProps {
  onAccept: () => void;
  isMonthlyReminder?: boolean;
}

export default function AIDisclaimer({ onAccept, isMonthlyReminder = false }: AIDisclaimerProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#2d2438] rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-white">
                {isMonthlyReminder ? "Monthly Reminder" : "Important Notice"}
              </h3>
              <p className="text-white/90 text-sm">About AI Mental Health Support</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4 mb-6">
            {/* Main disclaimer */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border-2 border-amber-200 dark:border-amber-700/30">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-amber-900 dark:text-amber-200 mb-2">
                    AI Chatbots Are Supportive Tools
                  </h4>
                  <p className="text-amber-800 dark:text-amber-300 text-sm">
                    Our AI chatbots provide emotional support and guidance, but they are <strong>NOT a replacement for professional mental health care</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* What AI can do */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border-2 border-green-200 dark:border-green-700/30">
              <h5 className="text-green-900 dark:text-green-200 mb-2 text-sm font-medium">
                ✓ What AI Chatbots CAN Help With:
              </h5>
              <ul className="text-green-800 dark:text-green-300 text-sm space-y-1">
                <li>• Emotional support and active listening</li>
                <li>• Coping strategy suggestions</li>
                <li>• Mindfulness and grounding exercises</li>
                <li>• Motivational encouragement</li>
                <li>• Self-care activity ideas</li>
              </ul>
            </div>

            {/* What AI cannot do */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border-2 border-red-200 dark:border-red-700/30">
              <h5 className="text-red-900 dark:text-red-200 mb-2 text-sm font-medium">
                ✗ What AI Chatbots CANNOT Do:
              </h5>
              <ul className="text-red-800 dark:text-red-300 text-sm space-y-1">
                <li>• Diagnose mental health conditions</li>
                <li>• Prescribe medications or treatments</li>
                <li>• Provide crisis intervention</li>
                <li>• Replace therapy or counseling</li>
                <li>• Handle emergency situations</li>
              </ul>
            </div>

            {/* Crisis resources */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700/30">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-purple-900 dark:text-purple-200 mb-2 text-sm font-medium">
                    🚨 In Crisis? Get Immediate Help:
                  </h5>
                  <div className="text-purple-800 dark:text-purple-300 text-sm space-y-1">
                    <p><strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988</p>
                    <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                    <p><strong>Emergency:</strong> Call 911 or go to your nearest ER</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Limitations */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border-2 border-indigo-200 dark:border-indigo-700/30">
              <p className="text-indigo-800 dark:text-indigo-300 text-sm">
                <strong>⚠️ AI Limitations:</strong> AI can make mistakes, misunderstand context, or provide generic advice. Always use your judgment and consult healthcare professionals for medical decisions.
              </p>
            </div>

            {/* Acknowledgment */}
            <label className="flex items-start gap-3 cursor-pointer p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-700/30">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="w-5 h-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500 mt-0.5 flex-shrink-0"
              />
              <span className="text-purple-900 dark:text-purple-200 text-sm">
                I understand that AI chatbots are supportive tools, not professional mental health care, and I will seek professional help when needed.
              </span>
            </label>
          </div>

          {/* Actions */}
          <Button
            onClick={onAccept}
            disabled={!acknowledged}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white disabled:opacity-50"
          >
            {isMonthlyReminder ? "I Understand - Continue" : "I Understand - Start Chatting"}
          </Button>

          {isMonthlyReminder && (
            <p className="text-purple-600 dark:text-purple-400 text-xs text-center mt-3">
              This reminder appears monthly to ensure safe and informed use of AI support.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to check if monthly reminder is needed
export const shouldShowMonthlyReminder = (): boolean => {
  const lastShown = localStorage.getItem('lastAIDisclaimerReminder');
  
  if (!lastShown) {
    return false; // First time users see it on chatbot access
  }
  
  const lastShownDate = new Date(lastShown);
  const now = new Date();
  const daysSince = Math.floor((now.getTime() - lastShownDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysSince >= 30; // Show every 30 days
};

// Helper to mark reminder as shown
export const markAIDisclaimerShown = () => {
  localStorage.setItem('lastAIDisclaimerReminder', new Date().toISOString());
};

// Helper to check if user has ever accepted disclaimer
export const hasAcceptedAIDisclaimer = (): boolean => {
  return localStorage.getItem('aiDisclaimerAccepted') === 'true';
};

// Helper to mark disclaimer as accepted
export const acceptAIDisclaimer = () => {
  localStorage.setItem('aiDisclaimerAccepted', 'true');
  markAIDisclaimerShown();
};
