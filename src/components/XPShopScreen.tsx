import { ArrowLeft, Sparkles, ShoppingCart, Lock, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import BottomNav from "./BottomNav";
import ChatbotSelector from "./ChatbotSelector";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";
import { useTheme } from "./ThemeContext";
import butterflyImg from "figma:asset/8eff843999d72843eedaeedc7ec4ab480b763a7c.png";
import flowerBlueImg from "figma:asset/4f8df1f361d5a2b67bf913bfc62b5cbfbe45d5f0.png";
import flowerPinkImg from "figma:asset/d1ce380a824276fc3ae3b8a0aa48439302348f68.png";

interface XPShopScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

interface ShopItem {
  id: string;
  name: string;
  cost: number;
  emoji: string;
  imageUrl: string;
  description: string;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: "butterfly",
    name: "Sparkle Butterfly",
    cost: 50,
    emoji: "🦋",
    imageUrl: butterflyImg,
    description: "A magical butterfly to flutter around your garden"
  },
  {
    id: "flower-blue",
    name: "Serenity Bloom",
    cost: 75,
    emoji: "🌸",
    imageUrl: flowerBlueImg,
    description: "A calming blue and purple flower for peaceful moments"
  },
  {
    id: "flower-pink",
    name: "Joy Blossom",
    cost: 100,
    emoji: "🌺",
    imageUrl: flowerPinkImg,
    description: "A cheerful pink flower that spreads happiness"
  }
];

export default function XPShopScreen({ onBack, onNavigate }: XPShopScreenProps) {
  const { isDarkMode } = useTheme();
  const [showChatbotSelector, setShowChatbotSelector] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  // Load XP and purchased items from localStorage
  useEffect(() => {
    updateXP();
    loadPurchasedItems();
  }, []);

  const updateXP = () => {
    const savedTasks = localStorage.getItem('selfCareTasks');
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      const xp = tasks.filter((t: any) => t.completed).reduce((sum: number, t: any) => sum + t.xp, 0);
      
      // Subtract spent XP
      const spentXP = getSpentXP();
      setTotalXP(xp - spentXP);
    }
  };

  const getSpentXP = () => {
    const purchased = localStorage.getItem('gardenPurchases');
    if (purchased) {
      const items = JSON.parse(purchased);
      return items.reduce((sum: number, itemId: string) => {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        return sum + (item?.cost || 0);
      }, 0);
    }
    return 0;
  };

  const loadPurchasedItems = () => {
    const purchased = localStorage.getItem('gardenPurchases');
    if (purchased) {
      setPurchasedItems(JSON.parse(purchased));
    }
  };

  const handlePurchase = (item: ShopItem) => {
    if (totalXP >= item.cost) {
      // Add item to purchased items
      const newPurchased = [...purchasedItems, item.id];
      setPurchasedItems(newPurchased);
      localStorage.setItem('gardenPurchases', JSON.stringify(newPurchased));
      
      // Update available XP
      setTotalXP(totalXP - item.cost);
      
      toast.success(`${item.name} unlocked! 🎉`, {
        description: "Visit your garden to see your new item!"
      });

      // Navigate back to garden after a short delay
      setTimeout(() => {
        onNavigate('garden');
      }, 1500);
    } else {
      toast.error("Not enough XP", {
        description: `You need ${item.cost - totalXP} more XP to unlock this item.`
      });
    }
  };

  const handleChatbotSelect = (chatbot: string) => {
    setShowChatbotSelector(false);
    onNavigate(chatbot);
  };

  const isItemPurchased = (itemId: string) => purchasedItems.includes(itemId);

  return (
    <div className={`min-h-screen pb-32 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-b from-purple-50 via-pink-50 to-white'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-100 to-purple-50 dark:from-[#3d2f52] dark:to-[#2d2438] sticky top-0 z-20 px-6 py-4 pt-12">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="hover:bg-purple-200 dark:hover:bg-purple-900/30 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-purple-900 dark:text-purple-200" />
          </Button>
          <div className="flex-1">
            <h2 className="text-purple-900 dark:text-purple-200">XP Shop</h2>
            <p className="flex items-center gap-1 text-purple-600 dark:text-purple-300">
              <ShoppingCart className="w-4 h-4" />
              Decorate your garden
            </p>
          </div>
        </div>

        {/* Current XP Display */}
        <div className={`rounded-2xl p-4 border-2 ${isDarkMode ? 'bg-gradient-to-r from-gold-900/30 to-yellow-900/30 border-gold-500/30' : 'bg-gradient-to-r from-gold-50 to-yellow-50 border-gold-200'} shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-gold-400' : 'text-gold-600'}`} />
              <span className={isDarkMode ? 'text-gold-200' : 'text-purple-900'}>Your Available XP</span>
            </div>
            <div className={`px-4 py-2 rounded-full ${isDarkMode ? 'bg-slate-800 border border-gold-500/30' : 'bg-white border-2 border-gold-300'} shadow-sm`}>
              <span className={`${isDarkMode ? 'text-gold-200' : 'text-purple-900'}`}>{totalXP} XP ✨</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Items */}
      <div className="px-6 py-6 space-y-4">
        {SHOP_ITEMS.map((item) => {
          const isPurchased = isItemPurchased(item.id);
          const canAfford = totalXP >= item.cost;

          return (
            <div 
              key={item.id}
              className={`rounded-2xl p-4 border-2 shadow-lg transition-all ${
                isPurchased 
                  ? isDarkMode 
                    ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30' 
                    : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                  : isDarkMode
                    ? 'bg-slate-800/50 border-purple-500/20 hover:border-purple-500/40'
                    : 'bg-white border-purple-200 hover:border-purple-300'
              }`}
            >
              <div className="flex gap-4">
                {/* Item Image */}
                <div className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 ${
                  isPurchased 
                    ? isDarkMode ? 'ring-2 ring-green-500/50' : 'ring-2 ring-green-400'
                    : isDarkMode ? 'bg-slate-700/30' : 'bg-purple-50'
                }`}>
                  <img 
                    src={item.imageUrl}
                    alt={item.name}
                    className={`w-full h-full object-contain p-2 ${!canAfford && !isPurchased ? 'opacity-40' : ''}`}
                  />
                  {isPurchased && (
                    <div className={`absolute inset-0 ${isDarkMode ? 'bg-green-500/20' : 'bg-green-500/20'} flex items-center justify-center`}>
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                  {!canAfford && !isPurchased && (
                    <div className={`absolute inset-0 ${isDarkMode ? 'bg-slate-900/60' : 'bg-purple-900/40'} flex items-center justify-center`}>
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`${isDarkMode ? 'text-purple-200' : 'text-purple-900'} truncate`}>
                      {item.emoji} {item.name}
                    </h3>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full flex-shrink-0 ${
                      isPurchased
                        ? isDarkMode ? 'bg-green-900/50 border border-green-500/30' : 'bg-green-100 border border-green-300'
                        : isDarkMode ? 'bg-gold-900/50 border border-gold-500/30' : 'bg-gold-100 border border-gold-300'
                    }`}>
                      <Sparkles className={`w-3 h-3 flex-shrink-0 ${isPurchased ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-gold-400' : 'text-gold-600')}`} />
                      <span className={`whitespace-nowrap ${isPurchased ? (isDarkMode ? 'text-green-300' : 'text-green-700') : (isDarkMode ? 'text-gold-300' : 'text-gold-700')}`}>{item.cost} XP</span>
                    </div>
                  </div>
                  <p className={`mb-3 line-clamp-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {item.description}
                  </p>

                  {/* Unlock Button */}
                  {isPurchased ? (
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-green-900/50 border border-green-500/30' : 'bg-green-100 border border-green-300'}`}>
                      <Check className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`whitespace-nowrap ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>Unlocked</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford}
                      size="sm"
                      className={`rounded-full ${
                        canAfford
                          ? isDarkMode 
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                          : isDarkMode
                            ? 'bg-slate-700/50 text-purple-400/50 cursor-not-allowed border border-purple-500/20'
                            : 'bg-purple-100 text-purple-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? (
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">Unlock Now</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="whitespace-nowrap">Need {item.cost - totalXP} XP</span>
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="px-6 pb-6">
        <div className={`rounded-2xl p-4 border-2 ${isDarkMode ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'}`}>
          <p className={`${isDarkMode ? 'text-purple-300' : 'text-purple-700'} text-center`}>
            💡 Complete self-care tasks to earn more XP and unlock beautiful decorations for your garden!
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        currentPage="tracker"
        onNavigate={onNavigate}
        onChatClick={() => setShowChatbotSelector(true)}
      />

      {/* Chatbot Selector */}
      {showChatbotSelector && (
        <ChatbotSelector 
          onSelect={handleChatbotSelect}
          onClose={() => setShowChatbotSelector(false)}
        />
      )}
    </div>
  );
}