import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = (location.state as any)?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Check your credentials and try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 lg:flex-row flex-col min-h-screen">
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-neon-purple/20 via-neon-blue/20 to-neon-pink/20 items-center justify-center relative overflow-hidden">
          <div className="z-10 p-12 text-center max-w-md">
            <h1 className="text-4xl font-bold gradient-text mb-6">Welcome to ProCollab</h1>
            <p className="text-content-secondary text-lg mb-8">
              Connect, collaborate, and create amazing projects with students from various disciplines.
            </p>
            <div className="space-y-6">
              <Feature title="Team Formation" description="Find perfect teammates with complementary skills" color="neon-purple" />
              <Feature title="Mentorship" description="Connect with experts and guides" color="neon-blue" />
              <Feature title="Funding Opportunities" description="Apply for grants and sponsorships" color="neon-pink" />
            </div>
          </div>
          {/* Decorative blurs */}
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl" />
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-20 relative">
          <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 z-10">
            <Button variant="ghost" size="icon" className="rounded-full text-content-primary hover:text-neon-blue hover:bg-white/5">
              <Home className="h-5 w-5" />
            </Button>
            <span className="font-bold text-xl gradient-text">ProCollab</span>
          </Link>

          <div className="max-w-md w-full bg-background/80 backdrop-blur-lg p-8 rounded-xl shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold gradient-text">Sign in to your account</h2>
              <p className="mt-2 text-sm text-content-secondary">
                Or{' '}
                <Link to="/signup" className="text-neon-blue hover:underline">
                  create a new account
                </Link>
              </p>
            </div>

            <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
              <div className=" m-1">
                <Label htmlFor="email" className="m-0">Email address</Label>
                <Input id="email" type="email" autoComplete="email" {...register('email')} />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex justify-between m-1">
                  <Label htmlFor="password" >Password</Label>
                  <Link to="/forgot-password" className="text-sm text-neon-blue hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full bg-neon-purple hover:bg-neon-purple/80 text-white py-3" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;

const Feature = ({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color: 'neon-purple' | 'neon-blue' | 'neon-pink';
}) => {
  const bg = `bg-${color}/30`;
  const icon = `bg-${color}`;
  return (
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
        <div className={`w-4 h-4 rounded-full ${icon}`} />
      </div>
      <div className="text-left">
        <h4 className="text-white font-semibold">{title}</h4>
        <p className="text-content-secondary text-sm">{description}</p>
      </div>
    </div>
  );
};
