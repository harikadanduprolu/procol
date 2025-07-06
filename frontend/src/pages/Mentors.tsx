import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mentorApi } from '@/services/api';

interface MentorProps {
  name: string;
  title: string;
  company: string;
  expertise: string[];
  image: string;
  rating: number;
  description: string;
}

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
  const [mentors, setMentors] = useState<MentorProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await mentorApi.getAll();
        setMentors(res.data.map((m: any) => ({
          name: m.user?.name || 'Unknown',
          title: m.user?.title || '',
          company: m.user?.company || '',
          expertise: m.expertise,
          image: m.user?.avatar || 'https://i.pravatar.cc/300',
          rating: m.rating,
          description: m.user?.bio || '',
        })));
      } catch {
        setMentors([]);
      }
      setLoading(false);
    };
    fetchMentors();
  }, []);

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
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-content-secondary">Loading mentors...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.length > 0 ? (
                mentors.map((mentor, index) => (
                  <MentorCard key={index} mentor={mentor} />
                ))
              ) : (
                <div className="text-center col-span-1 md:col-span-2 lg:col-span-3 py-12">
                  <p className="text-content-secondary">No mentors found. Please check back later.</p>
                </div>
              )}
            </div>
          )}
          
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
