import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-0 -left-40 w-80 h-80 bg-teal-400 opacity-20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-blue-400 opacity-20 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transform Your Lead Management with AI-Powered Automation
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
            LeadChase helps real estate agents nurture leads automatically across Email, SMS & Voice. Focus on what matters most — closing deals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center">
              Get Early Access & Save 50%
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-blue-800/50 text-white rounded-lg font-semibold hover:bg-blue-800/70 transition-colors border border-blue-700">
              Join Waitlist
            </button>
          </div>
          
          <p className="mt-6 text-blue-200 text-sm">
            Be the first to know. No spam, ever.
          </p>
        </div>
      </div>
    </section>
  );
};