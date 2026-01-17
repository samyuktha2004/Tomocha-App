import { useEffect, useState } from "react";

interface ScreenReaderAnnouncerProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

// Global announcer component
let announceCallback: ((message: string, priority?: 'polite' | 'assertive') => void) | null = null;

export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  if (announceCallback) {
    announceCallback(message, priority);
  }
};

export default function ScreenReaderAnnouncer() {
  const [announcement, setAnnouncement] = useState<string>("");
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite');

  useEffect(() => {
    announceCallback = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      setAnnouncement("");
      // Force re-render with new message
      setTimeout(() => {
        setAnnouncement(message);
        setPriority(priority);
      }, 100);
    };

    return () => {
      announceCallback = null;
    };
  }, []);

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}
