'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { AIService } from '../../services/aiService';
import { Message } from '../../types';

interface ChatbotProps {
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
  onClose?: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ onLeadCaptured, onClose }) => {
  const [isOpen, setIsOpen] = useState(onClose ? true : false);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiService = useRef(AIService.getInstance());

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    try {
      setIsProcessing(true);
      setError(null);

      // Add user message
      const userMessage: Message = { 
        type: 'user', 
        content: input,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Get AI response
      const response = await aiService.current.generateResponse(
        input,
        { conversationHistory: messages },
        'chat',
        'default-session'
      );

      if (response.error) {
        throw new Error(response.error);
      }

      // Typing animation for assistant message
      const typeMessage = (fullText: string) => {
        let index = 0;
        setMessages(prev => [
          ...prev,
          { type: 'assistant', content: '', timestamp: new Date() }
        ]);
        const interval = setInterval(() => {
          index++;
          setMessages(prev => {
            const newMessages = [...prev];
            const last = newMessages[newMessages.length - 1];
            if (last.type === 'assistant') {
              last.content = fullText.slice(0, index);
            }
            return newMessages;
          });
          if (index >= fullText.length) clearInterval(interval);
        }, 20); // 20ms per character
      };

      typeMessage(response.content);

      // Handle lead capture if needed
      if (response.metadata?.entities && onLeadCaptured) {
        const { name, email, phone } = response.metadata.entities;
        if (name && email && phone) {
          await onLeadCaptured({
            name,
            email,
            phone,
            source: 'chatbot',
            preferences: response.metadata.entities.preferences,
            interactionDetails: messages.map(m => `${m.type}: ${m.content}`).join('\n')
          });
        }
      }
    } catch (err) {
      console.error('Error in chat:', err);
      setError(err instanceof Error ? err.message : 'Failed to process message');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-24 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Open chat"
        >
          <MessageSquare className="w-8 h-8 text-white" />
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col">
          <div className="bg-blue-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-semibold">AI Assistant</h3>
            <button
              onClick={onClose ? onClose : () => setIsOpen(false)}
              className="hover:bg-blue-600 rounded-full p-1 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>Hello! How can I help you today?</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 text-sm">
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-700 hover:text-red-800 font-medium"
              >
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={isProcessing || !input.trim()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};