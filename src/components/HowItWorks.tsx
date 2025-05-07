import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Install the Tracking Code',
      description: 'Add our lightweight JavaScript snippet to your website with just one click or through your tag manager.',
      benefits: [
        'No developer needed',
        'Less than 1KB impact on load time',
        'Works with all major platforms'
      ]
    },
    {
      number: '02',
      title: 'Design Your Lead Flow',
      description: 'Use our drag-and-drop editor to create personalized lead generation forms and qualification workflows.',
      benefits: [
        'Choose from 50+ templates',
        'Customize questions and logic',
        'Mobile-optimized designs'
      ]
    },
    {
      number: '03',
      title: 'Activate AI Qualification',
      description: 'Let our AI analyze visitor behavior and engagement to automatically score and qualify leads.',
      benefits: [
        '98% accuracy on lead scoring',
        'Real-time qualification',
        'Behavioral intent tracking'
      ]
    },
    {
      number: '04',
      title: 'Convert and Integrate',
      description: 'Send qualified leads to your CRM or marketing tools and start converting them into customers.',
      benefits: [
        'Integrates with 100+ tools',
        'Automated follow-up sequences',
        'Custom webhook support'
      ]
    }
  ];

  return (
    <section id="how-it-works" className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How LeadFlow Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple four-step process to transform your lead generation
          </p>
        </div>
        
        <div className="space-y-16 lg:space-y-24">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex flex-col ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } items-center gap-10 lg:gap-16`}
            >
              <div className="w-full lg:w-1/2">
                <div className="relative">
                  {/* Decorative elements */}
                  <div className={`absolute -z-10 rounded-full w-64 h-64 blur-3xl opacity-20 
                    ${index % 2 === 0 ? '-bottom-20 -right-20 bg-teal-500' : '-top-20 -left-20 bg-blue-500'}`}
                  ></div>
                  
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
                      <span className="text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-teal-600">
                        {step.number}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  {step.description}
                </p>
                <ul className="space-y-3">
                  {step.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start">
                      <CheckCircle2 className="h-6 w-6 text-teal-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};