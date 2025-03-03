
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface StaffStatusBadgeProps {
  status: 'Active' | 'On Leave' | 'Former';
}

const StaffStatusBadge: React.FC<StaffStatusBadgeProps> = ({ status }) => {
  const badgeClassName = 
    status === 'Active' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 
    status === 'On Leave' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 
    'bg-rose-50 text-rose-600 hover:bg-rose-100';

  return (
    <Badge className={badgeClassName}>
      {status}
    </Badge>
  );
};

export default StaffStatusBadge;
