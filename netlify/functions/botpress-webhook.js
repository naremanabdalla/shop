// Session storage (in-memory)
const sessionStore = new Map();
const SECRET = process.env.X_DB_SECRET;

// Session cleanup helper
const cleanOldSessions = () => {
  const now = Date.now();
  sessionStore.forEach((msgs, userId) => {
    sessionStore.set(userId, msgs.filter(m => now - m.timestamp < 3600000));
  });
};

export const handler = async (event) => {
  // Verify the secret first
  if (event.headers['x-db-secret'] !== SECRET) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    cleanOldSessions(); // Cleanup on each request

    // Handle GET requests
    if (event.httpMethod === 'GET') {
      const { userId, lastTimestamp } = event.queryStringParameters || {};
      if (!userId) throw new Error('Missing userId');
      
      const userMessages = sessionStore.get(userId) || [];
      const newMessages = lastTimestamp
        ? userMessages.filter(msg => msg.timestamp > parseInt(lastTimestamp))
        : userMessages;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          messages: newMessages,
          lastTimestamp: newMessages.length > 0
            ? Math.max(...newMessages.map(m => m.timestamp))
            : lastTimestamp || Date.now()
        })
      };
    }

    // Handle POST requests
    if (event.httpMethod === 'POST') {
      const { event: eventType, data } = JSON.parse(event.body);
      
      if (eventType === 'message_created') {
        const { message, conversation } = data;
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
          webhookId: 'botpress-webhook'
        })
      };
    }

    return { statusCode: 405, headers, body: 'Method not allowed' };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message
      })
    };
  }
};