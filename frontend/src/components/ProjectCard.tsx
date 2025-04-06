import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Users, Star, Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  teamSize: number;
  duration: string;
  difficulty: string;
  image?: string;
  id?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  tags,
  teamSize,
  duration,
  difficulty,
  image,
  id = "1" // Default ID if none provided
}) => {
  return (
    <div className="glass-card neon-border rounded-xl overflow-hidden relative transition-all duration-300 hover:transform hover:-translate-y-2 animate-fade-in">
      
      {/* Image Section */}
      <div className="h-40 overflow-hidden relative">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 flex items-center justify-center">
            <span className="text-2xl gradient-text font-bold">{title.substring(0, 2)}</span>
          </div>
        )}
        
        {/* Overlay with pointer-events disabled */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/90 to-transparent pointer-events-none"></div>
      </div>
      
      {/* Content Section */}
      <div className="p-5 relative z-10">
        <h3 className="text-xl font-bold text-content-primary mb-2">{title}</h3>
        <p className="text-content-secondary text-sm mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-neon-purple/10 text-neon-purple border-neon-purple/30"
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex items-center gap-1 text-content-secondary text-xs">
            <Users size={14} className="text-neon-blue" />
            <span>{teamSize} members</span>
          </div>
          <div className="flex items-center gap-1 text-content-secondary text-xs">
            <Calendar size={14} className="text-neon-pink" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1 text-content-secondary text-xs">
            <Zap size={14} className="text-neon-purple" />
            <span>{difficulty}</span>
          </div>
        </div>

        {/* Button with Link inside */}
        <Button className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 transition-opacity cursor-pointer">
          <Link 
            to={`/projects/${id}`} 
            className="w-full block text-white no-underline"
          >
            View Details
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
