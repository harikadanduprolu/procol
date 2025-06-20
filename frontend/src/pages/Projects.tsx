import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Plus, Loader2 } from 'lucide-react';
import { projectApi } from '@/services/api';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useAuth } from '@/contexts/AuthContext';

const Projects = () => {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  const popularTags = ["AI", "Mobile App", "Web Dev", "IoT", "UX Design", "Data Viz", "Hardware", "Psychology", "Environmental"];
  
  // Fetch projects using React Query
  const { data: projectsData, isLoading, error } = useApiQuery(
    ['projects', searchQuery, activeFilters.join(','), sortBy, difficulty, duration, page.toString()],
    () => projectApi.getAll({ 
      search: searchQuery, 
      tags: activeFilters.join(','), 
      sort: sortBy,
      difficulty,
      duration,
      page: page.toString(),
      limit: limit.toString()
    }),
    {
      refetchOnWindowFocus: false,
    }
  );
  
  const projects = projectsData?.data?.projects || [];
  const pagination = projectsData?.data?.pagination;
  
  const addFilter = (tag: string) => {
    if (!activeFilters.includes(tag)) {
      setActiveFilters([...activeFilters, tag]);
      setPage(1); // Reset to first page when filter changes
    }
  };
  
  const removeFilter = (tag: string) => {
    setActiveFilters(activeFilters.filter(t => t !== tag));
    setPage(1); // Reset to first page when filter changes
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
    setDifficulty(null);
    setDuration(null);
    setPage(1);
  };
  
  const handleDifficultyClick = (value: string) => {
    setDifficulty(difficulty === value ? null : value);
  };

  const handleDurationClick = (value: string) => {
    setDuration(duration === value ? null : value);
  };
  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !difficulty || project.difficulty === difficulty;
    const matchesDuration = !duration || project.duration === duration;
    const matchesTags = activeFilters.length === 0 || activeFilters.some(tag => project.tags.includes(tag));
    return matchesSearch && matchesDifficulty && matchesDuration && matchesTags;
  });
  
  return (
    <div className="min-h-screen bg-background">
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
            <Button 
              className="bg-neon-purple hover:bg-neon-purple/80 text-white flex items-center gap-2"
              asChild
            >
              <Link to={isAuthenticated ? "/projects/create" : "/login"}>
                <Plus size={18} />
                Create New Project
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Search & Filter Section */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="glass-card rounded-xl p-6 mb-8">
            {/* Search + Filters */}
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
                <Select value={difficulty || null} onValueChange={handleDifficultyClick}>
                  <SelectTrigger className="w-[180px] bg-surface-dark/50 border-white/10">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={duration || null} onValueChange={handleDurationClick}>
                  <SelectTrigger className="w-[180px] bg-surface-dark/50 border-white/10">
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>All Durations</SelectItem>
                    <SelectItem value="1-3">1-3 months</SelectItem>
                    <SelectItem value="3-6">3-6 months</SelectItem>
                    <SelectItem value="6+">6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Popular Tags */}
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

            {/* Active Filters */}
            {(activeFilters.length > 0 || searchQuery || difficulty || duration) && (
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
                  {searchQuery && (
                    <Badge 
                      variant="outline" 
                      className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                    >
                      Search: {searchQuery} <button className="ml-1" onClick={() => setSearchQuery('')}>×</button>
                    </Badge>
                  )}
                  {difficulty && (
                    <Badge 
                      variant="outline" 
                      className="bg-neon-pink/20 text-neon-pink border-neon-pink/30"
                    >
                      Difficulty: {difficulty} <button className="ml-1" onClick={() => handleDifficultyClick(difficulty)}>×</button>
                    </Badge>
                  )}
                  {duration && (
                    <Badge 
                      variant="outline" 
                      className="bg-neon-green/20 text-neon-green border-neon-green/30"
                    >
                      Duration: {duration} <button className="ml-1" onClick={() => handleDurationClick(duration)}>×</button>
                    </Badge>
                  )}
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

          {/* Projects Section */}
          <div>
            {isLoading ? (
              <div className="text-center py-20">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-neon-purple" />
                <p className="text-content-secondary">Loading projects...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500">Failed to load projects. Please try again later.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-content-primary">
                    {pagination?.total || 0} projects found
                  </h2>
                  <Select value={sortBy} onValueChange={setSortBy}>
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
                  {projects.map((project) => (
                    <ProjectCard 
                      key={project._id}
                      id={project._id}
                      title={project.title}
                      description={project.description}
                      tags={project.tags || []}
                      teamSize={project.team?.length || 1}
                      duration={project.duration || "3-6 months"}
                      difficulty={project.difficulty || "Medium"}
                      image={project.image}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center mt-8 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4">
                      Page {page} of {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                      disabled={page === pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projects;
