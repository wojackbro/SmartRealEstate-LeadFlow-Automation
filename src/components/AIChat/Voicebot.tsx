'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, DollarSign, Building2, TrendingUp, Clock, X } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import 'regenerator-runtime/runtime';
import { ConversationContext, Message, Property, MarketData } from '../../types/index';
import { config } from '../../config';

interface VoicebotProps {
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

export const Voicebot: React.FC<VoicebotProps> = ({ onLeadCaptured, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Add debug logging for messages state changes
  useEffect(() => {
    console.log('📝 Current messages:', messages);
  }, [messages]);

  // Debug logging for component state
  useEffect(() => {
    console.log('🔍 Voicebot state:', {
      isListening,
      isSpeaking,
      isProcessing,
      isInitialized,
      error,
      messageCount: messages.length
    });
  }, [isListening, isSpeaking, isProcessing, isInitialized, error, messages.length]);

  useEffect(() => {
    const initializeVapi = async () => {
      try {
        // Check for microphone permissions first
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            } 
          });
          stream.getTracks().forEach(track => track.stop()); // Stop the stream after checking
          console.log('🎤 Microphone permission granted');
        } catch (err) {
          console.error('🎤 Microphone permission denied:', err);
          throw new Error('Microphone access is required for voice chat. Please grant microphone permissions.');
        }

        // Debug logging
        console.log('🔧 Environment check:', {
          vapiKey: config.vapi.key ? 'Present' : 'Missing',
          assistantId: config.vapi.assistantId ? 'Present' : 'Missing',
          allEnv: import.meta.env
        });

        if (!config.vapi.key) {
          throw new Error('VAPI Key is not configured. Please add VITE_VAPI_KEY to your .env file.');
        }

        if (!config.vapi.assistantId) {
          throw new Error('VAPI Assistant ID is not configured. Please add VITE_VAPI_ASSISTANT_ID to your .env file.');
        }

        // Check if Vapi is available
        if (typeof Vapi !== 'function') {
          throw new Error('Vapi is not properly imported. Please check your dependencies.');
        }

        console.log('🚀 Initializing Vapi with key:', config.vapi.key.substring(0, 5) + '...');
        
        // Validate API key before initializing
        if (!config.vapi.key.startsWith('vapi_') && !config.vapi.key.startsWith('cd5c9')) {
          throw new Error('Invalid Vapi API key. Please check your VITE_VAPI_KEY in .env file.');
        }

        const vapi = new Vapi(config.vapi.key, {
          assistantId: config.vapi.assistantId,
          baseUrl: 'https://api.vapi.ai'
        });
        
        // Verify vapi instance
        if (!vapi) {
          throw new Error('Failed to create Vapi instance');
        }

        vapiRef.current = vapi;
        console.log('✅ Vapi initialized successfully:', {
          hasStart: typeof vapi.start === 'function',
          hasStop: typeof vapi.stop === 'function',
          hasOn: typeof vapi.on === 'function'
        });
        
        setIsInitialized(true);

        // Handle all message types
        vapi.on('message', (message: any) => {
          console.log('📨 Raw message received:', JSON.stringify(message, null, 2));
          
          try {
            // Handle status updates
            if (message.type === 'status-update') {
              if (message.status === 'ended' && message.endedReason === 'silence-timed-out') {
                console.log('🤫 Silence timeout - call ended');
                setIsListening(false);
                setIsSpeaking(false);
                setIsProcessing(false);
                return;
              }
            }

            // Handle conversation updates
            if (message.type === 'conversation-update' && message.conversation) {
              console.log('💬 Processing conversation update');
              
              // Get the last message from the conversation
              const lastMessage = message.conversation[message.conversation.length - 1];
              if (lastMessage && lastMessage.role === 'assistant') {
                console.log('🤖 Processing assistant message:', lastMessage.content);
                
                setMessages(prev => {
                  // Check if we already have this message
                  const lastPrevMessage = prev[prev.length - 1];
                  if (lastPrevMessage && lastPrevMessage.type === 'assistant') {
                    // If the last message is a subset of the new message, update it
                    if (lastMessage.content.includes(lastPrevMessage.content)) {
                      console.log('🔄 Updating existing message');
                      return [
                        ...prev.slice(0, -1),
                        {
                          type: 'assistant',
                          content: lastMessage.content,
                          timestamp: new Date()
                        }
                      ];
                    }
                  }
                  
                  // Add as new message
                  console.log('✅ Adding new message');
                  return [
                    ...prev,
                    {
                      type: 'assistant',
                      content: lastMessage.content,
                      timestamp: new Date()
                    }
                  ];
                });
              }
            }
            // Handle user transcripts (both interim and final)
            else if (message.type === 'transcript') {
              console.log('🎤 Processing transcript:', {
                role: message.role,
                type: message.transcriptType,
                transcript: message.transcript
              });

              if (!message.transcript) {
                console.log('⚠️ Received empty transcript, skipping');
                return;
              }

              // Only process user transcripts
              if (message.role === 'user') {
                setMessages(prev => {
                  // For interim transcripts
                  if (message.transcriptType === 'partial') {
                    // Find the most recent user message
                    const lastUserMessageIndex = [...prev].reverse().findIndex(m => m.type === 'user');
                    const lastUserMessage = lastUserMessageIndex !== -1 ? prev[prev.length - 1 - lastUserMessageIndex] : null;
                    
                    if (lastUserMessage && Date.now() - lastUserMessage.timestamp.getTime() < 2000) {
                      // Update the existing message
                      console.log('🔄 Updating interim transcript:', message.transcript);
                      const newMessages = [...prev];
                      newMessages[prev.length - 1 - lastUserMessageIndex] = {
                        type: 'user',
                        content: message.transcript,
                        timestamp: new Date()
                      };
                      return newMessages;
                    }
                  }
                  
                  // For final transcripts
                  if (message.transcriptType === 'final') {
                    // Check if this is a duplicate of the last user message
                    const lastUserMessage = prev[prev.length - 1];
                    if (lastUserMessage && 
                        lastUserMessage.type === 'user' && 
                        lastUserMessage.content === message.transcript) {
                      console.log('⚠️ Skipping duplicate final transcript');
                      return prev;
                    }
                    
                    // Check if this is a duplicate of any recent user message
                    const recentUserMessages = prev.slice(-3).filter(m => m.type === 'user');
                    if (recentUserMessages.some(m => m.content === message.transcript)) {
                      console.log('⚠️ Skipping duplicate recent transcript');
                      return prev;
                    }
                    
                    console.log('✅ Adding new final transcript:', message.transcript);
                    return [
                      ...prev,
                      {
                        type: 'user',
                        content: message.transcript,
                        timestamp: new Date()
                      }
                    ];
                  }
                  
                  return prev;
                });
              }
            }
          } catch (error) {
            console.error('❌ Error processing message:', error);
          }
        });

        // Add speech event handlers
        vapi.on('speech-start', () => {
          console.log('🔊 Speech started');
          setIsSpeaking(true);
          setIsListening(false);
        });

        vapi.on('speech-end', () => {
          console.log('🔇 Speech ended');
          setIsSpeaking(false);
        });

        // Add call event handlers
        vapi.on('call-start', () => {
          console.log('🎤 Call started - listening for user input');
          setIsListening(true);
          setIsProcessing(false);
          setError(null);
        });

        vapi.on('call-end', () => {
          console.log('🎤 Call ended');
          setIsListening(false);
          setIsSpeaking(false);
          setIsProcessing(false);
        });

        vapi.on('error', (error: Error) => {
          console.error('❌ Vapi error:', error);
          let errorMessage = 'An unknown error occurred';
          
          if (error instanceof Response) {
            if (error.status === 401) {
              errorMessage = 'Invalid API key. Please check your VITE_VAPI_KEY in .env file.';
            } else if (error.status === 403) {
              errorMessage = 'API key is not authorized. Please check your Vapi account status.';
            } else {
              errorMessage = `API error (${error.status}): ${error.statusText}`;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          
          console.error('Error details:', {
            message: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : undefined
          });
          
          setError(errorMessage);
          setIsListening(false);
          setIsSpeaking(false);
          setIsProcessing(false);
        });
      } catch (error) {
        console.error('Failed to initialize Vapi:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize voice assistant';
        setError(errorMessage);
        setIsInitialized(false);
      }
    };

    initializeVapi();

    return () => {
      console.log('Cleaning up Vapi...');
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, [onLeadCaptured]);

  const extractLeadData = (response: string) => {
    try {
      if (!response) return null;
      const leadMatch = response.match(/lead:\s*({[\s\S]*?})/);
      if (leadMatch) {
        return JSON.parse(leadMatch[1]);
      }
    } catch (err) {
      console.error('Error extracting lead data:', err);
    }
    return null;
  };

  const toggleListening = async () => {
    try {
      if (!isInitialized) {
        throw new Error('Voice assistant is not initialized. Please check your configuration.');
      }

      console.log('🎤 Toggling listening, current state:', { isListening, isProcessing });
    if (isListening) {
        console.log('🛑 Stopping Vapi...');
        if (vapiRef.current) {
          vapiRef.current.stop();
        }
    } else {
        console.log('▶️ Starting Vapi...');
        setIsProcessing(true);
        setError(null);

        // Initialize audio context first
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          await audioContext.resume();
          console.log('🎵 Audio context initialized');
        } catch (err) {
          console.error('Failed to initialize audio context:', err);
        }

        // Check microphone permissions again before starting
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            } 
          });
          stream.getTracks().forEach(track => track.stop()); // Stop the stream after checking
          console.log('🎤 Microphone permission granted');
        } catch (err) {
          throw new Error('Microphone access is required. Please grant microphone permissions.');
        }

        if (!vapiRef.current) {
          throw new Error('Voice assistant is not properly initialized');
        }

        // Add a small delay before starting to ensure audio is ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('🎯 Using assistant ID:', config.vapi.assistantId);
        await vapiRef.current.start(config.vapi.assistantId);
      }
    } catch (error) {
      console.error('Error toggling voice:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start voice';
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => {
            setError(null);
            toggleListening();
          }}
          className="mt-2 text-sm text-red-600 hover:text-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col">
      <div className="bg-green-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <h3 className="font-semibold">Voice Assistant</h3>
        {onClose && (
              <button
            onClick={onClose}
            className="hover:bg-green-600 rounded-full p-1 transition-colors"
            aria-label="Close voicebot"
              >
            <X className="w-5 h-5" />
              </button>
            )}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: '200px' }}>
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">
              Start speaking to begin the conversation
            </div>
          ) : (
            messages.map((message, index) => {
              console.log('Rendering message:', message); // Debug log
              return (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.content}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="p-4 border-t">
          <div className="relative">
            <button
              onClick={toggleListening}
              disabled={isProcessing || !isInitialized}
              className={`
                w-16 h-16 rounded-full flex items-center justify-center
                transition-all duration-300 transform hover:scale-110
                ${isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : isSpeaking 
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                }
                ${(isProcessing || !isInitialized) ? 'opacity-50 cursor-not-allowed' : ''}
                shadow-lg
              `}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isListening ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : isSpeaking ? (
                <Volume2 className="w-8 h-8 text-white animate-pulse" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </button>

            {error && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                {error}
                <button
                  onClick={() => {
                    setError(null);
                    toggleListening();
                  }}
                  className="ml-2 text-red-700 hover:text-red-800 font-medium"
                >
                  Try Again
                </button>
            </div>
          )}
          
            {isProcessing && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                Processing...
            </div>
          )}
          
            {!isInitialized && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                Initializing...
              </div>
            )}
            </div>
        </div>
      </div>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-pulse {
            animation: pulse 2s infinite;
          }
        `}
      </style>
    </div>
  );
};