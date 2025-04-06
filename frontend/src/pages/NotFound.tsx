
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/3 -left-20 w-72 h-72 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/3 -right-20 w-72 h-72 bg-neon-blue/20 rounded-full blur-[100px] animate-pulse"></div>
      
      <div className="relative z-10 glass-card rounded-2xl p-12 max-w-md w-full text-center m-4 animate-fade-in">
        <div className="flex justify-center items-center mb-4">
          <img 
            src="/lovable-uploads/9af9cf0d-522f-4fdf-96e4-b832881c0bd5.png" 
            alt="ProCollab Logo" 
            className="h-16 w-16" 
          />
        </div>
        <h1 className="text-8xl font-bold gradient-text mb-6">404</h1>
        <div className="w-16 h-1 bg-gradient-to-r from-neon-purple to-neon-blue mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-content-primary mb-4">Page Not Found</h2>
        <p className="text-content-secondary mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-neon-purple hover:bg-neon-purple/80 text-white px-8">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
