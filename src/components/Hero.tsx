import React from 'react';
import { ArrowRight, BarChart, Zap, Users } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="pt-24 pb-16 md:pt-28 md:pb-24 lg:pt-32 lg:pb-32 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-400 opacity-10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-400 opacity-10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              <span>AI-Powered Lead Generation</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Convert visitors into <span className="text-teal-400">qualified leads</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-lg">
              Automate your lead generation, qualification, and nurturing with our AI-powered platform. Boost conversions by up to 320%.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#demo" 
                className="px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white text-base font-medium transition-all hover:shadow-lg hover:from-teal-600 hover:to-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4 ml-2 inline-block" />
              </a>
              <a 
                href="#how-it-works" 
                className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 text-base font-medium transition-all hover:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none"
              >
                See How It Works
              </a>
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10">
              <div className="flex items-center">
                <BarChart className="h-5 w-5 text-teal-400 mr-2" />
                <span className="text-blue-100">320% More Conversions</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-teal-400 mr-2" />
                <span className="text-blue-100">10,000+ Companies</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-teal-600/20 rounded-xl transform rotate-3 scale-105"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Lead Qualification</h3>
                  <span className="px-2 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-medium">Live</span>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      What's your biggest marketing challenge?
                    </label>
                    <select className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                      <option>Lead generation</option>
                      <option>Converting leads to customers</option>
                      <option>Retaining customers</option>
                      <option>Something else</option>
                    </select>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      How many leads do you generate monthly?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="px-4 py-2 rounded-lg border border-white/20 text-white text-sm hover:bg-teal-500/20 focus:bg-teal-500/20 focus:outline-none">
                        &lt; 100
                      </button>
                      <button className="px-4 py-2 rounded-lg border border-teal-500 bg-teal-500/20 text-white text-sm focus:outline-none">
                        100 - 500
                      </button>
                      <button className="px-4 py-2 rounded-lg border border-white/20 text-white text-sm hover:bg-teal-500/20 focus:bg-teal-500/20 focus:outline-none">
                        500 - 1000
                      </button>
                      <button className="px-4 py-2 rounded-lg border border-white/20 text-white text-sm hover:bg-teal-500/20 focus:bg-teal-500/20 focus:outline-none">
                        1000+
                      </button>
                    </div>
                  </div>
                  
                  <button className="w-full px-5 py-3 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white text-base font-medium transition-all hover:shadow-lg hover:from-teal-600 hover:to-teal-700">
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};