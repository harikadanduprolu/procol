import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TeamMemberCard from '@/components/TeamMemberCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Filter, Loader2 } from 'lucide-react';
import { authApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const Connect = () => {
  const { user: authUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null); // Reset error
      
      try {
        console.log('🔍 Fetching users...'); // Debug log
        
        const params: Record<string, any> = {};
        if (searchQuery) params.search = searchQuery;
        if (activeFilters.length > 0) params.skills = activeFilters.join(',');
        
        console.log('📝 Request params:', params); // Debug log
        
        const res = await authApi.getAllUsers(params);
        
        console.log('📦 Full API Response:', res); // Debug log
        console.log('📦 Response data:', res.data); // Debug log
        
        // Handle different response structures
        const userData = res.data?.users || res.data || [];
        
        console.log('👥 Processed users:', userData); // Debug log
        console.log('👥 Users count:', userData.length); // Debug log
        
        if (!Array.isArray(userData)) {
          console.error('❌ userData is not an array:', typeof userData);
          throw new Error('Invalid response format - expected array');
        }
        
        setUsers(userData);
        
      } catch (err: any) {
        console.error('❌ Fetch users error:', err);
        console.error('❌ Error response:', err?.response);
        console.error('❌ Error status:', err?.response?.status);
        console.error('❌ Error data:', err?.response?.data);
        console.error('❌ Error message:', err?.message);
        
        setError(err?.response?.data?.message || err?.message || 'Failed to fetch users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [searchQuery, activeFilters]);
  
  const popularSkills = ["React", "Python", "UX Design", "Machine Learning", "AI", "Mobile Dev", "Leadership", "UI Design", "AR/VR"];
  
  const addFilter = (tag: string) => {
    if (!activeFilters.includes(tag)) {
      setActiveFilters([...activeFilters, tag]);
    }
  };
  
  const removeFilter = (tag: string) => {
    setActiveFilters(activeFilters.filter(t => t !== tag));
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
  };
  
  // Add safety checks for filtering
  const filteredMembers = users
    .filter(member => member && member.role !== 'mentor') // Add null check
    .filter(member => {
      const matchesSearch = searchQuery === '' ||
        member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.university?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSkills = activeFilters.length === 0 ||
        (member.skills && activeFilters.some(skill => member.skills.includes(skill)));
      return matchesSearch && matchesSkills;
    });

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pb-24 px-4">
        <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-neon-blue/10 to-transparent"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text text-glow">
              Find Teammates
            </h1>
            <p className="text-content-secondary text-lg mb-8">
              Connect with talented students who have the skills you need for your projects.
            </p>
            <Button 
              className="bg-neon-blue hover:bg-neon-blue/80 text-white flex items-center gap-2"
              onClick={() => {
                if (!authUser) {
                  window.location.href = '/signup';
                } else {
                  document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <Users size={18} />
              {authUser ? 'Connect Now' : 'Join to Connect'}
            </Button>
          </div>
        </div>
      </section>
      
      {/* Search & Filter Section */}
      <section className="pb-16 px-4" id="search-section">
        <div className="container mx-auto">
          <div className="glass-card rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-secondary" />
                <Input 
                  placeholder="Search by name, role or university..." 
                  className="pl-10 bg-surface-dark/50 border-white/10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Select>
                  <SelectTrigger className="w-[180px] bg-surface-dark/50 border-white/10">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="researcher">Researcher</SelectItem>
                    <SelectItem value="manager">Project Manager</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px] bg-surface-dark/50 border-white/10">
                    <SelectValue placeholder="University" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stanford">Stanford</SelectItem>
                    <SelectItem value="mit">MIT</SelectItem>
                    <SelectItem value="cmu">Carnegie Mellon</SelectItem>
                    <SelectItem value="berkeley">UC Berkeley</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter size={16} className="text-content-secondary" />
                <span className="text-content-secondary text-sm">Popular Skills:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSkills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className={`cursor-pointer transition-colors ${
                      activeFilters.includes(skill) 
                        ? 'bg-neon-blue text-white border-neon-blue' 
                        : 'bg-surface-dark/50 text-content-secondary border-white/10 hover:border-neon-blue/50'
                    }`}
                    onClick={() => activeFilters.includes(skill) ? removeFilter(skill) : addFilter(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-content-secondary text-sm">Active Filters:</span>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                    >
                      {filter} <button className="ml-1" onClick={() => removeFilter(filter)}>×</button>
                    </Badge>
                  ))}
                </div>
                <Button 
                  variant="ghost" 
                  className="text-content-secondary text-xs hover:text-neon-blue"
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
          
          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="glass-card rounded-xl p-4 mb-4 border border-yellow-500/30 bg-yellow-500/5">
              <h3 className="text-yellow-300 font-semibold mb-2">🐛 Debug Info:</h3>
              <p className="text-yellow-200 text-sm">Loading: {loading.toString()}</p>
              <p className="text-yellow-200 text-sm">Error: {error || 'None'}</p>
              <p className="text-yellow-200 text-sm">Raw Users: {users.length}</p>
              <p className="text-yellow-200 text-sm">Filtered Members: {filteredMembers.length}</p>
              <p className="text-yellow-200 text-sm">Auth User: {authUser ? authUser.name : 'Not logged in'}</p>
            </div>
          )}
          
          {/* Error Display */}
          {error && (
            <div className="glass-card rounded-xl p-6 mb-8 border border-red-500/30 bg-red-500/5">
              <h3 className="text-red-300 font-semibold mb-2">❌ Failed to load users</h3>
              <p className="text-red-200 text-sm mb-4">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}
          
          {/* Members Grid */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-content-primary">
                {loading ? 'Loading...' : `${filteredMembers.length} members found`}
              </h2>
              <Select>
                <SelectTrigger className="w-[180px] bg-surface-dark/50 border-white/10">
                  <SelectValue placeholder="Sort by: Recently Active" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Recently Active</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="projects">Most Projects</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="glass-card rounded-xl p-6 h-64 animate-pulse">
                    <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-white/10 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-6 bg-white/10 rounded"></div>
                      <div className="h-6 bg-white/10 rounded"></div>
                    </div>
                  </div>
                ))
              ) : error ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-red-300">Failed to load users. Check console for details.</p>
                </div>
              ) : filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <TeamMemberCard 
                    key={member._id || member.id} 
                    id={member._id || member.id}
                    name={member.name || "Unknown User"}
                    role={member.role || "User"}
                    skills={member.skills || []}
                    university={member.university || "Not specified"}
                    avatar={member.avatar}
                  />
                ))
              ) : (
                <div className="col-span-full glass-card rounded-xl p-8 text-center">
                  <h3 className="text-xl font-semibold text-content-primary mb-2">No members found</h3>
                  <p className="text-content-secondary mb-6">
                    {users.length === 0 
                      ? "No users are registered yet or there's an API issue." 
                      : "Try adjusting your search or filters to find teammates."
                    }
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-neon-blue text-neon-blue hover:bg-neon-blue/10"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
            
            {filteredMembers.length > 0 && (
              <div className="mt-10 text-center">
                <Button variant="outline" className="border-white/10 text-content-secondary hover:border-white/30">
                  Load More Members
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Connect;
