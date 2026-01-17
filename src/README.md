# Tomocha 💜

Mental wellness companion with AI chatbots, gamified progress tracking, and self-care guidance.

**Tech**: React 18 + TypeScript + Tailwind CSS v4  
**Storage**: 100% local (browser localStorage)  
**Privacy**: No backend, no tracking

---

## Quick Start

```bash
npm install
npm run dev
```


📖 **Setup Guide**: [docs/SETUP.md](./docs/SETUP.md)

---

## Features

### 🤖 AI Chatbots
- **Aura** 🎈 - Mental health support with crisis detection
- **Spark** ☀️ - Motivational coaching
- **Zen** 🧸 - Self-care guidance

Voice input, conversation history, SOS mode

### 📊 Progress Tracking
- Mood slider with emoji feedback
- Task completion with XP rewards (10-30 XP)
- Daily streak counter
- Charts & visualizations

### 🌱 Garden System
Unlock pets: 🦋 (50 XP) → 🐝 (150) → 🐰 (300) → 🦊 (500) → 🐱 (750) → 🐶 (1000)

### 💊 Reminders
- Daily check-ins
- Mood tracking  
- Task reminders
- Medicine schedules

### ⚙️ Settings
- Profile & custom avatars
- Emergency contacts
- Notification preferences
- Dark mode
- Tutorial replay

---

## Project Structure

```
/
├── App.tsx                   # Main entry
├── components/
│   ├── AuthScreen.tsx        # Login/Signup
│   ├── HomeScreen.tsx        # Dashboard
│   ├── ChatbotInterface.tsx  # AI chat
│   ├── SelfCareTracker.tsx   # Tasks & XP
│   ├── GardenScreen.tsx      # Pet garden
│   ├── AccountPage.tsx       # Settings
│   └── ui/                   # shadcn components
├── utils/
│   ├── geminiService.ts      # AI integration
│   ├── notificationService.ts
│   └── userData.ts
└── docs/                     # Documentation
```

---

## Documentation

- **[Setup Guide](./docs/SETUP.md)** - Installation & configuration
- **[Features](./docs/FEATURES.md)** - Full feature list & customization
- **[Gemini AI](./docs/GEMINI.md)** - AI chatbot setup
- **[Accessibility](./docs/ACCESSIBILITY.md)** - WCAG 2.1 AA compliance

---

## Data Storage

All data in browser `localStorage`:

```
isAuthenticated, tomochaUser, userFirstName, profileAvatar
totalXP, completedTasks, dailyStreak
dailyMood, moodHistory
notificationSettings, medicineReminders
theme
```

**Note**: Device-specific, no cloud sync

---

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Lucide React icons
- Recharts (visualizations)
- Google Gemini API (optional)
- Web Speech API (voice input)

---

## Privacy & Security

✅ 100% local storage  
✅ No backend required  
✅ No tracking or analytics  
✅ Optional AI (works without API)

**⚠️ Disclaimer**: Supportive tool, NOT a replacement for professional mental health care.

### Crisis Resources
- 988 Suicide & Crisis Lifeline
- Crisis Text Line: HOME to 741741
- SAMHSA: 1-800-662-4357

---

## Credits

**Design Inspiration**: Duolingo (gamification), Headspace (serene design)  
**UI**: shadcn/ui, Lucide React, Recharts  
**AI**: Google Gemini

See [Attributions.md](./Attributions.md) for licenses.

---

## License

Copyright © 2024 Tomocha. All rights reserved.

**Built with 💜 for mental health awareness**
