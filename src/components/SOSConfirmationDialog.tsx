import { AlertTriangle, X } from "lucide-react";
import { Button } from "./ui/button";

interface SOSConfirmationDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SOSConfirmationDialog({ onConfirm, onCancel }: SOSConfirmationDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#2d2438] rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 dark:from-red-600 dark:to-pink-600 px-6 py-6 relative">
          <button 
            onClick={onCancel}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-white">Send SOS Alert?</h3>
              <p className="text-white/90">This will notify your support circle</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-purple-900 dark:text-purple-200 mb-4">
              Your support circle will receive an alert that you need someone to talk to in the next 8 minutes:
            </p>
            
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-4 border-2 border-teal-200 dark:border-teal-700/30">
              <p className="text-teal-900 dark:text-teal-200 mb-3">Will be notified:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>👩 Mom</span>
                </div>
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>👤 Best Friend Sarah</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700/30 mb-6">
            <p className="text-purple-800 dark:text-purple-300">
              💜 <strong>Aura</strong> will be with you immediately while you wait for your support circle to respond.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button 
              onClick={onConfirm}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full py-6 shadow-lg"
            >
              Yes, Send SOS Alert
            </Button>
            <Button 
              onClick={onCancel}
              variant="outline"
              className="w-full border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full py-6"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}