
import React from 'react';
import { BarChart3Icon } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const EmptyAuditState: React.FC = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <BarChart3Icon className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">No audit history available</p>
        <p className="text-sm text-center text-muted-foreground mb-6">
          Start your first audit to track facility performance over time
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyAuditState;
