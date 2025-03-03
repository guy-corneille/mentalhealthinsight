
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityIcon, BrainIcon, HeartPulseIcon } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the dashboard page after a short delay
    const redirectTimer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <BrainIcon className="h-10 w-10 text-healthiq-600" />
          <HeartPulseIcon className="h-10 w-10 text-healthiq-700" />
        </div>
        
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-healthiq-600 to-healthiq-800">
          MentalHealthIQ
        </h1>
        
        <p className="text-muted-foreground max-w-md">
          Comprehensive mental health facility management and assessment platform
        </p>
        
        <div className="mt-8 flex items-center">
          <ActivityIcon className="h-5 w-5 mr-3 text-healthiq-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">Redirecting to dashboard...</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
