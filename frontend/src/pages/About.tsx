import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { Mail, MessageSquare, Phone, MapPin } from 'lucide-react';

const About = () => {
  const founders = [
    {
      name: "Harika Danduprolu",
      role: "Founder",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    },
    {
      name: "Aashritha",
      role: "Co-founder",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    },
    {
      name: "Keerthika",
      role: "Co-founder",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        {/* Hero Section */}
        <section className="relative mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 rounded-2xl" />
          <div className="relative glass-card p-8 md:p-12 rounded-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              About ProCollab
            </h1>
            <p className="text-lg text-content-secondary max-w-3xl mb-8">
              ProCollab is a revolutionary platform that empowers students to collaborate on innovative projects, 
              connect with mentors, and access funding opportunities. Our mission is to break down barriers in 
              student innovation and create a thriving ecosystem for the next generation of entrepreneurs.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1721322800607-8c38375eef04"
              alt="Team collaboration"
              className="w-full h-64 md:h-80 object-cover rounded-xl"
            />
          </div>
        </section>

        {/* Founders Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 gradient-text">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {founders.map((founder, index) => (
              <Card key={index} className="glass-card overflow-hidden border-none">
                <div className="relative h-64">
                  <img 
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{founder.name}</h3>
                  <p className="text-content-secondary">{founder.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold mb-8 gradient-text">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-card border-none p-6">
              <h3 className="text-xl font-semibold mb-4">Innovation</h3>
              <p className="text-content-secondary">
                We believe in pushing boundaries and exploring new possibilities in student collaboration.
              </p>
            </Card>
            <Card className="glass-card border-none p-6">
              <h3 className="text-xl font-semibold mb-4">Collaboration</h3>
              <p className="text-content-secondary">
                We foster meaningful connections between students, mentors, and opportunities.
              </p>
            </Card>
            <Card className="glass-card border-none p-6">
              <h3 className="text-xl font-semibold mb-4">Impact</h3>
              <p className="text-content-secondary">
                We're committed to creating positive change through student-led innovation.
              </p>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold mb-8 gradient-text">Contact Us</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
                <p className="text-content-secondary mb-8">
                  Have questions about ProCollab? We're here to help. Send us a message and we'll respond as soon as possible.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-content-secondary">
                    <Mail className="h-5 w-5 text-neon-purple" />
                    <span>contact@procollab.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-content-secondary">
                    <Phone className="h-5 w-5 text-neon-blue" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-content-secondary">
                    <MapPin className="h-5 w-5 text-neon-pink" />
                    <span>123 Innovation Street, Tech Valley, CA 94043</span>
                  </div>
                  <div className="flex items-center gap-3 text-content-secondary">
                    <MessageSquare className="h-5 w-5 text-neon-purple" />
                    <span>Live chat available 9 AM - 5 PM PST</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
