import React, { useEffect, useRef, useState } from 'react';
import { AIService } from '../services/aiService';
import { ConversationContext, Message } from '../types';

interface VoiceChatProps {
  context: ConversationContext;
  onContextUpdate: (context: ConversationContext) => void;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({ context, onContextUpdate }) => {
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const aiService = AIService.getInstance();

  useEffect(() => {
    // Initialize voice stream when component mounts
    initializeVoiceStream();
    return () => {
      // Cleanup when component unmounts
      aiService.closeVoiceStream();
    };
  }, []);

  const initializeVoiceStream = async () => {
    try {
      await aiService.initializeVoiceStream(
        (message) => {
          const assistantMessage: Message = {
            type: 'assistant',
            content: message,
            timestamp: new Date()
          };

          const updatedContext: ConversationContext = {
            ...context,
            conversationHistory: [
              ...context.conversationHistory,
              assistantMessage
            ]
          };
          onContextUpdate(updatedContext);
        },
        (error) => {
          setError(error);
          setIsConnected(false);
        }
      );
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setError('Failed to initialize voice stream');
      setIsConnected(false);
    }
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          aiService.sendVoiceMessage(event.data);
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsListening(true);
      setError(null);
    } catch (err) {
      setError('Failed to access microphone');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="voice-chat-container">
      <div className="voice-status">
        {error && <div className="error-message">{error}</div>}
        <div className="connection-status">
          Status: {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      
      <button
        className={`voice-button ${isListening ? 'listening' : ''}`}
        onClick={toggleListening}
        disabled={!isConnected}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>

      <style jsx>{`
        .voice-chat-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
        }

        .voice-status {
          text-align: center;
          margin-bottom: 1rem;
        }

        .error-message {
          color: #dc2626;
          margin-bottom: 0.5rem;
        }

        .connection-status {
          color: ${isConnected ? '#059669' : '#dc2626'};
        }

        .voice-button {
          padding: 1rem 2rem;
          border-radius: 9999px;
          font-weight: 600;
          transition: all 0.2s;
          background-color: ${isListening ? '#dc2626' : '#3b82f6'};
          color: white;
          border: none;
          cursor: pointer;
        }

        .voice-button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .voice-button:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .voice-button.listening {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(220, 38, 38, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
          }
        }
      `}</style>
    </div>
  );
}; 