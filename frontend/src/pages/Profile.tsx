
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ProjectCard from '@/components/ProjectCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, Link as LinkIcon, Github, Linkedin, Twitter, Mail, School, Briefcase, Plus, PenSquare, Medal, Trash } from 'lucide-react';

const Profile = () => {
  // Mock user data - would be connected to actual auth in real app
  const [user, setUser] = useState({
    name: 'John Doe',
    avatar: '',
    username: 'johndoe',
    email: 'john.doe@university.edu',
    institution: 'University of Technology',
    role: 'Computer Science Student',
    bio: 'Final year computer science student specializing in AI and machine learning. Looking to collaborate on innovative projects.',
    skills: ['React', 'TypeScript', 'Python', 'Machine Learning', 'UI/UX'],
    socials: {
      github: 'github.com/johndoe',
      linkedin: 'linkedin.com/in/johndoe',
      twitter: 'twitter.com/johndoe',
      website: 'johndoe.dev'
    }
  });

  // Mock projects - would be fetched from API in real app
  const userProjects = [
    {
      id: "101",
      title: "AI Study Assistant",
      description: "An AI-powered tool to help students organize their study materials and create efficient study plans.",
      tags: ["AI", "Education", "Web App"],
      teamSize: 3,
      duration: "4 months",
      difficulty: "Medium"
    },
    {
      id: "102",
      title: "Eco-Friendly Campus Map",
      description: "Interactive map showing sustainable features and initiatives across campus.",
      tags: ["Mapping", "Sustainability", "UX Design"],
      teamSize: 2,
      duration: "2 months",
      difficulty: "Easy"
    }
  ];

  // Mock teams - would be fetched from API in real app
  const userTeams = [
    {
      id: "201",
      name: "TechInnovators",
      role: "Team Lead",
      members: 4,
      projects: 2
    },
    {
      id: "202",
      name: "DataViz Group",
      role: "Developer",
      members: 5,
      projects: 1
    }
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [newSkill, setNewSkill] = useState('');

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setUser(editedUser);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setEditedUser(prev => ({
      ...prev,
      socials: {
        ...prev.socials,
        [platform]: value
      }
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !editedUser.skills.includes(newSkill.trim())) {
      setEditedUser(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setEditedUser(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  return (
    <div className="min-h-screen bg-surface-dark">
      <Navbar />
      
      <main className="pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <div className="glass-card rounded-xl p-6 md:p-8 mb-8 relative">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-neon-purple/30">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-neon-purple/20 text-neon-purple text-3xl">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-neon-blue text-white p-1 rounded-full">
                    <Camera size={16} />
                  </button>
                )}
              </div>
              
              <div className="flex-grow">
                {isEditing ? (
                  <Input 
                    name="name"
                    value={editedUser.name} 
                    onChange={handleInputChange}
                    className="text-2xl font-bold mb-1 bg-surface-dark/50"
                  />
                ) : (
                  <h1 className="text-2xl md:text-3xl font-bold text-content-primary mb-1">{user.name}</h1>
                )}
                
                <div className="flex flex-wrap gap-2 items-center text-content-secondary mb-2">
                  {isEditing ? (
                    <>
                      <Input 
                        name="institution"
                        value={editedUser.institution}
                        onChange={handleInputChange}
                        className="flex-grow text-sm bg-surface-dark/50"
                        placeholder="Institution"
                      />
                      <Input 
                        name="role"
                        value={editedUser.role}
                        onChange={handleInputChange}
                        className="flex-grow text-sm bg-surface-dark/50"
                        placeholder="Role/Position"
                      />
                    </>
                  ) : (
                    <>
                      <School size={16} className="text-neon-blue" />
                      <span>{user.institution}</span>
                      <div className="w-1 h-1 rounded-full bg-content-secondary/50"></div>
                      <Briefcase size={16} className="text-neon-purple" />
                      <span>{user.role}</span>
                    </>
                  )}
                </div>
                
                {isEditing ? (
                  <Textarea 
                    name="bio"
                    value={editedUser.bio}
                    onChange={handleInputChange}
                    className="w-full text-sm bg-surface-dark/50 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-content-secondary text-sm md:text-base">{user.bio}</p>
                )}
              </div>
              
              <Button 
                onClick={handleEditToggle}
                variant={isEditing ? "default" : "outline"}
                className={isEditing ? 
                  "bg-neon-blue hover:bg-neon-blue/90 text-white gap-2" : 
                  "border-neon-blue text-neon-blue hover:bg-neon-blue/10 gap-2"
                }
              >
                {isEditing ? <Save size={16} /> : <PenSquare size={16} />}
                {isEditing ? "Save Profile" : "Edit Profile"}
              </Button>
            </div>
            
            {/* Skills & Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-semibold text-content-primary">Skills</h3>
                  {isEditing && (
                    <div className="flex-grow flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill..."
                        className="flex-grow bg-surface-dark/50"
                      />
                      <Button 
                        size="sm" 
                        onClick={addSkill}
                        className="bg-neon-purple hover:bg-neon-purple/90"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {editedUser.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className={`bg-neon-purple/10 text-neon-purple border-neon-purple/30 ${
                        isEditing ? 'pr-1' : ''
                      }`}
                    >
                      {skill}
                      {isEditing && (
                        <button 
                          className="ml-1 hover:text-white" 
                          onClick={() => removeSkill(skill)}
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold text-content-primary mb-3">Connect</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Github size={16} className="text-neon-blue" />
                    {isEditing ? (
                      <Input 
                        value={editedUser.socials.github}
                        onChange={(e) => handleSocialChange('github', e.target.value)}
                        className="flex-grow bg-surface-dark/50"
                        placeholder="GitHub username"
                      />
                    ) : (
                      <a href={`https://${user.socials.github}`} target="_blank" rel="noopener noreferrer" className="text-content-secondary hover:text-neon-blue">
                        {user.socials.github}
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Linkedin size={16} className="text-neon-purple" />
                    {isEditing ? (
                      <Input 
                        value={editedUser.socials.linkedin}
                        onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                        className="flex-grow bg-surface-dark/50"
                        placeholder="LinkedIn profile"
                      />
                    ) : (
                      <a href={`https://${user.socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-content-secondary hover:text-neon-purple">
                        {user.socials.linkedin}
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Twitter size={16} className="text-neon-blue" />
                    {isEditing ? (
                      <Input 
                        value={editedUser.socials.twitter}
                        onChange={(e) => handleSocialChange('twitter', e.target.value)}
                        className="flex-grow bg-surface-dark/50"
                        placeholder="Twitter profile"
                      />
                    ) : (
                      <a href={`https://${user.socials.twitter}`} target="_blank" rel="noopener noreferrer" className="text-content-secondary hover:text-neon-blue">
                        {user.socials.twitter}
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <LinkIcon size={16} className="text-neon-purple" />
                    {isEditing ? (
                      <Input 
                        value={editedUser.socials.website}
                        onChange={(e) => handleSocialChange('website', e.target.value)}
                        className="flex-grow bg-surface-dark/50"
                        placeholder="Personal website"
                      />
                    ) : (
                      <a href={`https://${user.socials.website}`} target="_blank" rel="noopener noreferrer" className="text-content-secondary hover:text-neon-purple">
                        {user.socials.website}
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-neon-blue" />
                    <span className="text-content-secondary">{user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Tabs */}
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="mb-6 bg-surface-dark/30">
              <TabsTrigger value="projects">My Projects</TabsTrigger>
              <TabsTrigger value="teams">My Teams</TabsTrigger>
              <TabsTrigger value="mentoring">Mentoring</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-content-primary">My Projects</h2>
                <Link to="/projects/create">
                  <Button className="bg-neon-purple hover:bg-neon-purple/80 text-white gap-2">
                    <Plus size={16} />
                    Create New Project
                  </Button>
                </Link>
              </div>
              
              {userProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProjects.map((project, index) => (
                    <ProjectCard key={index} {...project} />
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-xl p-8 text-center">
                  <h3 className="text-xl font-semibold text-content-primary mb-2">No projects yet</h3>
                  <p className="text-content-secondary mb-6">Start a new project or join an existing one to collaborate with others.</p>
                  <Link to="/projects/create">
                    <Button className="bg-neon-purple hover:bg-neon-purple/80 text-white gap-2">
                      <Plus size={16} />
                      Create New Project
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="teams">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-content-primary">My Teams</h2>
                <Button variant="outline" className="border-neon-blue text-neon-blue hover:bg-neon-blue/10 gap-2">
                  <Plus size={16} />
                  Create New Team
                </Button>
              </div>
              
              {userTeams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userTeams.map((team, index) => (
                    <div key={index} className="glass-card rounded-xl overflow-hidden">
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-content-primary">{team.name}</h3>
                          <Badge variant="outline" className="bg-neon-blue/10 text-neon-blue border-neon-blue/30">
                            {team.role}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-surface-dark/30">
                            <span className="text-2xl font-bold text-neon-purple">{team.members}</span>
                            <span className="text-xs text-content-secondary">Members</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-surface-dark/30">
                            <span className="text-2xl font-bold text-neon-blue">{team.projects}</span>
                            <span className="text-xs text-content-secondary">Projects</span>
                          </div>
                        </div>
                        
                        <Link to={`/teams/${team.id}`}>
                          <Button variant="outline" className="w-full border-white/10 text-content-secondary hover:text-white hover:border-white/30">
                            View Team
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-xl p-8 text-center">
                  <h3 className="text-xl font-semibold text-content-primary mb-2">No teams yet</h3>
                  <p className="text-content-secondary mb-6">Create a team or join an existing one to collaborate on projects.</p>
                  <Button className="bg-neon-purple hover:bg-neon-purple/80 text-white gap-2">
                    <Plus size={16} />
                    Create New Team
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="mentoring">
              <div className="glass-card rounded-xl p-8 text-center">
                <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-neon-purple/20 flex items-center justify-center">
                  <Medal className="text-neon-purple" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-content-primary mb-2">Become a Mentor</h3>
                <p className="text-content-secondary mb-6 max-w-md mx-auto">
                  Share your expertise and guide projects to success. Mentors play a crucial role in helping teams navigate challenges.
                </p>
                <Link to="/mentors/become">
                  <Button className="bg-neon-purple hover:bg-neon-purple/80 text-white">
                    Apply to be a Mentor
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="glass-card rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-semibold text-content-primary mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-content-primary mb-3">Email Address</h3>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="email" 
                        value={user.email} 
                        readOnly
                        className="flex-grow bg-surface-dark/50"
                      />
                      <Button variant="outline" className="border-neon-blue text-neon-blue hover:bg-neon-blue/10">
                        Change
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-content-primary mb-3">Password</h3>
                    <Button variant="outline" className="border-neon-blue text-neon-blue hover:bg-neon-blue/10">
                      Change Password
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-content-primary mb-3">Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-content-secondary">Email Notifications</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-content-secondary">Project Updates</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-content-secondary">Team Messages</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-content-primary mb-3 text-red-500">Danger Zone</h3>
                    <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10 gap-2">
                      <Trash size={16} />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const Switch = ({ defaultChecked }: { defaultChecked?: boolean }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked || false);
  
  return (
    <button
      className={`relative w-11 h-6 rounded-full transition-colors ${
        isChecked ? 'bg-neon-purple' : 'bg-surface-dark/50'
      }`}
      onClick={() => setIsChecked(!isChecked)}
    >
      <span 
        className={`absolute top-1 transition-transform ${
          isChecked ? 'left-6 bg-white' : 'left-1 bg-content-secondary'
        } w-4 h-4 rounded-full`}
      />
    </button>
  );
};

const Link = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => {
  return (
    <a href={to} className={className}>
      {children}
    </a>
  );
};

export default Profile;
