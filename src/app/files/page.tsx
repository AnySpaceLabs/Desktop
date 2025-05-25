"use client";

import React, { useState, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  File, 
  Image, 
  FileText, 
  FileCode,
  Music,
  Video,
  Archive,
  MoreVertical,
  Plus,
  Upload,
  Download,
  Trash2,
  Grid,
  List,
  Search,
  Filter,
  SortAsc,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Scissors,
  Share2,
  RefreshCw,
  View,
  FileIcon,
  ImageIcon,
  FileTextIcon,
  FileCodeIcon,
  Music2Icon,
  VideoIcon,
  ArchiveIcon,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useFileSystem } from '@/hooks/useFileSystem';
import FilesDrawer from '@/components/FilesDrawer';
import FileActionsBar from '@/components/FileManager/FileActionsBar';
import FileList, { FileItem } from '@/components/FileManager/FileList';
import PathNavigation from '@/components/FileManager/PathNavigation';

function getFileIcon(type: string) {
  switch (type) {
    case 'folder':
      return <FileIcon className="h-4 w-4" />;
    case 'image':
      return <ImageIcon className="h-4 w-4" />;
    case 'document':
      return <FileTextIcon className="h-4 w-4" />;
    case 'code':
      return <FileCodeIcon className="h-4 w-4" />;
    case 'music':
      return <Music2Icon className="h-4 w-4" />;
    case 'video':
      return <VideoIcon className="h-4 w-4" />;
    case 'archive':
      return <ArchiveIcon className="h-4 w-4" />;
    default:
      return <FileIcon className="h-4 w-4" />;
  }
}

export default function FilesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const {
    currentPath,
    files,
    drives,
    navigate,
    navigateBack,
    createFolder,
    deleteItems,
    copyItems,
    cutItems,
    refresh
  } = useFileSystem();

  const handleFileClick = useCallback((file: FileItem) => {
    setSelectedFiles(prev => {
      if (prev.includes(file.path)) {
        return prev.filter(p => p !== file.path);
      }
      return [...prev, file.path];
    });
  }, []);

  const handleFileDoubleClick = useCallback((file: FileItem) => {
    if (file.type === 'folder') {
      navigate(file.path);
    }
  }, [navigate]);

  const handleShare = useCallback(() => {
    // Implement share functionality
    console.log('Share:', selectedFiles);
  }, [selectedFiles]);

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        {/* Top Toolbar */}
        <div className="flex items-center gap-2 p-2 border-b border-[#dadce0] dark:border-[#3c4043] shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Scissors className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-border mx-2" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <View className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* Left Sidebar */}
          <FilesDrawer 
            drives={drives}
            currentPath={currentPath}
            onNavigate={navigate}
          />

          {/* Main content */}
          <div className="flex-1 flex flex-col min-h-0">
            <PathNavigation
              currentPath={currentPath}
              onNavigate={navigate}
              onBack={navigateBack}
              className="shrink-0"
            />
            
            <FileActionsBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onCreateFolder={createFolder}
              onCopy={() => copyItems(selectedFiles)}
              onCut={() => cutItems(selectedFiles)}
              onShare={handleShare}
              onRefresh={refresh}
              selectedFiles={selectedFiles}
//              className="shrink-0"
            />
            
            <div className="flex-1 min-h-0">
              <FileList
                files={filteredFiles}
                viewMode={viewMode}
                selectedFiles={selectedFiles}
                onFileClick={handleFileClick}
                onFileDoubleClick={handleFileDoubleClick}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 