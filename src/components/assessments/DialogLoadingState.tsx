
import React from 'react';
import { Spinner } from '@/components/ui/spinner';

const DialogLoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <Spinner size="md" />
      <span className="ml-2">Loading...</span>
    </div>
  );
};

export default DialogLoadingState;
