// Notification Service for Tomocha Mental Health App

export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  dailyReminderTime: string; // Format: "HH:MM"
  moodCheckIn: boolean;
  moodCheckInTime: string; // Format: "HH:MM"
  taskReminders: boolean;
  taskReminderTime: string; // Format: "HH:MM"
  medicineReminders: boolean; // NEW: Medicine reminders toggle
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  times: string[]; // Array of times in "HH:MM" format
  days: string[]; // Array of days: "Mon", "Tue", "Wed", etc. Empty = all days
  notes?: string;
  color?: string;
  enabled: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  dailyReminder: true,
  dailyReminderTime: "09:00",
  moodCheckIn: true,
  moodCheckInTime: "20:00",
  taskReminders: true,
  taskReminderTime: "10:00",
  medicineReminders: true // NEW: Default enabled
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

// Show a notification
export const showNotification = (title: string, options?: NotificationOptions) => {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const defaultOptions: NotificationOptions = {
    icon: "/tomocha-icon.png",
    badge: "/tomocha-badge.png",
    vibrate: [200, 100, 200],
    requireInteraction: false,
    ...options
  };

  new Notification(title, defaultOptions);
};

// Get notification settings from localStorage
export const getNotificationSettings = (): NotificationSettings => {
  const stored = localStorage.getItem('notificationSettings');
  if (stored) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch (e) {
      console.error("Failed to parse notification settings", e);
    }
  }
  return DEFAULT_SETTINGS;
};

// Save notification settings to localStorage
export const saveNotificationSettings = (settings: NotificationSettings): void => {
  localStorage.setItem('notificationSettings', JSON.stringify(settings));
  
  // Reschedule all notifications
  scheduleAllNotifications();
};

// Calculate milliseconds until target time
const calculateTimeUntilTarget = (targetTime: string): number => {
  const [hours, minutes] = targetTime.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  
  // If target time has passed today, schedule for tomorrow
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  
  return target.getTime() - now.getTime();
};

// Schedule a single notification
const scheduleNotification = (
  type: 'daily' | 'mood' | 'task',
  time: string,
  callback: () => void
): number => {
  const delay = calculateTimeUntilTarget(time);
  
  return window.setTimeout(() => {
    callback();
    // Reschedule for next day (24 hours later)
    window.setTimeout(() => {
      scheduleNotification(type, time, callback);
    }, 24 * 60 * 60 * 1000);
  }, delay);
};

// Store active timeout IDs
let activeTimeouts: { [key: string]: number } = {};

// Clear all scheduled notifications
export const clearAllNotifications = (): void => {
  Object.values(activeTimeouts).forEach(timeoutId => {
    window.clearTimeout(timeoutId);
  });
  activeTimeouts = {};
};

// Schedule all enabled notifications
export const scheduleAllNotifications = (): void => {
  clearAllNotifications();
  
  const settings = getNotificationSettings();
  
  if (!settings.enabled || Notification.permission !== "granted") {
    return;
  }
  
  // Daily reminder notification
  if (settings.dailyReminder) {
    activeTimeouts.daily = scheduleNotification(
      'daily',
      settings.dailyReminderTime,
      () => {
        showNotification(
          "💜 Daily Tomocha Check-in",
          {
            body: "Time to start your self-care journey! Complete today's tasks and earn XP.",
            tag: "daily-reminder",
            data: { screen: 'tracker' }
          }
        );
      }
    );
  }
  
  // Mood check-in notification
  if (settings.moodCheckIn) {
    activeTimeouts.mood = scheduleNotification(
      'mood',
      settings.moodCheckInTime,
      () => {
        showNotification(
          "😊 How are you feeling?",
          {
            body: "Take a moment to check in with yourself. Let us know how you're doing today.",
            tag: "mood-checkin",
            data: { screen: 'home' }
          }
        );
      }
    );
  }
  
  // Task reminder notification
  if (settings.taskReminders) {
    activeTimeouts.task = scheduleNotification(
      'task',
      settings.taskReminderTime,
      () => {
        showNotification(
          "⭐ Task Reminder",
          {
            body: "You have pending self-care tasks. Let's make progress together!",
            tag: "task-reminder",
            data: { screen: 'tracker' }
          }
        );
      }
    );
  }
  
  // Medicine reminders
  if (settings.medicineReminders) {
    scheduleMedicineReminders();
  }
};

// Initialize notification system
export const initNotificationSystem = (): void => {
  const settings = getNotificationSettings();
  
  if (settings.enabled && Notification.permission === "granted") {
    scheduleAllNotifications();
  }
  
  // Handle notification click events
  if ("Notification" in window) {
    // Note: Notification click handling in web apps is limited
    // This would work better in a PWA/Service Worker context
    console.log("Notification system initialized");
  }
};

// Check if notifications are supported
export const areNotificationsSupported = (): boolean => {
  return "Notification" in window;
};

// Get current notification permission status
export const getNotificationPermission = (): NotificationPermission | null => {
  if ("Notification" in window) {
    return Notification.permission;
  }
  return null;
};

// Send a test notification
export const sendTestNotification = (): void => {
  showNotification(
    "🎉 Test Notification",
    {
      body: "Tomocha notifications are working! You'll receive reminders at your scheduled times.",
      tag: "test-notification"
    }
  );
};

// ===== MEDICINE REMINDER FUNCTIONS =====

// Get all medicines from localStorage
export const getMedicines = (): Medicine[] => {
  const stored = localStorage.getItem('medicines');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse medicines", e);
    }
  }
  return [];
};

// Save medicines to localStorage
export const saveMedicines = (medicines: Medicine[]): void => {
  localStorage.setItem('medicines', JSON.stringify(medicines));
  scheduleMedicineReminders();
};

// Add a new medicine
export const addMedicine = (medicine: Omit<Medicine, 'id'>): Medicine => {
  const medicines = getMedicines();
  const newMedicine: Medicine = {
    ...medicine,
    id: Date.now().toString() + Math.random().toString(36).substring(2, 9)
  };
  medicines.push(newMedicine);
  saveMedicines(medicines);
  return newMedicine;
};

// Update an existing medicine
export const updateMedicine = (id: string, updates: Partial<Medicine>): void => {
  const medicines = getMedicines();
  const index = medicines.findIndex(m => m.id === id);
  if (index !== -1) {
    medicines[index] = { ...medicines[index], ...updates };
    saveMedicines(medicines);
  }
};

// Delete a medicine
export const deleteMedicine = (id: string): void => {
  const medicines = getMedicines().filter(m => m.id !== id);
  saveMedicines(medicines);
};

// Toggle medicine enabled/disabled
export const toggleMedicine = (id: string): void => {
  const medicines = getMedicines();
  const medicine = medicines.find(m => m.id === id);
  if (medicine) {
    medicine.enabled = !medicine.enabled;
    saveMedicines(medicines);
  }
};

// Check if today matches medicine's scheduled days
const isTodayScheduled = (medicine: Medicine): boolean => {
  if (!medicine.days || medicine.days.length === 0) {
    return true; // No specific days = every day
  }
  
  const daysMap: { [key: string]: number } = {
    'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
  };
  
  const today = new Date().getDay();
  return medicine.days.some(day => daysMap[day] === today);
};

// Schedule medicine reminder for a specific time
const scheduleMedicineReminder = (medicine: Medicine, time: string, timeoutKey: string): number => {
  const delay = calculateTimeUntilTarget(time);
  
  return window.setTimeout(() => {
    // Only send notification if it's a scheduled day
    if (isTodayScheduled(medicine)) {
      showNotification(
        `💊 Medicine Reminder`,
        {
          body: `Time to take ${medicine.name}${medicine.dosage ? ` (${medicine.dosage})` : ''}`,
          tag: `medicine-${medicine.id}-${time}`,
          icon: "/tomocha-icon.png",
          requireInteraction: true, // Keep notification visible until user interacts
          vibrate: [200, 100, 200, 100, 200],
          data: { 
            screen: 'medicines',
            medicineId: medicine.id
          }
        }
      );
    }
    
    // Reschedule for next day
    window.setTimeout(() => {
      if (getMedicines().some(m => m.id === medicine.id && m.enabled)) {
        activeTimeouts[timeoutKey] = scheduleMedicineReminder(medicine, time, timeoutKey);
      }
    }, 24 * 60 * 60 * 1000);
  }, delay);
};

// Schedule all medicine reminders
export const scheduleMedicineReminders = (): void => {
  const settings = getNotificationSettings();
  
  if (!settings.enabled || !settings.medicineReminders || Notification.permission !== "granted") {
    // Clear existing medicine timeouts
    Object.keys(activeTimeouts)
      .filter(key => key.startsWith('medicine-'))
      .forEach(key => {
        window.clearTimeout(activeTimeouts[key]);
        delete activeTimeouts[key];
      });
    return;
  }
  
  const medicines = getMedicines();
  
  // Clear existing medicine timeouts
  Object.keys(activeTimeouts)
    .filter(key => key.startsWith('medicine-'))
    .forEach(key => {
      window.clearTimeout(activeTimeouts[key]);
      delete activeTimeouts[key];
    });
  
  // Schedule new reminders for each medicine
  medicines.forEach(medicine => {
    if (!medicine.enabled) return;
    
    medicine.times.forEach(time => {
      const timeoutKey = `medicine-${medicine.id}-${time}`;
      activeTimeouts[timeoutKey] = scheduleMedicineReminder(medicine, time, timeoutKey);
    });
  });
  
  console.log(`Scheduled ${medicines.filter(m => m.enabled).length} medicine reminders`);
};

// Send a test medicine notification
export const sendTestMedicineNotification = (): void => {
  showNotification(
    "💊 Medicine Reminder Test",
    {
      body: "This is how your medicine reminders will appear!",
      tag: "test-medicine",
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200]
    }
  );
};