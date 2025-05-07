export interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ConversationContext {
  conversationHistory: Message[];
  propertySearch?: {
    type?: string[];
    priceRange?: [number, number];
    locations?: string[];
    beds?: number;
    baths?: number;
  };
  lastIntent?: string;
  lastEntities?: {
    name?: string;
    email?: string;
    phone?: string;
    source?: string;
    preferences?: string[];
  };
} 