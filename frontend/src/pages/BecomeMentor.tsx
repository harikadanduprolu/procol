
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, ArrowLeft, Clock, Briefcase, LinkIcon, CalendarDays, Check } from 'lucide-react';
import { toast } from 'sonner';

const BecomeMentor = () => {
  const navigate = useNavigate();
  
  const [mentorData, setMentorData] = useState({
    fullName: 'John Doe', // Pre-filled from user profile in a real app
    title: '',
    institution: '',
    bio: '',
    expertise: [] as string[],
    experience: '',
    linkedin: '',
    website: '',
    availability: [],
    commitmentLevel: '',
    motivation: '',
    agreeToTerms: false
  });
  
  const [newExpertise, setNewExpertise] = useState('');
  
  const expertiseFields = [
    'Artificial Intelligence', 'Machine Learning', 'Web Development', 
    'Mobile Development', 'Data Science', 'UI/UX Design', 'Blockchain',
    'Cloud Computing', 'Cybersecurity', 'IoT', 'Robotics', 'Game Development',
    'Education Technology', 'Healthcare Technology', 'Fintech', 'Clean Energy'
  ];
  
  const experienceLevels = ['1-3 years', '3-5 years', '5-10 years', '10+ years'];
  
  const availabilityOptions = [
    '1-2 hours/week', '3-5 hours/week', '5+ hours/week',
    'Weekdays only', 'Weekends only', 'Flexible schedule'
  ];
  
  const commitmentOptions = [
    'One-time consultation',
    'Short-term (1-3 months)',
    'Medium-term (3-6 months)',
    'Long-term (6+ months)'
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMentorData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setMentorData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAvailabilityToggle = (option: string) => {
    setMentorData(prev => {
      if (prev.availability.includes(option)) {
        return {
          ...prev,
          availability: prev.availability.filter(item => item !== option)
        };
      } else {
        return {
          ...prev,
          availability: [...prev.availability, option]
        };
      }
    });
  };
  
  const handleAddExpertise = () => {
    if (newExpertise.trim() && !mentorData.expertise.includes(newExpertise.trim())) {
      setMentorData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };
  
  const handleRemoveExpertise = (expertise: string) => {
    setMentorData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(e => e !== expertise)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!mentorData.title || !mentorData.bio || mentorData.expertise.length === 0 || 
        !mentorData.experience || mentorData.availability.length === 0 || 
        !mentorData.commitmentLevel || !mentorData.motivation || !mentorData.agreeToTerms) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // In a real app, you'd send this data to your API
    console.log('Submitting mentor application:', mentorData);
    
    // Show success message
    toast.success("Your mentor application has been submitted!");
    
    // Redirect to mentors page
    navigate('/mentors');
  };
  
  const mentorBenefits = [
    {
      title: "Expand Your Network",
      description: "Connect with students and professionals from diverse backgrounds and disciplines."
    },
    {
      title: "Share Your Knowledge",
      description: "Help shape the next generation of talent in your field by sharing your expertise."
    },
    {
      title: "Stay Current",
      description: "Engage with cutting-edge projects to keep your own skills and knowledge up-to-date."
    },
    {
      title: "Build Your Profile",
      description: "Enhance your professional reputation and leadership skills while giving back."
    }
  ];
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            className="mb-6 text-content-secondary hover:text-neon-blue"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="glass-card rounded-xl p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-content-primary mb-6">
                  Become a Mentor
                </h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Mentor Profile */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-content-primary">Profile Information</h2>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16 border-2 border-neon-purple/30">
                        <AvatarFallback className="bg-neon-purple/20 text-neon-purple text-xl">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-content-primary font-medium">{mentorData.fullName}</p>
                        <p className="text-content-secondary text-sm">
                          This information will be displayed on your mentor profile
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="title" className="block text-content-primary font-medium mb-2">
                        Professional Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="title"
                        name="title"
                        value={mentorData.title}
                        onChange={handleInputChange}
                        placeholder="e.g. Senior Software Engineer, Professor of Computer Science"
                        className="bg-surface-dark/50 border-white/10"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="institution" className="block text-content-primary font-medium mb-2">
                        Company or Institution <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="institution"
                        name="institution"
                        value={mentorData.institution}
                        onChange={handleInputChange}
                        placeholder="e.g. Google, Stanford University"
                        className="bg-surface-dark/50 border-white/10"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-content-primary font-medium mb-2">
                        Professional Bio <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={mentorData.bio}
                        onChange={handleInputChange}
                        placeholder="Share your professional background, achievements, and why you're passionate about mentoring"
                        className="bg-surface-dark/50 border-white/10 resize-none min-h-32"
                        required
                      />
                      <p className="text-xs text-content-secondary mt-1">
                        Min 100 characters, max 1000 characters
                      </p>
                    </div>
                  </div>
                  
                  {/* Expertise & Experience */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-content-primary">Expertise & Experience</h2>
                    
                    <div>
                      <label className="block text-content-primary font-medium mb-2">
                        Areas of Expertise <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2 mb-2">
                        <Select
                          value={newExpertise}
                          onValueChange={setNewExpertise}
                        >
                          <SelectTrigger className="bg-surface-dark/50 border-white/10">
                            <SelectValue placeholder="Select or type your expertise" />
                          </SelectTrigger>
                          <SelectContent>
                            {expertiseFields.map((field) => (
                              <SelectItem key={field} value={field}>{field}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          onClick={handleAddExpertise}
                          variant="outline"
                          className="border-neon-purple text-neon-purple hover:bg-neon-purple/10"
                        >
                          <Plus size={18} />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {mentorData.expertise.map((expertise, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="bg-neon-purple/10 text-neon-purple border-neon-purple/30 pr-1"
                          >
                            {expertise}
                            <button
                              type="button"
                              className="ml-1 hover:text-white"
                              onClick={() => handleRemoveExpertise(expertise)}
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-content-primary font-medium mb-2">
                        Years of Experience <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={mentorData.experience}
                        onValueChange={(value) => handleSelectChange('experience', value)}
                        required
                      >
                        <SelectTrigger className="bg-surface-dark/50 border-white/10">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="linkedin" className="block text-content-primary font-medium mb-2">
                          LinkedIn Profile
                        </label>
                        <div className="relative">
                          <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-secondary" />
                          <Input
                            id="linkedin"
                            name="linkedin"
                            value={mentorData.linkedin}
                            onChange={handleInputChange}
                            placeholder="linkedin.com/in/username"
                            className="bg-surface-dark/50 border-white/10 pl-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="website" className="block text-content-primary font-medium mb-2">
                          Personal Website
                        </label>
                        <div className="relative">
                          <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-secondary" />
                          <Input
                            id="website"
                            name="website"
                            value={mentorData.website}
                            onChange={handleInputChange}
                            placeholder="yourwebsite.com"
                            className="bg-surface-dark/50 border-white/10 pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mentoring Preferences */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-content-primary">Mentoring Preferences</h2>
                    
                    <div>
                      <label className="block text-content-primary font-medium mb-2">
                        Availability <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {availabilityOptions.map((option) => (
                          <div key={option} className="flex items-center gap-2">
                            <Checkbox 
                              id={`availability-${option}`}
                              checked={mentorData.availability.includes(option)}
                              onCheckedChange={() => handleAvailabilityToggle(option)}
                              className="data-[state=checked]:bg-neon-purple"
                            />
                            <label 
                              htmlFor={`availability-${option}`} 
                              className="text-content-secondary cursor-pointer"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-content-primary font-medium mb-2">
                        Preferred Commitment Level <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={mentorData.commitmentLevel}
                        onValueChange={(value) => handleSelectChange('commitmentLevel', value)}
                        required
                      >
                        <SelectTrigger className="bg-surface-dark/50 border-white/10">
                          <SelectValue placeholder="Select commitment level" />
                        </SelectTrigger>
                        <SelectContent>
                          {commitmentOptions.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label htmlFor="motivation" className="block text-content-primary font-medium mb-2">
                        Why do you want to be a mentor? <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        id="motivation"
                        name="motivation"
                        value={mentorData.motivation}
                        onChange={handleInputChange}
                        placeholder="Share your motivation for becoming a mentor and what you hope to contribute"
                        className="bg-surface-dark/50 border-white/10 resize-none min-h-24"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Terms and Conditions */}
                  <div className="pt-4">
                    <div className="flex items-start gap-2 mb-6">
                      <Checkbox 
                        id="terms"
                        checked={mentorData.agreeToTerms}
                        onCheckedChange={(checked) => 
                          setMentorData(prev => ({ ...prev, agreeToTerms: checked === true }))
                        }
                        className="data-[state=checked]:bg-neon-purple mt-1"
                      />
                      <label htmlFor="terms" className="text-content-secondary text-sm">
                        I agree to the <a href="#" className="text-neon-blue hover:underline">Mentor Guidelines</a> and 
                        commit to providing quality mentorship to students and teams. I understand that 
                        my application will be reviewed before approval.
                      </label>
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-white/20 text-content-secondary hover:border-white/40"
                        onClick={() => navigate('/mentors')}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-neon-purple hover:bg-neon-purple/80 text-white"
                      >
                        Submit Application
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="order-1 lg:order-2">
              <div className="glass-card rounded-xl p-6 md:p-8 sticky top-28">
                <h2 className="text-xl font-semibold text-content-primary mb-6">Benefits of Mentoring</h2>
                
                <div className="space-y-4">
                  {mentorBenefits.map((benefit, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center flex-shrink-0">
                        <Check className="text-neon-purple" size={16} />
                      </div>
                      <div>
                        <h3 className="font-medium text-content-primary">{benefit.title}</h3>
                        <p className="text-content-secondary text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-white/10 mt-6 pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-neon-blue" />
                    <div>
                      <h3 className="font-medium text-content-primary">Flexible Time Commitment</h3>
                      <p className="text-content-secondary text-sm">Mentor according to your own schedule</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Briefcase size={18} className="text-neon-purple" />
                    <div>
                      <h3 className="font-medium text-content-primary">Choose Your Projects</h3>
                      <p className="text-content-secondary text-sm">Select projects aligned with your expertise</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CalendarDays size={18} className="text-neon-blue" />
                    <div>
                      <h3 className="font-medium text-content-primary">Application Timeline</h3>
                      <p className="text-content-secondary text-sm">Applications are reviewed within 1-2 weeks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BecomeMentor;
