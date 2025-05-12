import React from 'react';
import { Logo } from './Logo';
import { 
  Heart, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Youtube
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-gray-400 mb-8 max-w-md">
              LeadChase helps businesses transform their lead generation with AI-powered automation, qualification, and nurturing tools.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Product</h3>
            <ul className="space-y-4">
              <li><a href="#features" className="text-gray-400 hover:text-teal-400 transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-teal-400 transition-colors">Pricing</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-teal-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Integrations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Guides</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Webinars</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Careers</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-teal-400 transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Partners</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Legal</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} LeadChase. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-teal-400 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-teal-400 transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-teal-400 transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
          <div className="mt-6 text-center md:text-left text-gray-500 text-sm">
            Made with <Heart className="h-4 w-4 inline-block text-red-500" /> by the LeadChase team
          </div>
        </div>
      </div>
    </footer>
  );
};