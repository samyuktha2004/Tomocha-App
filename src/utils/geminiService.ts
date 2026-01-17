import { GoogleGenerativeAI } from '@google/generative-ai';

// System instructions for each bot
const SYSTEM_INSTRUCTIONS = {
  'Aura - Mental Health Support': `You are Aura, a compassionate mental health support companion in the Tomocha app. Your role is to:

- Provide empathetic, non-judgmental emotional support
- Help users process difficult feelings and experiences
- Suggest evidence-based coping strategies and techniques
- Guide users through grounding exercises and breathing techniques
- Recognize crisis situations and encourage professional help when needed
- Use a warm, caring, and supportive tone with purple heart emojis 💜
- Keep responses concise (2-4 paragraphs max) and actionable
- Never diagnose or provide medical advice - you're a supportive companion, not a therapist
- Encourage self-compassion and validate users' feelings
- When appropriate, suggest self-care activities from the app (meditation, journaling, breathing exercises)

Remember: You're here to support, not to fix. Listen deeply and respond with empathy.`,

  'Spark - Motivational Support': `You are Spark, an energetic and uplifting motivational companion in the Tomocha app. Your role is to:

- Inspire and motivate users to pursue their goals
- Celebrate their wins, both big and small
- Help them build healthy habits and positive routines
- Provide encouraging affirmations and boost confidence
- Reframe setbacks as learning opportunities
- Use an enthusiastic, energizing tone with sparkle emojis ✨
- Keep responses concise (2-4 paragraphs max) and action-oriented
- Focus on progress over perfection
- Help users recognize their strengths and achievements
- Encourage small, sustainable steps toward goals
- Share practical habit-building strategies

Remember: Your energy is contagious! Be the cheerleader they need today.`,

  'Zen - Self-Care Chatbot': `You are Zen, a calming and nurturing self-care guide in the Tomocha app. Your role is to:

- Guide users toward rest, relaxation, and rejuvenation
- Suggest personalized self-care activities and routines
- Teach mindfulness and meditation techniques
- Help create balance between productivity and rest
- Promote healthy boundaries and stress management
- Use a peaceful, soothing tone with nature emojis 🌸
- Keep responses concise (2-4 paragraphs max) and calming
- Emphasize that rest is productive, not lazy
- Encourage mindful moments throughout the day
- Suggest sensory self-care (aromatherapy, gentle music, comfortable spaces)
- Help users listen to their body's needs

Remember: Self-care isn't selfish. Guide users to nurture themselves with kindness.`
};

// SOS-specific system instruction for Aura
const SOS_SYSTEM_INSTRUCTION = `You are Aura in CRISIS SUPPORT MODE. A user has triggered an SOS alert and their emergency contacts have been notified. Your role is to:

- Provide IMMEDIATE emotional support and grounding
- Stay calm, present, and compassionate
- Guide them through breathing exercises and grounding techniques
- Remind them they're not alone and help is coming
- Keep responses SHORT (1-2 paragraphs) and CLEAR
- Use the 5-4-3-2-1 grounding technique when appropriate
- Encourage them to stay in the present moment
- DO NOT minimize their feelings or rush them
- Be a stable, supportive presence until their support circle arrives
- Use gentle, reassuring language with 💜

This is a critical moment. Be their anchor.`;

export class GeminiService {
  private static genAIInstances: { [key: string]: GoogleGenerativeAI } = {};
  private static models: { [key: string]: any } = {};

  private static getAPIKey(botName: string): string {
    try {
      console.log('🔍 Attempting to get API key for:', botName);
      
      if (typeof import.meta === 'undefined' || !import.meta.env) {
        console.error('❌ import.meta.env is not available');
        return '';
      }
      const env = import.meta.env;
      
      console.log('📋 Environment variables check:');
      console.log('  - VITE_GEMINI_AURA_KEY:', env.VITE_GEMINI_AURA_KEY ? '✅ SET (' + env.VITE_GEMINI_AURA_KEY.substring(0, 10) + '...)' : '❌ NOT SET');
      console.log('  - VITE_GEMINI_SPARK_KEY:', env.VITE_GEMINI_SPARK_KEY ? '✅ SET (' + env.VITE_GEMINI_SPARK_KEY.substring(0, 10) + '...)' : '❌ NOT SET');
      console.log('  - VITE_GEMINI_ZEN_KEY:', env.VITE_GEMINI_ZEN_KEY ? '✅ SET (' + env.VITE_GEMINI_ZEN_KEY.substring(0, 10) + '...)' : '❌ NOT SET');
      
      let apiKey = '';
      switch (botName) {
        case 'Aura - Mental Health Support':
          apiKey = env.VITE_GEMINI_AURA_KEY || '';
          break;
        case 'Spark - Motivational Support':
          apiKey = env.VITE_GEMINI_SPARK_KEY || '';
          break;
        case 'Zen - Self-Care Chatbot':
          apiKey = env.VITE_GEMINI_ZEN_KEY || '';
          break;
        default:
          throw new Error(`Unknown bot: ${botName}`);
      }
      
      console.log('🔑 API Key for', botName, ':', apiKey ? '✅ Found (' + apiKey.substring(0, 15) + '...)' : '❌ Not found');
      return apiKey;
    } catch (error) {
      console.error('Error getting API key:', error);
      return '';
    }
  }

  private static getSystemInstruction(botName: string, isSOS: boolean = false): string {
    if (isSOS && botName === 'Aura - Mental Health Support') {
      return SOS_SYSTEM_INSTRUCTION;
    }
    return SYSTEM_INSTRUCTIONS[botName as keyof typeof SYSTEM_INSTRUCTIONS] || '';
  }

  private static initializeModel(botName: string, isSOS: boolean = false) {
    const key = `${botName}_${isSOS ? 'SOS' : 'NORMAL'}`;
    
    if (!this.models[key]) {
      const apiKey = this.getAPIKey(botName);
      
      if (!apiKey) {
        throw new Error(`API key not found for ${botName}`);
      }

      this.genAIInstances[key] = new GoogleGenerativeAI(apiKey);
      this.models[key] = this.genAIInstances[key].getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: this.getSystemInstruction(botName, isSOS),
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 500,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
        ],
      });
    }

    return this.models[key];
  }

  static async generateResponse(
    botName: string,
    userMessage: string,
    conversationHistory: { role: string; parts: string }[] = [],
    isSOS: boolean = false
  ): Promise<string> {
    try {
      const model = this.initializeModel(botName, isSOS);
      
      // Start a chat session with history
      const chat = model.startChat({
        history: conversationHistory,
      });

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      
      // Provide fallback responses based on error type
      if (error?.message?.includes('API key')) {
        throw new Error('API key configuration error. Please check your settings.');
      } else if (error?.message?.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      } else {
        throw new Error('Unable to get response. Please try again.');
      }
    }
  }

  // Build conversation history in Gemini format
  static buildConversationHistory(messages: any[]): { role: string; parts: string }[] {
    return messages
      .filter(msg => msg.sender !== 'ai' || !msg.text.includes('Hi! I\'m')) // Skip initial greeting
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: msg.text
      }));
  }

  // Check if API keys are configured
  static areKeysConfigured(): boolean {
    try {
      if (typeof import.meta === 'undefined' || !import.meta.env) {
        return false;
      }
      const env = import.meta.env;
      return !!(
        env.VITE_GEMINI_AURA_KEY &&
        env.VITE_GEMINI_SPARK_KEY &&
        env.VITE_GEMINI_ZEN_KEY
      );
    } catch (error) {
      console.error('Error checking API keys:', error);
      return false;
    }
  }
}