import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectApi } from '@/services/api';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Users, Zap, MessageSquare, FileText, Github, Star, Share, ArrowLeft, Shield, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface Member {
  _id: string;
  name: string;
  avatar?: string;
  role?: string;
  isAdmin?: boolean;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  owner: Member;
  team: Member[];
  mentors: Member[];
  status: string;
  githubUrl?: string;
  demoUrl?: string;
  deadline?: string;
  duration?: string;
  difficulty?: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const isCurrentUserAdmin = true; // Replace with real check

  
  

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await projectApi.getById(id!);
        setProject(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      toast.success("Application submitted successfully!");
    }, 1500);
  };

  const handleSettingChange = (key: string) => {
    toast.success("Project setting updated (not persisted)");
  };

  const toggleAdminStatus = (memberId: string) => {
    toast.success("Admin status toggled (not persisted)");
    setAdminDialogOpen(false);
  };

  if (loading) return <div className="text-center py-24">Loading...</div>;
  if (!project) return <div className="text-center py-24">Project not found.</div>;

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
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-background/50 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-content-primary mb-3">{project.title}</h1>
                    <div className="flex flex-wrap gap-2">
                      {project?.tags?.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-neon-purple/10 text-neon-purple border-neon-purple/30">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isCurrentUserAdmin && (
                      <Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)}>
                        <Settings className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="icon"><Star className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon"><Share className="h-4 w-4" /></Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <InfoCard icon={<Users />} label="Team Size" value={`${project.team.length} members`} />
                  <InfoCard icon={<Calendar />} label="Duration" value={project.duration || "N/A"} />
                  <InfoCard icon={<Zap />} label="Difficulty" value={project.difficulty || "N/A"} />
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-8">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-semibold mb-4">Description</h3>
                        <p className="text-content-secondary leading-relaxed">{project.description}</p>
                      </div>

                      <div>
                        <h3 className="text-2xl font-semibold mb-4">Timeline</h3>
                        <div className="space-y-4">
                          <TimelineItem label="Start Date" value={new Date(project.createdAt).toDateString()} />
                          {project.deadline && (
                            <TimelineItem label="Deadline" value={new Date(project.deadline).toDateString()} />
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="team">
                    <h3 className="text-2xl font-semibold mb-4">Team Members</h3>
                    <div className="space-y-4">
                      {project?.team?.map((member) => (
                        <div key={member._id} className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-semibold text-content-primary flex items-center gap-2">
                              {member.name}
                              {member.isAdmin && <Badge className="text-xs">Admin</Badge>}
                            </div>
                            <p className="text-sm text-content-secondary">{member.role || 'Team Member'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="resources">
                    <h3 className="text-2xl font-semibold mb-4">Resources</h3>
                    <div className="space-y-4">
                      {project.githubUrl && (
                        <ResourceItem icon={<Github />} title="GitHub Repository" description={project.githubUrl} />
                      )}
                      {project.demoUrl && (
                        <ResourceItem icon={<FileText />} title="Live Demo" description={project.demoUrl} />
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-background/50 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Join This Project</h3>
                <Button className="w-full" onClick={handleApply} disabled={isApplying}>
                  {isApplying ? "Applying..." : "Apply to Join"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex flex-col items-center p-4 rounded-lg bg-white/5">
    <div className="mb-2 text-neon-blue">{icon}</div>
    <span className="text-sm text-content-secondary">{label}</span>
    <span className="font-semibold text-content-primary">{value}</span>
  </div>
);

const TimelineItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center p-4 rounded-lg bg-white/5">
    <div className="flex items-center gap-2 text-content-secondary">
      <Calendar className="h-5 w-5" />
      {label}
    </div>
    <div className="text-content-primary font-medium">{value}</div>
  </div>
);

const ResourceItem = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
    <div className="text-neon-blue">{icon}</div>
    <div>
      <div className="font-semibold text-content-primary">{title}</div>
      <div className="text-sm text-content-secondary truncate">{description}</div>
    </div>
  </div>
);

export default ProjectDetail;
