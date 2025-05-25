"use client";

import { useState, useEffect, useCallback } from 'react';
import { Home as HomeIcon, Search, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrowserBar from '@/components/BrowserBar';
import { BrowserTab, BrowserTabs } from '@/components/BrowserTab';
import WebView from '@/components/WebView';
import ChatButton from '@/components/ChatButton';
import ChatSidebar from '@/components/ChatSidebar';
import Sidebar from '@/components/Sidebar';
import AIChatHome from '@/components/AIChatHome';
import { cn } from '@/lib/utils';
import { type ElectronAPI } from '@/types/electron';


declare global {
  interface Window {
    // @ts-ignore
    electronAPI?: ElectronAPI;
  }
}

const DEFAULT_URL = '';

export default function HomePage() {
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_URL);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [isElectron, setIsElectron] = useState(false);
  const [tabs, setTabs] = useState([
    { id: 0, title: 'New Tab', url: DEFAULT_URL, icon: <HomeIcon className="w-4 h-4" />, favicon: '' },
  ]);

  // Check if running in Electron
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      setIsElectron(true);
    }
  }, []);

  // Handle URL changes from WebView
  const handleURLChange = useCallback((newUrl: string) => {
    setCurrentUrl(newUrl);
    setTabs(tabs => tabs.map(tab => 
      tab.id === activeTab 
        ? { ...tab, url: newUrl }
        : tab
    ));
  }, [activeTab]);

  // Handle title changes from WebView
  const handleTitleChange = useCallback((newTitle: string) => {
    setTabs(tabs => tabs.map(tab => 
      tab.id === activeTab 
        ? { ...tab, title: newTitle }
        : tab
    ));
  }, [activeTab]);

  // Handle favicon changes from WebView
  const handleFaviconChange = useCallback((faviconUrl: string) => {
    setTabs(tabs => tabs.map(tab => 
      tab.id === activeTab 
        ? { ...tab, favicon: faviconUrl }
        : tab
    ));
  }, [activeTab]);

  // Handle URL navigation
  const handleNavigate = useCallback((url: string) => {
    if (!url.trim()) {
      setCurrentUrl('');
      setTabs(tabs => tabs.map(tab => 
        tab.id === activeTab 
          ? { ...tab, url: '', title: 'New Tab', favicon: '' }
          : tab
      ));
      return;
    }

    setIsLoading(true);
    
    // Ensure URL has protocol
    const normalizedUrl = url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;
    
    setCurrentUrl(normalizedUrl);
    
    // Update the current tab's URL
    setTabs(tabs => tabs.map(tab => 
      tab.id === activeTab 
        ? { ...tab, url: normalizedUrl }
        : tab
    ));

    // Prevent focus from going to webview
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [activeTab]);

  // Handle tab switching
  const handleTabChange = useCallback((tabId: number) => {
    setActiveTab(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setCurrentUrl(tab.url);
    }
  }, [tabs]);

  // Handle adding a new tab
  const handleAddTab = useCallback(() => {
    const newTabId = Math.max(...tabs.map(tab => tab.id)) + 1;
    const newTab = {
      id: newTabId,
      title: 'New Tab',
      url: '',
      icon: <HomeIcon className="w-4 h-4" />,
      favicon: ''
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTab(newTabId);
    setCurrentUrl('');
  }, [tabs]);

  // Handle closing a tab
  const handleCloseTab = useCallback((tabId: number) => {
    // Don't allow closing the last tab
    if (tabs.length <= 1) return;
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    // If the active tab was closed, switch to the first available tab
    if (activeTab === tabId) {
      const newActiveTab = newTabs[0].id;
      setActiveTab(newActiveTab);
      setCurrentUrl(newTabs[0].url);
    }
  }, [tabs, activeTab]);

  // Toggle chat sidebar
  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
    setUnreadMessages(0);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    
    if (isElectron && window.electronAPI) {
      window.electronAPI.navigation.refresh();
    } else {
      // Simulate loading for non-Electron environment
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [isElectron]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    setIsLoading(true);
    
    if (isElectron && window.electronAPI) {
      window.electronAPI.navigation.goBack();
    } else {
      // Simulate loading for non-Electron environment
      setTimeout(() => setIsLoading(false), 800);
    }
  }, [isElectron]);

  // Handle forward navigation
  const handleForward = useCallback(() => {
    setIsLoading(true);
    
    if (isElectron && window.electronAPI) {
      window.electronAPI.navigation.goForward();
    } else {
      // Simulate loading for non-Electron environment
      setTimeout(() => setIsLoading(false), 800);
    }
  }, [isElectron]);

  // Simulate receiving a new message
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isChatOpen) {
        setUnreadMessages(prev => prev + 1);
      }
    }, 30000); // Every 30 seconds if chat is closed
    
    return () => clearInterval(interval);
  }, [isChatOpen]);

  // Handle AI chat submission
  const handleChatSubmit = useCallback((message: string) => {
    // For now, just navigate to a search URL with the message
    const searchUrl = `https://anyspace.ai/search?q=${encodeURIComponent(message)}`;
    handleNavigate(searchUrl);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className={cn(
        "flex-1 ml-16 flex h-screen transition-all duration-300 overflow-hidden",
        isChatOpen ? "mr-80" : "mr-0"
      )}>
        <main className="flex-1 flex flex-col h-screen bg-[#f8f9fa] dark:bg-[#202124] relative overflow-hidden">
          {/* Header with tab bar and URL bar */}
          <header className="flex flex-col border-b border-[#dadce0] dark:border-[#3c4043] z-10 relative">
            {/* Tab bar */}
            <div className="flex items-center bg-[#dfe1e5] dark:bg-[#202124] px-2 pt-1">
              <BrowserTabs onAddTab={handleAddTab}>
                {tabs.map((tab) => (
                  <BrowserTab
                    key={tab.id}
                    title={tab.title}
                    icon={tab.favicon ? <img src={tab.favicon} className="w-4 h-4" /> : tab.icon}
                    active={activeTab === tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    onClose={() => handleCloseTab(tab.id)}
                  />
                ))}
              </BrowserTabs>
              
              <div className="flex items-center ml-auto">
                <Button variant="ghost" size="sm" className="text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#e3e5e8] dark:hover:bg-[#3c4043]">
                  <span className="text-sm">Sign in</span>
                </Button>
              </div>
            </div>
            
            {/* URL bar */}
            <div className="flex items-center justify-center bg-white dark:bg-[#35363a] py-2 px-4">
              <BrowserBar 
                defaultUrl={currentUrl}
                onNavigate={handleNavigate}
                isLoading={isLoading}
                onRefresh={handleRefresh}
                onBack={handleBack}
                onForward={handleForward}
              />
            </div>
          </header>
          
          {/* WebView container or AI Chat Home */}
          <div className="flex-1 relative overflow-hidden pointer-events-auto">
            {currentUrl === DEFAULT_URL ? (
              <AIChatHome onSubmit={handleChatSubmit} />
            ) : (
              <WebView
                url={currentUrl}
                isLoading={isLoading}
                onLoadingChange={setIsLoading}
                onURLChange={handleURLChange}
                onTitleChange={handleTitleChange}
                onFaviconChange={handleFaviconChange}
              />
            )}
        </div>
      </main>
      </div>

      {/* Right Chat Sidebar - Fixed position */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-80 transform transition-transform duration-300 ease-in-out z-20",
          isChatOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <ChatSidebar onClose={toggleChat} isOpen={isChatOpen} />
      </div>
      
      {/* Floating chat button */}
      {isChatOpen && !currentUrl && <div className="fixed bottom-4 right-4 z-30">
        <ChatButton 
          isOpen={isChatOpen} 
          onClick={toggleChat} 
          unreadCount={unreadMessages}
        />
      </div>}
    </div>
  );
}
