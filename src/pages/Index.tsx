
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  useEffect(() => {
    console.log("Index component mounted");
  }, []);

  console.log("Index component rendering");
  
  // Instead of immediately redirecting, let's show a simple landing page
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Mental Health IQ</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Comprehensive mental health facility management and assessment platform
        </p>
        <div className="mt-4">
          <a 
            href="/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
