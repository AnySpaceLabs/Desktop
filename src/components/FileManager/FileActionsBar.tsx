import React from 'react';
import { Search, Plus, Copy, Scissors, Share2, RefreshCw, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface FileActionsBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onCreateFolder: () => void;
  onCopy: () => void;
  onCut: () => void;
  onShare: () => void;
  onRefresh: () => void;
  selectedFiles?: string[];
  className?: string;
}

const FileActionsBar = React.forwardRef<HTMLDivElement, FileActionsBarProps>(
  ({ 
    searchQuery,
    onSearchChange,
    viewMode,
    onViewModeChange,
    onCreateFolder,
    onCopy,
    onCut,
    onShare,
    onRefresh,
    selectedFiles = [],
    className
  }, ref) => {
    const hasSelection = selectedFiles.length > 0;

    return (
      <div className={cn("border-b border-[#dadce0] dark:border-[#3c4043]", className)}>
        {/* Search bar */}
        <div className="p-2 flex items-center gap-2">
          <Input
            type="search"
            placeholder="Search"
            className="w-64"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            prefix={<Search className="h-4 w-4" />}
          />
        </div>

        {/* Actions */}
        <div className="p-2 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCreateFolder}>
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            disabled={!hasSelection}
            onClick={onCopy}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            disabled={!hasSelection}
            onClick={onCut}
          >
            <Scissors className="h-4 w-4 mr-2" />
            Cut
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            disabled={!hasSelection}
            onClick={onShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Separator orientation="vertical" className="mx-2" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange('grid')}
            className={cn(viewMode === 'grid' && 'bg-accent')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange('list')}
            className={cn(viewMode === 'list' && 'bg-accent')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
);

FileActionsBar.displayName = "FileActionsBar";

export default FileActionsBar; 