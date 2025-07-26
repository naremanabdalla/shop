let conversations = {};

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    // GET - For polling messages
    if (event.httpMethod === 'GET') {
        const { conversationId, userId, lastTimestamp } = event.queryStringParameters || {};
        const userConvKey = `${userId}_${conversationId}`; // Unique key per user
        const convMessages = conversations[userConvKey] || [];

        const newMessages = lastTimestamp
            ? convMessages.filter(msg => msg.timestamp > parseInt(lastTimestamp))
            : convMessages;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                messages: newMessages,
                lastTimestamp: newMessages.length > 0
                    ? Math.max(...newMessages.map(m => m.timestamp))
                    : Date.now()
            })
        };
    }

    // POST - For receiving bot responses
    if (event.httpMethod === 'POST') {
        try {
            const botResponse = JSON.parse(event.body);
            const userConvKey = `${botResponse.userId}_${botResponse.conversationId}`;

            if (!conversations[userConvKey]) {
                conversations[userConvKey] = [];
            }

            const botMessage = {
                id: botResponse.messageId || `msg-${Date.now()}`,
                text: botResponse.payload?.text || "How can I help?",
                sender: 'bot',
                userId: botResponse.userId, // Track which user this belongs to
                rawData: botResponse.payload,
                timestamp: Date.now()
            };

            conversations[userConvKey].push(botMessage);
            conversations[userConvKey] = conversations[userConvKey].slice(-50);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: botMessage
                })
            };
        } catch (error) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: error.message })
            };
        }
    }

    return { statusCode: 405, headers, body: 'Method Not Allowed' };
};