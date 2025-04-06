
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Calendar, 
  Users, 
  Award, 
  Star, 
  BookOpen, 
  Github, 
  ArrowLeft 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import ProjectCard from '@/components/ProjectCard';

const TeamMemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock member data (in a real app, you would fetch this from an API)
  const member = {
    id: id || '1',
    name: "Alex Rivera",
    role: "Full Stack Developer",
    university: "Stanford University",
    year: "3rd Year",
    skills: ["React", "Node.js", "MongoDB", "Python", "UX Research"],
    bio: "Computer Science major with a focus on web development and user experience. I'm passionate about creating accessible and intuitive applications that solve real-world problems. Currently exploring machine learning and AI integration into web applications.",
    projects: [
      {
        title: "AI-Powered Campus Navigator",
        description: "Create an AI system to help new students navigate campus facilities and resources.",
        tags: ["AI", "Mobile App", "UX Design"],
        teamSize: 4,
        duration: "3 months",
        difficulty: "Medium"
      },
      {
        title: "Smart Campus Recycling",
        description: "Create a system to track and improve recycling habits across university campuses.",
        tags: ["Hardware", "Environmental", "IoT"],
        teamSize: 4,
        duration: "5 months",
        difficulty: "Medium"
      }
    ],
    education: [
      { degree: "B.S. Computer Science", institution: "Stanford University", year: "2022-2026" },
      { degree: "High School Diploma", institution: "Lincoln High School", year: "2018-2022" }
    ],
    certificates: [
      { name: "AWS Certified Developer", issuer: "Amazon Web Services", year: "2023" },
      { name: "Machine Learning Specialization", issuer: "Coursera", year: "2022" }
    ],
    skillLevels: [
      { skill: "JavaScript", level: 90 },
      { skill: "React", level: 85 },
      { skill: "Node.js", level: 80 },
      { skill: "Python", level: 75 },
      { skill: "UX Design", level: 70 }
    ],
    socialLinks: [
      { platform: "Github", url: "https://github.com/alexrivera" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/alexrivera" }
    ]
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <Link to="/teams" className="inline-flex items-center text-content-secondary hover:text-neon-blue mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Team Members
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="glass-card neon-border rounded-xl p-6 mb-8">
                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                  <div className="flex-shrink-0">
                    <Avatar className="h-24 w-24 rounded-xl">
                      <AvatarImage src="" alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-br from-neon-purple to-neon-blue text-white text-2xl rounded-xl">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-4">
                      <div>
                        <h1 className="text-3xl font-bold text-content-primary">{member.name}</h1>
                        <p className="text-content-secondary">{member.university} • {member.year}</p>
                      </div>
                      
                      <Button className="bg-neon-purple hover:bg-neon-purple/80 text-white flex items-center gap-2 w-full md:w-auto">
                        <MessageSquare className="h-4 w-4" />
                        Connect
                      </Button>
                    </div>
                    
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-neon-blue/10 text-neon-blue border-neon-blue/30">
                        {member.role}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="bg-neon-purple/10 text-neon-purple border-neon-purple/30 text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="about">
                  <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="about" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Bio</h3>
                      <p className="text-content-secondary">{member.bio}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="projects" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Current Projects</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {member.projects.map((project, index) => (
                          <ProjectCard key={index} {...project} />
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="skills" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Skills Proficiency</h3>
                      <div className="space-y-4">
                        {member.skillLevels.map((skill, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-content-primary">{skill.skill}</span>
                              <span className="text-content-secondary text-sm">{skill.level}%</span>
                            </div>
                            <Progress value={skill.level} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="education" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Education</h3>
                      <div className="space-y-4">
                        {member.education.map((edu, index) => (
                          <div key={index} className="flex gap-4 p-4 bg-white/5 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="h-5 w-5 text-neon-blue" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-content-primary">{edu.degree}</h4>
                              <p className="text-content-secondary text-sm">{edu.institution}</p>
                              <p className="text-content-secondary text-xs">{edu.year}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Certificates</h3>
                      <div className="space-y-4">
                        {member.certificates.map((cert, index) => (
                          <div key={index} className="flex gap-4 p-4 bg-white/5 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center flex-shrink-0">
                              <Award className="h-5 w-5 text-neon-purple" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-content-primary">{cert.name}</h4>
                              <p className="text-content-secondary text-sm">{cert.issuer}</p>
                              <p className="text-content-secondary text-xs">{cert.year}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="glass-card neon-border rounded-xl p-6 mb-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                    <MessageSquare className="h-4 w-4 text-neon-blue" />
                    <span className="text-content-secondary">Direct Message</span>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                    <Github className="h-4 w-4 text-neon-purple" />
                    <a href={member.socialLinks[0].url} target="_blank" rel="noopener noreferrer" className="text-content-secondary hover:text-neon-blue">
                      Github Profile
                    </a>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 transition-opacity mb-4"
                >
                  Invite to Project
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-content-secondary hover:text-neon-blue hover:border-neon-blue"
                >
                  <Star className="mr-2 h-4 w-4" />
                  Add to Favorites
                </Button>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">Similar Team Members</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <Avatar>
                      <AvatarFallback className="bg-neon-blue/20 text-neon-blue">MC</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-content-primary">Mia Chen</div>
                      <div className="text-xs text-content-secondary">UX Designer</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <Avatar>
                      <AvatarFallback className="bg-neon-pink/20 text-neon-pink">JT</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-content-primary">Jordan Taylor</div>
                      <div className="text-xs text-content-secondary">Data Scientist</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default TeamMemberDetail;
