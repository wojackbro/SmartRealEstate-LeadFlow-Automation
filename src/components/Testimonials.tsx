import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  content: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  image: string;
}

export const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      content: "LeadFlow completely transformed our lead generation process. We're seeing 3x more qualified leads and our sales team can finally focus on closing instead of prospecting.",
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechSolutions Inc.",
      rating: 5,
      image: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 2,
      content: "The AI qualification tool is incredible. It accurately identifies our best leads and the integration with our CRM was seamless. Worth every penny!",
      author: "Michael Chen",
      role: "Sales Manager",
      company: "GrowthForce Agency",
      rating: 5,
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 3,
      content: "We implemented LeadFlow six months ago and have already seen a 42% increase in conversion rates. The analytics dashboard makes it easy to track and optimize performance.",
      author: "Alicia Rodriguez",
      role: "CEO",
      company: "Sprout Digital",
      rating: 4,
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            See what our customers say about LeadFlow
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-teal-400 opacity-10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-400 opacity-10 rounded-full filter blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/20 shadow-xl">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="md:w-1/3 flex-shrink-0">
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <img 
                      src={testimonials[activeIndex].image} 
                      alt={testimonials[activeIndex].author}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="flex mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-6 w-6 ${
                          i < testimonials[activeIndex].rating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-400'
                        }`} 
                      />
                    ))}
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl font-medium text-white mb-8 leading-relaxed">
                    "{testimonials[activeIndex].content}"
                  </blockquote>
                  
                  <div>
                    <p className="text-xl font-semibold text-white">
                      {testimonials[activeIndex].author}
                    </p>
                    <p className="text-blue-200">
                      {testimonials[activeIndex].role}, {testimonials[activeIndex].company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-10 space-x-4">
              <button 
                onClick={prevTestimonial}
                className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="flex space-x-2 items-center">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === activeIndex ? 'bg-teal-400' : 'bg-white/30'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button 
                onClick={nextTestimonial}
                className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};