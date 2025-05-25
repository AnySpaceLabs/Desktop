import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ChatMessageProps {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatSidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose: () => void;
}

const ChatSidebar = React.forwardRef<HTMLDivElement, ChatSidebarProps>(
  ({ className, isOpen = true, onClose }, ref) => {
    const [messages, setMessages] = useState<ChatMessageProps[]>([
      {
        id: '1',
        content: 'Hello! How can I help you today?',
        isUser: false,
        timestamp: new Date()
      }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
      if (inputValue.trim() === '') return;
      
      // Add user message
      const userMessage: ChatMessageProps = {
        id: Date.now().toString(),
        content: inputValue,
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        const aiMessage: ChatMessageProps = {
          id: (Date.now() + 1).toString(),
          content: `I received your message: "${inputValue}"`,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col h-full bg-white dark:bg-[#292a2d] border-l border-[#dadce0] dark:border-[#3c4043] shadow-lg",
          "w-80",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#dadce0] dark:border-[#3c4043]">
          <h3 className="font-medium text-[#202124] dark:text-[#e8eaed]">Chat Assistant</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#e3e5e8] dark:hover:bg-[#3c4043]"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col max-w-[80%] rounded-lg p-3",
                message.isUser 
                  ? "ml-auto bg-[#1a73e8] text-white" 
                  : "mr-auto bg-[#f1f3f4] dark:bg-[#35363a] text-[#202124] dark:text-[#e8eaed]"
              )}
            >
              <p className="text-sm">{message.content}</p>
              <span className={cn(
                "text-xs mt-1",
                message.isUser ? "text-white/70" : "text-[#5f6368] dark:text-[#9aa0a6]"
              )}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <div className="p-4 border-t border-[#dadce0] dark:border-[#3c4043]">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#f1f3f4] dark:bg-[#35363a] rounded-full px-4 py-2 flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-[#202124] dark:text-[#e8eaed] placeholder-[#5f6368] dark:placeholder-[#9aa0a6]"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-[#1a73e8] dark:text-[#8ab4f8] hover:bg-[#e3e5e8] dark:hover:bg-[#3c4043] ml-1"
                onClick={handleSendMessage}
                disabled={inputValue.trim() === ''}
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ChatSidebar.displayName = "ChatSidebar";

export default ChatSidebar; 