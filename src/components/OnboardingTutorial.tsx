import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, X, Sparkles, Heart, MessageCircle, BarChart3, Users } from 'lucide-react';
import teddyBearIcon from 'figma:asset/91fec4f9ee723ba1154def76a0261e8b2f36ec9b.png';
import sunIcon from 'figma:asset/8477b7615928e9707724f0741e3c792f5c6f1884.png';
import hotAirBalloonIcon from 'figma:asset/beb891181ee199ea6ff028acadbd43858e477e35.png';

interface OnboardingTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingTutorial({ onComplete, onSkip }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Tomocha! 💜",
      description: "Your personal mental health companion designed to support you every day with AI-powered chatbots, personalized self-care tasks, and a growing garden of encouragement.",
      icon: "🌸",
      gradient: "from-purple-500 to-pink-500",
      image: null,
    },
    {
      title: "Daily Mood Check-In 😊",
      description: "Start each day by checking in with yourself. Use the mood slider to tell us how you're feeling, and we'll personalize your self-care tasks to match your energy level.",
      icon: "💭",
      gradient: "from-purple-600 to-purple-500",
      image: null,
      features: [
        { emoji: "😞", label: "High Distress", desc: "Gentle, grounding tasks" },
        { emoji: "😐", label: "Neutral", desc: "Balanced activities" },
        { emoji: "😊", label: "High Energy", desc: "Challenging goals" }
      ]
    },
    {
      title: "Meet Your AI Companions 🤖",
      description: "Three specialized chatbots are here to support you whenever you need them. Each one brings unique care and guidance.",
      icon: "💬",
      gradient: "from-blue-500 to-teal-500",
      image: null,
      chatbots: [
        { name: "Aura", icon: hotAirBalloonIcon, color: "from-blue-500 to-blue-600", desc: "Mental health support" },
        { name: "Spark", icon: sunIcon, color: "from-pink-500 to-pink-600", desc: "Motivational boost" },
        { name: "Zen", icon: teddyBearIcon, color: "from-teal-500 to-teal-600", desc: "Self-care guidance" }
      ]
    },
    {
      title: "Complete Tasks & Earn XP ⭐",
      description: "Each self-care task you complete earns you XP (experience points). The more you care for yourself, the more you grow! Tasks are personalized based on your daily mood.",
      icon: "🎯",
      gradient: "from-yellow-500 to-orange-500",
      image: null,
      xpLevels: [
        { level: "Beginner", xp: "10-15 XP", color: "from-green-400 to-green-500" },
        { level: "Intermediate", xp: "15-25 XP", color: "from-blue-400 to-blue-500" },
        { level: "Advanced", xp: "25-30 XP", color: "from-purple-400 to-purple-500" }
      ]
    },
    {
      title: "Your Growing Garden 🌱",
      description: "As you earn XP, you unlock adorable pets and companions in your garden! Each milestone brings new friends to celebrate your self-care journey.",
      icon: "🦋",
      gradient: "from-emerald-500 to-teal-500",
      image: null,
      milestones: [
        { xp: "50 XP", pet: "🦋 Butterfly" },
        { xp: "150 XP", pet: "🐝 Bee" },
        { xp: "300 XP", pet: "🐰 Bunny" },
        { xp: "500 XP", pet: "🦊 Fox" }
      ]
    },
    {
      title: "Track Your Progress 📊",
      description: "Watch your self-care journey unfold! View completed tasks, track your XP growth, and see your daily streaks. Celebrate every step forward.",
      icon: "📈",
      gradient: "from-indigo-500 to-purple-500",
      image: null,
      navigation: [
        { icon: MessageCircle, label: "Chat", desc: "Talk to AI companions" },
        { icon: BarChart3, label: "Progress", desc: "View your tasks & XP" },
        { icon: Users, label: "Cheer", desc: "Get motivated" }
      ]
    },
    {
      title: "You're All Set! 🎉",
      description: "Remember: self-care is not selfish. Every small step counts, and we're here to support you every day. Let's begin your journey!",
      icon: "✨",
      gradient: "from-pink-500 to-purple-600",
      image: null,
    }
  ];

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-50 via-pink-50 to-white dark:from-[#1a1625] dark:via-[#231d2e] dark:to-[#231d2e] z-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-md">
        {/* Skip Button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            onClick={onSkip}
            className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
            aria-label="Skip tutorial"
          >
            <X className="w-5 h-5 mr-2" />
            Skip
          </Button>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-[#2d2438] rounded-3xl p-8 shadow-2xl border-2 border-purple-200 dark:border-purple-700/30">
          {/* Icon/Emoji Header */}
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${currentStepData.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
            <span className="text-4xl">{currentStepData.icon}</span>
          </div>

          {/* Title */}
          <h2 className="text-purple-900 dark:text-purple-200 text-center mb-4">
            {currentStepData.title}
          </h2>

          {/* Description */}
          <p className="text-purple-700 dark:text-purple-300 text-center mb-6">
            {currentStepData.description}
          </p>

          {/* Step-specific Content */}
          <div className="mb-8">
            {/* Mood Features */}
            {currentStepData.features && (
              <div className="space-y-3">
                {currentStepData.features.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 border-2 border-purple-200 dark:border-purple-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{feature.emoji}</span>
                      <div className="flex-1">
                        <p className="text-purple-900 dark:text-purple-200">{feature.label}</p>
                        <p className="text-purple-600 dark:text-purple-400">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Chatbots */}
            {currentStepData.chatbots && (
              <div className="grid grid-cols-3 gap-3">
                {currentStepData.chatbots.map((bot, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br ${bot.color} rounded-2xl p-3 text-white shadow-md flex flex-col items-center min-h-[140px] border-2 border-white/30`}
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-white/20 flex items-center justify-center flex-shrink-0 p-2 mb-3 mt-1">
                      <img src={bot.icon} alt={bot.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-white text-center text-xs mb-1">{bot.name}</span>
                    <span className="text-white/80 text-center text-xs leading-tight">{bot.desc}</span>
                  </div>
                ))}
              </div>
            )}

            {/* XP Levels */}
            {currentStepData.xpLevels && (
              <div className="space-y-3">
                {currentStepData.xpLevels.map((level, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 border-2 border-purple-200 dark:border-purple-700/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${level.color}`}></div>
                        <p className="text-purple-900 dark:text-purple-200">{level.level}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-purple-700 dark:text-purple-300">{level.xp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Garden Milestones */}
            {currentStepData.milestones && (
              <div className="grid grid-cols-2 gap-3">
                {currentStepData.milestones.map((milestone, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-4 border-2 border-emerald-200 dark:border-emerald-700/30 text-center"
                  >
                    <span className="text-3xl mb-2 block">{milestone.pet.split(' ')[0]}</span>
                    <p className="text-purple-900 dark:text-purple-200 text-sm mb-1">{milestone.pet.split(' ')[1]}</p>
                    <p className="text-purple-600 dark:text-purple-400 text-xs">{milestone.xp}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation Preview */}
            {currentStepData.navigation && (
              <div className="space-y-3">
                {currentStepData.navigation.map((nav, index) => {
                  const Icon = nav.icon;
                  return (
                    <div 
                      key={index}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 border-2 border-purple-200 dark:border-purple-700/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-purple-900 dark:text-purple-200">{nav.label}</p>
                          <p className="text-purple-600 dark:text-purple-400">{nav.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                aria-label={`Go to step ${index + 1}`}
                className={`transition-all rounded-full ${
                  index === currentStep
                    ? 'w-8 h-3 bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'w-3 h-3 bg-purple-200 dark:bg-purple-700/30 hover:bg-purple-300 dark:hover:bg-purple-600/50'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isFirstStep}
              className="flex-1 border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Go to previous step"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg"
              aria-label={isLastStep ? "Finish tutorial and start using app" : "Go to next step"}
            >
              {isLastStep ? (
                <>
                  Start Journey
                  <Sparkles className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Step Counter */}
        <p className="text-center mt-4 text-purple-600 dark:text-purple-400">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}
