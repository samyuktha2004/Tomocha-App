import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, Bell, BellOff, Clock, Zap } from "lucide-react";
import { toast } from "sonner";

interface NotificationSettingsProps {
  onClose: () => void;
}

export default function NotificationSettings({ onClose }: NotificationSettingsProps) {
  const [enabledNotifications, setEnabledNotifications] = useState(true);
  const [dndEnabled, setDndEnabled] = useState(false);
  const [dndStartHour, setDndStartHour] = useState(22); // 10 PM
  const [dndEndHour, setDndEndHour] = useState(8); // 8 AM
  const [smartScheduling, setSmartScheduling] = useState(true);
  const [preferredTimes, setPreferredTimes] = useState({
    morning: true,
    afternoon: false,
    evening: true
  });

  // Load settings from localStorage
  useEffect(() => {
    const settings = localStorage.getItem('notificationSettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setEnabledNotifications(parsed.enabled ?? true);
      setDndEnabled(parsed.dndEnabled ?? false);
      setDndStartHour(parsed.dndStartHour ?? 22);
      setDndEndHour(parsed.dndEndHour ?? 8);
      setSmartScheduling(parsed.smartScheduling ?? true);
      setPreferredTimes(parsed.preferredTimes ?? { morning: true, afternoon: false, evening: true });
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      enabled: enabledNotifications,
      dndEnabled,
      dndStartHour,
      dndEndHour,
      smartScheduling,
      preferredTimes
    };
    
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    
    // Set up smart notification tracking
    if (smartScheduling) {
      // Track when user is most active
      trackUserActivity();
    }
    
    toast.success('✨ Notification settings saved!');
    onClose();
  };

  // Track user activity to learn best notification times
  const trackUserActivity = () => {
    const now = new Date();
    const hour = now.getHours();
    const activityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
    
    activityLog.push({
      hour,
      timestamp: now.toISOString(),
      action: 'settings_update'
    });
    
    // Keep only last 30 days of activity
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const filteredLog = activityLog.filter((entry: any) => 
      new Date(entry.timestamp).getTime() > thirtyDaysAgo
    );
    
    localStorage.setItem('activityLog', JSON.stringify(filteredLog));
  };

  // Check if current time is in DND period
  const isInDNDPeriod = () => {
    const now = new Date().getHours();
    
    if (dndStartHour < dndEndHour) {
      // DND period doesn't cross midnight (e.g., 14:00 - 18:00)
      return now >= dndStartHour && now < dndEndHour;
    } else {
      // DND period crosses midnight (e.g., 22:00 - 08:00)
      return now >= dndStartHour || now < dndEndHour;
    }
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#2d2438] rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 px-6 py-6 relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close notification settings"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-white">Notification Settings</h3>
              <p className="text-white/90">Customize your reminder preferences</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Enable/Disable Notifications */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Bell className={`w-5 h-5 ${enabledNotifications ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                <h4 className="text-purple-900 dark:text-purple-200">Enable Notifications</h4>
              </div>
              <button
                onClick={() => setEnabledNotifications(!enabledNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enabledNotifications ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={enabledNotifications ? 'Disable notifications' : 'Enable notifications'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enabledNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-purple-600 dark:text-purple-400 text-sm">
              Receive daily reminders for check-ins and self-care tasks
            </p>
          </div>

          {enabledNotifications && (
            <>
              {/* Do Not Disturb Hours */}
              <div className="mb-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 border-2 border-purple-200 dark:border-purple-700/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BellOff className={`w-5 h-5 ${dndEnabled ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                    <h4 className="text-purple-900 dark:text-purple-200">Do Not Disturb</h4>
                  </div>
                  <button
                    onClick={() => setDndEnabled(!dndEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      dndEnabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-label={dndEnabled ? 'Disable Do Not Disturb' : 'Enable Do Not Disturb'}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        dndEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <p className="text-purple-600 dark:text-purple-400 text-sm mb-4">
                  Gentle visual reminders only during these hours (no sound/vibration)
                </p>

                {dndEnabled && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-purple-700 dark:text-purple-300 text-sm mb-1 block">Start Time</label>
                      <select
                        value={dndStartHour}
                        onChange={(e) => setDndStartHour(parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border-2 border-purple-200 dark:border-purple-700/30 bg-white dark:bg-[#2d2438] text-purple-900 dark:text-purple-200"
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i}>{formatHour(i)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-purple-700 dark:text-purple-300 text-sm mb-1 block">End Time</label>
                      <select
                        value={dndEndHour}
                        onChange={(e) => setDndEndHour(parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border-2 border-purple-200 dark:border-purple-700/30 bg-white dark:bg-[#2d2438] text-purple-900 dark:text-purple-200"
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i}>{formatHour(i)}</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-white dark:bg-[#2d2438] rounded-xl p-3 text-sm">
                      <p className="text-purple-700 dark:text-purple-300">
                        <Clock className="w-4 h-4 inline mr-1" />
                        DND Period: {formatHour(dndStartHour)} - {formatHour(dndEndHour)}
                      </p>
                      {isInDNDPeriod() && (
                        <p className="text-purple-600 dark:text-purple-400 mt-1">
                          🌙 Currently in Do Not Disturb period
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Smart Scheduling */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className={`w-5 h-5 ${smartScheduling ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                    <h4 className="text-purple-900 dark:text-purple-200">Smart Scheduling</h4>
                  </div>
                  <button
                    onClick={() => setSmartScheduling(!smartScheduling)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      smartScheduling ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-label={smartScheduling ? 'Disable smart scheduling' : 'Enable smart scheduling'}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        smartScheduling ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <p className="text-purple-600 dark:text-purple-400 text-sm mb-4">
                  Learn when you're most receptive and adjust notification timing accordingly
                </p>

                {smartScheduling && (
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700/30">
                    <p className="text-purple-700 dark:text-purple-300 text-sm mb-3">
                      💡 Preferred Times (we'll learn your patterns automatically)
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferredTimes.morning}
                          onChange={(e) => setPreferredTimes({ ...preferredTimes, morning: e.target.checked })}
                          className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-purple-900 dark:text-purple-200">Morning (6 AM - 12 PM)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferredTimes.afternoon}
                          onChange={(e) => setPreferredTimes({ ...preferredTimes, afternoon: e.target.checked })}
                          className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-purple-900 dark:text-purple-200">Afternoon (12 PM - 6 PM)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferredTimes.evening}
                          onChange={(e) => setPreferredTimes({ ...preferredTimes, evening: e.target.checked })}
                          className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-purple-900 dark:text-purple-200">Evening (6 PM - 10 PM)</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4 border-2 border-teal-200 dark:border-teal-700/30">
                <p className="text-teal-800 dark:text-teal-300 text-sm">
                  ✨ <strong>How it works:</strong> We track when you're most active in the app and gradually adjust reminder times to match your natural rhythm. DND hours ensure you're never disturbed when you need rest.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-purple-50 dark:bg-purple-900/20 border-t-2 border-purple-200 dark:border-purple-700/30 flex-shrink-0">
          <div className="flex gap-3">
            <Button
              onClick={saveSettings}
              className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
            >
              Save Settings
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
