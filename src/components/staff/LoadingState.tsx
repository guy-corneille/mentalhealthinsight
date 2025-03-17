
import React from 'react';
import { Spinner } from "@/components/ui/spinner";

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <Spinner size="lg" />
      <p className="ml-2 text-muted-foreground">Loading staff...</p>
    </div>
  );
};

export default LoadingState;
