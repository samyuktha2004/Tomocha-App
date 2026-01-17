import { Home, MessageCircle, BarChart3, Users } from "lucide-react";
import { Button } from "./ui/button";

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onChatClick: () => void;
}

export default function BottomNav({ currentPage, onNavigate, onChatClick }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'tracker', icon: BarChart3, label: 'Progress' },
    { id: 'fanclub', icon: Users, label: 'Cheer' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#231d2e] border-t border-purple-100 dark:border-purple-900/30 px-6 py-3 rounded-t-3xl shadow-xl z-40" role="navigation" aria-label="Main navigation">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const handleClick = item.id === 'chat' ? () => onNavigate('chatbot-selector') : () => onNavigate(item.id);
          
          return (
            <Button 
              key={item.id}
              variant="ghost" 
              className={`flex flex-col items-center gap-1 px-6 py-3 rounded-2xl transition-all ${
                isActive 
                  ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-600 dark:text-purple-300' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-purple-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
              }`}
              onClick={handleClick}
              aria-label={`Navigate to ${item.label} page`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-xs ${isActive ? '' : ''}`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}