
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Plus } from 'lucide-react';

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const projects = [
    {
      id: "1",
      title: "AI-Powered Campus Navigator",
      description: "Create an AI system to help new students navigate campus facilities and resources.",
      tags: ["AI", "Mobile App", "UX Design"],
      teamSize: 4,
      duration: "3 months",
      difficulty: "Medium"
    },
    {
      id: "2",
      title: "Sustainable Energy Monitor",
      description: "Build a real-time dashboard to monitor and optimize energy usage across campus.",
      tags: ["IoT", "Data Viz", "Sustainability"],
      teamSize: 5,
      duration: "6 months",
      difficulty: "Hard"
    },
    {
      id: "3",
      title: "Mental Health Companion",
      description: "Design an app to support student mental health with resources and anonymous support.",
      tags: ["Health", "App Dev", "Psychology"],
      teamSize: 3,
      duration: "4 months",
      difficulty: "Medium"
    },
    {
      id: "4",
      title: "Smart Campus Recycling",
      description: "Create a system to track and improve recycling habits across university campuses.",
      tags: ["Hardware", "Environmental", "IoT"],
      teamSize: 4,
      duration: "5 months",
      difficulty: "Medium"
    },
    {
      id: "5",
      title: "Collaborative Music Platform",
      description: "Build a platform for student musicians to collaborate on compositions remotely.",
      tags: ["Audio", "Web Dev", "Creative"],
      teamSize: 3,
      duration: "4 months",
      difficulty: "Medium"
    },
    {
      id: "6",
      title: "Robotics Lab Assistant",
      description: "Design a robotic assistant to help with common lab tasks in science departments.",
      tags: ["Robotics", "AI", "Hardware"],
      teamSize: 5,
      duration: "8 months",
      difficulty: "Hard"
    }
  ];
  
  const popularTags = ["AI", "Mobile App", "Web Dev", "IoT", "UX Design", "Data Viz", "Hardware", "Psychology", "Environmental"];
  
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
  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = activeFilters.length === 0 || 
      activeFilters.some(tag => project.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pb-24 px-4">
        <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-neon-purple/10 to-transparent"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text text-glow">
              Discover Projects
            </h1>
            <p className="text-content-secondary text-lg mb-8">
              Find exciting projects to join or create your own to collaborate with talented students.
            </p>
            <Button className="bg-neon-purple hover:bg-neon-purple/80 text-white flex items-center gap-2">
              <Plus size={18} />
              Create New Project
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
                  placeholder="Search projects..." 
                  className="pl-10 bg-surface-dark/50 border-white/10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Select>
                  <SelectTrigger className="w-[180px] bg-surface-dark/50 border-white/10">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px] bg-surface-dark/50 border-white/10">
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3">1-3 months</SelectItem>
                    <SelectItem value="3-6">3-6 months</SelectItem>
                    <SelectItem value="6+">6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter size={16} className="text-content-secondary" />
                <span className="text-content-secondary text-sm">Popular Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className={`cursor-pointer transition-colors ${
                      activeFilters.includes(tag) 
                        ? 'bg-neon-purple text-white border-neon-purple' 
                        : 'bg-surface-dark/50 text-content-secondary border-white/10 hover:border-neon-purple/50'
                    }`}
                    onClick={() => activeFilters.includes(tag) ? removeFilter(tag) : addFilter(tag)}
                  >
                    {tag}
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
                      className="bg-neon-purple/20 text-neon-purple border-neon-purple/30"
                    >
                      {filter} <button className="ml-1" onClick={() => removeFilter(filter)}>×</button>
                    </Badge>
                  ))}
                </div>
                <Button 
                  variant="ghost" 
                  className="text-content-secondary text-xs hover:text-neon-purple"
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
          
          {/* Projects Grid */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-content-primary">
                {filteredProjects.length} projects found
              </h2>
              <Select>
                <SelectTrigger className="w-[180px] bg-surface-dark/50 border-white/10">
                  <SelectValue placeholder="Sort by: Newest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard 
                  key={index} 
                  {...project} 
                  id={project.id} // Explicitly pass the ID
                />
              ))}
            </div>
            
            {filteredProjects.length === 0 && (
              <div className="glass-card rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold text-content-primary mb-2">No projects found</h3>
                <p className="text-content-secondary mb-6">Try adjusting your search or filters to find projects.</p>
                <Button 
                  variant="outline" 
                  className="border-neon-blue text-neon-blue hover:bg-neon-blue/10 cursor-pointer"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}
            
            {filteredProjects.length > 0 && (
              <div className="mt-10 text-center">
                <Button 
                  variant="outline" 
                  className="border-white/10 text-content-secondary hover:border-white/30 cursor-pointer"
                  onClick={() => console.log("Load more clicked")}
                >
                  Load More Projects
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

export default Projects;
