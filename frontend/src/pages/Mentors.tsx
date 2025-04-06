
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MentorProps {
  name: string;
  title: string;
  company: string;
  expertise: string[];
  image: string;
  rating: number;
  description: string;
}

const mentors: MentorProps[] = [
  {
    name: 'Dr. Sarah Chen',
    title: 'AI Research Scientist',
    company: 'DeepMind',
    expertise: ['Machine Learning', 'Neural Networks', 'Computer Vision'],
    image: 'https://i.pravatar.cc/300?img=1',
    rating: 4.9,
    description: 'Specializing in deep learning architectures with over 10 years of industry experience. Available to mentor students working on AI/ML projects.',
  },
  {
    name: 'James Rodriguez',
    title: 'Senior Software Engineer',
    company: 'Google',
    expertise: ['Full-Stack Development', 'Cloud Architecture', 'Mobile Apps'],
    image: 'https://i.pravatar.cc/300?img=3',
    rating: 4.7,
    description: 'Passionate about helping students develop scalable applications with modern tech stacks. Experienced in mentoring junior developers.',
  },
  {
    name: 'Dr. Michelle Wong',
    title: 'Biotech Researcher',
    company: 'Genentech',
    expertise: ['Biomedical Engineering', 'Genomics', 'Medical Devices'],
    image: 'https://i.pravatar.cc/300?img=5',
    rating: 4.8,
    description: 'Helping students bridge the gap between biology and technology. Can guide projects related to healthcare innovations and biotech.',
  },
  {
    name: 'Alex Johnson',
    title: 'Product Design Lead',
    company: 'Airbnb',
    expertise: ['UX/UI Design', 'Design Systems', 'User Research'],
    image: 'https://i.pravatar.cc/300?img=7',
    rating: 4.6,
    description: 'Design mentor with a focus on user-centered design processes. Can help with everything from wireframing to usability testing.',
  },
  {
    name: 'Priya Patel',
    title: 'Startup Founder',
    company: 'TechFoundry',
    expertise: ['Entrepreneurship', 'Business Strategy', 'Fundraising'],
    image: 'https://i.pravatar.cc/300?img=9',
    rating: 4.9,
    description: 'Serial entrepreneur who has raised over $10M in funding. Mentors students interested in launching their own startups.',
  },
  {
    name: 'David Kim',
    title: 'Blockchain Developer',
    company: 'Ethereum Foundation',
    expertise: ['Blockchain', 'Smart Contracts', 'Cryptocurrency'],
    image: 'https://i.pravatar.cc/300?img=11',
    rating: 4.7,
    description: 'Specialized in blockchain technologies and Web3 development. Can guide students on implementing decentralized applications.',
  },
];

const MentorCard = ({ mentor }: { mentor: MentorProps }) => {
  return (
    <Card className="bg-surface-dark/80 backdrop-blur-xl border border-white/10 hover:border-neon-purple/50 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <img 
            src={mentor.image} 
            alt={mentor.name} 
            className="w-16 h-16 rounded-full border-2 border-neon-purple/50 object-cover"
          />
          <div>
            <CardTitle className="text-xl">{mentor.name}</CardTitle>
            <CardDescription className="text-content-secondary">
              {mentor.title} at {mentor.company}
            </CardDescription>
            <div className="flex items-center mt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(mentor.rating) ? 'text-neon-purple' : 'text-gray-500'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-1 text-sm text-content-secondary">{mentor.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-content-secondary text-sm mb-4">{mentor.description}</p>
        <div className="flex flex-wrap gap-2">
          {mentor.expertise.map((skill, index) => (
            <span 
              key={index} 
              className="text-xs py-1 px-2 rounded-full bg-neon-purple/20 text-neon-purple"
            >
              {skill}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t border-white/10 pt-4">
        <Button className="w-full bg-neon-purple hover:bg-neon-purple/80 text-white">
          <MessageCircle className="w-4 h-4 mr-2" />
          Request Mentorship
        </Button>
      </CardFooter>
    </Card>
  );
};

const Mentors = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <section className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Expert Mentorship</h1>
            <p className="text-content-secondary text-lg">
              Connect with industry professionals and academic experts who can guide your projects and help you develop new skills.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor, index) => (
              <MentorCard key={index} mentor={mentor} />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Become a Mentor</h2>
            <p className="text-content-secondary mb-6 max-w-2xl mx-auto">
              Are you an industry professional or academic expert interested in guiding the next generation of talent? Join our mentorship program.
            </p>
            <Link to="/mentors/become">
            <Button className="bg-neon-blue hover:bg-neon-blue/80 text-black font-medium px-8">
              Apply as Mentor
            </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Mentors;
