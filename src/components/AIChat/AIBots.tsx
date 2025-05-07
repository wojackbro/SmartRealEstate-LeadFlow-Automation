import React, { useState } from 'react';
import { Chatbot } from './Chatbot';
import { Voicebot } from './Voicebot';
import { MessageSquare, Mic } from 'lucide-react';

interface AIBotsProps {
  onLeadCaptured?: (leadData: {
    name: string;
    email: string;
    phone: string;
    source: 'website' | 'chatbot' | 'voicebot' | 'referral' | 'other';
    preferences?: {
      propertyType?: string[];
      priceRange?: [number, number];
      locations?: string[];
      beds?: number;
      baths?: number;
    };
    interactionDetails?: string;
  }) => Promise<void>;
}

export const AIBots: React.FC<AIBotsProps> = ({ onLeadCaptured }) => {
  const [openMode, setOpenMode] = useState<null | 'chat' | 'voice'>(null);

  // Only one window open at a time
  const handleClose = () => setOpenMode(null);

  return (
    <>
      {/* Floating Chat Button */}
      {openMode !== 'chat' && openMode !== 'voice' && (
        <>
          <button
            onClick={() => setOpenMode('chat')}
            className="fixed bottom-4 right-24 w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
            aria-label="Open text chat"
          >
            <MessageSquare className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={() => setOpenMode('voice')}
            className="fixed bottom-4 right-4 w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
            aria-label="Open voice chat"
          >
            <Mic className="w-8 h-8 text-white" />
          </button>
        </>
      )}
      {/* Chatbot Dialog */}
      {openMode === 'chat' && (
        <div className="fixed bottom-4 right-24 z-50">
          <Chatbot onLeadCaptured={onLeadCaptured} onClose={handleClose} />
        </div>
      )}
      {/* Voicebot Dialog */}
      {openMode === 'voice' && (
        <div className="fixed bottom-4 right-4 z-50">
          <Voicebot onLeadCaptured={onLeadCaptured} onClose={handleClose} />
        </div>
      )}
    </>
  );
}; 