
import React from 'react';

interface ErrorStateProps {
  error: Error;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="py-12 text-center">
      <p className="text-rose-500 mb-2">Error loading staff</p>
      <p className="text-muted-foreground">{error.message || 'Unknown error occurred'}</p>
    </div>
  );
};

export default ErrorState;
