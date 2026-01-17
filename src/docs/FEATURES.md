# Features Guide

## Core Features

### 🎭 AI Chatbots
- **Aura** 🎈 - Mental health support, crisis detection
- **Spark** ☀️ - Motivational coaching
- **Zen** 🧸 - Self-care guidance
- Voice input, conversation history, SOS mode

### 📊 Progress Tracking
- Mood slider (1-100)
- Task completion with XP rewards
- Daily streak counter
- Charts & visualizations

### 🌱 Garden System
Unlock pets at XP milestones:
50→🦋, 150→🐝, 300→🐰, 500→🦊, 750→🐱, 1000→🐶

### 💊 Reminders
- Daily check-ins
- Mood tracking
- Task reminders
- Medicine schedules

### ⚙️ Settings
- Profile & avatar
- Emergency contacts
- Notification preferences
- Dark mode
- Tutorial replay

---

## Customization

### Add Task
Edit `SelfCareTracker.tsx`:
```typescript
{ id: 999, emoji: "🎯", title: "New Task", xp: 10 }
```

### Change Colors
Edit `styles/globals.css`:
```css
--purple-primary: #8B5CF6;
```

### Modify Chatbot
Edit `utils/geminiService.ts` system instructions.
