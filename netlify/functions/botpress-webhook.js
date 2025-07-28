// Session storage (in-memory)
const sessionStore = new Map();
const SECRET = process.env.X_DB_SECRET;

export const handler = async (event) => {
  // 1. Verify secret first
  if (event.headers['x-db-secret'] !== SECRET) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  // 2. Set CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // 3. Handle OPTIONS preflight
  if (event.method === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    // 4. Process GET requests (polling)
    if (event.method === 'GET') {
      const { userId, lastTimestamp } = event.query;
      if (!userId) {
        throw new Error('Missing userId parameter');
      }

      const userMessages = sessionStore.get(userId) || [];
      const filteredMessages = lastTimestamp
        ? userMessages.filter(msg => msg.timestamp > parseInt(lastTimestamp))
        : userMessages;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          messages: filteredMessages,
          lastTimestamp: filteredMessages.length > 0
            ? Math.max(...filteredMessages.map(m => m.timestamp))
            : lastTimestamp || Date.now()
        })
      };
    }

    // 5. Process POST requests (from Botpress)
    if (event.method === 'POST') {
      const payload = JSON.parse(event.body);
      
      // Botpress webhook format
      if (payload.event === 'message_created') {
        const { message, conversation } = payload.data;
        const userId = conversation.userId;

        if (!sessionStore.has(userId)) {
          sessionStore.set(userId, []);
        }

        sessionStore.get(userId).push({
          id: message.id,
          text: message.payload.text,
          sender: 'bot',
          timestamp: Date.now(),
          rawData: message
        });
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          status: 'received',
          webhookId: 'botpress-chat-integration'
        })
      };
    }

    // 6. Handle unsupported methods
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Webhook processing error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};