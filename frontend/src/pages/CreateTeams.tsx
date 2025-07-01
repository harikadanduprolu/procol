import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import { teamApi } from '@/services/api';

const CreateTeam = () => {
  const navigate = useNavigate();

  const [teamData, setTeamData] = useState({
    name: '',
    description: '',
    interests: '',
    github: '',
    lookingFor: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTeamData({ ...teamData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamData.name || !teamData.description) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...teamData,
        interests: teamData.interests.split(',').map(i => i.trim()),
      };
      const res = await teamApi.create(payload);
      toast({ title: 'Team created successfully!' });
      navigate(`/teams/${res.data._id}`);
    } catch (err: any) {
      toast({ title: 'Error creating team', description: err?.response?.data?.message || 'Unexpected error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Create a Team</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block font-medium mb-1">Team Name *</label>
            <Input
              name="name"
              id="name"
              placeholder="e.g., AI Pioneers"
              value={teamData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium mb-1">Team Description *</label>
            <Textarea
              name="description"
              id="description"
              rows={4}
              placeholder="Describe your team's mission, goals, and what you're building..."
              value={teamData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="interests" className="block font-medium mb-1">Areas of Interest (comma separated)</label>
            <Input
              name="interests"
              id="interests"
              placeholder="e.g., Machine Learning, Sustainability, Robotics"
              value={teamData.interests}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="github" className="block font-medium mb-1">GitHub or Website</label>
            <Input
              name="github"
              id="github"
              placeholder="https://github.com/myteam"
              value={teamData.github}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="lookingFor" className="block font-medium mb-1">Looking For (roles/skills)</label>
            <Textarea
              name="lookingFor"
              id="lookingFor"
              rows={3}
              placeholder="e.g., Looking for a React developer and UI/UX designer"
              value={teamData.lookingFor}
              onChange={handleChange}
            />
          </div>

          <Button 
            type="submit"
            className="bg-neon-purple hover:bg-neon-purple/80 text-white w-full py-6 text-lg"
            disabled={loading}
          >
            <Plus className="mr-2 h-5 w-5" /> {loading ? 'Creating...' : 'Create Team'}
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default CreateTeam;
