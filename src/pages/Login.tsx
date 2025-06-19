import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainIcon, HeartPulseIcon, UserPlusIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

// This is the login page component
const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification } = useNotifications();

  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Attempt to login with provided credentials
      await login(username, password);
      
      // Success notification
      addNotification(
        "Login successful",
        "Welcome back!",
        "success"
      );
      
      // Navigate to dashboard on successful login
      navigate('/dashboard');
    } catch (error) {
      // Error notification
      addNotification(
        "Login failed",
        error instanceof Error ? error.message : "Invalid credentials",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center space-x-2">
            <BrainIcon className="h-8 w-8 text-blue-600" />
            <HeartPulseIcon className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Mental Health IQ
          </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your account
          </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <div className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto text-blue-600 hover:text-blue-800"
              onClick={() => navigate('/register')}
            >
              Register here
            </Button>
          </div>
          </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
