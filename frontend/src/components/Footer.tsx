import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface-dark/30 backdrop-blur-lg border-t border-white/5 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold gradient-text">ProCollab</h3>
            <p className="text-content-secondary max-w-xs">
              Connect, collaborate, and create amazing projects with students from various disciplines.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-content-secondary hover:text-neon-purple transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-content-secondary hover:text-neon-blue transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-content-secondary hover:text-neon-pink transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-content-secondary hover:text-neon-purple transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-content-primary text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/projects" className="text-content-secondary hover:text-neon-blue transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/teams" className="text-content-secondary hover:text-neon-blue transition-colors">
                  Teams
                </Link>
              </li>
              <li>
                <Link to="/mentors" className="text-content-secondary hover:text-neon-blue transition-colors">
                  Mentors
                </Link>
              </li>
              <li>
                <Link to="/funding" className="text-content-secondary hover:text-neon-blue transition-colors">
                  Funding
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-content-primary text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-content-secondary hover:text-neon-blue transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-content-secondary hover:text-neon-blue transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-content-secondary hover:text-neon-blue transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-content-secondary hover:text-neon-blue transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-content-primary text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-content-secondary hover:text-neon-blue transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-content-secondary hover:text-neon-blue transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-content-secondary hover:text-neon-blue transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-content-secondary hover:text-neon-blue transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-content-secondary text-sm">
            &copy; {new Date().getFullYear()} ProCollab. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Link to="/privacy" className="text-content-secondary hover:text-neon-blue text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-content-secondary hover:text-neon-blue text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
