# Tomocha Mood Check-In System

## Problem Identified
- **Original**: Single daily mood check-in (rigid, doesn't capture fluctuations)
- **Reality**: Mood changes throughout the day - morning anxiety ≠ evening calm
- **User Need**: Balance between routine AND flexibility

## Solution: Hybrid Mood Tracking System ⭐

### Three Types of Check-Ins:

#### 1. **Morning Check-In** 🌅
- **When**: Encouraged first thing (sets baseline)
- **Purpose**: Start the day mindfully, establish routine
- **Optional**: Not mandatory to avoid pressure
- **Icon**: Sun/sunrise
- **Color**: Warm amber/orange tones

#### 2. **Evening Reflection** 🌙
- **When**: End of day (optional)
- **Purpose**: Reflect on overall day, notice patterns
- **Optional**: Only if user wants
- **Icon**: Moon/stars
- **Color**: Calming indigo/purple tones

#### 3. **Quick Mood Log** 💭 (NEW!)
- **When**: ANYTIME throughout the day
- **Purpose**: Capture significant mood shifts, breakthroughs, or difficult moments
- **Always Available**: Button visible on home screen
- **Icon**: Thought bubble/heart
- **Color**: Purple/pink gradient

### Smart Limits to Prevent Overwhelm:
- **Daily Cap**: 5-6 check-ins max per day
- **Reasoning**: Prevents obsessive tracking (harmful for anxiety)
- **Notification**: Gentle reminder if trying to log 7th time: "You've already checked in 6 times today. Take a break and be kind to yourself 💜"

---

## Features Included:

### Quick Mood Log Component (`QuickMoodLog.tsx`)
✅ **5-point mood scale** (Quick faces: Very Bad → Great)  
✅ **12 emotion tags** (Happy, Anxious, Sad, etc.) - select up to 5  
✅ **Optional text note** - "What's contributing to how you feel?"  
✅ **Context-aware tips** based on check-in type (morning/evening/moment)  
✅ **Screen reader announcements** for accessibility  

### Mood History Viewer (`MoodHistory.tsx`)
✅ **Daily timeline view** - see all check-ins for a specific date  
✅ **Date selector** - browse past days  
✅ **Daily average calculation** - overall mood trend  
✅ **Count of check-ins** - spot obsessive tracking patterns  
✅ **Emotion patterns** - which feelings occur together?  
✅ **Time stamps** - notice when mood dips/peaks  

### Data Structure:
```typescript
interface MoodEntry {
  id: string;
  mood: number;           // 20, 40, 60, 80, 100
  emotions: string[];     // Up to 5 tags
  note: string;           // Optional context
  type: 'morning' | 'evening' | 'moment';
  timestamp: string;      // Exact time logged
  date: string;          // YYYY-MM-DD for grouping
}
```

---

## User Experience Flow:

### Home Screen:
```
┌────────────────────────────────┐
│  Good morning, Alex! 🌅        │
│                                │
│  [Haven't checked in today]    │
│  [Morning Check-In Button]     │
│                                │
│  💭 Quick Mood Log (always)    │
│  📊 View Mood History          │
└────────────────────────────────┘
```

### Throughout Day:
- User feels anxious at 2pm → Taps "Quick Mood Log"
- Selects mood, tags (Anxious, Stressed), notes "Big presentation"
- Logs successfully, can see in history

### Evening:
- Optional prompt: "How was your day overall?" (dismissible)
- Evening reflection captures full day perspective

### Mood History View:
```
📅 Monday, January 2, 2026
Daily Average: 😊 Good | 4 check-ins

🌅 7:30 AM - Morning Check-In
😊 Good • Grateful, Hopeful
"Excited for the day ahead!"

💭 2:15 PM - Quick Log  
😰 Anxious • Stressed, Overwhelmed
"Big presentation - feeling nervous"

💭 4:30 PM - Quick Log
😄 Great • Happy, Proud, Energized  
"Nailed the presentation! So relieved!"

🌙 9:00 PM - Evening Reflection
😊 Good • Calm, Grateful
"Overall a great day despite mid-day anxiety"
```

---

## Benefits Over Single Daily Check-In:

### ✅ **More Accurate Data**
- Captures mood fluctuations, not just one snapshot
- Sees impact of events (therapy, medication, stressors)

### ✅ **Empowering, Not Restrictive**
- User chooses when to log (not forced to daily slot)
- Honors that mental health isn't linear

### ✅ **Pattern Recognition**
- "I always crash at 3pm" → afternoon self-care task
- "Therapy days I feel worse before better" → normal processing

### ✅ **Crisis Support**
- Can log during panic attack, then review coping strategies that helped
- Documents severity for therapist/psychiatrist

### ✅ **Celebrates Wins**
- Had a breakthrough? Log it immediately while fresh
- See progress: "Bad morning → Good evening"

### ✅ **Prevents Overwhelm**
- 5-6 entry cap stops obsessive tracking
- Optional check-ins reduce pressure

---

## Best Practices from Research:

### ✅ Mental Health Apps That Use Multiple Check-Ins:
- **Daylio**: Unlimited entries per day, most popular mood tracker
- **Sanvello**: Morning + evening (both optional)
- **Moodpath**: 3x daily for assessment period, then flexible
- **Bearable**: Unlimited, designed for chronic illness tracking

### ✅ Why This Works:
1. **Routine-based** (morning/evening) builds habit for consistency
2. **On-demand** (quick log) captures real life as it happens
3. **Limits** prevent harmful hyper-vigilance
4. **Patterns emerge** with multiple data points

### ❌ What to Avoid:
- Mandatory hourly pings (overwhelming)
- No upper limit (enables obsession)
- Only morning OR evening (misses fluctuations)
- Requires long form entry (too burdensome)

---

## Accessibility Features:

✅ **Screen Reader**: "Mood Good recorded with 2 emotions"  
✅ **Keyboard Navigation**: Tab through mood faces  
✅ **High Contrast Mode**: Enhanced borders on selected mood  
✅ **Reduced Motion**: No animations on mood selection  
✅ **Quick Entry**: 3 taps minimum (mood → save → done)  

---

## Implementation Notes:

### Storage:
- All mood entries stored in `localStorage` under `moodHistory`
- Array of MoodEntry objects, sorted by timestamp
- No server transmission (privacy-first)

### Integration Points:
1. **Home Screen**: "Quick Mood Log" button (always visible)
2. **Home Screen**: Morning/Evening prompts (contextual)
3. **Self-Care Tracker**: Can view mood alongside tasks
4. **Analytics**: Generate mood trends graphs (future)

### Daily Limit Logic:
```typescript
const getTodayCheckInCount = (): number => {
  const today = new Date().toISOString().split('T')[0];
  const entries = JSON.parse(localStorage.getItem('moodHistory') || '[]');
  return entries.filter(e => e.date === today).length;
};

const canLogMood = (): boolean => {
  return getTodayCheckInCount() < 6; // Max 6 per day
};
```

---

## Notifications (Optional):

### Smart Reminders:
- **9 AM**: "Morning check-in? 🌅" (if enabled, dismissible)
- **9 PM**: "How was your day? 🌙" (if enabled, dismissible)
- **No nagging**: Quick log is always available without reminders

### Do Not Disturb Integration:
- Respects DND hours from notification settings
- Won't prompt during sleep/work focus times

---

## Future Enhancements:

### 📊 Mood Analytics (Phase 2):
- Weekly mood graph showing fluctuations
- Most common emotions per day of week
- Correlation with self-care tasks completed
- Export data for therapist

### 🎯 Smart Insights (Phase 3):
- "Your mood tends to dip on Mondays around 2pm"
- "You feel best on days with 30+ min exercise"
- "Therapy appointments → brief dip → improvement 24h later"

### 🤝 Support Buddy Integration:
- If 3+ consecutive "Very Bad" entries → gentle support buddy alert
- If no check-ins for 3 days → support buddy wellness check

---

## Privacy & Safety:

✅ **Data stays local** - no cloud sync  
✅ **No mood content shared** - support buddy only gets "check-in status"  
✅ **User controlled** - can export or delete all mood data anytime  
✅ **Crisis detection** - Multiple "Very Bad" entries trigger SOS resources prompt  
✅ **No judgment** - Neutral language, celebrates logging regardless of mood  

---

## Conclusion:

The **Hybrid Mood Tracking System** balances:
- **Structure** (morning/evening routine) for consistency
- **Flexibility** (quick log anytime) for real-life mood fluctuations  
- **Safety limits** (6 max/day) to prevent obsessive tracking
- **User empowerment** (all optional) to reduce pressure

This approach is **evidence-based**, used by leading mental health apps, and **respects that recovery isn't linear**. Mood changes throughout the day are NORMAL and worth capturing! 💜
