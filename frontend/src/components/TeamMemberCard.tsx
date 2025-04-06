import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, UserPlus, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface TeamMemberCardProps {
  name: string;
  role: string;
  skills: string[];
  avatar?: string;
  university: string;
  id?: string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  name,
  role,
  skills,
  avatar,
  university,
  id = "1" // Default ID if none provided
}) => {
  return (
    <div className="glass-card neon-border rounded-xl overflow-hidden relative transition-all duration-300 hover:transform hover:-translate-y-2 animate-fade-in">
      
      {/* Avatar and Info Section */}
      <div className="p-5 relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-neon-purple/50">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center">
                <span className="text-lg font-bold text-white">{name.substring(0, 2)}</span>
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-surface-dark"></div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-content-primary">{name}</h3>
            <p className="text-content-secondary text-sm">{university}</p>
          </div>
        </div>

        {/* Role Badge */}
        <div className="mb-3">
          <Badge 
            variant="outline" 
            className="bg-neon-blue/10 text-neon-blue border-neon-blue/30"
          >
            {role}
          </Badge>
        </div>

        {/* Skills Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-neon-purple/10 text-neon-purple border-neon-purple/30 text-xs"
            >
              {skill}
            </Badge>
          ))}
        </div>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline"
              className="w-full border-neon-pink text-neon-pink hover:bg-neon-pink/10 flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} />
              Connect
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="bg-surface-dark border border-white/10">
            
            <Link to={`/chat?type=team&id=${id}`} className="w-full block">
              <DropdownMenuItem className="cursor-pointer hover:bg-neon-purple/20">
                <UserPlus className="mr-2 h-4 w-4 text-neon-purple" />
                <span>Connect for Team</span>
              </DropdownMenuItem>
            </Link>

            <Link to={`/chat?type=project&id=${id}`} className="w-full block">
              <DropdownMenuItem className="cursor-pointer hover:bg-neon-blue/20">
                <FolderPlus className="mr-2 h-4 w-4 text-neon-blue" />
                <span>Connect for Project</span>
              </DropdownMenuItem>
            </Link>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Gradient Overlay with pointer-events disabled */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/90 to-transparent pointer-events-none"></div>
      
    </div>
  );
};

export default TeamMemberCard;
