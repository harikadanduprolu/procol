
import React, { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import TeamMemberCard from '@/components/TeamMemberCard';
import FeatureCard from '@/components/FeatureCard';
import { Button } from '@/components/ui/button';
import { Users, Search, Lightbulb, MessageSquare, DollarSign, BookOpen, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const projectsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      {
        threshold: 0.1
      }
    );
    
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => {
      el.classList.add('opacity-0', 'translate-y-10');
      el.classList.add('transition-all', 'duration-500', 'ease-out');
      observer.observe(el);
    });
    
    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);
  
  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const featuredProjects = [
    {
      title: "AI-Powered Campus Navigator",
      description: "Create an AI system to help new students navigate campus facilities and resources.",
      tags: ["AI", "Mobile App", "UX Design"],
      teamSize: 4,
      duration: "3 months",
      difficulty: "Medium"
    },
    {
      title: "Sustainable Energy Monitor",
      description: "Build a real-time dashboard to monitor and optimize energy usage across campus.",
      tags: ["IoT", "Data Viz", "Sustainability"],
      teamSize: 5,
      duration: "6 months",
      difficulty: "Hard"
    },
    {
      title: "Mental Health Companion",
      description: "Design an app to support student mental health with resources and anonymous support.",
      tags: ["Health", "App Dev", "Psychology"],
      teamSize: 3,
      duration: "4 months",
      difficulty: "Medium"
    }
  ];
  
  const featuredMembers = [
    {
      name: "Alex Rivera",
      role: "Full Stack Developer",
      skills: ["React", "Node.js", "MongoDB"],
      university: "Stanford University"
    },
    {
      name: "Mia Chen",
      role: "UX Designer",
      skills: ["Figma", "User Research", "Prototyping"],
      university: "Carnegie Mellon"
    },
    {
      name: "Jordan Taylor",
      role: "Data Scientist",
      skills: ["Python", "ML", "Data Analysis"],
      university: "MIT"
    }
  ];
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-neon-blue/20 rounded-full blur-[100px] animate-pulse"></div>
        
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text text-glow">
            Connect. Collaborate.<br />Create Together.
          </h1>
          <p className="text-content-secondary text-lg md:text-xl max-w-2xl mx-auto mb-8">
            ProCollab connects students across disciplines to form teams, find mentors, and secure funding for innovative projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-neon-purple hover:bg-neon-purple/80 text-white text-lg py-6 px-8"
              onClick={scrollToProjects}
            >
              Explore Projects
            </Button>
            <Button 
              variant="outline" 
              className="border-neon-blue text-neon-blue hover:bg-neon-blue/10 text-lg py-6 px-8"
            >
              Find Teammates
            </Button>
          </div>
          
          <div className="mt-12 relative">
            <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 shadow-2xl animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-neon-blue/10 to-neon-pink/10"></div>
              <img 
                src="https://www.simplilearn.com/ice9/free_resources_article_thumb/project_management_coursefees.jpg" 
                alt="ProCollab Platform" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                <span className="inline-block bg-neon-purple/80 rounded-full px-3 py-1 text-sm font-semibold text-white mb-2">
                  Trending
                </span>
                <h3 className="text-xl font-bold text-white">Launch your next big idea with the perfect team</h3>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 md:bottom-8 md:right-8 max-w-xs glass-card rounded-lg p-4 animate-float" style={{animationDelay: '1s'}}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink flex items-center justify-center">
                  <Rocket size={16} className="text-white" />
                </div>
                <span className="font-semibold text-content-primary">Project Matching</span>
              </div>
              <p className="text-content-secondary text-sm">
                AI-powered matching connects you with the perfect teammates for your project
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text inline-block">
              One platform, endless possibilities
            </h2>
            <p className="text-content-secondary text-lg max-w-2xl mx-auto">
              ProCollab brings together all the tools you need to turn your ideas into reality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="animate-on-scroll">
              <FeatureCard 
                title="Find Projects"
                description="Browse and join innovative projects across all disciplines."
                icon={Search}
                gradient="bg-gradient-to-r from-neon-purple to-neon-blue"
              />
            </div>
            <div className="animate-on-scroll" style={{transitionDelay: '100ms'}}>
              <FeatureCard 
                title="Build Teams"
                description="Connect with talented students to form the perfect team."
                icon={Users}
                gradient="bg-gradient-to-r from-neon-blue to-neon-pink"
              />
            </div>
            <div className="animate-on-scroll" style={{transitionDelay: '200ms'}}>
              <FeatureCard 
                title="Get Mentorship"
                description="Access guidance from industry experts and professors."
                icon={Lightbulb}
                gradient="bg-gradient-to-r from-neon-pink to-neon-purple"
              />
            </div>
            <div className="animate-on-scroll" style={{transitionDelay: '300ms'}}>
              <FeatureCard 
                title="Secure Funding"
                description="Apply for grants and sponsorships for your projects."
                icon={DollarSign}
                gradient="bg-gradient-to-r from-neon-purple to-neon-pink"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section className="section-padding" ref={projectsRef}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 animate-on-scroll">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 gradient-text inline-block">
                Featured Projects
              </h2>
              <p className="text-content-secondary text-lg max-w-2xl">
                Discover exciting projects waiting for your skills and contribution.
              </p>
            </div>
            <Link to="/projects">
              <Button 
                variant="outline"
                className="mt-4 md:mt-0 border-neon-blue text-neon-blue hover:bg-neon-blue/10"
              >
                View All Projects
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <div key={index} className="animate-on-scroll" style={{transitionDelay: `${index * 100}ms`}}>
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="section-padding bg-surface-dark/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 animate-on-scroll">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 gradient-text inline-block">
                Find Teammates
              </h2>
              <p className="text-content-secondary text-lg max-w-2xl">
                Connect with talented students from different disciplines.
              </p>
            </div>
            <Link to="/teams">
              <Button 
                variant="outline"
                className="mt-4 md:mt-0 border-neon-pink text-neon-pink hover:bg-neon-pink/10"
              >
                Browse All Members
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMembers.map((member, index) => (
              <div key={index} className="animate-on-scroll" style={{transitionDelay: `${index * 100}ms`}}>
                <TeamMemberCard {...member} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-72 h-72 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-neon-blue/20 rounded-full blur-[100px] animate-pulse"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto glass-card neon-border rounded-2xl p-8 md:p-12 text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
              Ready to bring your ideas to life?
            </h2>
            <p className="text-content-secondary text-lg mb-8 max-w-2xl mx-auto">
              Join ProCollab today and connect with students, mentors, and opportunities to turn your innovative ideas into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white text-lg py-6 px-8"
              >
                Create Account
              </Button>
              <Button 
                variant="outline" 
                className="border-white/20 text-content-primary hover:bg-white/5 text-lg py-6 px-8"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-on-scroll">
            <div className="glass-card rounded-xl p-6 text-center">
              <span className="text-4xl font-bold gradient-text block mb-2">500+</span>
              <p className="text-content-secondary">Active Projects</p>
            </div>
            <div className="glass-card rounded-xl p-6 text-center">
              <span className="text-4xl font-bold gradient-text block mb-2">2,000+</span>
              <p className="text-content-secondary">Students</p>
            </div>
            <div className="glass-card rounded-xl p-6 text-center">
              <span className="text-4xl font-bold gradient-text block mb-2">150+</span>
              <p className="text-content-secondary">Mentors</p>
            </div>
            <div className="glass-card rounded-xl p-6 text-center">
              <span className="text-4xl font-bold gradient-text block mb-2">50+</span>
              <p className="text-content-secondary">Universities</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
