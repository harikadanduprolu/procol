
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Signup = () => {
  const navigate = useNavigate();
  
  const handleSuccessfulSignup = () => {
    // Set login state in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/');
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full text-content-primary hover:text-neon-blue hover:bg-white/5">
            <Home className="h-5 w-5" />
          </Button>
          <span className="font-bold text-xl gradient-text">ProCollab</span>
        </Link>
      </div>
      
      <div className="flex flex-1">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 order-2 lg:order-1">
          <AuthForm mode="signup" onSuccess={handleSuccessfulSignup} />
        </div>
        
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-neon-pink/20 via-neon-purple/20 to-neon-blue/20 relative overflow-hidden items-center justify-center order-1 lg:order-2">
          <div className="relative z-10 p-12 text-center max-w-md mx-auto">
            <h1 className="text-4xl font-bold gradient-text mb-6">Join ProCollab Today</h1>
            <p className="text-content-secondary text-lg mb-8">
              Create an account to start collaborating on innovative projects with students from around the world.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-full bg-neon-purple/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Discover Projects</h3>
                  <p className="text-content-secondary text-sm">Explore innovative projects across various disciplines</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-full bg-neon-blue/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Communication Tools</h3>
                  <p className="text-content-secondary text-sm">Chat, discuss, and share ideas seamlessly</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-full bg-neon-pink/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Resource Sharing</h3>
                  <p className="text-content-secondary text-sm">Access to learning materials and project resources</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-neon-pink/20 filter blur-3xl"></div>
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-neon-blue/20 filter blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
