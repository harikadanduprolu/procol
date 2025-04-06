
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSuccess?: () => void;
}

const AuthForm = ({ mode, onSuccess }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      
      // Show success toast
      toast({
        title: mode === 'login' ? "Successfully logged in!" : "Account created successfully!",
        description: mode === 'login' 
          ? "Welcome back to ProCollab!" 
          : "Welcome to ProCollab! Your account has been created.",
        variant: "default",
      });
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md border-white/10 bg-surface-dark/70 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold gradient-text text-center">
          {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
        </CardTitle>
        <CardDescription className="text-content-secondary text-center">
          {mode === 'login'
            ? 'Enter your credentials to access your account'
            : 'Join our community of innovators and collaborators'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background/50 border-white/20"
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 border-white/20"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/50 border-white/20"
              required
            />
          </div>

          {mode === 'signup' && (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => {
                  setAgreedToTerms(checked as boolean);
                }}
                required
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-content-secondary"
              >
                I agree to the <Link to="/terms" className="text-neon-blue hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-neon-blue hover:underline">Privacy Policy</Link>
              </label>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full mt-6 bg-neon-purple hover:bg-neon-purple/80 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </span>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10"></span>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface-dark px-2 text-content-secondary">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button variant="outline" className="border-white/20 hover:bg-white/5">
            <Github className="mr-2 h-4 w-4" />
            Github
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-white/10 pt-4">
        <p className="text-content-secondary text-sm">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <Link
            to={mode === 'login' ? '/signup' : '/login'}
            className="text-neon-blue hover:underline font-medium"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
