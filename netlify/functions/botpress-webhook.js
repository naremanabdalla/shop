// Persistent conversation storage
const conversations = new Map();
const SECRET = process.env.X_DB_SECRET;

export const handler = async (event) => {
    // Verify secret if set
    if (SECRET && event.headers['x-db-secret'] !== SECRET) {
        console.error('Invalid secret provided');

        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Unauthorized' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }
    console.log('Incoming request:', {
        method: event.httpMethod,
        path: event.path,
        query: event.queryStringParameters,
        headers: event.headers
    });

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
        // Handle GET requests (polling)
        if (event.httpMethod === 'GET') {
            const { userId, conversationId, lastTimestamp } = event.queryStringParameters || {};

            if (!userId) throw new Error('Missing userId');

            const conversationKey = conversationId ? `${userId}-${conversationId}` : userId;
            const messages = conversations.get(conversationKey) || [];

            const newMessages = lastTimestamp
                ? messages.filter(msg => msg.timestamp > parseInt(lastTimestamp))
                : messages;

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

        // Handle POST requests (from Botpress)
        if (event.httpMethod === 'POST') {
            const { event: eventType, data } = JSON.parse(event.body);

            if (eventType === 'message_created') {
                const { message, conversation } = data;
                const userId = conversation.userId;
                const conversationKey = conversation.id ? `${userId}-${conversation.id}` : userId;

                if (!conversations.has(conversationKey)) {
                    conversations.set(conversationKey, []);
                }

                const botMessage = {
                    id: message.id,
                    text: message.payload.text,
                    sender: 'bot',
                    timestamp: Date.now(),
                    rawData: message
                };

                // Add to conversation
                conversations.get(conversationKey).push(botMessage);
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ status: 'received' })
            };
        }

        return { statusCode: 405, headers, body: 'Method not allowed' };
    } catch (error) {
        console.error('Webhook error:', error);
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