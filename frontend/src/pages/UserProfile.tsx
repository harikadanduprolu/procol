import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Calendar, 
  Mail, 
  Github, 
  Linkedin, 
  Twitter, 
  Globe,
  ArrowLeft,
  MessageSquare,
  UserPlus,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { authApi } from '@/services/api';
import { toast } from 'sonner';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  university?: string;
  bio?: string;
  avatar?: string;
  yearsOfExperience?: number;
  location?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  projects?: Array<{
    _id: string;
    title: string;
    description: string;
    tags: string[];
    image?: string;
    createdAt: string;
  }>;
  createdAt: string;
}

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await authApi.getUserById(id);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleConnect = () => {
    toast.success('Connection request sent!');
  };

  const handleMessage = () => {
    toast.info('Messaging feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto text-center">
            <div className="text-content-secondary">Loading profile...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl font-bold text-content-primary mb-4">User Not Found</h1>
            <Link to="/connect">
              <Button variant="outline">Back to Connect</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link to="/connect" className="inline-flex items-center text-content-secondary hover:text-neon-blue mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Connect
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="bg-background/50 border-white/10">
                <CardContent className="p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-neon-blue to-neon-purple text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h1 className="text-2xl font-bold text-content-primary mb-2">{user.name}</h1>
                  <p className="text-content-secondary mb-4 capitalize">{user.role}</p>
                  
                  {user.bio && (
                    <p className="text-content-secondary text-sm mb-6">{user.bio}</p>
                  )}

                  <div className="flex gap-2 mb-6">
                    <Button onClick={handleConnect} className="flex-1 bg-neon-blue hover:bg-neon-blue/80">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                    <Button onClick={handleMessage} variant="outline" className="flex-1 border-white/20">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-content-primary">{user.projects?.length || 0}</div>
                      <div className="text-xs text-content-secondary">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-content-primary">{user.yearsOfExperience || 0}</div>
                      <div className="text-xs text-content-secondary">Years Experience</div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-left">
                    {user.email && (
                      <div className="flex items-center gap-2 text-content-secondary text-sm">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center gap-2 text-content-secondary text-sm">
                        <MapPin className="w-4 h-4" />
                        {user.location}
                      </div>
                    )}
                    {user.university && (
                      <div className="flex items-center gap-2 text-content-secondary text-sm">
                        <GraduationCap className="w-4 h-4" />
                        {user.university}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-content-secondary text-sm">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Social Links */}
                  {user.socials && (
                    <div className="flex justify-center gap-3 mt-6">
                      {user.socials.github && (
                        <a href={user.socials.github} target="_blank" rel="noopener noreferrer" 
                           className="text-content-secondary hover:text-neon-blue transition-colors">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {user.socials.linkedin && (
                        <a href={user.socials.linkedin} target="_blank" rel="noopener noreferrer"
                           className="text-content-secondary hover:text-neon-blue transition-colors">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {user.socials.twitter && (
                        <a href={user.socials.twitter} target="_blank" rel="noopener noreferrer"
                           className="text-content-secondary hover:text-neon-blue transition-colors">
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {user.socials.website && (
                        <a href={user.socials.website} target="_blank" rel="noopener noreferrer"
                           className="text-content-secondary hover:text-neon-blue transition-colors">
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills Card */}
              <Card className="bg-background/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-content-primary">Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.skills?.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="bg-neon-blue/10 text-neon-blue border-neon-blue/30"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Projects */}
            <div className="lg:col-span-2">
              <Card className="bg-background/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-content-primary flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Projects ({user.projects?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.projects && user.projects.length > 0 ? (
                    <div className="space-y-4">
                      {user.projects.map((project) => (
                        <Link key={project._id} to={`/projects/${project._id}`}>
                          <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                            <div className="flex gap-4">
                              {project.image && (
                                <img 
                                  src={project.image} 
                                  alt={project.title}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <h3 className="font-semibold text-content-primary mb-2">{project.title}</h3>
                                <p className="text-content-secondary text-sm mb-3 line-clamp-2">
                                  {project.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {project.tags?.slice(0, 3).map((tag, index) => (
                                    <Badge 
                                      key={index} 
                                      variant="outline" 
                                      className="text-xs bg-neon-purple/10 text-neon-purple border-neon-purple/30"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="text-xs text-content-secondary">
                                  {new Date(project.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-content-secondary">No projects available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UserProfile;