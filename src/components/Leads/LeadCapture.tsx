import React, { useState, useEffect } from 'react';
import { Chatbot } from '../AIChat/Chatbot';
import { Voicebot } from '../AIChat/Voicebot';
import { LeadService } from '../../services/leadService';
import { MessageSquare, Mic, X } from 'lucide-react';
import { Lead } from '../../types';

interface LeadCaptureProps {
  onLeadCaptured: (leadId: string) => void;
}

interface LeadData {
  name: string;
  email: string;
  phone?: string;
  source?: 'website' | 'chatbot' | 'voicebot' | 'referral' | 'other';
  preferences?: {
    propertyType?: string[];
    priceRange?: [number, number];
    locations?: string[];
    beds?: number;
    baths?: number;
  };
  interactionDetails?: string;
}

export const LeadCapture: React.FC<LeadCaptureProps> = ({ onLeadCaptured }) => {
  const [capturedLead, setCapturedLead] = useState<string | null>(null);
  const leadService = LeadService.getInstance();

  const handleLeadCaptured = async (leadData: LeadData) => {
    try {
      const lead = await leadService.createLead({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone || '',
        source: leadData.source || 'chatbot',
        preferences: leadData.preferences || {},
        interactions: [{
          type: 'chat',
          timestamp: new Date(),
          notes: leadData.interactionDetails || 'Initial contact via chat'
        }],
        updatedAt: new Date()
      });
      setCapturedLead(lead.id);
      onLeadCaptured(lead.id);
    } catch (error) {
      console.error('Failed to capture lead:', error);
    }
  };

  // Removed chat button and chat interface UI
  return null;
}; 