import { useState } from "react";
import { Button } from "./ui/button";
import { X, Shield, Database, Trash2, Download, CheckCircle2, XCircle, WifiOff } from "lucide-react";
import { toast } from "sonner";

interface PrivacyDataProps {
  onClose: () => void;
}

export default function PrivacyData({ onClose }: PrivacyDataProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleExportData = () => {
    try {
      // Collect all Tomocha data from localStorage
      const tomochaData: { [key: string]: any } = {};
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              tomochaData[key] = JSON.parse(value);
            } catch {
              tomochaData[key] = value;
            }
          }
        }
      }

      // Create downloadable file
      const dataStr = JSON.stringify(tomochaData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tomocha-data-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("✨ Your data has been exported successfully!");
    } catch (error) {
      toast.error("Failed to export data. Please try again.");
    }
  };

  const handleDeleteAllData = () => {
    if (deleteConfirmText !== "DELETE MY DATA") {
      toast.error('Please type "DELETE MY DATA" to confirm');
      return;
    }

    // Clear all localStorage data
    localStorage.clear();
    
    toast.success("All data has been permanently deleted.", {
      duration: 3000
    });

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const dataWeTrack = [
    {
      category: "Self-Care Progress",
      items: [
        "Daily mood ratings (1-100 scale)",
        "Emotion tags selected during check-ins",
        "Completed self-care tasks",
        "Task effectiveness ratings",
        "XP/progress points earned",
        "Completion streaks"
      ]
    },
    {
      category: "Wellness Data",
      items: [
        "Medicine reminder schedules",
        "Notification preferences",
        "Last check-in timestamps",
        "Garden pets unlocked"
      ]
    },
    {
      category: "Personal Customization",
      items: [
        "Profile name and avatar choice",
        "App preferences (language, colors, animations)",
        "Support buddy contact info (if added)",
        "Coping strategies you've written"
      ]
    },
    {
      category: "Account Details (Optional)",
      items: [
        "Name, email, phone (if provided)",
        "Emergency contact info (if provided)",
        "Health provider info (if provided)"
      ]
    }
  ];

  const dataWeNeverTrack = [
    "🚫 Actual chatbot conversation content (prompts sent to AI)",
    "🚫 Your location or GPS data",
    "🚫 Device information or identifiers",
    "🚫 Contacts from your phone",
    "🚫 Photos or media files",
    "🚫 Browsing history",
    "🚫 Third-party app data",
    "🚫 Financial information",
    "🚫 Social media accounts",
    "🚫 Biometric data"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#2d2438] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 px-6 py-6 relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close privacy settings"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-white">Privacy & Your Data</h3>
              <p className="text-white/90">Complete transparency about what we track</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Local Storage Notice */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-5 border-2 border-teal-200 dark:border-teal-700/30 mb-6">
            <div className="flex items-start gap-3">
              <WifiOff className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-teal-900 dark:text-teal-200 mb-2">
                  🔒 Your Data Stays On Your Device
                </h4>
                <p className="text-teal-800 dark:text-teal-300 text-sm mb-3">
                  Tomocha stores <strong>100% of your data locally</strong> using browser localStorage. Nothing is sent to external servers or stored in the cloud.
                </p>
                <ul className="text-teal-700 dark:text-teal-400 text-sm space-y-1">
                  <li>✓ Works completely offline</li>
                  <li>✓ No account registration required</li>
                  <li>✓ No data transmission to servers</li>
                  <li>✓ You have full control - export or delete anytime</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What We Track */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h4 className="text-purple-900 dark:text-purple-200">What We Track (Locally)</h4>
            </div>
            
            <div className="space-y-4">
              {dataWeTrack.map((section, idx) => (
                <div 
                  key={idx}
                  className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700/30"
                >
                  <h5 className="text-purple-800 dark:text-purple-300 mb-2">{section.category}</h5>
                  <ul className="space-y-1">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-purple-700 dark:text-purple-400 text-sm flex items-start gap-2">
                        <span className="text-purple-500 dark:text-purple-500 flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* What We Never Track */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h4 className="text-purple-900 dark:text-purple-200">What We NEVER Track</h4>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border-2 border-red-200 dark:border-red-700/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {dataWeNeverTrack.map((item, idx) => (
                  <div key={idx} className="text-red-800 dark:text-red-300 text-sm flex items-start gap-2">
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Chatbot Note */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border-2 border-yellow-200 dark:border-yellow-700/30 mb-6">
            <p className="text-yellow-800 dark:text-yellow-300 text-sm">
              <strong>⚠️ AI Chatbot Privacy:</strong> When you use AI chatbots, your prompts are sent to third-party AI services (OpenAI, Anthropic, etc.) to generate responses. These services have their own privacy policies. Tomocha itself does NOT store your conversation history.
            </p>
          </div>

          {/* Data Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h4 className="text-purple-900 dark:text-purple-200">Manage Your Data</h4>
            </div>

            <Button
              onClick={handleExportData}
              variant="outline"
              className="w-full border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <Download className="w-5 h-5 mr-2" />
              Export All My Data (JSON)
            </Button>

            {!showDeleteConfirm ? (
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="outline"
                className="w-full border-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete All My Data
              </Button>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border-2 border-red-300 dark:border-red-700/30">
                <h5 className="text-red-900 dark:text-red-200 mb-3">⚠️ Permanent Deletion</h5>
                <p className="text-red-800 dark:text-red-300 text-sm mb-4">
                  This will permanently delete ALL your Tomocha data including mood history, tasks, garden progress, and preferences. This action cannot be undone.
                </p>
                <p className="text-red-700 dark:text-red-400 text-sm mb-3">
                  Type <strong>"DELETE MY DATA"</strong> to confirm:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE MY DATA"
                  className="w-full px-4 py-2 rounded-lg border-2 border-red-300 dark:border-red-700 bg-white dark:bg-[#1a1625] text-red-900 dark:text-red-200 mb-3"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleDeleteAllData}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    disabled={deleteConfirmText !== "DELETE MY DATA"}
                  >
                    Confirm Deletion
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText("");
                    }}
                    variant="outline"
                    className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Additional Privacy Info */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border-2 border-indigo-200 dark:border-indigo-700/30 mt-6">
            <p className="text-indigo-800 dark:text-indigo-300 text-sm">
              💡 <strong>Questions about privacy?</strong> Tomocha is designed with privacy-first principles. Since data never leaves your device, you have complete control. Clearing your browser data will also remove all Tomocha information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
