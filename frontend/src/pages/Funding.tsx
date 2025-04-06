
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Calendar, ArrowRight, Clock, Award } from 'lucide-react';

interface FundingOpportunityProps {
  title: string;
  organization: string;
  amount: string;
  deadline: string;
  category: string;
  description: string;
  requirements: string[];
  applicationLink: string;
}

const fundingOpportunities: FundingOpportunityProps[] = [
  {
    title: "Innovation Startup Grant",
    organization: "Tech Founders Association",
    amount: "$5,000 - $15,000",
    deadline: "June 30, 2023",
    category: "Entrepreneurship",
    description: "For student-led startups in the early stages of development. Provides seed funding to help bring innovative ideas to market.",
    requirements: [
      "Business plan or pitch deck",
      "Prototype or proof of concept",
      "Team of at least 2 students",
      "Faculty advisor"
    ],
    applicationLink: "#"
  },
  {
    title: "Sustainable Solutions Fund",
    organization: "GreenFuture Foundation",
    amount: "$10,000",
    deadline: "July 15, 2023",
    category: "Sustainability",
    description: "Supporting projects that address environmental challenges and promote sustainable development on campus or in local communities.",
    requirements: [
      "Project proposal with environmental impact assessment",
      "Budget plan",
      "Implementation timeline",
      "Letter of support from a faculty member"
    ],
    applicationLink: "#"
  },
  {
    title: "Digital Health Innovation Prize",
    organization: "MedTech Alliance",
    amount: "$7,500 - $20,000",
    deadline: "August 5, 2023",
    category: "Healthcare",
    description: "For innovative technology solutions addressing healthcare challenges. Open to interdisciplinary teams with projects in digital health.",
    requirements: [
      "Working prototype",
      "Research validation",
      "Team must include students from technical and health disciplines",
      "Project presentation video"
    ],
    applicationLink: "#"
  },
  {
    title: "Arts & Media Production Grant",
    organization: "Creative Works Foundation",
    amount: "$3,000 - $8,000",
    deadline: "September 1, 2023",
    category: "Creative Arts",
    description: "Supporting student film, animation, game design, and other media production projects that demonstrate creativity and technical skill.",
    requirements: [
      "Portfolio of previous work",
      "Detailed project proposal",
      "Production timeline",
      "Budget breakdown"
    ],
    applicationLink: "#"
  },
  {
    title: "Social Impact Challenge",
    organization: "Community Change Collective",
    amount: "$12,000",
    deadline: "September 20, 2023",
    category: "Social Innovation",
    description: "For projects addressing social challenges and promoting positive change in communities. Focus on education, access, equality, and justice.",
    requirements: [
      "Problem statement and solution approach",
      "Community engagement plan",
      "Impact measurement framework",
      "Sustainability plan"
    ],
    applicationLink: "#"
  },
  {
    title: "Research Commercialization Fund",
    organization: "University Innovation Office",
    amount: "Up to $25,000",
    deadline: "October 15, 2023",
    category: "Research",
    description: "Helping student researchers transform academic discoveries into commercial applications. Funds prototype development and market testing.",
    requirements: [
      "Research validation documentation",
      "IP status disclosure",
      "Market analysis",
      "Commercialization plan",
      "Faculty endorsement"
    ],
    applicationLink: "#"
  }
];

const FundingOpportunityCard = ({ opportunity }: { opportunity: FundingOpportunityProps }) => {
  return (
    <Card className="bg-surface-dark/80 backdrop-blur-xl border border-white/10 hover:border-neon-blue/50 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{opportunity.title}</CardTitle>
            <CardDescription className="text-content-secondary mt-1">
              {opportunity.organization}
            </CardDescription>
          </div>
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-neon-blue/20 text-neon-blue">
            {opportunity.category}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-content-secondary text-sm">{opportunity.description}</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center">
            <DollarSign className="text-neon-blue w-5 h-5 mr-2" />
            <div>
              <p className="text-xs text-content-secondary">Amount</p>
              <p className="text-sm font-semibold">{opportunity.amount}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="text-neon-purple w-5 h-5 mr-2" />
            <div>
              <p className="text-xs text-content-secondary">Deadline</p>
              <p className="text-sm font-semibold">{opportunity.deadline}</p>
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Requirements:</p>
          <ul className="text-sm text-content-secondary space-y-1">
            {opportunity.requirements.map((req, index) => (
              <li key={index} className="flex items-start">
                <span className="text-neon-blue mr-2">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="border-t border-white/10 pt-4">
        <Button className="w-full bg-neon-blue hover:bg-neon-blue/80 text-black font-medium">
          Apply Now
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const Funding = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <section className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Funding Opportunities</h1>
            <p className="text-content-secondary text-lg">
              Discover grants, competitions, and sponsorships to help bring your innovative projects to life.
            </p>
          </div>
          
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fundingOpportunities.map((opportunity, index) => (
                <FundingOpportunityCard key={index} opportunity={opportunity} />
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-neon-purple/10 via-neon-blue/10 to-neon-pink/10 rounded-2xl p-8 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-neon-purple/20 flex items-center justify-center mx-auto mb-4">
                  <Award className="text-neon-purple w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Success Rate</h3>
                <p className="text-content-secondary">
                  40% of ProCollab projects successfully secure funding
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="text-neon-blue w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Average Funding</h3>
                <p className="text-content-secondary">
                  $8,500 average funding amount per student project
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-neon-pink/20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-neon-pink w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Application Support</h3>
                <p className="text-content-secondary">
                  Get application reviews from mentors before submission
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Funding;
