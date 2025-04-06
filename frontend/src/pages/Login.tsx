
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Login = () => {
  const navigate = useNavigate();
  
  const handleSuccessfulLogin = () => {
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
          <img 
            src="/lovable-uploads/9af9cf0d-522f-4fdf-96e4-b832881c0bd5.png" 
            alt="ProCollab Logo" 
            className="h-7 w-7" 
          />
          <span className="font-bold text-xl gradient-text">ProCollab</span>
        </Link>
      </div>
      
      <div className="flex flex-1">
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-neon-purple/20 via-neon-blue/20 to-neon-pink/20 relative overflow-hidden items-center justify-center">
          <div className="relative z-10 p-12 text-center max-w-md mx-auto">
            <h1 className="text-4xl font-bold gradient-text mb-6">Welcome to ProCollab</h1>
            <p className="text-content-secondary text-lg mb-8">
              Connect, collaborate, and create amazing projects with students from various disciplines.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-full bg-neon-purple/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Team Formation</h3>
                  <p className="text-content-secondary text-sm">Find the perfect teammates with complementary skills</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-full bg-neon-blue/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Mentorship</h3>
                  <p className="text-content-secondary text-sm">Connect with industry experts and academic guides</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-full bg-neon-pink/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Funding Opportunities</h3>
                  <p className="text-content-secondary text-sm">Apply for grants and sponsorships for your projects</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-neon-purple/20 filter blur-3xl"></div>
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-neon-blue/20 filter blur-3xl"></div>
        </div>
        
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <AuthForm mode="login" onSuccess={handleSuccessfulLogin} />
        </div>
      </div>
    </div>
  );
};

export default Login;
