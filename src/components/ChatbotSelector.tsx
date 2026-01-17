import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import BottomNav from "./BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState, useEffect } from "react";
import Group from "../imports/Group2.tsx";
import teddyBearIcon from 'figma:asset/91fec4f9ee723ba1154def76a0261e8b2f36ec9b.png';
import sunIcon from 'figma:asset/8477b7615928e9707724f0741e3c792f5c6f1884.png';
import hotAirBalloonIcon from 'figma:asset/beb891181ee199ea6ff028acadbd43858e477e35.png';

interface ChatbotSelectorProps {
  onSelect: (chatbot: string) => void;
  onBack?: () => void;
  onClose?: () => void;
  onNavigate?: (screen: string) => void;
}

export default function ChatbotSelector({ onSelect, onBack, onClose, onNavigate }: ChatbotSelectorProps) {
  const [profileAvatar, setProfileAvatar] = useState<string>("");
  
  // Load profile avatar from localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('profileAvatar');
    if (savedAvatar) {
      setProfileAvatar(savedAvatar);
    }
  }, []);
  
  const handleBackClick = () => {
    if (onClose) {
      onClose();
    } else if (onBack) {
      onBack();
    }
  };
  
  const handleAIDemoClick = () => {
    // Set flag in localStorage to trigger demo mode
    localStorage.setItem('showAITaskDemo', 'true');
    // Navigate to Aura chatbot
    onSelect('chatbot-mental');
  };

  const chatbots = [
    {
      id: 'chatbot-mental',
      name: 'Aura',
      description: 'Mental Health Support',
      tagline: 'Talk through your feelings and get emotional support',
      icon: 'image',
      imageSrc: hotAirBalloonIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10',
      borderColor: 'border-blue-300 dark:border-blue-700/30'
    },
    {
      id: 'chatbot-motivation',
      name: 'Spark',
      description: 'Motivational Support',
      tagline: 'Get inspired and boost your confidence',
      icon: 'image',
      imageSrc: sunIcon,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/10',
      borderColor: 'border-pink-300 dark:border-pink-700/30'
    },
    {
      id: 'chatbot-selfcare',
      name: 'Zen',
      description: 'Self-Care Companion',
      tagline: 'Build healthy habits and practice self-care',
      icon: 'image',
      imageSrc: teddyBearIcon,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/10',
      borderColor: 'border-teal-300 dark:border-teal-700/30'
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-purple-50 to-white dark:from-[#1a1625] dark:to-[#231d2e] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-100 to-purple-50 dark:from-[#3d2f52] dark:to-[#2d2438] px-6 py-4 pt-12">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-purple-900 dark:text-purple-200">Choose Your AI Companion</h3>
            <p className="text-purple-600 dark:text-purple-300 mt-1">Select who you'd like to talk to</p>
          </div>
          {onNavigate && (
            <button onClick={() => onNavigate('account')} className="cursor-pointer">
              <Avatar className="w-10 h-10 border-2 border-purple-300 dark:border-purple-600">
                <AvatarImage src={profileAvatar} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-500">
                  <div className="w-6 h-6">
                    <Group />
                  </div>
                </AvatarFallback>
              </Avatar>
            </button>
          )}
        </div>
      </div>

      {/* Chatbot Options */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {chatbots.map((chatbot) => {
          const Icon = chatbot.icon !== 'image' ? chatbot.icon : null;
          return (
            <button
              key={chatbot.id}
              onClick={() => onSelect(chatbot.id)}
              className={`w-full bg-gradient-to-br ${chatbot.bgColor} rounded-2xl p-5 border-2 ${chatbot.borderColor} hover:shadow-lg transition-all text-left active:scale-[0.98]`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden p-2 border-2 border-white/30">
                  {Icon ? (
                    <Icon className="w-7 h-7 text-white" />
                  ) : (
                    <img src={chatbot.imageSrc} alt={chatbot.name} className="w-full h-full object-contain" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-purple-900 dark:text-purple-200 mb-1">{chatbot.name}</h4>
                  <p className="text-purple-700 dark:text-purple-300 mb-2">{chatbot.description}</p>
                  <p className="text-purple-600 dark:text-purple-400">{chatbot.tagline}</p>
                </div>
              </div>
            </button>
          );
        })}

        {/* Info Footer */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700/30 mt-6">
          <p className="text-purple-700 dark:text-purple-300 text-center">
            💬 All conversations are private and secure
          </p>
        </div>
        
        {/* AI Task Creation Demo Button */}
        <button
          onClick={handleAIDemoClick}
          className="w-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-2xl p-5 border-2 border-purple-300 dark:border-purple-700 hover:shadow-lg transition-all text-left active:scale-[0.98] mt-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
              <Sparkles className="w-7 h-7 text-white fill-white animate-pulse" />
            </div>
            <div className="flex-1">
              <h4 className="text-purple-900 dark:text-purple-200 mb-1 flex items-center gap-2">
                🌟 Demo: AI Task Creation
                <span className="px-2 py-0.5 bg-purple-600 dark:bg-purple-500 text-white rounded-full text-xs">NEW</span>
              </h4>
              <p className="text-purple-700 dark:text-purple-300 mb-2">See how Aura creates personalized tasks</p>
              <p className="text-purple-600 dark:text-purple-400">Watch a conversation turn into an actionable task!</p>
            </div>
          </div>
        </button>
      </div>

      {/* Bottom Navigation */}
      {onNavigate && (
        <BottomNav 
          currentPage="chat"
          onNavigate={onNavigate}
          onChatClick={() => {}}
        />
      )}
    </div>
  );
}