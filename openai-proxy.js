import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_WS_URL = 'wss://api.vapi.ai/v1/voice/stream';
const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID || 'default';

const VOICEFLOW_API_KEY = process.env.VOICEFLOW_API_KEY;
const VOICEFLOW_VERSION_ID = process.env.VOICEFLOW_VERSION_ID || 'production';
const VOICEFLOW_API_URL = 'https://general-runtime.voiceflow.com/state/user';

// Store conversation history for each user
const conversationHistory = new Map();

// WebSocket server for voice streaming
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');

  // Connect to Vapi WebSocket
  const vapiWs = new WebSocket(VAPI_WS_URL, {
    headers: {
      'Authorization': `Bearer ${VAPI_API_KEY}`,
      'X-Assistant-ID': VAPI_ASSISTANT_ID
    }
  });

  vapiWs.on('open', () => {
    console.log('Connected to Vapi WebSocket');
    ws.send(JSON.stringify({ type: 'connected' }));
  });

  vapiWs.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log('Received Vapi message:', message);
      
      if (message.error) {
        console.error('Vapi error:', message.error);
        ws.send(JSON.stringify({ type: 'error', error: message.error }));
        return;
      }

      ws.send(JSON.stringify({
        type: 'response',
        text: message.text || '',
        metadata: message.metadata || {},
        error: null
      }));
    } catch (error) {
      console.error('Error parsing Vapi message:', error);
      ws.send(JSON.stringify({ type: 'error', error: 'Invalid message format' }));
    }
  });

  vapiWs.on('error', (error) => {
    console.error('Vapi WebSocket error:', error);
    ws.send(JSON.stringify({ type: 'error', error: error.message }));
  });

  ws.on('message', (data) => {
    try {
      console.log('Received client message');
      vapiWs.send(data);
    } catch (error) {
      console.error('Error forwarding message to Vapi:', error);
      ws.send(JSON.stringify({ type: 'error', error: 'Failed to send message' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    vapiWs.close();
  });
});

// HTTP endpoint for initializing voice connection
app.post('/api/vapi/voice', (req, res) => {
  try {
    if (!VAPI_API_KEY) {
      console.error('Vapi API key not configured');
      return res.status(500).json({ error: 'Vapi API key not configured' });
    }

    const wsUrl = `ws://localhost:${PORT}/api/vapi/voice/ws`;
    console.log('Generated WebSocket URL:', wsUrl);
    
    res.json({ 
      wsUrl,
      assistantId: VAPI_ASSISTANT_ID
    });
  } catch (error) {
    console.error('Error in /api/vapi/voice:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/openai', async (req, res) => {
  try {
    const { messages, model = 'deepseek-chat', ...rest } = req.body;
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
      model,
      messages,
        ...rest
      })
    });
    const data = await response.json();
    console.log('DeepSeek API response:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error(error?.message || error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vapi', async (req, res) => {
  try {
    const { audio, assistant_id = 'default', ...rest } = req.body;
    console.log('Vapi Request:', {
      url: VAPI_WS_URL,
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`
      }
    });

    // Connect to Vapi WebSocket
    const vapiWs = new WebSocket(VAPI_WS_URL, {
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`
      }
    });

    vapiWs.on('open', () => {
      console.log('Connected to Vapi WebSocket');
    });

    vapiWs.on('message', (data) => {
      // Forward Vapi's response to client
      res.write(data);
    });

    vapiWs.on('error', (error) => {
      console.error('Vapi WebSocket error:', error);
      res.status(500).json({ error: error.message });
    });

    // Forward client's audio to Vapi
    vapiWs.send(audio);

    res.status(200).end();
  } catch (error) {
    console.error('Vapi API error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/voiceflow', async (req, res) => {
  try {
    const { message, userId } = req.body;
    console.log('Received Voiceflow request:', { message, userId });

    if (!VOICEFLOW_API_KEY || !VOICEFLOW_VERSION_ID) {
      console.error('Voiceflow credentials not configured');
      return res.status(500).json({ error: 'Voiceflow credentials not configured' });
    }

    // Get current state
    const stateResponse = await fetch(`${VOICEFLOW_API_URL}/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': VOICEFLOW_API_KEY,
        'versionID': VOICEFLOW_VERSION_ID
      }
    });

    if (!stateResponse.ok) {
      console.error('Failed to get Voiceflow state:', await stateResponse.text());
      return res.status(500).json({ error: 'Failed to get conversation state' });
    }

    const state = await stateResponse.json();

    // Send message
    const messageResponse = await fetch(`${VOICEFLOW_API_URL}/${userId}/interact`, {
      method: 'POST',
      headers: {
        'Authorization': VOICEFLOW_API_KEY,
        'versionID': VOICEFLOW_VERSION_ID,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: {
          type: 'text',
          payload: message
        }
      })
    });

    if (!messageResponse.ok) {
      console.error('Failed to send message to Voiceflow:', await messageResponse.text());
      return res.status(500).json({ error: 'Failed to send message' });
    }

    const response = await messageResponse.json();
    console.log('Voiceflow response:', response);

    // Extract text and metadata from response
    const text = response.trace
      .filter(t => t.type === 'text')
      .map(t => t.payload.message)
      .join('\n');

    const metadata = {
      intent: response.trace.find(t => t.type === 'intent')?.payload?.intent,
      entities: response.trace.find(t => t.type === 'entities')?.payload?.entities || {}
    };

    // Update conversation history
    const history = [
      ...(conversationHistory.get(userId) || []),
      { type: 'user', content: message, timestamp: new Date() },
      { type: 'assistant', content: text, timestamp: new Date() }
    ];
    conversationHistory.set(userId, history);

    res.json({
      response: text,
      metadata,
      history
    });
  } catch (error) {
    console.error('Voiceflow proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add endpoint to get conversation history
app.get('/api/voiceflow/history/:userId', (req, res) => {
  const { userId } = req.params;
  const history = conversationHistory.get(userId) || [];
  res.json({ history });
});

// Add endpoint to clear conversation history
app.delete('/api/voiceflow/history/:userId', (req, res) => {
  const { userId } = req.params;
  conversationHistory.delete(userId);
  res.json({ message: 'Conversation history cleared' });
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log('API Status:');
  console.log(`- Vapi: ${VAPI_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`- Voiceflow: ${VOICEFLOW_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`- Vapi Assistant ID: ${VAPI_ASSISTANT_ID}`);
  console.log(`- Voiceflow Version ID: ${VOICEFLOW_VERSION_ID}`);
});

// Handle WebSocket upgrade
server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;

  if (pathname === '/api/vapi/voice/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});