import React, { useState, useEffect, KeyboardEvent, useRef, useCallback, ChangeEvent, FormEvent } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Lock, Star, X, MoreVertical, ChevronDown, ChevronLeft, ChevronRight, Search, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Define Electron API types
interface ElectronAPI {
  on: (channel: string, callback: (...args: any[]) => void) => void;
  send: (channel: string, ...args: any[]) => void;
  navigation: {
    goBack: () => void;
    goForward: () => void;
    refresh: () => void;
    loadURL: (url: string) => void;
  };
  system: {
    platform: string;
    homedir: string;
  };
}

// Extend Window interface
declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export interface BrowserBarProps {
  url?: string;
  isLoading?: boolean;
  onNavigate?: (url: string) => void;
  onBack?: () => void;
  onForward?: () => void;
  onRefresh?: () => void;
}

const BrowserBar = React.forwardRef<HTMLDivElement, BrowserBarProps>(
  ({ 
    url = '',
    isLoading = false,
    onNavigate,
    onBack,
    onForward,
    onRefresh
  }, ref) => {
    const [inputValue, setInputValue] = useState(url);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isElectron, setIsElectron] = useState(false);
    
    // Check if running in Electron
    useEffect(() => {
      if (typeof window !== 'undefined' && window.electronAPI) {
        setIsElectron(true);
      }
    }, []);
    
    // Update input value when URL prop changes
    useEffect(() => {
      setInputValue(url);
    }, [url]);
    
    // Handle URL navigation
    const navigateToUrl = useCallback((targetUrl: string) => {
      if (onNavigate) {
        onNavigate(targetUrl);
      }
    }, [onNavigate]);

    // Handle form submission
    const handleSubmit = useCallback((e: FormEvent) => {
      e.preventDefault();
      navigateToUrl(inputValue);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, [inputValue, navigateToUrl]);

    // Handle input change
    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    }, []);

    // Handle refresh button click
    const handleRefresh = useCallback(() => {
      if (onRefresh) {
        onRefresh();
      }
    }, [onRefresh]);

    return (
      <div 
        ref={ref}
        className={cn(
          "flex flex-col w-full max-w-3xl",
        )}
      >
        {/* Loading progress bar */}
        <div className="h-[3px] w-full relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0">
              <div className="absolute h-full animate-progress-indeterminate" />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 px-2 h-10">
          {/* Navigation buttons */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#e3e5e8] dark:hover:bg-[#3c4043]"
              onClick={onBack}
            >
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#e3e5e8] dark:hover:bg-[#3c4043]"
              onClick={onForward}
            >
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-8 w-8 rounded-full text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#e3e5e8] dark:hover:bg-[#3c4043]",
                isLoading && "animate-spin"
              )}
              onClick={handleRefresh}
            >
              {isLoading ? (
                <X className="w-5 h-5" />
              ) : (
                <RotateCw className="w-5 h-5 text-gray-500" />
              )}
            </Button>
          </div>

          {/* URL input - Chrome style */}
          <div className="flex-1 flex items-center relative">
            <div className={cn(
              "w-full h-9 bg-[#f1f3f4] dark:bg-[#202124] rounded-full flex items-center transition-all",
              "hover:bg-[#f8f9fa] dark:hover:bg-[#35363a] focus-within:bg-[#f8f9fa] dark:focus-within:bg-[#35363a]",
              "border border-transparent hover:border-[#dfe1e5] dark:hover:border-[#3c4043]",
              "focus-within:border-[#dfe1e5] dark:focus-within:border-[#3c4043]",
              isLoading && "border-[#1a73e8] dark:border-[#8ab4f8]"
            )}>
              {/* Site identity section */}
              <div className={cn(
                "flex items-center min-w-[90px] px-3 border-r border-transparent group cursor-pointer",
                url ? "hover:border-[#dfe1e5] dark:hover:border-[#3c4043]" : "border-none"
              )}>
                <Lock size={14} className={cn(
                  "mr-2",
                  isLoading ? "text-[#1a73e8] dark:text-[#8ab4f8] animate-pulse" : "text-[#1a73e8] dark:text-[#8ab4f8]",
                  !url && "opacity-50"
                )} />
                <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6] whitespace-nowrap overflow-hidden text-ellipsis">
                  {url ? url.replace(/^https?:\/\//, '').split('/')[0] : 'New Tab'}
                </span>
                {url && <ChevronDown size={14} className="text-[#5f6368] dark:text-[#9aa0a6] ml-1 opacity-0 group-hover:opacity-100" />}
              </div>
            
              {/* URL input */}
              <div className="flex-1 flex items-center px-2">
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="flex items-center flex-1 h-7 px-3 rounded-full bg-gray-100 dark:bg-gray-800/50">
                    <div className={`flex items-center gap-1.5 ${isLoading ? 'animate-pulse' : ''}`}>
                      {url ? (
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        <Search className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      className={`flex-1 ml-1.5 bg-transparent border-none outline-none text-sm ${
                        isLoading ? 'text-blue-500' : ''
                      }`}
                      placeholder="Search or enter website"
                    />
                  </div>
                </form>
              </div>
            
              {/* Action buttons */}
              <div className="flex items-center pr-2">
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#e3e5e8] dark:hover:bg-[#3c4043] ml-1">
                  <Star size={14} />
                </Button>
              </div>
            </div>
          </div>

          {/* Additional actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#e3e5e8] dark:hover:bg-[#3c4043]">
              <MoreVertical size={18} />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

BrowserBar.displayName = "BrowserBar";

export default BrowserBar; 