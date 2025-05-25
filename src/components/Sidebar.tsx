import React from 'react';
import Link from 'next/link';
import { 
  Home,
  Search,
  Settings,
  FolderClosed,
  FileText,
  Terminal,
  BarChart2,
  User,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  return (
    <div className="h-screen w-16 bg-[#f1f3f4] dark:bg-[#292a2d] flex flex-col items-center py-2 fixed left-0 top-0 z-10 border-r border-[#dadce0] dark:border-[#3c4043]">
      {/* Menu button */}
      <div className="mb-4 w-full flex justify-center">
        <button className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-[#e8eaed] dark:hover:bg-[#35363a]">
          <Menu size={20} className="text-[#5f6368] dark:text-[#9aa0a6]" />
        </button>
      </div>
      
      {/* Navigation Icons */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        <SidebarItem icon={<Home size={20} />} tooltip="Home" href="/" active />
        <SidebarItem icon={<Search size={20} />} tooltip="Search" href="/search" />
        <SidebarItem icon={<BarChart2 size={20} />} tooltip="Dashboard" href="/dashboard" />
        <SidebarItem icon={<Terminal size={20} />} tooltip="Terminal" href="/terminal" />
        <SidebarItem icon={<FolderClosed size={20} />} tooltip="Files" href="/files" />
      </nav>
      
      {/* Settings & User Profile */}
      <div className="mt-auto flex flex-col gap-1 mb-2">
        <SidebarItem icon={<Settings size={20} />} tooltip="Settings" href="/settings" />
        <div className="h-10 w-10 rounded-full bg-[#1a73e8] flex items-center justify-center cursor-pointer hover:bg-[#1967d2] transition-colors">
          <User size={18} className="text-white" />
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  tooltip: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, tooltip, href, active }) => {
  return (
    <Link href={href} className="group relative">
      <div className={cn(
        "h-10 w-10 rounded-full flex items-center justify-center cursor-pointer transition-colors",
        active 
          ? "bg-[#e8eaed] dark:bg-[#35363a] text-[#1a73e8]" 
          : "hover:bg-[#e8eaed] dark:hover:bg-[#35363a] text-[#5f6368] dark:text-[#9aa0a6]"
      )}>
        {icon}
      </div>
      <span className="absolute left-14 whitespace-nowrap rounded-md bg-[#202124]/90 text-white px-2 py-1 text-xs font-medium transition-all duration-200 scale-0 origin-left group-hover:scale-100 z-20 shadow-lg">
        {tooltip}
      </span>
    </Link>
  );
};

export default Sidebar; 