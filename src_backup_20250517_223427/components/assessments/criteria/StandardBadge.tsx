
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StandardBadgeProps {
  standard: string;
  className?: string;
}

const StandardBadge: React.FC<StandardBadgeProps> = ({ standard, className }) => {
  const getStandardBadgeColor = (standard: string) => {
    switch (standard) {
      case 'WHO-AIMS 2.0':
        return 'bg-blue-500';
      case 'ISO 9001':
        return 'bg-green-500';
      case 'Custom':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Badge className={cn(getStandardBadgeColor(standard), className)}>
      {standard}
    </Badge>
  );
};

export default StandardBadge;
