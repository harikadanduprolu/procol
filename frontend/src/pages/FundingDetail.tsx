import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Building,
  CheckCircle,
  PlayCircle,
  Circle,
  Loader2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Types
interface FundingData {
  id: string;
  title: string;
  organization: string;
  amount: string;
  description: string;
  longDescription: string;
  categories: string[];
  eligibility: string[];
  requirements: string[];
  timeline: {
    applicationDeadline: string;
    notificationDate: string;
    fundingStart: string;
    projectCompletion: string;
  };
  statistics: {
    applicants: number;
    funded: number;
    successRate: string;
    averageAmount: string;
  };
  pastProjects: Array<{ name: string; amount: string; year: string }>;
  reviewers: Array<{ name: string; role: string; avatar: string }>;
}

interface ApplicationStep {
  id: string;
  title: string;
  completed: boolean;
  current: boolean;
}

// Components
const StatCard = ({ icon: Icon, value, label, color }: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  color: string;
}) => (
  <Card className="text-center bg-white/5 border-white/10">
    <CardContent className="p-4">
      <Icon className={`h-5 w-5 mx-auto mb-2 ${color}`} />
      <div className="font-semibold text-content-primary text-lg">{value}</div>
      <div className="text-xs text-content-secondary">{label}</div>
    </CardContent>
  </Card>
);

const TimelineItem = ({ icon: Icon, title, date, color }: {
  icon: React.ElementType;
  title: string;
  date: string;
  color: string;
}) => (
  <div className="flex items-start gap-4">
    <div className={`h-10 w-10 rounded-full ${color} flex items-center justify-center flex-shrink-0 z-10`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h4 className="font-semibold text-content-primary">{title}</h4>
      <p className="text-content-secondary">{date}</p>
    </div>
  </div>
);

const ChecklistItem = ({ children, completed = false }: {
  children: React.ReactNode;
  completed?: boolean;
}) => (
  <li className="flex items-start gap-2 text-content-secondary">
    <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
      completed ? 'bg-neon-blue/20' : 'bg-neon-purple/20'
    }`}>
      <span className={`text-xs ${completed ? 'text-neon-blue' : 'text-neon-purple'}`}>
        {completed ? '✓' : '➔'}
      </span>
    </div>
    {children}
  </li>
);

const ApplicationStepItem = ({ step }: { step: ApplicationStep }) => {
  const getIcon = () => {
    if (step.completed) return <CheckCircle className="h-4 w-4 text-neon-blue" />;
    if (step.current) return <PlayCircle className="h-4 w-4 text-neon-green" />;
    return <Circle className="h-4 w-4 text-content-secondary" />;
  };

  const getBgColor = () => {
    if (step.completed) return 'bg-neon-blue/10';
    if (step.current) return 'bg-neon-green/10';
    return 'bg-white/5';
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${getBgColor()}`}>
      {getIcon()}
      <span className={`${step.current ? 'text-content-primary font-medium' : 'text-content-secondary'}`}>
        {step.title}
      </span>
    </div>
  );
};

const FundingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isApplying, setIsApplying] = useState(false);
  
  // Mock funding opportunity data
  const funding: FundingData = {
    id: id || '1',
    title: "Student Innovation Grant",
    organization: "Tech Future Foundation",
    amount: "$5,000 - $15,000",
    description: "Supporting university students in developing innovative technology solutions for real-world problems.",
    longDescription: "The Tech Future Foundation's Student Innovation Grant program empowers the next generation of technologists to create meaningful change. This grant provides financial support, mentorship, and resources to help university students turn their innovative ideas into reality. Projects should demonstrate technical innovation, feasibility, and potential for social impact.",
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

  // Extended application steps for better scrolling demonstration
  const applicationSteps: ApplicationStep[] = [
    { id: '1', title: 'Create account', completed: true, current: false },
    { id: '2', title: 'Email verification', completed: true, current: false },
    { id: '3', title: 'Basic information', completed: true, current: false },
    { id: '4', title: 'Academic background', completed: true, current: false },
    { id: '5', title: 'Project proposal', completed: false, current: true },
    { id: '6', title: 'Technical details', completed: false, current: false },
    { id: '7', title: 'Budget breakdown', completed: false, current: false },
    { id: '8', title: 'Team member information', completed: false, current: false },
    { id: '9', title: 'Faculty letter of support', completed: false, current: false },
    { id: '10', title: 'Project timeline', completed: false, current: false },
    { id: '11', title: 'Impact assessment', completed: false, current: false },
    { id: '12', title: 'Final review', completed: false, current: false },
  ];

  const progressValue = (applicationSteps.filter(step => step.completed).length / applicationSteps.length) * 100;

  const timelineItems = [
    { icon: Calendar, title: "Application Deadline", date: funding.timeline.applicationDeadline, color: "bg-neon-blue/20 text-neon-blue" },
    { icon: MessageSquare, title: "Notification of Results", date: funding.timeline.notificationDate, color: "bg-neon-purple/20 text-neon-purple" },
    { icon: DollarSign, title: "Funding Start Date", date: funding.timeline.fundingStart, color: "bg-neon-pink/20 text-neon-pink" },
    { icon: Target, title: "Project Completion", date: funding.timeline.projectCompletion, color: "bg-neon-green/20 text-neon-green" }
  ];

  const statsData = [
    { icon: Users, value: funding.statistics.applicants, label: "Applicants", color: "text-neon-purple" },
    { icon: Target, value: funding.statistics.funded, label: "Funded", color: "text-neon-pink" },
    { icon: DollarSign, value: funding.statistics.averageAmount, label: "Average Grant", color: "text-neon-blue" },
    { icon: Star, value: funding.statistics.successRate, label: "Success Rate", color: "text-neon-green" }
  ];

  const handleApply = async () => {
    setIsApplying(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Your application has been started. Complete all requirements to submit.");
    } catch (error) {
      console.error('Application error:', error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <Link 
            to="/funding" 
            className="inline-flex items-center text-content-secondary hover:text-neon-blue mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Funding Opportunities
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Header Card */}
              <Card className="glass-card neon-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h1 className="text-3xl md:text-4xl font-bold text-content-primary mb-3">
                        {funding.title}
                      </h1>
                      <div className="flex items-center text-content-secondary mb-4">
                        <Building className="h-4 w-4 mr-2" />
                        {funding.organization}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-6">
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
                    
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="border-white/20 text-content-secondary hover:text-neon-blue hover:border-neon-blue"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="border-white/20 text-content-secondary hover:text-neon-blue hover:border-neon-blue"
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Amount Highlight */}
                  <Card className="bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border-neon-blue/30 mb-6">
                    <CardContent className="text-center p-8">
                      <DollarSign className="h-12 w-12 text-neon-blue mx-auto mb-3" />
                      <h2 className="text-3xl font-bold text-content-primary mb-2">
                        {funding.amount}
                      </h2>
                      <p className="text-content-secondary">Funding Amount Range</p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Tabs Content */}
              <Card className="glass-card">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid grid-cols-4 w-full bg-surface-dark/50 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="past">Past Projects</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-8 p-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-content-primary">About This Grant</h3>
                      <p className="text-content-secondary mb-4 leading-relaxed">
                        {funding.description}
                      </p>
                      <p className="text-content-secondary leading-relaxed">
                        {funding.longDescription}
                      </p>
                    </div>
                    
                    {/* Statistics */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-content-primary">Grant Statistics</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {statsData.map((stat, index) => (
                          <StatCard key={index} {...stat} />
                        ))}
                      </div>
                    </div>
                    
                    {/* Reviewers */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-content-primary">Program Reviewers</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {funding.reviewers.map((reviewer, index) => (
                          <Card key={index} className="bg-white/5 border-white/10">
                            <CardContent className="flex items-center gap-4 p-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={reviewer.avatar} alt={reviewer.name} />
                                <AvatarFallback className="bg-neon-blue/20 text-neon-blue">
                                  {reviewer.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold text-content-primary">{reviewer.name}</h4>
                                <p className="text-sm text-content-secondary">{reviewer.role}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="eligibility" className="space-y-8 p-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-content-primary">Eligibility Criteria</h3>
                      <ul className="space-y-3">
                        {funding.eligibility.map((item, index) => (
                          <ChecklistItem key={index} completed>
                            {item}
                          </ChecklistItem>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-content-primary">Application Requirements</h3>
                      <ul className="space-y-3">
                        {funding.requirements.map((item, index) => (
                          <ChecklistItem key={index}>
                            {item}
                          </ChecklistItem>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="timeline" className="p-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-6 text-content-primary">Grant Timeline</h3>
                      <div className="space-y-8 relative">
                        <div className="absolute left-[19px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-neon-blue via-neon-purple to-neon-green opacity-30"></div>
                        
                        {timelineItems.map((item, index) => (
                          <TimelineItem key={index} {...item} />
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="past" className="p-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-6 text-content-primary">Previously Funded Projects</h3>
                      <div className="space-y-4">
                        {funding.pastProjects.map((project, index) => (
                          <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                            <CardContent className="flex justify-between items-center p-4">
                              <div>
                                <h4 className="font-semibold text-content-primary mb-1">{project.name}</h4>
                                <p className="text-sm text-content-secondary">{project.year}</p>
                              </div>
                              <Badge variant="outline" className="bg-neon-green/10 text-neon-green border-neon-green/30">
                                {project.amount}
                              </Badge>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Application Progress - Now with Scrollable Content */}
              <Card className="glass-card neon-border sticky top-24 max-h-[calc(100vh-6rem)]">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="text-content-primary">Application Progress</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full overflow-hidden">
                  
                  {/* Progress Bar - Fixed at top */}
                  <div className="flex-shrink-0 mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-content-secondary text-sm">Progress</span>
                      <span className="text-content-secondary text-sm font-medium">{Math.round(progressValue)}%</span>
                    </div>
                    <Progress value={progressValue} className="h-2" />
                  </div>
                  
                  {/* Scrollable Steps Container */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-neon-purple/20 scrollbar-track-transparent">
                    {applicationSteps.map((step) => (
                      <ApplicationStepItem key={step.id} step={step} />
                    ))}
                  </div>
                  
                  {/* Action Buttons - Fixed at bottom */}
                  <div className="flex-shrink-0 space-y-3 mt-6 pt-4 border-t border-white/10">
                    <Button 
                      className="w-full bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity"
                      onClick={handleApply}
                      disabled={isApplying}
                    >
                      {isApplying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
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
                </CardContent>
              </Card>
              
              {/* Similar Opportunities */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-content-primary">Similar Opportunities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-content-primary mb-2">Emerging Tech Fellowship</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-content-secondary text-sm">Next Funds</span>
                        <Badge variant="outline" className="bg-neon-pink/10 text-neon-pink border-neon-pink/30">
                          $10,000
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-content-primary mb-2">Climate Tech Grant</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-content-secondary text-sm">Green Future Foundation</span>
                        <Badge variant="outline" className="bg-neon-green/10 text-neon-green border-neon-green/30">
                          $7,500
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundingDetail;
