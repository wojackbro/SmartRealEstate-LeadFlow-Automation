import React from 'react';
import { CircleDashed, ArrowUpRight } from 'lucide-react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <CircleDashed className="h-8 w-8 text-teal-400" strokeWidth={2} />
        <ArrowUpRight 
          className="h-4 w-4 text-teal-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
          strokeWidth={2.5}
        />
      </div>
      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
        LeadChase
      </span>
    </div>
  );
};