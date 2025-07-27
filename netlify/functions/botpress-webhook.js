// Session storage (in-memory)
const sessionStore = new Map();

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    try {
        // Handle GET requests (frontend polling)
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

        // Handle POST requests (from Botpress)
        if (event.httpMethod === 'POST') {
            const botResponse = JSON.parse(event.body);
            const { userId } = botResponse;

            if (!userId) throw new Error('Missing userId');

            // Initialize session if it doesn't exist
            if (!sessionStore.has(userId)) {
                sessionStore.set(userId, []);
            }

            // Store bot reply in SESSION (not Firestore)
            sessionStore.get(userId).push({
                id: botResponse.message.id,
                text: botResponse.message.payload.text,
                sender: 'bot',
                timestamp: Date.now(),
                rawData: botResponse
            });

            return { statusCode: 200, headers };
        }

        return { statusCode: 405, headers, body: 'Method not allowed' };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};