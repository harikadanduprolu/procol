
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ImagePlus, X, Plus, ArrowLeft, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

const CreateProject = () => {
  const navigate = useNavigate();
  
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: '',
    difficulty: '',
    duration: '',
    teamSize: '',
    tags: [] as string[],
    image: null as File | null,
    imagePreview: '',
  });
  
  const [newTag, setNewTag] = useState('');
  
  const categories = [
    'Technology', 'Science', 'Education', 'Healthcare', 
    'Environment', 'Arts', 'Social Impact', 'Business', 'Other'
  ];
  
  const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Expert'];
  const durationOptions = ['1-2 weeks', '1 month', '3 months', '6 months', '1 year+'];
  const teamSizeOptions = ['1-2', '3-5', '6-10', '10+'];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setProjectData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !projectData.tags.includes(newTag.trim())) {
      setProjectData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setProjectData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProjectData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };
  
  const handleRemoveImage = () => {
    setProjectData(prev => ({
      ...prev,
      image: null,
      imagePreview: ''
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!projectData.title || !projectData.description || !projectData.category || 
        !projectData.difficulty || !projectData.duration || !projectData.teamSize) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // In a real app, you'd send this data to your API
    console.log('Submitting project:', projectData);
    
    // Show success message
    toast.success("Project created successfully!");
    
    // Redirect to projects page
    navigate('/projects');
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Button
            variant="ghost"
            className="mb-6 text-content-secondary hover:text-neon-blue"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
          
          <div className="glass-card rounded-xl p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-content-primary mb-6">Create New Project</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Image */}
              <div>
                <label className="block text-content-primary font-medium mb-2">
                  Project Image
                </label>
                
                {projectData.imagePreview ? (
                  <div className="relative w-full h-48 mb-2 rounded-lg overflow-hidden">
                    <img
                      src={projectData.imagePreview}
                      alt="Project preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-surface-dark/30 hover:bg-surface-dark/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud size={24} className="text-content-secondary mb-2" />
                      <p className="text-sm text-content-secondary">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-content-secondary">
                        SVG, PNG, JPG or GIF (max. 2MB)
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
              
              {/* Basic Project Info */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-content-primary font-medium mb-2">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={projectData.title}
                    onChange={handleInputChange}
                    placeholder="Give your project a clear, descriptive title"
                    className="bg-surface-dark/50 border-white/10"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-content-primary font-medium mb-2">
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={projectData.description}
                    onChange={handleInputChange}
                    placeholder="A brief summary of your project (max 200 characters)"
                    className="bg-surface-dark/50 border-white/10 resize-none"
                    maxLength={200}
                    required
                  />
                  <p className="text-xs text-content-secondary mt-1">
                    {projectData.description.length}/200 characters
                  </p>
                </div>
                
                <div>
                  <label htmlFor="longDescription" className="block text-content-primary font-medium mb-2">
                    Full Description
                  </label>
                  <Textarea
                    id="longDescription"
                    name="longDescription"
                    value={projectData.longDescription}
                    onChange={handleInputChange}
                    placeholder="Provide detailed information about your project goals, challenges, and expected outcomes"
                    className="bg-surface-dark/50 border-white/10 resize-none min-h-32"
                  />
                </div>
              </div>
              
              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-content-primary font-medium mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={projectData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                    required
                  >
                    <SelectTrigger className="bg-surface-dark/50 border-white/10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-content-primary font-medium mb-2">
                    Difficulty <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={projectData.difficulty}
                    onValueChange={(value) => handleSelectChange('difficulty', value)}
                    required
                  >
                    <SelectTrigger className="bg-surface-dark/50 border-white/10">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-content-primary font-medium mb-2">
                    Expected Duration <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={projectData.duration}
                    onValueChange={(value) => handleSelectChange('duration', value)}
                    required
                  >
                    <SelectTrigger className="bg-surface-dark/50 border-white/10">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-content-primary font-medium mb-2">
                    Team Size <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={projectData.teamSize}
                    onValueChange={(value) => handleSelectChange('teamSize', value)}
                    required
                  >
                    <SelectTrigger className="bg-surface-dark/50 border-white/10">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamSizeOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-content-primary font-medium mb-2">
                  Skills & Technologies
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add skills or technologies needed"
                    className="bg-surface-dark/50 border-white/10"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                    className="border-neon-purple text-neon-purple hover:bg-neon-purple/10"
                  >
                    <Plus size={18} />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {projectData.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-neon-purple/10 text-neon-purple border-neon-purple/30 pr-1"
                    >
                      {tag}
                      <button
                        type="button"
                        className="ml-1 hover:text-white"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/20 text-content-secondary hover:border-white/40"
                  onClick={() => navigate('/projects')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-neon-purple hover:bg-neon-purple/80 text-white"
                >
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateProject;
