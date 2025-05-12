import React from 'react';
import { 
  Brain, 
  BarChartBig, 
  Users, 
  MessageSquareQuote, 
  Zap, 
  Bot, 
  LineChart,
  Shield
} from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center mb-4">
        <div className="text-teal-600">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'AI-Powered Lead Scoring',
      description: 'Automatically score and prioritize leads based on engagement and conversion likelihood.'
    },
    {
      icon: <BarChartBig className="h-6 w-6" />,
      title: 'Conversion Analytics',
      description: 'Get detailed insights into your conversion funnel with powerful visualization tools.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Audience Segmentation',
      description: 'Segment your leads based on behavior, demographics, and engagement patterns.'
    },
    {
      icon: <MessageSquareQuote className="h-6 w-6" />,
      title: 'Smart Chat Automation',
      description: 'Engage visitors with intelligent chat that qualifies leads while you sleep.'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Fast Implementation',
      description: 'Set up in minutes with our code-free integration and start generating leads instantly.'
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: 'Custom AI Agents',
      description: 'Create personalized AI agents that match your brand voice and sales approach.'
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: 'Performance Tracking',
      description: 'Monitor and optimize your lead generation performance in real-time.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'GDPR Compliance',
      description: 'Built-in compliance tools to ensure your lead generation meets privacy standards.'
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Lead Generation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to capture, qualify, and convert more leads
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};