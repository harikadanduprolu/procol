
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Target, 
  FileText, 
  Star, 
  Share, 
  ArrowLeft,
  MessageSquare, 
  Building
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const FundingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isApplying, setIsApplying] = useState(false);
  
  // Mock funding opportunity data
  const funding = {
    id: id || '1',
    title: "Student Innovation Grant",
    organization: "Tech Future Foundation",
    amount: "$5,000 - $15,000",
    description: "The Student Innovation Grant supports university students in developing innovative technology solutions that address real-world problems in fields such as education, healthcare, or sustainability.",
    longDescription: "The Tech Future Foundation's Student Innovation Grant program aims to empower the next generation of technologists to create meaningful change. This grant provides financial support, mentorship, and resources to help university students turn their innovative ideas into reality. Projects should demonstrate technical innovation, feasibility, and potential for social impact. Successful applicants will receive funding along with access to the Foundation's network of industry advisors and technical resources.",
    categories: ["Technology", "Innovation", "Social Impact"],
    eligibility: [
      "Currently enrolled undergraduate or graduate students",
      "Projects must involve technological innovation",
      "Individual or team applications accepted (team limit: 5 members)",
      "All disciplines welcome, but project must have technical component"
    ],
    requirements: [
      "Project proposal (max 5 pages)",
      "Budget breakdown",
      "Team member resumes",
      "Letter of support from faculty advisor",
      "Timeline with milestones"
    ],
    timeline: {
      applicationDeadline: "November 30, 2023",
      notificationDate: "December 15, 2023",
      fundingStart: "January 15, 2024",
      projectCompletion: "August 15, 2024"
    },
    statistics: {
      applicants: 243,
      funded: 25,
      successRate: "10.3%",
      averageAmount: "$8,500"
    },
    pastProjects: [
      { name: "Smart Campus Navigator", amount: "$12,000", year: "2022" },
      { name: "AR Medical Training Tool", amount: "$15,000", year: "2022" },
      { name: "Sustainable Energy Monitor", amount: "$9,500", year: "2021" }
    ],
    reviewers: [
      { name: "Dr. Sarah Johnson", role: "Senior Program Director", avatar: "" },
      { name: "Prof. Michael Chen", role: "Technical Advisor", avatar: "" }
    ]
  };
  
  const progressValue = 70; // Example progress in application process
  
  const handleApply = () => {
    setIsApplying(true);
    
    // Simulate application process
    setTimeout(() => {
      setIsApplying(false);
      
      // Show success notification (you would implement this)
      alert("Your application has been started. Complete all requirements to submit.");
    }, 1500);
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <Link to="/funding" className="inline-flex items-center text-content-secondary hover:text-neon-blue mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Funding Opportunities
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="glass-card neon-border rounded-xl p-6 mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-content-primary mb-2">{funding.title}</h1>
                    <div className="flex items-center text-content-secondary mb-4">
                      <Building className="h-4 w-4 mr-2" />
                      {funding.organization}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {funding.categories.map((category, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="bg-neon-blue/10 text-neon-blue border-neon-blue/30"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="border-white/20 text-content-secondary hover:text-neon-blue hover:border-neon-blue">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="border-white/20 text-content-secondary hover:text-neon-blue hover:border-neon-blue">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-center p-6 bg-white/5 rounded-xl mb-6">
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 text-neon-blue mx-auto mb-2" />
                    <h2 className="text-2xl font-bold text-content-primary mb-1">
                      {funding.amount}
                    </h2>
                    <p className="text-content-secondary">Funding Amount</p>
                  </div>
                </div>
                
                <Tabs defaultValue="overview">
                  <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="past">Past Projects</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Description</h3>
                      <p className="text-content-secondary mb-4">{funding.longDescription}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Grant Statistics</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg bg-white/5 text-center">
                          <Users className="h-5 w-5 text-neon-purple mx-auto mb-2" />
                          <div className="font-semibold text-content-primary text-lg">{funding.statistics.applicants}</div>
                          <div className="text-xs text-content-secondary">Applicants</div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 text-center">
                          <Target className="h-5 w-5 text-neon-pink mx-auto mb-2" />
                          <div className="font-semibold text-content-primary text-lg">{funding.statistics.funded}</div>
                          <div className="text-xs text-content-secondary">Funded</div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 text-center">
                          <DollarSign className="h-5 w-5 text-neon-blue mx-auto mb-2" />
                          <div className="font-semibold text-content-primary text-lg">{funding.statistics.averageAmount}</div>
                          <div className="text-xs text-content-secondary">Average Grant</div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 text-center">
                          <Star className="h-5 w-5 text-neon-green mx-auto mb-2" />
                          <div className="font-semibold text-content-primary text-lg">{funding.statistics.successRate}</div>
                          <div className="text-xs text-content-secondary">Success Rate</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Program Reviewers</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {funding.reviewers.map((reviewer, index) => (
                          <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
                            <Avatar>
                              <AvatarImage src={reviewer.avatar} alt={reviewer.name} />
                              <AvatarFallback className="bg-neon-blue/20 text-neon-blue">
                                {reviewer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-content-primary">{reviewer.name}</div>
                              <div className="text-sm text-content-secondary">{reviewer.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="eligibility" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Eligibility Criteria</h3>
                      <ul className="space-y-2">
                        {funding.eligibility.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-content-secondary">
                            <div className="h-5 w-5 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-neon-blue text-xs">✓</span>
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Application Requirements</h3>
                      <ul className="space-y-2">
                        {funding.requirements.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-content-secondary">
                            <div className="h-5 w-5 rounded-full bg-neon-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-neon-purple text-xs">➔</span>
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="timeline" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Grant Timeline</h3>
                      <div className="space-y-6 relative">
                        <div className="absolute left-[19px] top-10 bottom-10 w-0.5 bg-white/10"></div>
                        
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0 z-10">
                            <Calendar className="h-5 w-5 text-neon-blue" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-content-primary">Application Deadline</h4>
                            <p className="text-content-secondary">{funding.timeline.applicationDeadline}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-neon-purple/20 flex items-center justify-center flex-shrink-0 z-10">
                            <MessageSquare className="h-5 w-5 text-neon-purple" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-content-primary">Notification of Results</h4>
                            <p className="text-content-secondary">{funding.timeline.notificationDate}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-neon-pink/20 flex items-center justify-center flex-shrink-0 z-10">
                            <DollarSign className="h-5 w-5 text-neon-pink" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-content-primary">Funding Start Date</h4>
                            <p className="text-content-secondary">{funding.timeline.fundingStart}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0 z-10">
                            <Target className="h-5 w-5 text-neon-green" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-content-primary">Project Completion</h4>
                            <p className="text-content-secondary">{funding.timeline.projectCompletion}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="past" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Previously Funded Projects</h3>
                      <div className="space-y-4">
                        {funding.pastProjects.map((project, index) => (
                          <div key={index} className="flex justify-between items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                            <div>
                              <h4 className="font-semibold text-content-primary">{project.name}</h4>
                              <p className="text-sm text-content-secondary">{project.year}</p>
                            </div>
                            <Badge variant="outline" className="bg-neon-green/10 text-neon-green border-neon-green/30">
                              {project.amount}
                            </Badge>
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
                <h3 className="text-xl font-semibold mb-4">Application Status</h3>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-content-secondary text-sm">Progress</span>
                    <span className="text-content-secondary text-sm font-medium">{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                    <div className="h-5 w-5 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-neon-blue text-xs">✓</span>
                    </div>
                    <span className="text-content-secondary">Create account</span>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                    <div className="h-5 w-5 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-neon-blue text-xs">✓</span>
                    </div>
                    <span className="text-content-secondary">Basic information</span>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                    <div className="h-5 w-5 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-neon-green text-xs">▷</span>
                    </div>
                    <span className="text-content-primary font-medium">Project proposal</span>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                    <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-content-secondary text-xs">○</span>
                    </div>
                    <span className="text-content-secondary">Budget breakdown</span>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                    <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-content-secondary text-xs">○</span>
                    </div>
                    <span className="text-content-secondary">Faculty letter</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-neon-blue to-neon-green hover:opacity-90 transition-opacity mb-4"
                  onClick={handleApply}
                  disabled={isApplying}
                >
                  {isApplying ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Processing...
                    </span>
                  ) : (
                    'Continue Application'
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-content-secondary hover:text-neon-blue hover:border-neon-blue"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Download Guidelines
                </Button>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">Similar Opportunities</h3>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <h4 className="font-semibold text-content-primary">Emerging Tech Fellowship</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-content-secondary text-xs">Next Funds</span>
                      <Badge variant="outline" className="bg-neon-pink/10 text-neon-pink border-neon-pink/30 text-xs">
                        $10,000
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <h4 className="font-semibold text-content-primary">Climate Tech Grant</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-content-secondary text-xs">Next Funds</span>
                      <Badge variant="outline" className="bg-neon-pink/10 text-neon-pink border-neon-pink/30 text-xs">
                        $7,500
                      </Badge>
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

export default FundingDetail;
