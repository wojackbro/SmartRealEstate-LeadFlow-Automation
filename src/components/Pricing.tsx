import React, { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';

interface PlanFeature {
  name: string;
  tooltip?: string;
  included: boolean | string;
}

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period: string;
  cta: string;
  popular?: boolean;
  features: PlanFeature[];
}

export const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  
  const plans: PricingPlan[] = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses just getting started',
      price: billingCycle === 'monthly' ? '$49' : '$39',
      period: billingCycle === 'monthly' ? '/month' : '/month, billed annually',
      cta: 'Start Free Trial',
      features: [
        { name: 'Up to 1,000 visitors tracked', included: true },
        { name: 'Basic lead form builder', included: true },
        { name: 'Email capture popups', included: true },
        { name: 'Standard lead qualification', included: true },
        { name: 'Basic analytics dashboard', included: true },
        { name: 'Standard email notifications', included: true },
        { name: 'AI-powered lead scoring', included: false },
        { name: 'Advanced integrations', included: false },
        { name: 'Custom branding', included: false },
        { name: 'Priority support', included: false },
      ]
    },
    {
      name: 'Growth',
      description: 'For growing teams with more advanced needs',
      price: billingCycle === 'monthly' ? '$99' : '$79',
      period: billingCycle === 'monthly' ? '/month' : '/month, billed annually',
      cta: 'Start Free Trial',
      popular: true,
      features: [
        { name: 'Up to 10,000 visitors tracked', included: true },
        { name: 'Advanced form builder', included: true },
        { name: 'Smart popups & slide-ins', included: true },
        { name: 'AI lead qualification', included: true },
        { name: 'Full analytics dashboard', included: true },
        { name: 'Real-time notifications', included: true },
        { name: 'AI-powered lead scoring', included: true },
        { name: 'Advanced integrations', included: true },
        { name: 'Custom branding', included: true },
        { name: 'Priority support', included: false },
      ]
    },
    {
      name: 'Enterprise',
      description: 'For organizations with complex requirements',
      price: 'Custom',
      period: 'Contact for pricing',
      cta: 'Contact Sales',
      features: [
        { name: 'Unlimited visitors tracked', included: true },
        { name: 'Premium form builder', included: true },
        { name: 'All popup & form types', included: true },
        { name: 'Advanced AI qualification', included: true },
        { name: 'Custom analytics & reports', included: true },
        { name: 'Custom notifications', included: true },
        { name: 'Advanced AI lead scoring', included: true },
        { name: 'Premium integrations & API', included: true },
        { name: 'White labeling & branding', included: true },
        { name: 'Dedicated support manager', included: true },
      ]
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
          
          <div className="flex justify-center mt-8">
            <div className="inline-flex p-1 rounded-full bg-gray-100 border border-gray-200">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
                  billingCycle === 'annual'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                <span className="ml-2 py-0.5 px-2 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
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
              
              <div className="bg-gray-50 p-8 border-t border-gray-200">
                <p className="font-medium text-gray-900 mb-4">Features include:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      {typeof feature.included === 'boolean' ? (
                        feature.included ? (
                          <Check className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" />
                        ) : (
                          <span className="h-5 w-5 rounded-full border-2 border-gray-300 mr-2 flex-shrink-0" />
                        )
                      ) : (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 mr-2">
                          {feature.included}
                        </span>
                      )}
                      <span className="text-gray-700 flex items-center">
                        {feature.name}
                        {feature.tooltip && (
                          <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
                        )}
                      </span>
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