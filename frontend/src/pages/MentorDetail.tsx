
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
  Briefcase,
  Star,
  Users,
  BookOpen,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const MentorDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock mentor data
  const mentor = {
    id: id || '1',
    name: "Dr. Sarah Johnson",
    title: "AI Research Scientist",
    company: "Google AI",
    expertise: ["Artificial Intelligence", "Machine Learning", "Computer Vision", "Natural Language Processing"],
    bio: "Dr. Sarah Johnson is a Senior Research Scientist at Google AI with over 15 years of experience in artificial intelligence and machine learning. She has published over 30 papers in top-tier conferences and journals, and has contributed to several open-source projects. Dr. Johnson is passionate about mentoring the next generation of AI researchers and engineers.",
    experience: [
      { position: "Senior Research Scientist", company: "Google AI", period: "2018 - Present" },
      { position: "AI Researcher", company: "Microsoft Research", period: "2012 - 2018" },
      { position: "Assistant Professor", company: "Stanford University", period: "2008 - 2012" }
    ],
    education: [
      { degree: "Ph.D. in Computer Science", institution: "MIT", year: "2008" },
      { degree: "M.S. in Computer Science", institution: "Stanford University", year: "2004" },
      { degree: "B.S. in Computer Science", institution: "UC Berkeley", year: "2002" }
    ],
    mentoringTopics: [
      "Machine Learning Algorithms",
      "AI Ethics",
      "Research Paper Writing",
      "Career in AI Research",
      "Computer Vision Projects"
    ],
    availability: {
      slots: [
        { day: "Monday", time: "4:00 PM - 6:00 PM" },
        { day: "Thursday", time: "10:00 AM - 12:00 PM" }
      ],
      timezone: "PST (UTC-8)"
    },
    mentees: 12,
    rating: 4.9,
    reviews: [
      { name: "Alex Rivera", comment: "Dr. Johnson provided invaluable guidance for my ML project. Her expertise and patience made complex concepts accessible.", rating: 5 },
      { name: "Mia Chen", comment: "Incredibly knowledgeable and supportive. Dr. Johnson helped me navigate my AI research and provided excellent feedback.", rating: 5 }
    ]
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <Link to="/mentors" className="inline-flex items-center text-content-secondary hover:text-neon-blue mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Mentors
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="glass-card neon-border rounded-xl p-6 mb-8">
                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                  <div className="flex-shrink-0">
                    <Avatar className="h-24 w-24 rounded-xl">
                      <AvatarImage src="" alt={mentor.name} />
                      <AvatarFallback className="bg-gradient-to-br from-neon-pink to-neon-purple text-white text-2xl rounded-xl">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-4">
                      <div>
                        <h1 className="text-3xl font-bold text-content-primary">{mentor.name}</h1>
                        <p className="text-content-secondary">{mentor.title} at {mentor.company}</p>
                      </div>
                      
                      <Button className="bg-neon-pink hover:bg-neon-pink/80 text-white flex items-center gap-2 w-full md:w-auto">
                        <MessageSquare className="h-4 w-4" />
                        Contact
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.round(mentor.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-content-primary font-semibold">{mentor.rating}</span>
                      <span className="text-content-secondary text-sm">({mentor.reviews.length} reviews)</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="bg-neon-pink/10 text-neon-pink border-neon-pink/30 text-xs"
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
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="about" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Bio</h3>
                      <p className="text-content-secondary">{mentor.bio}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Education</h3>
                      <div className="space-y-4">
                        {mentor.education.map((edu, index) => (
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
                  </TabsContent>
                  
                  <TabsContent value="experience" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Work Experience</h3>
                      <div className="space-y-4">
                        {mentor.experience.map((exp, index) => (
                          <div key={index} className="flex gap-4 p-4 bg-white/5 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-neon-pink/20 flex items-center justify-center flex-shrink-0">
                              <Briefcase className="h-5 w-5 text-neon-pink" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-content-primary">{exp.position}</h4>
                              <p className="text-content-secondary text-sm">{exp.company}</p>
                              <p className="text-content-secondary text-xs">{exp.period}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="mentorship" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Mentoring Topics</h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {mentor.mentoringTopics.map((topic, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="bg-neon-blue/10 text-neon-blue border-neon-blue/30"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Availability</h3>
                      <div className="space-y-3 mb-2">
                        {mentor.availability.slots.map((slot, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                            <Calendar className="h-4 w-4 text-neon-purple" />
                            <span className="text-content-primary">{slot.day}: {slot.time}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-content-secondary">Timezone: {mentor.availability.timezone}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-4 flex flex-col items-center">
                          <Users className="h-6 w-6 text-neon-blue mb-2" />
                          <span className="text-xl font-bold text-content-primary">{mentor.mentees}</span>
                          <span className="text-xs text-content-secondary">Active Mentees</span>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-4 flex flex-col items-center">
                          <Clock className="h-6 w-6 text-neon-pink mb-2" />
                          <span className="text-xl font-bold text-content-primary">150+</span>
                          <span className="text-xs text-content-secondary">Hours Mentored</span>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Student Reviews</h3>
                      <div className="space-y-4">
                        {mentor.reviews.map((review, index) => (
                          <div key={index} className="p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                              <Avatar>
                                <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                                  {review.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold text-content-primary">{review.name}</div>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-content-secondary text-sm">{review.comment}</p>
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
                <h3 className="text-xl font-semibold mb-4">Schedule a Session</h3>
                <p className="text-content-secondary mb-6">
                  Book a mentoring session with Dr. Johnson to get personalized guidance on your project or career.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-neon-blue mr-2" />
                      <span className="text-content-primary">Monday</span>
                    </div>
                    <span className="text-content-secondary text-sm">4:00 PM - 6:00 PM</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-neon-blue mr-2" />
                      <span className="text-content-primary">Thursday</span>
                    </div>
                    <span className="text-content-secondary text-sm">10:00 AM - 12:00 PM</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-neon-pink to-neon-purple hover:opacity-90 transition-opacity mb-4"
                >
                  Book Mentoring Session
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-content-secondary hover:text-neon-pink hover:border-neon-pink"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">Similar Mentors</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <Avatar>
                      <AvatarFallback className="bg-neon-blue/20 text-neon-blue">DT</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-content-primary">Dr. Thomas Lee</div>
                      <div className="text-xs text-content-secondary">ML Engineer, Amazon</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <Avatar>
                      <AvatarFallback className="bg-neon-pink/20 text-neon-pink">RJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-content-primary">Prof. Rachel Jones</div>
                      <div className="text-xs text-content-secondary">Computer Vision Scientist</div>
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

export default MentorDetail;
