import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

interface AccountSectionProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  color: string;
  borderColor: string;
  buttonLabel: string;
  buttonIcon: React.ReactNode;
  buttonColor: string;
  onButtonClick: () => void;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
}

export default function AccountSection({
  icon,
  title,
  description,
  color,
  borderColor,
  buttonLabel,
  buttonIcon,
  buttonColor,
  onButtonClick,
  children,
  defaultExpanded = false
}: AccountSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-white dark:bg-[#2d2438] rounded-2xl shadow-md border-2 ${borderColor} overflow-hidden`}>
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
            {icon}
          </div>
          <h3 className="text-purple-900 dark:text-purple-200">
            {title}
          </h3>
        </div>
        
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        )}
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t-2 border-purple-100 dark:border-purple-800/30 pt-4 animate-in slide-in-from-top duration-200">
          {description && (
            <p className="text-purple-700 dark:text-purple-300 text-sm mb-4">
              {description}
            </p>
          )}
          
          {children}
          
          <Button
            onClick={onButtonClick}
            className={`w-full ${buttonColor} text-white border-0 shadow-md mt-4`}
            aria-label={buttonLabel}
          >
            {buttonIcon}
            {buttonLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

// Compact version - just title and button, no accordion
export function CompactAccountSection({
  icon,
  title,
  buttonLabel,
  buttonIcon,
  buttonColor,
  onButtonClick,
  borderColor
}: Omit<AccountSectionProps, 'description' | 'children' | 'defaultExpanded' | 'color'>) {
  return (
    <div className={`bg-white dark:bg-[#2d2438] rounded-2xl shadow-md border-2 ${borderColor} p-4`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-purple-900 dark:text-purple-200 text-sm">
            {title}
          </h3>
        </div>
        
        <Button
          onClick={onButtonClick}
          size="sm"
          className={`${buttonColor} text-white border-0 shadow-sm`}
          aria-label={buttonLabel}
        >
          {buttonIcon}
          <span className="hidden sm:inline ml-2">{buttonLabel}</span>
        </Button>
      </div>
    </div>
  );
}
