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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApiQuery, useApiMutation } from '../hooks/useApi';
import { useToast } from '../hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

interface ProfileFormData {
  name: string;
  bio: string;
  skills: string[];
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
  location: string;
  avatar: string;
}

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    bio: '',
    skills: [],
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
    location: '',
    avatar: ''
  });

  const { data: profile, isLoading } = useApiQuery('/profile/me', {
    onSuccess: (data) => {
      setFormData(data);
    }
  });

  const updateProfileMutation = useApiMutation('/profile/me', {
    method: 'PUT',
    onSuccess: (data) => {
      updateUser(data);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => ({ ...prev, skills }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-surface-dark">
      <Navbar />
      
      <main className="pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile</CardTitle>
                <Button
                  variant={isEditing ? 'secondary' : 'default'}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={formData.avatar} />
                    <AvatarFallback>{formData.name?.[0]}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Input
                      name="avatar"
                      placeholder="Avatar URL"
                      value={formData.avatar}
                      onChange={handleChange}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Skills (comma-separated)</label>
                  <Input
                    name="skills"
                    value={formData.skills.join(', ')}
                    onChange={handleSkillsChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">GitHub</label>
                    <Input
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">LinkedIn</label>
                    <Input
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Twitter</label>
                    <Input
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Website</label>
                    <Input
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
          
          {/* Content Tabs */}
          <Tabs defaultValue="projects" className="w-full mt-8">
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
              
              {/* Project list will be added here */}
            </TabsContent>
            
            <TabsContent value="teams">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-content-primary">My Teams</h2>
                <Button variant="outline" className="border-neon-blue text-neon-blue hover:bg-neon-blue/10 gap-2">
                  <Plus size={16} />
                  Create New Team
                </Button>
              </div>
              
              {/* Team list will be added here */}
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
