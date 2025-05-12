import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  content: string;
  author: string;
  role: string;
  company: string;
  image: string;
  rating: number;
}

export const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      content: "LeadChase has transformed how we handle leads. The AI-powered automation saves us hours every day, and we're closing more deals than ever.",
      author: "Sarah Johnson",
      role: "Real Estate Agent",
      company: "Century 21",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      rating: 5
    },
    {
      content: "The automated follow-ups and lead scoring have been game-changers. We're now focusing on the most promising leads and closing more deals.",
      author: "Michael Chen",
      role: "Broker",
      company: "RE/MAX",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      rating: 5
    },
    {
      content: "The voice and SMS automation features have revolutionized how we engage with potential buyers. It's like having a 24/7 assistant.",
      author: "Emily Rodriguez",
      role: "Team Lead",
      company: "Keller Williams",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Real Estate Professionals
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            See how LeadChase is helping agents close more deals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${
                      i < testimonial.rating 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-400'
                    }`} 
                  />
                ))}
              </div>
              
              <blockquote className="text-lg text-white mb-8">
                "{testimonial.content}"
              </blockquote>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover mr-4" 
                />
                <div>
                  <p className="font-semibold text-white">
                    {testimonial.author}
                  </p>
                  <p className="text-blue-200 text-sm">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};