import React from 'react';
import { FileIcon, FolderIcon, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: number;
  modifiedAt?: Date;
}

interface FileListProps {
  files: FileItem[];
  viewMode: 'grid' | 'list';
  selectedFiles: string[];
  onFileClick: (file: FileItem) => void;
  onFileDoubleClick: (file: FileItem) => void;
  className?: string;
}

const getFileIcon = (type: 'file' | 'folder') => {
  return type === 'folder' ? FolderIcon : FileIcon;
};

const formatFileSize = (size?: number) => {
  if (!size) return '--';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let fileSize = size;

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex++;
  }

  return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
};

const formatDate = (date?: Date) => {
  if (!date) return '--';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const FileList = React.forwardRef<HTMLDivElement, FileListProps>(
  ({ files, viewMode, selectedFiles, onFileClick, onFileDoubleClick, className }, ref) => {
    return (
      <div ref={ref} className={cn("h-full flex flex-col min-h-0 bg-background/40 rounded-md", className)}>
        {viewMode === 'grid' ? (
          <ScrollArea className="h-full">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 p-4">
              {files.map((file) => {
                const Icon = getFileIcon(file.type);
                const isSelected = selectedFiles.includes(file.path);

                return (
                  <div
                    key={file.path}
                    className={cn(
                      "group flex flex-col items-center p-4 rounded-xl cursor-pointer select-none",
                      "bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
                      "hover:bg-white dark:hover:bg-gray-800/80 hover:shadow-lg hover:-translate-y-0.5",
                      "border border-border/50 hover:border-border",
                      "transition-all duration-200 ease-in-out",
                      isSelected && "bg-primary/10 hover:bg-primary/20 border-primary/50 shadow-md ring-1 ring-primary/20"
                    )}
                    onClick={() => onFileClick(file)}
                    onDoubleClick={() => onFileDoubleClick(file)}
                  >
                    <div className={cn(
                      "relative mb-3 p-2 rounded-lg",
                      "bg-gradient-to-br from-background/80 to-muted",
                      "group-hover:from-background group-hover:to-background",
                      "transition-colors duration-200",
                      isSelected && "from-primary/5 to-primary/10"
                    )}>
                      <Icon className={cn(
                        "h-12 w-12",
                        file.type === 'folder' 
                          ? "text-blue-500 dark:text-blue-400" 
                          : "text-gray-600 dark:text-gray-400",
                        "group-hover:text-primary transition-colors duration-200",
                        "drop-shadow-sm"
                      )} />
                    </div>
                    <span className="text-sm font-medium text-center truncate w-full">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground/80 mt-1">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center px-6 py-2.5 bg-muted/80 border-b text-sm font-medium text-muted-foreground select-none shrink-0 rounded-t-md backdrop-blur-sm">
              <div className="w-8" /> {/* Icon space */}
              <div className="flex-grow">Name</div>
              <div className="w-32 text-right">Size</div>
              <div className="w-48">Modified</div>
            </div>
            
            {/* File list */}
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="min-w-[600px]">
                  {files.map((file, index) => {
                    const Icon = getFileIcon(file.type);
                    const isSelected = selectedFiles.includes(file.path);

                    return (
                      <div
                        key={file.path}
                        className={cn(
                          "group flex items-center px-6 py-2 cursor-pointer select-none",
                          "hover:bg-accent/30 active:bg-accent/50",
                          "transition-colors duration-150",
                          index % 2 === 0 ? "bg-muted/[0.015]" : "bg-transparent",
                          isSelected && "bg-primary/10 hover:bg-primary/20"
                        )}
                        onClick={() => onFileClick(file)}
                        onDoubleClick={() => onFileDoubleClick(file)}
                      >
                        <div className={cn(
                          "w-8 h-8 mr-3 rounded-lg flex items-center justify-center flex-shrink-0",
                          "bg-gradient-to-br from-background/80 to-muted/80",
                          "group-hover:from-background group-hover:to-background",
                          "transition-colors duration-200",
                          isSelected && "from-primary/5 to-primary/10"
                        )}>
                          <Icon className={cn(
                            "h-4.5 w-4.5",
                            file.type === 'folder' 
                              ? "text-blue-500 dark:text-blue-400" 
                              : "text-gray-600 dark:text-gray-400",
                            "group-hover:text-primary transition-colors duration-200"
                          )} />
                        </div>
                        <div className="flex-grow flex items-center min-w-0 font-medium">
                          <span className="truncate">{file.name}</span>
                          {file.type === 'folder' && (
                            <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-200 text-primary" />
                          )}
                        </div>
                        <div className="w-32 text-right text-sm text-muted-foreground/80">
                          {formatFileSize(file.size)}
                        </div>
                        <div className="w-48 text-sm text-muted-foreground/80">
                          {formatDate(file.modifiedAt)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </div>
    );
  }
);

FileList.displayName = "FileList";

export default FileList; 