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
        const { conversationId, userId } = event.queryStringParameters || {};

        // Create unique key combining userId and conversationId
        const userConversationKey = `${userId}_${conversationId}`;
        const userMessages = conversations[userConversationKey] || [];

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                messages: userMessages,
                lastTimestamp: userMessages.length > 0
                    ? Math.max(...userMessages.map(m => m.timestamp))
                    : Date.now()
            })
        };
    }

    // POST - For receiving bot responses
    if (event.httpMethod === 'POST') {
        try {
            const data = JSON.parse(event.body);

            // Create unique conversation key
            const userConversationKey = `${data.userId}_${data.conversationId}`;

            if (!conversations[userConversationKey]) {
                conversations[userConversationKey] = [];
            }

            const botMessage = {
                id: data.messageId || `msg-${Date.now()}`,
                text: data.text || (data.payload?.text || "How can I help?"),
                sender: 'bot',
                userId: data.userId, // Track which user this belongs to
                timestamp: Date.now(),
                rawData: data.payload
            };

            conversations[userConversationKey].push(botMessage);
            // Keep only the last 50 messages
            conversations[userConversationKey] = conversations[userConversationKey].slice(-50);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: botMessage })
            };
        } catch (error) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: error.message })
            };
        }
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Method not allowed" })
    };
};