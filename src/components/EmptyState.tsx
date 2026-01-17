import { Button } from "./ui/button";

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export default function EmptyState({
  emoji = "🌸",
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {/* Friendly emoji */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-4 border-purple-200 dark:border-purple-700/30 flex items-center justify-center mb-6 animate-in zoom-in duration-500">
        <span className="text-5xl">{emoji}</span>
      </div>

      {/* Title */}
      <h3 className="text-purple-900 dark:text-purple-200 mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-purple-600 dark:text-purple-400 mb-6 max-w-md">
        {description}
      </p>

      {/* Action buttons */}
      {(onAction || onSecondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {onAction && actionLabel && (
            <Button
              onClick={onAction}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {actionLabel}
            </Button>
          )}
          
          {onSecondaryAction && secondaryActionLabel && (
            <Button
              onClick={onSecondaryAction}
              variant="outline"
              className="border-2 border-purple-300 dark:border-purple-700/30 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300"
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Specific empty states for common scenarios

export function NoDataYet({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <EmptyState
      emoji="🌱"
      title="Nothing here yet!"
      description="Your journey is just beginning. Start tracking to see your progress grow!"
      actionLabel={onGetStarted ? "Get Started" : undefined}
      onAction={onGetStarted}
    />
  );
}

export function NoResultsFound({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <EmptyState
      emoji="🔍"
      title="No results found"
      description="We couldn't find anything matching your search. Try adjusting your filters!"
      actionLabel={onClearFilters ? "Clear Filters" : undefined}
      onAction={onClearFilters}
    />
  );
}

export function OfflineState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      emoji="📡"
      title="You're offline"
      description="Don't worry! Your data is safe. We'll sync when you're back online."
      actionLabel={onRetry ? "Try Again" : undefined}
      onAction={onRetry}
    />
  );
}

export function ComingSoon() {
  return (
    <EmptyState
      emoji="🚧"
      title="Coming Soon!"
      description="We're working on something special for you. Check back soon! 💜"
    />
  );
}
