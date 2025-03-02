
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the dashboard page
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse">
        <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-healthiq-600 to-healthiq-800">
          MentalHealthIQ
        </h1>
      </div>
    </div>
  );
};

export default Index;
