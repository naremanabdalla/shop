const sessionStore = new Map();
const SECRET = process.env.X_DB_SECRET;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

export const handler = async (event) => {
  // Secret verification
  if (event.headers['x-db-secret'] !== SECRET) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    if (event.httpMethod === 'GET') {
      const { userId, lastTimestamp } = event.queryStringParameters || {};
      if (!userId) throw new Error('Missing userId');
      
      const messages = sessionStore.get(userId) || [];
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ messages })
      };
    }

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
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
}
}