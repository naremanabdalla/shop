let conversations = {};

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    if (event.httpMethod === 'GET') {
        const { conversationId, userId, lastTimestamp } = event.queryStringParameters || {};
        
        // Create unique conversation key combining userId and conversationId
        const conversationKey = `${userId}-${conversationId || 'default'}`;
        const convMessages = conversations[conversationKey] || [];

        const newMessages = lastTimestamp
            ? convMessages.filter(msg => msg.timestamp > parseInt(lastTimestamp) && msg.userId === userId)
            : convMessages.filter(msg => msg.userId === userId);

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

    if (event.httpMethod === 'POST') {
        try {
            const botResponse = JSON.parse(event.body);
            const { userId, conversationId = 'default' } = botResponse;
            
            if (!userId) throw new Error("userId is required");

            const conversationKey = `${userId}-${conversationId}`;
            if (!conversations[conversationKey]) {
                conversations[conversationKey] = [];
            }

            const botMessage = {
                id: botResponse.messageId || `msg-${Date.now()}`,
                text: botResponse.payload?.text || botResponse.text || "How can I help you?",
                sender: 'bot',
                userId: userId, // Include userId in message
                rawData: botResponse,
                timestamp: Date.now()
            };

            // Deduplicate and store
            if (!conversations[conversationKey].some(m => m.id === botMessage.id)) {
                conversations[conversationKey].push(botMessage);
                conversations[conversationKey] = conversations[conversationKey].slice(-20);
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true })
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