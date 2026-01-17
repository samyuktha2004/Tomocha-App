import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Sparkles, Mic, MicOff, Bug } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Group from "../imports/Group2.tsx";
import BottomNav from "./BottomNav";
import { useTheme } from "./ThemeContext";
import { toast } from "sonner";
import { GeminiService } from "../utils/geminiService";
import GeminiDebugPanel from "./GeminiDebugPanel";
import AIDisclaimer, { hasAcceptedAIDisclaimer, acceptAIDisclaimer, shouldShowMonthlyReminder, markAIDisclaimerShown } from "./AIDisclaimer";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTaskCreation?: boolean;
}

interface ChatbotInterfaceProps {
  onBack: () => void;
  onNavigate: (screen: string, data?: any) => void;
  botName: string;
  botColor: string;
  botIcon: string;
}

export default function ChatbotInterface({ onBack, onNavigate, botName, botColor, botIcon }: ChatbotInterfaceProps) {
  const { isDarkMode } = useTheme();
  
  // Check for SOS alert on component mount
  const [isSOS, setIsSOS] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [profileAvatar, setProfileAvatar] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showAIDisclaimer, setShowAIDisclaimer] = useState(false);
  const [isMonthlyReminder, setIsMonthlyReminder] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // Check if AI disclaimer needs to be shown
  useEffect(() => {
    const hasAccepted = hasAcceptedAIDisclaimer();
    const needsMonthlyReminder = shouldShowMonthlyReminder();
    
    if (!hasAccepted) {
      setShowAIDisclaimer(true);
      setIsMonthlyReminder(false);
    } else if (needsMonthlyReminder) {
      setShowAIDisclaimer(true);
      setIsMonthlyReminder(true);
    }
  }, []);
  
  const handleAcceptDisclaimer = () => {
    if (!hasAcceptedAIDisclaimer()) {
      acceptAIDisclaimer();
    } else {
      markAIDisclaimerShown();
    }
    setShowAIDisclaimer(false);
  };
  
  // Load profile avatar from localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('profileAvatar');
    if (savedAvatar) {
      setProfileAvatar(savedAvatar);
    }
  }, []);
  
  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputValue(transcript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          setIsRecording(false);
          if (event.error === 'not-allowed') {
            toast.error('Microphone access denied. Please enable microphone permissions in your browser settings.');
          } else if (event.error === 'no-speech') {
            // Don't show error for no-speech, it's expected
          } else if (event.error !== 'aborted') {
            // Only log unexpected errors (not aborted or no-speech)
            console.error('Speech recognition error:', event.error);
            toast.error('Voice input error. Please try again.');
          }
        };
        
        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  // Check if we should show the AI task creation demo
  const [showTaskDemo, setShowTaskDemo] = useState(() => {
    const demoFlag = localStorage.getItem('showAITaskDemo');
    return demoFlag === 'true' && botName === 'Aura - Mental Health Support';
  });
  
  useEffect(() => {
    const sosAlert = localStorage.getItem('sosAlertSent');
    if (sosAlert === 'true' && botName === 'Aura - Mental Health Support') {
      setIsSOS(true);
      // Clear the flag after detecting it
      localStorage.removeItem('sosAlertSent');
    }
    
    // Check demo flag
    const demoFlag = localStorage.getItem('showAITaskDemo');
    if (demoFlag === 'true' && botName === 'Aura - Mental Health Support') {
      setShowTaskDemo(true);
      localStorage.removeItem('showAITaskDemo'); // Clear flag after showing
    }
  }, [botName]);

  const initialMessage = isSOS && botName === 'Aura - Mental Health Support'
    ? `I see you just sent an SOS alert. I'm here for you while you wait for your support circle to call. 💜\n\nYou're not alone. Let's take a moment together. Would you like to try some calming techniques?`
    : `Hi! I'm ${botName}. I'm here to support you. How are you feeling today?`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: initialMessage,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  // Update initial message if SOS changes
  useEffect(() => {
    if (showTaskDemo && botName === 'Aura - Mental Health Support') {
      // Show the AI task creation conversation
      setMessages([
        {
          id: 1,
          text: "Hi! I'm Aura - Mental Health Support. I'm here to support you. How are you feeling today?",
          sender: 'ai',
          timestamp: new Date()
        },
        {
          id: 2,
          text: "Aura, I want to be more intentional with my mornings, not just rush.",
          sender: 'user',
          timestamp: new Date()
        },
        {
          id: 3,
          text: "That's a wonderful goal for mental clarity. How about we create a new task to help you start your day with purpose?",
          sender: 'ai',
          timestamp: new Date()
        },
        {
          id: 4,
          text: "Yes, I'd love a 'Morning Intention Setting' task!",
          sender: 'user',
          timestamp: new Date()
        },
        {
          id: 5,
          text: "Great! I've added 'Morning Intention Setting (5 min)' to your Progress page. Let's make it a daily habit together. ✨",
          sender: 'ai',
          timestamp: new Date(),
          isTaskCreation: true
        }
      ]);
      return;
    }
    
    const newInitialMessage = isSOS && botName === 'Aura - Mental Health Support'
      ? `I see you just sent an SOS alert. I'm here for you while you wait for your support circle to call. 💜\n\nYou're not alone. Let's take a moment together. Would you like to try some calming techniques?`
      : `Hi! I'm ${botName}. I'm here to support you. How are you feeling today?`;
      
    setMessages([
      {
        id: 1,
        text: newInitialMessage,
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  }, [isSOS, botName, showTaskDemo]);

  const quickReplies = isSOS && botName === 'Aura - Mental Health Support' 
    ? [
        "Help me breathe",
        "I'm feeling overwhelmed",
        "Grounding techniques",
        "Just talk to me"
      ]
    : botName === 'Aura - Mental Health Support'
    ? [
        "Self-care ideas",
        "Meditation practices",
        "Help me unwind",
        "Nurture my wellbeing"
      ]
    : botName === 'Spark - Motivational Support'
    ? [
        "Daily affirmations",
        "Build healthy habits",
        "Celebrate small wins",
        "Self-compassion tips"
      ]
    : [
        "Mindful activities",
        "Relaxation routines",
        "Self-soothing techniques",
        "Create a wellness plan"
      ];

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    const userInput = inputValue.toLowerCase();
    const currentInput = inputValue; // Store before clearing
    setInputValue('');

    // Check if Gemini API is configured
    const hasGeminiAPI = GeminiService.areKeysConfigured();
    console.log('\n=== 🤖 CHATBOT MESSAGE HANDLING ===');
    console.log('Bot Name:', botName);
    console.log('User Message:', currentInput);
    console.log('Gemini API Available:', hasGeminiAPI);
    
    // Try to access environment variables directly
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      console.log('🔍 Direct Environment Check:');
      console.log('  VITE_GEMINI_AURA_KEY:', import.meta.env.VITE_GEMINI_AURA_KEY ? 'EXISTS' : 'MISSING');
      console.log('  VITE_GEMINI_SPARK_KEY:', import.meta.env.VITE_GEMINI_SPARK_KEY ? 'EXISTS' : 'MISSING');
      console.log('  VITE_GEMINI_ZEN_KEY:', import.meta.env.VITE_GEMINI_ZEN_KEY ? 'EXISTS' : 'MISSING');
    } else {
      console.log('❌ import.meta.env is not available');
    }

    if (hasGeminiAPI) {
      // Use Gemini API for real AI responses
      console.log('✅ Proceeding with Gemini API...');
      try {
        // Build conversation history
        const history = GeminiService.buildConversationHistory([...messages]);
        console.log('📚 Conversation history length:', history.length);
        
        // Generate response
        console.log('⏳ Calling Gemini API...');
        const aiResponseText = await GeminiService.generateResponse(
          botName,
          currentInput,
          history,
          isSOS
        );
        
        console.log('✅ Gemini API Response Received:', aiResponseText.substring(0, 100) + '...');
        const aiMessage: Message = {
          id: messages.length + 2,
          text: aiResponseText,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error: any) {
        console.error('❌ Gemini API Error:', error);
        console.log('🔄 Falling back to context-aware responses');
        
        // Fallback to context-aware responses on error
        const fallbackMessage = getFallbackResponse(userInput);
        const aiMessage: Message = {
          id: messages.length + 2,
          text: fallbackMessage,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        
        toast.error(error.message || 'Unable to get response. Using fallback mode.');
      }
    } else {
      // Use fallback context-aware responses (original behavior)
      console.log('⚠️ Using Fallback Responses (API keys not configured)');
      setTimeout(() => {
        const fallbackMessage = getFallbackResponse(userInput);
        console.log('📝 Fallback response:', fallbackMessage.substring(0, 100) + '...');
        const aiMessage: Message = {
          id: messages.length + 2,
          text: fallbackMessage,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
    console.log('=== END MESSAGE HANDLING ===\n');
  };

  // Fallback response function (matches current quick reply buttons)
  const getFallbackResponse = (userInput: string): string => {
    let aiResponseText = "I understand how you're feeling. Let's work through this together. Can you tell me more about what's on your mind?";
    
    // SOS Mode - Aura Mental Health Support
    if (isSOS && botName === 'Aura - Mental Health Support') {
      if (userInput.includes('breathe') || userInput.includes('breathing')) {
        aiResponseText = "Let's breathe together. 🌬️\n\nFollow this pattern with me:\n\n1️⃣ Breathe IN slowly for 4 counts\n2️⃣ HOLD for 4 counts\n3️⃣ Breathe OUT slowly for 4 counts\n4️⃣ HOLD for 4 counts\n\nRepeat this a few times. I'm right here with you. 💜";
      } else if (userInput.includes('overwhelmed')) {
        aiResponseText = "I hear you. Feeling overwhelmed is really hard. 💜\n\nLet's take this one step at a time:\n\n✨ First, take a slow deep breath\n✨ You're safe right now in this moment\n✨ Your support circle has been notified\n✨ You don't have to face this alone\n\nWhat's one small thing that might help right now?";
      } else if (userInput.includes('grounding')) {
        aiResponseText = "Let's try the 5-4-3-2-1 grounding technique together. 🌟\n\nLook around and name:\n\n5️⃣ things you can SEE\n4️⃣ things you can TOUCH\n3️⃣ things you can HEAR\n2️⃣ things you can SMELL\n1️⃣ thing you can TASTE\n\nThis helps bring you back to the present moment. Take your time. 💜";
      } else if (userInput.includes('talk') || userInput.includes('just talk')) {
        aiResponseText = "I'm here. I'm listening. 💜\n\nYou don't have to explain or make sense of everything. Sometimes it helps just to know someone is here.\n\nYour support circle will reach out soon, but until then, I'm right here with you. You're not alone in this moment.\n\nWould you like to tell me what's on your mind, or would you prefer we just sit together quietly?";
      }
    }
    // Regular Aura - Mental Health Support
    else if (botName === 'Aura - Mental Health Support') {
      if (userInput.includes('self-care') || userInput.includes('self care')) {
        aiResponseText = "Here are some gentle self-care ideas for you today: 🌸\n\n💜 Take a 5-minute mindfulness break\n🛁 Enjoy a warm bath or shower\n📖 Read a chapter of a comforting book\n☕ Sip your favorite tea slowly\n🎵 Listen to calming music\n🌿 Spend time in nature\n✍️ Journal your thoughts\n\nWhich one resonates with you today?";
      } else if (userInput.includes('meditation')) {
        aiResponseText = "Meditation is wonderful for mental clarity. 🧘‍♀️\n\nHere are some practices to try:\n\n🌅 Morning breath meditation (5 min)\n💭 Body scan relaxation (10 min)\n🎯 Mindful focus meditation (8 min)\n💗 Loving-kindness meditation (7 min)\n🌙 Evening gratitude meditation (5 min)\n\nStart with just 5 minutes. Even small moments of stillness make a difference. Which one would you like to try?";
      } else if (userInput.includes('unwind')) {
        aiResponseText = "Let's help you unwind and release today's tension. 😌\n\n✨ Progressive muscle relaxation\n🌬️ Deep breathing exercises\n🎨 Creative expression (draw, color, write)\n🎵 Listen to soothing music\n📱 Digital detox for 30 minutes\n🕯️ Light a candle and sit quietly\n\nWhat feels right for you in this moment?";
      } else if (userInput.includes('wellbeing') || userInput.includes('nurture')) {
        aiResponseText = "Nurturing your wellbeing is so important. 🌺\n\n💚 Physical: Gentle movement, healthy meals, rest\n💜 Emotional: Honor your feelings, practice self-compassion\n💙 Mental: Set boundaries, reduce stress, seek support\n💛 Social: Connect with loved ones, join communities\n🧡 Spiritual: Practice gratitude, find meaning, meditate\n\nWhat area of wellbeing would you like to focus on today?";
      }
    }
    // Spark - Motivational Support
    else if (botName === 'Spark - Motivational Support') {
      if (userInput.includes('affirmation')) {
        aiResponseText = "Here are powerful affirmations just for you today! ✨\n\n💪 \"I am capable of achieving my goals\"\n🌟 \"I choose progress over perfection\"\n💜 \"I am worthy of success and happiness\"\n🔥 \"Every step forward is a victory\"\n🌈 \"I trust in my ability to grow\"\n⭐ \"I am resilient and strong\"\n\nPick one that resonates and repeat it throughout your day!";
      } else if (userInput.includes('habit')) {
        aiResponseText = "Building healthy habits is how we create lasting change! 🎯\n\n📅 Start small: 5-minute daily practices\n📝 Track your progress visually\n🔔 Set reminder notifications\n🎉 Celebrate each completion\n🔄 Stack new habits on existing ones\n💪 Be patient with yourself\n\nWhat habit would you like to build first?";
      } else if (userInput.includes('win') || userInput.includes('celebrate')) {
        aiResponseText = "Every small win deserves celebration! 🎉\n\n🌟 You got out of bed today\n🌟 You're taking care of yourself\n🌟 You showed up and tried\n🌟 You asked for support\n🌟 You're making progress\n\nProgress isn't always visible, but it's always valuable. What small win can you celebrate today?";
      } else if (userInput.includes('self-compassion') || userInput.includes('compassion')) {
        aiResponseText = "Self-compassion is strength, not weakness. 💜\n\n🌸 Talk to yourself like a good friend\n🌸 Remember: everyone struggles sometimes\n🌸 Treat mistakes as learning opportunities\n🌸 Acknowledge your efforts, not just results\n🌸 Rest is productive, not lazy\n🌸 You deserve kindness, especially from yourself\n\nWhat would you say to a friend in your situation?";
      }
    }
    // Zen - Self-Care Chatbot
    else if (botName === 'Zen - Self-Care Chatbot') {
      if (userInput.includes('mindful')) {
        aiResponseText = "Mindful activities can transform ordinary moments into peaceful ones. 🧘\n\n🍃 Mindful walking - notice each step\n☕ Mindful eating - savor each bite\n🌬️ Mindful breathing - focus on your breath\n🎨 Mindful coloring or drawing\n🎵 Mindful listening to nature sounds\n🌸 Mindful stretching or yoga\n\nWhich activity calls to you right now?";
      } else if (userInput.includes('relax')) {
        aiResponseText = "Let's create a relaxation routine just for you! 🌙\n\n✨ Evening wind-down (30 min before bed)\n🛁 Warm bath with calming scents\n📖 Read something light and positive\n🎵 Play gentle, soothing music\n🕯️ Dim the lights, light candles\n📱 Put devices away\n\nWhat time of day do you need relaxation most?";
      } else if (userInput.includes('sooth')) {
        aiResponseText = "Self-soothing techniques for when you need comfort: 🌸\n\n💙 Hold something soft (pillow, blanket, stuffed animal)\n☕ Drink something warm slowly\n🎵 Listen to your favorite calming music\n🌬️ Practice deep belly breathing\n✍️ Write your feelings in a journal\n🚶 Take a gentle walk\n💜 Give yourself a hug\n\nWhat helps you feel most comforted?";
      } else if (userInput.includes('wellness') || userInput.includes('plan')) {
        aiResponseText = "Let's create your personalized wellness plan! 📋\n\n🌅 Morning routine: Set intentions, stretch, hydrate\n☀️ Daytime: Take breaks, move your body, eat well\n🌙 Evening: Unwind, reflect, prepare for rest\n💜 Self-care: Schedule regular me-time\n🎯 Goals: Set small, achievable daily goals\n\nWhat aspect of wellness is most important to you right now?";
      }
    }
    
    return aiResponseText;
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
  };
  
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    
    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
      setIsRecording(false);
      toast.info('Recording stopped');
    } else {
      try {
        setInputValue(''); // Clear input before starting
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err: any) {
        setIsRecording(false);
        if (err.name === 'NotAllowedError') {
          toast.error('Microphone access denied. Please enable microphone permissions in your browser settings.');
        } else {
          toast.error('Could not start voice input. Please check your microphone permissions.');
        }
      }
    }
  };
  
  const handleViewNewTask = () => {
    const newTask = {
      id: Date.now(),
      title: "Morning Intention Setting",
      description: "Set your daily purpose with clarity",
      icon: "🌅",
      completed: false,
      xp: 10,
      difficulty: 'Beginner' as const,
      color: "from-amber-400 to-amber-500",
      duration: "5 min",
      isNew: true,
      aiGenerated: true
    };
    
    onNavigate('tracker', { newTask });
  };

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-b from-purple-50 to-white'}`}>
      {/* Header with gradient - matches Figma design */}
      <div className={`${botColor} px-6 py-4 pt-12 shadow-md`}>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="text-white hover:bg-white/20 rounded-lg h-9 w-9"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 dark:bg-white/10 flex items-center justify-center flex-shrink-0 p-2 border-2 border-white/30">
            <img src={botIcon} alt={botName} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1">
            <h3 className="text-white text-lg">{botName}</h3>
            <p className="text-white/80 text-sm">Online</p>
          </div>
          <button onClick={() => onNavigate('account')} className="cursor-pointer">
            <Avatar className="w-10 h-10 border-2 border-white/30">
              <AvatarImage src={profileAvatar} />
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-500">
                <div className="w-6 h-6">
                  <Group />
                </div>
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 pb-32">
        {messages.map((message, index) => (
          <div key={message.id}>
            <div
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 ${
                  message.sender === 'user'
                    ? `rounded-2xl rounded-br-md ${isDarkMode ? 'bg-gradient-to-r from-purple-700 to-pink-700' : 'bg-gradient-to-r from-purple-600 to-pink-600'} text-white`
                    : `rounded-2xl rounded-tl-md ${isDarkMode ? 'bg-purple-900/40 border border-purple-500/30' : 'bg-purple-100'}`
                }`}
              >
                <p className={`whitespace-pre-wrap ${
                  message.sender === 'user' 
                    ? 'text-white' 
                    : isDarkMode ? 'text-purple-200' : 'text-purple-900'
                }`}>
                  {message.text}
                </p>
              </div>
            </div>
            
            {/* Show navigation button after task creation message */}
            {message.isTaskCreation && showTaskDemo && (
              <div className="flex justify-start mt-3">
                <Button
                  onClick={handleViewNewTask}
                  className={`rounded-full px-6 py-2 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700' 
                      : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600'
                  } text-white shadow-md`}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  View "Morning Intention Setting" Task on Progress Page
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Replies - Horizontal scrollable */}
      <div className={`fixed bottom-[calc(4.5rem+3.5rem)] left-0 right-0 px-6 py-3 ${isDarkMode ? 'bg-slate-900 border-t border-purple-500/20' : 'bg-white border-t border-purple-100'}`}>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => handleQuickReply(reply)}
              className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm ${
                isDarkMode 
                  ? 'bg-slate-800 border-purple-500/30 text-purple-300 hover:bg-purple-900/30' 
                  : 'bg-white border-purple-300 text-purple-700 hover:bg-purple-50'
              }`}
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className={`fixed bottom-[4.5rem] left-0 right-0 px-6 py-4 ${isDarkMode ? 'bg-slate-900 border-t border-purple-500/20' : 'bg-white border-t border-purple-100'}`}>
        {/* Recording Indicator */}
        {isRecording && (
          <div className="flex items-center gap-2 mb-3 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 rounded-full animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="text-white text-sm">Recording... Speak now</span>
          </div>
        )}
        
        <div className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isRecording ? "Listening..." : "Type or speak your message..."}
              className={`w-full rounded-full py-2 px-4 pr-12 ${
                isDarkMode 
                  ? 'bg-slate-800 border-purple-500/30 text-purple-100 placeholder:text-purple-400/50' 
                  : 'bg-gray-100 border-purple-200 text-gray-900 placeholder:text-gray-500'
              } ${isRecording ? 'ring-2 ring-red-500' : ''}`}
            />
          </div>
          <Button
            onClick={toggleVoiceInput}
            size="icon"
            className={`rounded-full h-9 w-9 shrink-0 transition-all ${
              isRecording
                ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 animate-pulse'
                : isDarkMode 
                ? 'bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700' 
                : 'bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600'
            }`}
            aria-label={isRecording ? "Stop recording" : "Start voice input"}
          >
            {isRecording ? (
              <Mic className="w-4 h-4 text-white" />
            ) : (
              <Mic className="w-4 h-4 text-white" />
            )}
          </Button>
          <Button
            onClick={handleSend}
            size="icon"
            className={`rounded-full h-9 w-9 shrink-0 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700' 
                : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'
            }`}
            aria-label="Send message"
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
          <Button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            size="icon"
            className={`rounded-full h-9 w-9 shrink-0 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700' 
                : 'bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600'
            }`}
            aria-label="Toggle Debug Panel"
          >
            <Bug className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        currentPage="chat"
        onNavigate={onNavigate}
        onChatClick={() => {}}
      />

      {/* Gemini Debug Panel */}
      {showDebugPanel && (
        <GeminiDebugPanel onClose={() => setShowDebugPanel(false)} />
      )}
      
      {/* AI Disclaimer */}
      {showAIDisclaimer && (
        <AIDisclaimer 
          onAccept={handleAcceptDisclaimer}
          isMonthlyReminder={isMonthlyReminder}
        />
      )}
    </div>
  );
}