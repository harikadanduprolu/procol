
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  gradient
}) => {
  return (
    <div className="glass-card rounded-xl p-6 hover-scale animate-fade-in">
      <div 
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${gradient}`}
      >
        <Icon size={24} className="text-white" />
      </div>
      
      <h3 className="text-xl font-bold text-content-primary mb-2">{title}</h3>
      <p className="text-content-secondary">{description}</p>
    </div>
  );
};

export default FeatureCard;
