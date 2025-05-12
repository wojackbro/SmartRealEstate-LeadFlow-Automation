import React from 'react';
import { Check } from 'lucide-react';

interface Plan {
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export const Pricing: React.FC = () => {
  const plans: Plan[] = [
    {
      name: 'Starter',
      description: 'Perfect for individual agents',
      price: '$49',
      period: '/month',
      features: [
        'Up to 100 leads per month',
        'Basic AI lead scoring',
        'Email support',
        '1 team member',
        'Basic analytics',
        'Standard integrations'
      ],
      cta: 'Start Free Trial'
    },
    {
      name: 'Professional',
      description: 'Ideal for growing teams',
      price: '$99',
      period: '/month',
      features: [
        'Up to 500 leads per month',
        'Advanced AI lead scoring',
        'Priority support',
        '5 team members',
        'Advanced analytics',
        'Custom integrations',
        'Workflow automation',
        'A/B testing'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large brokerages',
      price: 'Custom',
      period: '',
      features: [
        'Unlimited leads',
        'Custom AI models',
        '24/7 dedicated support',
        'Unlimited team members',
        'Custom analytics',
        'API access',
        'Advanced security',
        'Custom solutions'
      ],
      cta: 'Contact Sales'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that's right for your business
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-2xl overflow-hidden transition-all ${
                plan.popular 
                  ? 'border-2 border-teal-500 shadow-xl scale-105 md:scale-105 z-10 bg-white' 
                  : 'border border-gray-200 shadow-md bg-white hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-teal-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-teal-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-gray-600 mt-2">
            Need a custom plan? <a href="#contact" className="text-teal-600 hover:text-teal-700 font-medium">Contact us</a>
          </p>
        </div>
      </div>
    </section>
  );
};