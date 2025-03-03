
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  useEffect(() => {
    console.log("Index component mounted");
  }, []);

  console.log("Index component rendering");
  
  // Redirect to dashboard
  return <Navigate to="/dashboard" />;
};

export default Index;
