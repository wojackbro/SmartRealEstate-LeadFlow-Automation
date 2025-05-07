export interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ConversationContext {
  conversationHistory: Message[];
  lastIntent?: string;
  lastEntities?: Record<string, any>;
  propertySearch?: {
    type?: string[];
    priceRange?: [number, number];
    locations?: string[];
    beds?: number;
    baths?: number;
  };
}

export interface Property {
  id: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  location: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    zipCode: string;
  };
  status: 'active' | 'pending' | 'sold';
  listingDate: Date;
  lastUpdated: Date;
}

export interface MarketData {
  averagePrice: number;
  priceTrend: 'increasing' | 'decreasing' | 'stable';
  daysOnMarket: number;
  marketType: 'buyer' | 'seller' | 'balanced';
  inventory: number;
  salesVolume: number;
  pricePerSqFt: number;
  yearOverYearChange: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: 'website' | 'chatbot' | 'voicebot' | 'referral' | 'other';
  preferences: {
    propertyType?: string[];
    priceRange?: [number, number];
    locations?: string[];
    beds?: number;
    baths?: number;
  };
  interactions: Array<{
    type: string;
    timestamp: Date;
    notes: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
} 