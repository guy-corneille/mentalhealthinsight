
import React from 'react';

interface ErrorStateProps {
  message: string;
  error?: Error;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, error }) => {
  return (
    <div className="py-12 text-center">
      <p className="text-rose-500 mb-2">{message}</p>
      {error && (
        <p className="text-muted-foreground">{error.message || 'Unknown error occurred'}</p>
      )}
    </div>
  );
};

export default ErrorState;
