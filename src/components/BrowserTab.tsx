import React from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BrowserTabProps {
  title: string;
  icon?: React.ReactNode;
  active?: boolean;
  className?: string;
  onClick?: () => void;
  onClose?: () => void;
  url?: string;
}

export interface BrowserTabsProps {
  children: React.ReactNode;
  className?: string;
  onAddTab?: () => void;
}

export const BrowserTab = React.forwardRef<HTMLDivElement, BrowserTabProps>(
  ({ title, icon, active = false, className, onClick, onClose, url = '' }, ref) => {
    const displayTitle = url ? title : 'New Tab';
    
    return (
      <div
        ref={ref}
        className={cn(
          "group flex items-center min-w-[180px] max-w-[240px] h-9 px-3 rounded-t-lg relative cursor-pointer",
          active
            ? "bg-white dark:bg-[#35363a] text-[#202124] dark:text-[#e8eaed]"
            : "bg-[#dfe1e5] dark:bg-[#202124] text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#e3e5e8] dark:hover:bg-[#3c4043]",
          className
        )}
        onClick={onClick}
      >
        {icon && (
          <div className={cn(
            "mr-2",
            active ? "text-[#1a73e8] dark:text-[#8ab4f8]" : "text-[#5f6368] dark:text-[#9aa0a6]",
            !url && "opacity-50"
          )}>
            {icon}
          </div>
        )}
        <div className="flex-1 truncate text-sm">{displayTitle}</div>
        <button
          className={cn(
            "ml-2 rounded-full p-0.5 opacity-0 group-hover:opacity-100 hover:bg-[#e3e5e8] dark:hover:bg-[#3c4043]",
            active ? "text-[#5f6368] dark:text-[#9aa0a6]" : "text-[#5f6368] dark:text-[#9aa0a6]"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
        >
          <X size={14} />
        </button>
        
        {/* Active indicator line */}
        {active && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1a73e8] dark:bg-[#8ab4f8]"></div>
        )}
      </div>
    );
  }
);

BrowserTab.displayName = "BrowserTab";

export const BrowserTabs = React.forwardRef<HTMLDivElement, BrowserTabsProps>(
  ({ children, className, onAddTab }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center space-x-1 overflow-x-auto scrollbar-hide",
          className
        )}
      >
        {children}
        <button
          className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-[#e3e5e8] dark:hover:bg-[#3c4043] text-[#5f6368] dark:text-[#9aa0a6]"
          onClick={onAddTab}
        >
          <Plus size={18} />
        </button>
      </div>
    );
  }
);

BrowserTabs.displayName = "BrowserTabs"; 