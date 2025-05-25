import React, { useState } from 'react';
import { Send, Command, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIChatHomeProps {
  onSubmit?: (message: string) => void;
  className?: string;
}

const AIChatHome = React.forwardRef<HTMLDivElement, AIChatHomeProps>(
  ({ onSubmit, className }, ref) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (message.trim()) {
        onSubmit?.(message.trim());
        setMessage('');
      }
    };

    return (
      <div 
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center min-h-screen bg-[#ffffff] dark:bg-[#000000] text-black dark:text-white px-4",
          className
        )}
      >
        {/* Logo and Title */}
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="w-8 h-8 text-[#1a73e8] dark:text-[#8ab4f8]" />
          <h1 className="text-4xl font-medium tracking-tight">AnySpace AI</h1>
        </div>
        
        {/* Subtitle */}
        <p className="text-lg text-[#666666] dark:text-[#999999] mb-12 text-center max-w-md">
          Your intelligent computing assistant. Ask anything or type a URL to navigate.
        </p>

        {/* Chat Input */}
        <form 
          onSubmit={handleSubmit}
          className="w-full max-w-2xl"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a73e8] via-[#8ab4f8] to-[#1a73e8] rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                rows={message.split('\n').length + 1}
                className={cn(
                  "w-full px-6 py-4 text-lg bg-white dark:bg-black",
                  "border border-[#e2e8f0] dark:border-[#333333]",
                  "rounded-2xl shadow-lg backdrop-blur-xl",
                  "placeholder:text-[#999999] dark:placeholder:text-[#666666]",
                  "focus:outline-none focus:ring-2 focus:ring-[#1a73e8] dark:focus:ring-[#8ab4f8]",
                  "transition-all duration-300",
                  "resize-none"
                )}
                style={{ minHeight: '60px' }}
              />
              
              {/* Command Key Hint */}
              <div className="absolute right-4 bottom-4 flex items-center gap-2 text-sm text-[#999999] dark:text-[#666666]">
                <Command className="w-4 h-4" />
                <span>+ Enter to send</span>
              </div>
            </div>
          </div>

          {/* Submit Button - Only show if there's text */}
          {message.trim() && (
            <button
              type="submit"
              className={cn(
                "mt-4 px-6 py-3 bg-[#1a73e8] dark:bg-[#8ab4f8]",
                "text-white dark:text-black font-medium rounded-full",
                "flex items-center justify-center gap-2",
                "transform transition-all duration-300",
                "hover:scale-105 hover:shadow-lg",
                "focus:outline-none focus:ring-2 focus:ring-[#1a73e8] dark:focus:ring-[#8ab4f8] focus:ring-offset-2"
              )}
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          )}
        </form>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
          {[
            { title: 'Search Web', description: 'Find information online' },
            { title: 'System Tasks', description: 'Manage your computer' },
            { title: 'Get Help', description: 'Learn how to use AnySpace' }
          ].map((action, i) => (
            <button
              key={i}
              className={cn(
                "p-4 rounded-xl text-left",
                "bg-[#f8f9fa] dark:bg-[#1c1c1e]",
                "hover:bg-[#f1f3f4] dark:hover:bg-[#2c2c2e]",
                "transition-all duration-300",
                "group"
              )}
            >
              <h3 className="font-medium mb-1 group-hover:text-[#1a73e8] dark:group-hover:text-[#8ab4f8] transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-[#666666] dark:text-[#999999]">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

AIChatHome.displayName = "AIChatHome";

export default AIChatHome; 