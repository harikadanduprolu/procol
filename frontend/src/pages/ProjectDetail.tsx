import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Users, 
  Zap, 
  MessageSquare, 
  FileText, 
  Github, 
  Star, 
  Share, 
  ArrowLeft,
  Shield,
  Settings
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isApplying, setIsApplying] = useState(false);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(true); // For demo purposes, set to true
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  
  // Mock project data (in a real app, you would fetch this from an API)
  const [project, setProject] = useState({
    id: id || '1',
    title: "AI-Powered Campus Navigator",
    description: "Create an AI system to help new students navigate campus facilities and resources with personalized recommendations and real-time assistance.",
    longDescription: "The AI-Powered Campus Navigator is an innovative solution designed to help new students seamlessly navigate through their university experience. This system combines advanced AI algorithms with comprehensive campus data to provide personalized recommendations, directions, and information about campus facilities, services, and events. Features include real-time navigation assistance, personalized recommendations based on student interests and schedules, integration with university calendars and class schedules, multilingual support, and accessibility features for students with disabilities.",
    tags: ["AI", "Mobile App", "UX Design"],
    teamSize: 4,
    duration: "3 months",
    difficulty: "Medium",
    status: "Active",
    createdAt: "2023-10-15",
    deadline: "2024-01-15",
    skills: ["React Native", "TensorFlow", "UI/UX Design", "Node.js", "AWS"],
    members: [
      { id: "1", name: "Alex Rivera", role: "Project Lead", avatar: "", isAdmin: true },
      { id: "2", name: "Mia Chen", role: "UX Designer", avatar: "", isAdmin: false }
    ],
    openRoles: ["AI Engineer", "Mobile Developer"],
    settings: {
      isPublic: true,
      allowApplications: true,
      automaticApplicationApproval: false,
      showGithubLink: true
    }
  });
  
  const handleApply = () => {
    setIsApplying(true);
    
    // Simulate application process
    setTimeout(() => {
      setIsApplying(false);
      
      toast.success("Application submitted successfully!");
    }, 1500);
  };

  const toggleAdminStatus = (memberId: string) => {
    setProject(prev => ({
      ...prev,
      members: prev.members.map(member => 
        member.id === memberId 
          ? { ...member, isAdmin: !member.isAdmin } 
          : member
      )
    }));
    
    setAdminDialogOpen(false);
    
    const member = project.members.find(m => m.id === memberId);
    if (member) {
      toast.success(`${member.isAdmin ? 'Removed' : 'Granted'} admin rights to ${member.name}`);
    }
  };

  const handleSettingChange = (setting: keyof typeof project.settings) => {
    setProject(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: !prev.settings[setting]
      }
    }));

    toast.success(`Project setting updated`);
  };

  const openAdminDialog = (member: any) => {
    setSelectedMember(member);
    setAdminDialogOpen(true);
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <Link to="/projects" className="inline-flex items-center text-content-secondary hover:text-neon-blue mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-background/50 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-content-primary mb-3">{project.title}</h1>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="bg-neon-purple/10 text-neon-purple border-neon-purple/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {isCurrentUserAdmin && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="border-white/20 text-content-secondary hover:text-neon-purple hover:border-neon-purple"
                        onClick={() => setSettingsOpen(true)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="icon" className="border-white/20 text-content-secondary hover:text-neon-blue hover:border-neon-blue">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="border-white/20 text-content-secondary hover:text-neon-blue hover:border-neon-blue">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="flex flex-col items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Users className="h-6 w-6 text-neon-blue mb-2" />
                    <span className="text-sm text-content-secondary">Team Size</span>
                    <span className="font-semibold text-content-primary">{project.teamSize} members</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Calendar className="h-6 w-6 text-neon-pink mb-2" />
                    <span className="text-sm text-content-secondary">Duration</span>
                    <span className="font-semibold text-content-primary">{project.duration}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Zap className="h-6 w-6 text-neon-purple mb-2" />
                    <span className="text-sm text-content-secondary">Difficulty</span>
                    <span className="font-semibold text-content-primary">{project.difficulty}</span>
                  </div>
                </div>
                
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-8">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-semibold mb-4">Description</h3>
                      <p className="text-content-secondary leading-relaxed">{project.longDescription}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-semibold mb-4">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="bg-neon-blue/10 text-neon-blue border-neon-blue/30"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-semibold mb-4">Timeline</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-neon-blue mr-3" />
                            <span className="text-content-secondary">Start Date</span>
                          </div>
                          <span className="font-semibold text-content-primary">{project.createdAt}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-neon-pink mr-3" />
                            <span className="text-content-secondary">Deadline</span>
                          </div>
                          <span className="font-semibold text-content-primary">{project.deadline}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="team" className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-semibold mb-4">Current Team</h3>
                      <div className="space-y-4">
                        {project.members.map((member, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback className="bg-neon-purple/20 text-neon-purple text-lg">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-semibold text-content-primary flex items-center">
                                {member.name}
                                {member.isAdmin && (
                                  <Badge className="ml-2 bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                                    <Shield className="h-3 w-3 mr-1" /> Admin
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-content-secondary">{member.role}</div>
                            </div>
                            <div className="flex gap-2">
                              {isCurrentUserAdmin && member.id !== "1" && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-neon-purple hover:bg-neon-purple/10"
                                  onClick={() => openAdminDialog(member)}
                                >
                                  <Shield className="h-4 w-4 mr-1" />
                                  {member.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" className="text-neon-blue hover:bg-neon-blue/10">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Message
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-semibold mb-4">Open Roles</h3>
                      <div className="space-y-4">
                        {project.openRoles.map((role, index) => (
                          <div key={index} className="flex justify-between items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <span className="text-content-primary font-medium">{role}</span>
                            <Button size="sm" variant="outline" className="border-neon-purple text-neon-purple hover:bg-neon-purple/10">
                              Apply
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resources" className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-semibold mb-4">Project Resources</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                          <FileText className="h-6 w-6 text-neon-blue" />
                          <div>
                            <div className="font-semibold text-content-primary">Project Outline</div>
                            <div className="text-sm text-content-secondary">PDF Document • 2.3 MB</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                          <Github className="h-6 w-6 text-neon-purple" />
                          <div>
                            <div className="font-semibold text-content-primary">Github Repository</div>
                            <div className="text-sm text-content-secondary">Code repository with initial setup</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-background/50 backdrop-blur-sm border border-white/10 rounded-xl p-6  top-24">
                <h3 className="text-xl font-semibold mb-4">Join This Project</h3>
                <p className="text-content-secondary mb-6">
                  Interested in this project? Apply now to collaborate with the team!
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 transition-opacity mb-4"
                  onClick={handleApply}
                  disabled={isApplying || !project.settings.allowApplications}
                >
                  {isApplying ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Applying...
                    </span>
                  ) : (
                    'Apply to Join'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-content-secondary hover:text-neon-blue hover:border-neon-blue"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Team Lead
                </Button>
              </div>
              
              <div className="bg-background/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Similar Projects</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <h4 className="font-semibold text-content-primary mb-2">Smart Campus Recycling</h4>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline" className="bg-neon-purple/10 text-neon-purple border-neon-purple/30 text-xs">Hardware</Badge>
                      <Badge variant="outline" className="bg-neon-purple/10 text-neon-purple border-neon-purple/30 text-xs">IoT</Badge>
                    </div>
                    <div className="flex items-center text-content-secondary text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      4 members
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <h4 className="font-semibold text-content-primary mb-2">Mental Health Companion</h4>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline" className="bg-neon-purple/10 text-neon-purple border-neon-purple/30 text-xs">Health</Badge>
                      <Badge variant="outline" className="bg-neon-purple/10 text-neon-purple border-neon-purple/30 text-xs">App Dev</Badge>
                    </div>
                    <div className="flex items-center text-content-secondary text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      3 members
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Admin Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Project Settings</DialogTitle>
            <DialogDescription>
              Manage settings for your project as an admin
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Public Project</div>
                <div className="text-sm text-muted-foreground">
                  Make the project visible to everyone
                </div>
              </div>
              <Switch 
                checked={project.settings.isPublic} 
                onCheckedChange={() => handleSettingChange('isPublic')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Allow Applications</div>
                <div className="text-sm text-muted-foreground">
                  Let users apply to join the project
                </div>
              </div>
              <Switch 
                checked={project.settings.allowApplications} 
                onCheckedChange={() => handleSettingChange('allowApplications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto-Approve Applications</div>
                <div className="text-sm text-muted-foreground">
                  Automatically approve user applications
                </div>
              </div>
              <Switch 
                checked={project.settings.automaticApplicationApproval} 
                onCheckedChange={() => handleSettingChange('automaticApplicationApproval')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Show GitHub Repository</div>
                <div className="text-sm text-muted-foreground">
                  Display GitHub repository link to members
                </div>
              </div>
              <Switch 
                checked={project.settings.showGithubLink} 
                onCheckedChange={() => handleSettingChange('showGithubLink')}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSettingsOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Admin Dialog */}
      <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedMember?.isAdmin ? 'Remove Admin Rights' : 'Grant Admin Rights'}
            </DialogTitle>
            <DialogDescription>
              {selectedMember?.isAdmin 
                ? `Remove admin privileges from ${selectedMember?.name}?` 
                : `Give ${selectedMember?.name} admin privileges for this project?`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              {selectedMember?.isAdmin 
                ? 'This will remove their ability to modify project settings and manage team members.'
                : 'Admins can modify project settings, manage team members, and approve applications.'}
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setAdminDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant={selectedMember?.isAdmin ? "destructive" : "default"}
              onClick={() => toggleAdminStatus(selectedMember?.id)}
              className={!selectedMember?.isAdmin ? "bg-neon-purple hover:bg-neon-purple/90" : ""}
            >
              {selectedMember?.isAdmin ? 'Remove Admin' : 'Grant Admin'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default ProjectDetail;
