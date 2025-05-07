import React, { useState, useRef, useEffect } from 'react';
import { AIService } from '../services/aiService';
import { ConversationContext, Message } from '../types';
import { VoiceChat } from './VoiceChat';

export const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [context, setContext] = useState<ConversationContext>({
    conversationHistory: [],
    propertySearch: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiService = AIService.getInstance();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [context.conversationHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = input;
    setInput('');

    // Add user message to context
    const userMessageObj: Message = {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    const updatedContext: ConversationContext = {
      ...context,
      conversationHistory: [
        ...context.conversationHistory,
        userMessageObj
      ]
    };
    setContext(updatedContext);

    try {
      const response = await aiService.generateResponse(
        userMessage,
        updatedContext,
        'chat',
        'default-session'
      );

      setContext(response.updatedContext);
    } catch (error) {
      console.error('Error generating response:', error);
      // Add error message to context
      const errorMessage: Message = {
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };

      setContext({
        ...updatedContext,
        conversationHistory: [
          ...updatedContext.conversationHistory,
          errorMessage
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {context.conversationHistory.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <VoiceChat context={context} onContextUpdate={setContext} />
        
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="chat-input"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="send-button"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>

      <style>
        {`
          .chat-container {
            display: flex;
            flex-direction: column;
            height: 100vh;
            max-width: 800px;
            margin: 0 auto;
            padding: 1rem;
          }

          .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .message {
            max-width: 70%;
            padding: 0.75rem;
            border-radius: 0.5rem;
            margin-bottom: 0.5rem;
          }

          .user-message {
            align-self: flex-end;
            background-color: #3b82f6;
            color: white;
          }

          .assistant-message {
            align-self: flex-start;
            background-color: #f3f4f6;
            color: #1f2937;
          }

          .message-content {
            margin-bottom: 0.25rem;
          }

          .message-timestamp {
            font-size: 0.75rem;
            opacity: 0.7;
          }

          .chat-input-container {
            padding: 1rem;
            border-top: 1px solid #e5e7eb;
          }

          .chat-form {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
          }

          .chat-input {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.375rem;
            font-size: 1rem;
          }

          .send-button {
            padding: 0.75rem 1.5rem;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 0.375rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .send-button:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
          }

          .send-button:hover:not(:disabled) {
            background-color: #2563eb;
          }
        `}
      </style>
    </div>
  );
}; 