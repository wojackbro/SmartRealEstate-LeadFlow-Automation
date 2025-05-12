import React from 'react';
import { Zap, Clock, Headphones } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join the Waitlist & Lock In Premium Benefits
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Early adopters receive lifetime advantages
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center flex-shrink-0 mr-4">
                  <Zap className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Be the First</h3>
                  <p className="text-gray-600">Get exclusive early access before anyone else</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center flex-shrink-0 mr-4">
                  <Clock className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">FREE Beta Access</h3>
                  <p className="text-gray-600">Use LeadChase completely free during our initial launch</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center flex-shrink-0 mr-4">
                  <Headphones className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">LIFETIME 50% Discount</h3>
                  <p className="text-gray-600">Secure half-price access FOREVER as a founding user</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="john@company.com"
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-lg hover:from-teal-600 hover:to-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
              >
                Get Early Access & Save 50%
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};