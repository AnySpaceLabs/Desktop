import React, { useState, useEffect } from 'react';
import { Monitor, HardDrive, FolderIcon, ImageIcon, Music2Icon, VideoIcon, ChevronDown, HomeIcon, DownloadIcon, FileTextIcon, MusicIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DriveInfo } from '@/types/electron';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HardDriveIcon } from 'lucide-react';
import path from 'path';

interface FilesDrawerProps {
  drives?: DriveInfo[];
  currentPath: string;
  onNavigate: (path: string) => void;
  className?: string;
}

const QUICK_ACCESS = [
  { id: 'home', name: 'Home', icon: HomeIcon },
  { id: 'downloads', name: 'Downloads', icon: DownloadIcon },
  { id: 'pictures', name: 'Pictures', icon: ImageIcon },
  { id: 'documents', name: 'Documents', icon: FileTextIcon },
  { id: 'music', name: 'Music', icon: MusicIcon },
  { id: 'videos', name: 'Videos', icon: VideoIcon }
];

export const FilesDrawer = React.forwardRef<HTMLDivElement, FilesDrawerProps>(
  ({ drives = [], currentPath, onNavigate, className }, ref) => {
    const [homedir, setHomedir] = useState<string>('');
    const [platform, setPlatform] = useState<string>('');
    const [isElectron, setIsElectron] = useState(false);

    useEffect(() => {
      if (typeof window !== 'undefined' && window.electronAPI) {
        setIsElectron(true);
        setHomedir(window.electronAPI.system.homedir);
        setPlatform(window.electronAPI.system.platform);
      }
    }, []);

    if (!isElectron) {
      return null;
    }

    const getQuickAccessPath = (id: string) => {
      if (id === 'home') return homedir;
      
      // Get the correct path based on platform
      const sep = platform === 'win32' ? '\\' : '/';
      let basePath = '';
      
      if (platform === 'win32') {
        // On Windows, special folders are typically in the User folder
        switch (id) {
          case 'downloads':
            basePath = path.join(homedir, 'Downloads');
            break;
          case 'pictures':
            basePath = path.join(homedir, 'Pictures');
            break;
          case 'documents':
            basePath = path.join(homedir, 'Documents');
            break;
          case 'music':
            basePath = path.join(homedir, 'Music');
            break;
          case 'videos':
            basePath = path.join(homedir, 'Videos');
            break;
          default:
            basePath = homedir;
        }
      } else {
        // On Unix-like systems
        switch (id) {
          case 'downloads':
            basePath = path.join(homedir, 'Downloads');
            break;
          case 'pictures':
            basePath = path.join(homedir, 'Pictures');
            break;
          case 'documents':
            basePath = path.join(homedir, 'Documents');
            break;
          case 'music':
            basePath = path.join(homedir, 'Music');
            break;
          case 'videos':
            basePath = path.join(homedir, 'Videos');
            break;
          default:
            basePath = homedir;
        }
      }
      
      // Normalize the path separators
      return basePath.split(path.sep).join(sep);
    };

    const isPathActive = (targetPath: string) => {
      // Normalize both paths for comparison
      const normalizedCurrent = currentPath.replace(/[\\/]+/g, '/');
      const normalizedTarget = targetPath.replace(/[\\/]+/g, '/');
      return normalizedCurrent === normalizedTarget;
    };

    return (
      <div ref={ref} className={cn("w-60 border-r bg-card", className)}>
        <ScrollArea className="h-full">
          <div className="space-y-4 p-2">
            {/* Quick Access Section */}
            <div>
              <h3 className="px-2 text-sm font-medium text-muted-foreground mb-2">
                Quick Access
              </h3>
              <div className="space-y-1">
                {QUICK_ACCESS.map(({ id, name, icon: Icon }) => {
                  const targetPath = getQuickAccessPath(id);
                  const isActive = isPathActive(targetPath);
                  
                  return (
                    <button
                      key={id}
                      onClick={() => onNavigate(targetPath)}
                      className={cn(
                        "w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-sm",
                        "hover:bg-accent/50 transition-colors duration-150",
                        "group cursor-pointer",
                        isActive && "bg-accent/70 hover:bg-accent text-accent-foreground"
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4",
                        isActive ? "text-accent-foreground" : "text-muted-foreground",
                        "group-hover:text-primary transition-colors duration-150"
                      )} />
                      <span className="truncate">{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drives Section */}
            {drives.length > 0 && (
              <div>
                <h3 className="px-2 text-sm font-medium text-muted-foreground mb-2">
                  Drives
                </h3>
                <div className="space-y-1">
                  {drives.map((drive) => {
                    const isActive = isPathActive(drive.path);
                    
                    return (
                      <div
                        key={drive.path}
                        className="px-2 py-2 rounded-lg hover:bg-accent/50 transition-colors duration-150 group"
                      >
                        <button
                          onClick={() => onNavigate(drive.path)}
                          className={cn(
                            "w-full flex items-center gap-3 mb-1.5",
                            "group cursor-pointer",
                            isActive && "text-accent-foreground"
                          )}
                        >
                          <HardDriveIcon className={cn(
                            "h-4 w-4",
                            isActive ? "text-accent-foreground" : "text-muted-foreground",
                            "group-hover:text-primary transition-colors duration-150"
                          )} />
                          <span className="truncate text-sm font-medium">
                            {drive.name}
                          </span>
                        </button>
                        
                        {/* Storage info */}
                        <div className="pl-7 space-y-1">
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-300" 
                              style={{ width: `${drive.usedPercentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>{drive.used} used</span>
                            <span>{drive.free} free</span>
                          </div>
                          <div className="text-xs text-muted-foreground/80">
                            {drive.total} total
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }
);

FilesDrawer.displayName = "FilesDrawer";

export default FilesDrawer; 