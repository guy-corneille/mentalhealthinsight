import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainIcon, HeartPulseIcon, UserPlusIcon } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

// This is the login page component
// It no longer requires authentication - just redirects to dashboard
const Login: React.FC = () => {
  const [username, setUsername] = useState(''); // Just for UI display
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Simplified handler - no authentication required
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Just display a notification
    addNotification(
      "Welcome!",
      `You have entered as ${username || 'Guest'}`,
      "success"
    );
    
    // Simply navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <BrainIcon className="h-8 w-8 text-primary" />
            <HeartPulseIcon className="h-8 w-8 text-primary" />
          </div>
          
          <CardTitle className="text-2xl font-bold">
            MentalHealthIQ
          </CardTitle>
          <CardDescription>
            Enter any username to access the platform (no authentication)
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username (Optional)</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter any username"
                autoComplete="username"
              />
            </div>
            
            <div className="p-2 bg-amber-50 rounded-md border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Authentication has been disabled. You can enter with any username.
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            <Button type="submit" className="w-full">
              Enter Dashboard
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/register')}
            >
              <UserPlusIcon className="mr-2 h-4 w-4" />
              New User? Register
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
