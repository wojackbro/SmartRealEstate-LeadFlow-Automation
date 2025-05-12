import React from 'react';
import { Clock, Phone, MessageSquare, Mail } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      time: '9:00 AM',
      title: 'Morning Follow-ups',
      description: 'Starting your day with endless manual follow-ups on leads that go nowhere',
      icon: <Clock className="h-6 w-6" />
    },
    {
      time: '11:30 AM',
      title: 'Missed Hot Lead',
      description: 'Another hot lead slips through the cracks due to delayed responses',
      icon: <Phone className="h-6 w-6" />
    },
    {
      time: '2:00 PM',
      title: 'Data Management Chaos',
      description: 'Wasting hours juggling between spreadsheets, CRM, and property lists',
      icon: <MessageSquare className="h-6 w-6" />
    },
    {
      time: '4:30 PM',
      title: 'Missed Connections',
      description: "Perfect listing for a buyer found too late - they've already made an offer elsewhere",
      icon: <Mail className="h-6 w-6" />
    },
    {
      time: '6:00 PM',
      title: 'End-of-Day Frustration',
      description: 'Reviewing generic autoresponder messages that failed to engage prospects',
      icon: <Clock className="h-6 w-6" />
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sound Familiar? You're Losing Hours (and Deals) To...
          </h2>
        </div>
        
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex items-start gap-6 p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center flex-shrink-0">
                <div className="text-teal-600">{step.icon}</div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-lg font-semibold text-gray-900">{step.time}</span>
                  <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};