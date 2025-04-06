
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TeamMemberCard from '@/components/TeamMemberCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Filter } from 'lucide-react';

const Teams = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const members = [
    {
      name: "Alex Rivera",
      role: "Full Stack Developer",
      skills: ["React", "Node.js", "MongoDB"],
      university: "Stanford University",
      id: "alex-rivera"
    },
    {
      name: "Mia Chen",
      role: "UX Designer",
      skills: ["Figma", "User Research", "Prototyping"],
      university: "Carnegie Mellon",
      id: "mia-chen"
    },
    {
      name: "Jordan Taylor",
      role: "Data Scientist",
      skills: ["Python", "ML", "Data Analysis"],
      university: "MIT",
      id: "jordan-taylor"
    },
    {
      name: "Sam Wilson",
      role: "Mobile Developer",
      skills: ["Flutter", "Firebase", "UI Design"],
      university: "UC Berkeley",
      id: "sam-wilson"
    },
    {
      name: "Aisha Johnson",
      role: "AI Researcher",
      skills: ["TensorFlow", "Python", "NLP"],
      university: "Georgia Tech",
      id: "aisha-johnson"
    },
    {
      name: "Carlos Mendez",
      role: "Hardware Engineer",
      skills: ["Arduino", "PCB Design", "IoT"],
      university: "Caltech",
      id: "carlos-mendez"
    },
    {
      name: "Zoe Williams",
      role: "Project Manager",
      skills: ["Agile", "Team Leadership", "Strategy"],
      university: "Harvard University",
      id: "zoe-williams"
    },
    {
      name: "Eric Chang",
      role: "Game Developer",
      skills: ["Unity", "C#", "3D Modeling"],
      university: "NYU",
      id: "eric-chang"
    }
  ];
  
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
  
  const filteredMembers = members.filter(member => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.university.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by skills
    const matchesSkills = activeFilters.length === 0 || 
      activeFilters.some(skill => member.skills.includes(skill));
    
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
              Connect with talented students who have the skills you need for your next project.
            </p>
            <Button className="bg-neon-blue hover:bg-neon-blue/80 text-white flex items-center gap-2">
              <Users size={18} />
              Find Teammates
            </Button>
          </div>
        </div>
      </section>
      
      {/* Search & Filter Section */}
      <section className="pb-16 px-4">
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
          
          {/* Members Grid */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-content-primary">
                {filteredMembers.length} members found
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
              {filteredMembers.map((member, index) => (
                <TeamMemberCard key={index} {...member} />
              ))}
            </div>
            
            {filteredMembers.length === 0 && (
              <div className="glass-card rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold text-content-primary mb-2">No members found</h3>
                <p className="text-content-secondary mb-6">Try adjusting your search or filters to find teammates.</p>
                <Button 
                  variant="outline" 
                  className="border-neon-blue text-neon-blue hover:bg-neon-blue/10"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}
            
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

export default Teams;
