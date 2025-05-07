import { Lead } from '../types';

export class LeadService {
  private static instance: LeadService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = import.meta.env.VITE_LEAD_API_URL || 'https://api.example.com';
  }

  static getInstance(): LeadService {
    if (!LeadService.instance) {
      LeadService.instance = new LeadService();
    }
    return LeadService.instance;
  }

  async createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<Lead> {
    try {
      // In production, make actual API call
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        ...lead,
        status: 'new',
        createdAt: new Date(),
        interactions: []
      };

      return newLead;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw new Error('Failed to create lead');
    }
  }

  async updateLead(leadId: string, updates: Partial<Lead>): Promise<Lead> {
    try {
      // In production, make actual API call
      const lead = await this.getLead(leadId);
      const updatedLead = {
        ...lead,
        ...updates,
        lastContacted: new Date()
      };

      return updatedLead;
    } catch (error) {
      console.error('Error updating lead:', error);
      throw new Error('Failed to update lead');
    }
  }

  async getLead(leadId: string): Promise<Lead> {
    try {
      // In production, make actual API call
      return {
        id: leadId,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        source: 'website',
        status: 'new',
        preferences: {
          propertyType: ['house', 'condo'],
          priceRange: [300000, 600000],
          locations: ['San Francisco', 'Oakland'],
          beds: 3,
          baths: 2
        },
        interactions: [],
        createdAt: new Date(),
        lastContacted: new Date()
      };
    } catch (error) {
      console.error('Error getting lead:', error);
      throw new Error('Failed to get lead');
    }
  }

  async addInteraction(leadId: string, interaction: {
    type: 'chat' | 'call' | 'email' | 'viewing';
    notes?: string;
  }): Promise<Lead> {
    try {
      const lead = await this.getLead(leadId);
      const updatedLead = {
        ...lead,
        interactions: [
          ...lead.interactions,
          {
            ...interaction,
            timestamp: new Date()
          }
        ],
        lastContacted: new Date()
      };

      return updatedLead;
    } catch (error) {
      console.error('Error adding interaction:', error);
      throw new Error('Failed to add interaction');
    }
  }

  async qualifyLead(leadId: string): Promise<{
    score: number;
    status: 'hot' | 'warm' | 'cold';
    recommendations: string[];
  }> {
    try {
      const lead = await this.getLead(leadId);
      
      // Calculate lead score based on various factors
      let score = 0;
      
      // Source weight
      const sourceWeights = {
        'website': 10,
        'chatbot': 15,
        'voicebot': 20,
        'referral': 25,
        'other': 5
      };
      score += sourceWeights[lead.source] || 0;

      // Interaction weight
      const interactionWeights = {
        'chat': 5,
        'call': 10,
        'email': 5,
        'viewing': 20
      };
      lead.interactions.forEach(interaction => {
        score += interactionWeights[interaction.type] || 0;
      });

      // Preference completeness weight
      if (lead.preferences) {
        if (lead.preferences.propertyType?.length) score += 10;
        if (lead.preferences.priceRange) score += 10;
        if (lead.preferences.locations?.length) score += 10;
        if (lead.preferences.beds) score += 5;
        if (lead.preferences.baths) score += 5;
      }

      // Determine status
      const status = score > 70 ? 'hot' : score > 40 ? 'warm' : 'cold';

      // Generate recommendations
      const recommendations: string[] = [];
      if (status === 'hot') {
        recommendations.push('Schedule a viewing');
        recommendations.push('Send detailed property information');
        recommendations.push('Connect with a mortgage specialist');
      } else if (status === 'warm') {
        recommendations.push('Follow up with market analysis');
        recommendations.push('Send property recommendations');
        recommendations.push('Schedule a consultation call');
      } else {
        recommendations.push('Send general market information');
        recommendations.push('Follow up with basic property search');
        recommendations.push('Request more information about preferences');
      }

      return {
        score,
        status,
        recommendations
      };
    } catch (error) {
      console.error('Error qualifying lead:', error);
      throw new Error('Failed to qualify lead');
    }
  }

  async getLeads(params: {
    status?: Lead['status'];
    source?: Lead['source'];
    page?: number;
    limit?: number;
  }): Promise<{
    leads: Lead[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      // In production, make actual API call
      const mockLeads: Lead[] = [
        {
          id: 'lead-1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          source: 'website',
          status: 'new',
          preferences: {
            propertyType: ['house'],
            priceRange: [300000, 500000],
            locations: ['San Francisco'],
            beds: 3,
            baths: 2
          },
          interactions: [],
          createdAt: new Date(),
          lastContacted: new Date()
        }
      ];

      return {
        leads: mockLeads,
        total: 1,
        page: params.page || 1,
        limit: params.limit || 10
      };
    } catch (error) {
      console.error('Error getting leads:', error);
      throw new Error('Failed to get leads');
    }
  }

  async deleteLead(leadId: string): Promise<void> {
    try {
      // In production, make actual API call
      console.log(`Deleting lead ${leadId}`);
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw new Error('Failed to delete lead');
    }
  }
} 