import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './card';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

const DashboardCard = React.forwardRef<HTMLDivElement, DashboardCardProps>(
  ({ title, description, icon: Icon, className, children, footer, action }, ref) => {
    return (
      <Card ref={ref} className={cn("overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center gap-2">
          {Icon && (
            <div className="p-2 rounded-md bg-secondary text-secondary-foreground">
              <Icon size={18} />
            </div>
          )}
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        </CardHeader>
        {children && <CardContent>{children}</CardContent>}
        {(footer || action) && (
          <CardFooter className="flex justify-between items-center pt-4 border-t">
            {footer}
            {action && (
              <Button 
                variant="ghost" 
                onClick={action.onClick}
                {...(action.href ? { as: 'a', href: action.href } : {})}
              >
                {action.label}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    );
  }
);

DashboardCard.displayName = "DashboardCard";

export { DashboardCard }; 