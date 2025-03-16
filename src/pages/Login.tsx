
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BrainIcon, HeartPulseIcon, AlertCircleIcon, UserPlusIcon } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    
    try {
      console.log('Attempting login with:', { username });
      const user = await login(username, password);
      console.log('Login successful:', user);
      
      addNotification(
        "Welcome back!",
        `You have successfully logged in as ${user.displayName || user.username}`,
        "success"
      );
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'Invalid credentials. Please check your username and password.';
      
      if (err instanceof Error) {
        // Custom error handling for specific error messages
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          errorMessage = 'Authentication failed. Please check your username and password.';
        } else if (err.message.includes('network') || err.message.includes('connection')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again later.';
        } else if (err.message.includes('server')) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        addNotification(
          "Login failed",
          errorMessage,
          "error"
        );
      } else {
        setError(errorMessage);
        addNotification(
          "Login failed",
          errorMessage,
          "error"
        );
      }
    }
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
            Sign in to access the mental health facility management platform
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-primary hover:text-primary/80">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
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
