# Gemini AI Setup

## Quick Setup

1. Get API key: [Google AI Studio](https://aistudio.google.com/)
2. Open `/utils/geminiService.ts`
3. Replace: `const GEMINI_API_KEY = 'your-key-here';`
4. Test in Account page → Debug Panel

**Without API key**: App uses smart mock responses automatically.

---

## Chatbots

- **Aura** 🎈 - Mental health support, crisis detection
- **Spark** ☀️ - Motivational coaching, goal-setting  
- **Zen** 🧸 - Self-care guidance, relaxation

---

## Troubleshooting

**Not responding?**
- Check API key in `geminiService.ts`
- Test with Debug Panel (Account page)
- Check console for errors

**Common Issues:**
- API quota exceeded → Wait or upgrade
- Network error → Check internet
- Invalid key → Verify key is correct

---

## Resources

- [Documentation](https://ai.google.dev/docs)
- [Pricing](https://ai.google.dev/pricing) - Free tier: 60 req/min
