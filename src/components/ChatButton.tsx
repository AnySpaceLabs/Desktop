import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  unreadCount?: number;
}

const ChatButton = React.forwardRef<HTMLButtonElement, ChatButtonProps>(
  ({ isOpen, onClick, className, unreadCount = 0 }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={cn(
          "h-14 w-14 rounded-full bg-[#1a73e8] hover:bg-[#1967d2] text-white shadow-lg flex items-center justify-center transition-all duration-300",
          isOpen && "rotate-90",
          className
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <MessageSquare size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 bg-[#ea4335] rounded-full text-xs flex items-center justify-center transform translate-x-1 -translate-y-1">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

ChatButton.displayName = "ChatButton";

export default ChatButton; 