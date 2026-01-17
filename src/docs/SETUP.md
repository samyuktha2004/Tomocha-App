# Setup Guide 🚀

## Quick Start

### Installation
```bash
npm install
npm run dev
# Open http://localhost:5173
```

Or just use in **Figma Make** - no installation needed!

---

## Gemini API Setup (Optional)

For AI chatbots:

1. Get key: [Google AI Studio](https://aistudio.google.com/)
2. Open `/utils/geminiService.ts`
3. Replace: `const GEMINI_API_KEY = 'your-key-here';`

**Without API**: App uses smart mock responses.

---

## First Run

1. Sign up or continue as guest
2. Complete tutorial (or skip)
3. Set mood and start!

---

## Troubleshooting

**Chatbots not working?**
- Check API key in `geminiService.ts`
- Use Debug Panel (Account page)

**Notifications not working?**
- Allow browser permissions
- Try "Test Notification" button

**Voice input not working?**
- Allow microphone permission
- Use Chrome/Edge (best support)

---

## Data Storage

All data in browser localStorage - device-specific, no cloud sync.
