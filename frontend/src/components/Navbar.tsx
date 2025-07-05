import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Users, Search, Lightbulb, MessageSquare, DollarSign, 
  User, Plus, LogIn, Bell, MessageCircle 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { notificationApi, messageApi } from '@/services/api'; // <-- Add this import

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]); // Re-check when location changes

  useEffect(() => {
    if (!isAuthenticated) {
      setNotificationCount(0);
      return;
    }
    // Fetch notification count (unread or all, as your API supports)
    const fetchCount = async () => {
      try {
        const res = await notificationApi.getAll();
        // Count unread or pending notifications
        const count = Array.isArray(res.data)
          ? res.data.filter((n: any) => !n.read || n.status === 'pending').length
          : 0;
        setNotificationCount(count);
      } catch {
        setNotificationCount(0);
      }
    };
    fetchCount();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setMessageCount(0);
      return;
    }
    const fetchMessageCount = async () => {
      try {
        const res = await messageApi.getConversations();
        // Count unread messages (adjust the filter as per your backend)
        const count = Array.isArray(res.data)
          ? res.data.reduce((acc: number, convo: any) => acc + (convo.unreadCount || 0), 0)
          : 0;
        setMessageCount(count);
      } catch {
        setMessageCount(0);
      }
    };
    fetchMessageCount();
  }, [isAuthenticated]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    
    // Show notification
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
      variant: "default",
    });
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) {
      return 'U';
    }
    return user.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 bg-black/80 backdrop-blur-lg shadow-lg' : 'py-5 bg-black/80 backdrop-blur-lg shadow-lg'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/favicon.ico" 
              alt="ProCollab Logo" 
              className="h-8 w-8" 
            />
            <span className="font-bold text-2xl gradient-text font-space-grotesk">ProCollab</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/projects" 
              className={`text-content-primary hover:text-neon-blue transition-colors ${
                location.pathname.includes('/projects') ? 'text-neon-blue' : ''
              }`}
            >
              Projects
            </Link>
            <Link 
              to="/teams" 
              className={`text-content-primary hover:text-neon-blue transition-colors ${
                location.pathname.includes('/teams') ? 'text-neon-blue' : ''
              }`}
            >
              Teams
            </Link>
            <Link 
              to="/mentors" 
              className={`text-content-primary hover:text-neon-blue transition-colors ${
                location.pathname.includes('/mentors') ? 'text-neon-blue' : ''
              }`}
            >
              Mentors
            </Link>
            <Link 
              to="/funding" 
              className={`text-content-primary hover:text-neon-blue transition-colors ${
                location.pathname.includes('/funding') ? 'text-neon-blue' : ''
              }`}
            >
              Funding
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/projects/create">
                  <Button variant="outline" className="border-neon-purple text-neon-purple hover:bg-neon-purple/10 flex items-center gap-2">
                    <Plus size={16} />
                    New Project
                  </Button>
                </Link>
                <Link to="/chat" className="relative">
                  <Button variant="ghost" size="icon" className="rounded-full text-content-primary hover:text-neon-blue">
                    <MessageCircle size={20} />
                    {messageCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-neon-purple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {messageCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link to="/notifications" className="relative">
                  <Button variant="ghost" size="icon" className="rounded-full text-content-primary hover:text-neon-blue">
                    <Bell size={20} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-neon-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link to="/profile">
                  <Avatar className="cursor-pointer h-9 w-9 border-2 border-neon-blue/30 hover:border-neon-blue transition-colors">
                    {user?.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-neon-blue/20 text-neon-blue">
                        {getUserInitials()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Link>
                <Button 
                  variant="ghost" 
                  className="text-content-secondary hover:text-neon-blue"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-neon-blue text-neon-blue hover:bg-neon-blue/10 flex items-center gap-2">
                    <LogIn size={16} />
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-neon-purple hover:bg-neon-purple/80 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="absolute top-full left-0 right-0 bg-surface-dark/95 backdrop-blur-xl shadow-lg border-t border-white/10 py-6 px-4 animate-slide-down">
          <div className="flex flex-col gap-6">
            <Link 
              to="/projects" 
              className="flex items-center gap-3 text-content-primary hover:text-neon-purple transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Search size={18} />
              <span>Projects</span>
            </Link>
            <Link 
              to="/teams" 
              className="flex items-center gap-3 text-content-primary hover:text-neon-purple transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Users size={18} />
              <span>Teams</span>
            </Link>
            <Link 
              to="/mentors" 
              className="flex items-center gap-3 text-content-primary hover:text-neon-purple transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Lightbulb size={18} />
              <span>Mentors</span>
            </Link>
            <Link 
              to="/funding" 
              className="flex items-center gap-3 text-content-primary hover:text-neon-purple transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <DollarSign size={18} />
              <span>Funding</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/projects/create" 
                  className="flex items-center gap-3 text-content-primary hover:text-neon-purple transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Plus size={18} />
                  <span>New Project</span>
                </Link>
                <Link 
                  to="/chat" 
                  className="flex items-center gap-3 text-content-primary hover:text-neon-purple transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MessageCircle size={18} />
                  <span>Messages</span>
                  {messageCount > 0 && (
                    <span className="ml-auto bg-neon-purple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {messageCount}
                    </span>
                  )}
                </Link>
                <Link 
                  to="/notifications" 
                  className="flex items-center gap-3 text-content-primary hover:text-neon-purple transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Bell size={18} />
                  <span>Notifications</span>
                  {notificationCount > 0 && (
                    <span className="ml-auto bg-neon-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-3 text-content-primary hover:text-neon-purple transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <button 
                  className="flex items-center gap-3 text-content-primary hover:text-neon-purple transition-colors"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogIn size={18} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center gap-3 text-content-primary hover:text-neon-purple transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn size={18} />
                  <span>Log In</span>
                </Link>
                <Link 
                  to="/signup" 
                  className="flex items-center gap-3 text-content-primary hover:text-neon-purple transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
