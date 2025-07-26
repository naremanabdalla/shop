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
        const userConvKey = `${userId}_${conversationId}`;
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
            const data = JSON.parse(event.body);
            const userConvKey = `${data.userId}_${data.conversationId}`;

            if (!conversations[userConvKey]) {
                conversations[userConvKey] = [];
            }

            // Handle both direct Botpress responses and our proxy format
            const botMessage = {
                id: data.messageId || `msg-${Date.now()}`,
                text: data.text || (data.payload?.text || "How can I help?"),
                sender: 'bot',
                userId: data.userId,
                rawData: data.payload || data, // Store complete response
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