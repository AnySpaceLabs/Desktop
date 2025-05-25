import React from 'react';
import { Plus, X, Copy, Scissors, Share2, RefreshCw, View } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileToolbarProps {
  onNew?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onCut?: () => void;
  onShare?: () => void;
  onRefresh?: () => void;
  onViewOptions?: () => void;
  selectedFiles?: string[];
}

const FileToolbar = React.forwardRef<HTMLDivElement, FileToolbarProps>(
  ({ onNew, onDelete, onCopy, onCut, onShare, onRefresh, onViewOptions, selectedFiles = [] }, ref) => {
    const hasSelection = selectedFiles.length > 0;

    return (
      <div 
        ref={ref}
        className="flex items-center gap-2 p-2 border-b border-[#dadce0] dark:border-[#3c4043]"
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onNew}
          title="New"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onDelete}
          disabled={!hasSelection}
          title="Delete"
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onCopy}
          disabled={!hasSelection}
          title="Copy"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onCut}
          disabled={!hasSelection}
          title="Cut"
        >
          <Scissors className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onShare}
          disabled={!hasSelection}
          title="Share"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <div className="h-4 w-px bg-border mx-2" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onRefresh}
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onViewOptions}
          title="View options"
        >
          <View className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);

FileToolbar.displayName = "FileToolbar";

export default FileToolbar; 