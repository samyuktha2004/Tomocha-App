import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X, UserPlus, Shield, Heart, Mail, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface SupportBuddyProps {
  onClose: () => void;
}

interface Buddy {
  name: string;
  relationship: string;
  email: string;
  phone: string;
  consentGiven: boolean;
  dateAdded: string;
}

export default function SupportBuddy({ onClose }: SupportBuddyProps) {
  const [buddy, setBuddy] = useState<Buddy | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    email: "",
    phone: ""
  });
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    // Load existing buddy from localStorage
    const saved = localStorage.getItem('supportBuddy');
    if (saved) {
      const buddyData = JSON.parse(saved);
      setBuddy(buddyData);
      setFormData({
        name: buddyData.name,
        relationship: buddyData.relationship,
        email: buddyData.email,
        phone: buddyData.phone
      });
      setConsentChecked(buddyData.consentGiven);
    } else {
      setIsEditing(true);
    }
  }, []);

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      toast.error("Please enter at least name and email");
      return;
    }

    if (!consentChecked) {
      toast.error("Please consent to the support buddy feature");
      return;
    }

    const newBuddy: Buddy = {
      ...formData,
      consentGiven: consentChecked,
      dateAdded: new Date().toISOString()
    };

    localStorage.setItem('supportBuddy', JSON.stringify(newBuddy));
    setBuddy(newBuddy);
    setIsEditing(false);
    
    // Reset last check-in tracking
    localStorage.setItem('lastCheckIn', new Date().toISOString());
    
    toast.success("✨ Support buddy saved! They'll receive a gentle notification if you haven't checked in for 3 days.");
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to remove your support buddy?")) {
      localStorage.removeItem('supportBuddy');
      setBuddy(null);
      setFormData({ name: "", relationship: "", email: "", phone: "" });
      setConsentChecked(false);
      setIsEditing(true);
      toast.info("Support buddy removed");
    }
  };

  const handleTestAlert = () => {
    if (!buddy) return;
    
    toast.success(
      `Test alert sent to ${buddy.name}!`,
      {
        description: "In a real scenario, they would receive: \"Your friend hasn't checked in with Tomocha for a few days. Consider reaching out to see how they're doing. 💜\"",
        duration: 5000
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#2d2438] rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 px-6 py-6 relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close support buddy settings"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-white">Support Buddy</h3>
              <p className="text-white/90">Your trusted wellness check-in contact</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Explanation */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700/30 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-purple-900 dark:text-purple-200 mb-2">How It Works</h4>
                <ul className="text-purple-700 dark:text-purple-300 text-sm space-y-1">
                  <li>✓ Your buddy gets a gentle alert if you haven't checked in for 3+ days</li>
                  <li>✓ They receive ONLY a wellness check prompt - no personal data</li>
                  <li>✓ You can remove or update your buddy anytime</li>
                  <li>✓ All data stays on your device</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="buddyName" className="text-purple-700 dark:text-purple-300">
                  Name *
                </Label>
                <Input
                  id="buddyName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Their name"
                  className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buddyRelationship" className="text-purple-700 dark:text-purple-300">
                  Relationship
                </Label>
                <Input
                  id="buddyRelationship"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  placeholder="Friend, Partner, Family Member, etc."
                  className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buddyEmail" className="text-purple-700 dark:text-purple-300">
                  Email *
                </Label>
                <Input
                  id="buddyEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="their.email@example.com"
                  className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buddyPhone" className="text-purple-700 dark:text-purple-300">
                  Phone (Optional)
                </Label>
                <Input
                  id="buddyPhone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="border-purple-200 dark:border-purple-700/30 dark:bg-slate-800 dark:text-purple-100"
                />
              </div>

              {/* Consent */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border-2 border-purple-300 dark:border-purple-600/30 mt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="w-5 h-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500 mt-0.5 flex-shrink-0"
                  />
                  <div className="text-sm">
                    <p className="text-purple-900 dark:text-purple-200 mb-2">
                      <strong>I consent to the following:</strong>
                    </p>
                    <ul className="text-purple-700 dark:text-purple-300 space-y-1">
                      <li>• My support buddy may receive wellness check alerts</li>
                      <li>• Alerts only indicate I haven't checked in recently</li>
                      <li>• No personal health data or app content is shared</li>
                      <li>• I can revoke this consent anytime</li>
                    </ul>
                  </div>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  disabled={!consentChecked}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Save Support Buddy
                </Button>
                {buddy && (
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ) : buddy ? (
            <div className="space-y-4">
              {/* Buddy Info Display */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border-2 border-purple-200 dark:border-purple-700/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div>
                    <h4 className="text-purple-900 dark:text-purple-200">{buddy.name}</h4>
                    {buddy.relationship && (
                      <p className="text-purple-600 dark:text-purple-400 text-sm">{buddy.relationship}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Mail className="w-4 h-4" />
                    <span>{buddy.email}</span>
                  </div>
                  {buddy.phone && (
                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                      <span>📱</span>
                      <span>{buddy.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 pt-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span>Active since {new Date(buddy.dateAdded).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4 border-2 border-teal-200 dark:border-teal-700/30">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-teal-800 dark:text-teal-300 text-sm">
                      <strong>Status:</strong> Your support buddy will be notified if you don't check in for 3 consecutive days. Keep building your streak to stay connected! 💜
                    </p>
                  </div>
                </div>
              </div>

              {/* Example Alert */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700/30">
                <p className="text-purple-700 dark:text-purple-300 text-sm mb-3">
                  <strong>Example Alert They'll Receive:</strong>
                </p>
                <div className="bg-white dark:bg-[#1a1625] rounded-lg p-3 border border-purple-200 dark:border-purple-700/30 text-sm text-purple-800 dark:text-purple-200">
                  "Hi {buddy.name}! Your friend hasn't checked in with Tomocha for a few days. Consider reaching out to see how they're doing. 💜"
                </div>
                <p className="text-purple-600 dark:text-purple-400 text-xs mt-2">
                  Note: No personal data, mood information, or app content is shared.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex-1 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                >
                  Edit Buddy
                </Button>
                <Button
                  onClick={handleTestAlert}
                  variant="outline"
                  className="flex-1 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300"
                >
                  Test Alert
                </Button>
              </div>

              <Button
                onClick={handleDelete}
                variant="outline"
                className="w-full border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Support Buddy
              </Button>
            </div>
          ) : null}

          {/* Privacy Notice */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border-2 border-indigo-200 dark:border-indigo-700/30 mt-6">
            <p className="text-indigo-800 dark:text-indigo-300 text-sm">
              🔒 <strong>Privacy First:</strong> Your support buddy feature works entirely locally on your device. No data is sent to external servers. Alerts would need to be manually configured through your own email/SMS service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
