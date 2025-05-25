import React from 'react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AppLayout = React.forwardRef<HTMLDivElement, AppLayoutProps>(
  ({ children, className }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "flex h-screen bg-white dark:bg-[#202124] text-[#202124] dark:text-white font-geist-sans",
          className
        )}
      >
        <Sidebar />
        <main className="flex-1 ml-16 relative">
          {/* Chrome-style content area */}
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </div>
    );
  }
);

AppLayout.displayName = "AppLayout";

export default AppLayout; 