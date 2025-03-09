
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
    
    try {
      const user = await login(username, password);
      addNotification(
        "Welcome back!",
        `You have successfully logged in as ${user.displayName || user.username}`,
        "success"
      );
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        addNotification(
          "Login failed",
          err.message,
          "error"
        );
      } else {
        setError('An unknown error occurred');
        addNotification(
          "Login failed",
          "An unknown error occurred",
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
            <BrainIcon className="h-8 w-8 text-healthiq-600" />
            <HeartPulseIcon className="h-8 w-8 text-healthiq-700" />
          </div>
          
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-healthiq-600 to-healthiq-800">
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
                <a href="#" className="text-sm font-medium text-healthiq-600 hover:text-healthiq-700">
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
        
        <div className="px-6 pb-6 text-center text-sm text-muted-foreground">
          <div className="mt-4">
            <p className="mb-2">Demo Accounts:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div className="border rounded p-1">
                <p className="font-semibold">Admin</p>
                <p>Username: admin</p>
              </div>
              <div className="border rounded p-1">
                <p className="font-semibold">Evaluator</p>
                <p>Username: evaluator</p>
              </div>
              <div className="border rounded p-1">
                <p className="font-semibold">Viewer</p>
                <p>Username: viewer</p>
              </div>
            </div>
            <p className="mt-2">Password for all accounts: password123</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
