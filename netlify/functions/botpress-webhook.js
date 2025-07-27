// Session storage (in-memory)
const sessionStore = new Map();

export const handler = async (event) => {
    // CORS headers
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
            
            // Filter messages newer than lastTimestamp
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

            const botMessage = {
                id: botResponse.messageId || `msg-${Date.now()}`,
                text: botResponse.payload?.text || "Bot response",
                sender: 'bot',
                timestamp: Date.now(),
                rawData: botResponse
            };

            // Add to session storage
            sessionStore.get(userId).push(botMessage);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: 'Method not allowed'
        };
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