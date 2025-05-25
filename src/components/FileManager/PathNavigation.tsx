import React from 'react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PathNavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onBack?: () => void;
  className?: string;
}

const PathNavigation = React.forwardRef<HTMLDivElement, PathNavigationProps>(
  ({ currentPath, onNavigate, onBack, className }, ref) => {
    const pathParts = currentPath.split(/[/\\]/).filter(Boolean);
    const isRoot = pathParts.length === 0;

    const handlePathClick = (index: number) => {
      const newPath = pathParts.slice(0, index + 1).join('/');
      onNavigate(newPath);
    };

    return (
      <div 
        ref={ref}
        className={cn(
          "flex items-center gap-2 p-2 border-b border-[#dadce0] dark:border-[#3c4043]",
          className
        )}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8"
          onClick={onBack}
          disabled={isRoot}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-1 text-sm">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => onNavigate('/')}
          >
            <Home className="h-4 w-4" />
          </Button>

          {pathParts.map((part, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2",
                  index === pathParts.length - 1 && "text-muted-foreground"
                )}
                onClick={() => handlePathClick(index)}
              >
                {part}
              </Button>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
);

PathNavigation.displayName = "PathNavigation";

export default PathNavigation; 