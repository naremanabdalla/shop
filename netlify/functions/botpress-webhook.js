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

        // Create a unique conversation key combining userId and conversationId
        const conversationKey = `${userId}-${conversationId}`;
        const convMessages = conversations[conversationKey] || [];

        const newMessages = lastTimestamp
            ? convMessages.filter(msg => msg.timestamp > parseInt(lastTimestamp) && msg.userId === userId)
            : [];

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
            const baseConversationId = botResponse.conversationId || "default";
            const conversationKey = `${botResponse.userId}-${baseConversationId}`;

            if (!conversations[conversationKey]) {
                conversations[conversationKey] = [];
            }

            const botMessage = {
                id: botResponse.messageId || `msg-${Date.now()}`,
                text: botResponse.payload?.text || botResponse.text || "How can I help you?",
                sender: 'bot',
                userId: botResponse.userId, // Include userId in the message
                rawData: botResponse,
                timestamp: Date.now()
            };

            // Deduplicate before adding
            const exists = conversations[conversationKey].some(
                m => m.id === botMessage.id
            );

            if (!exists) {
                conversations[conversationKey].push(botMessage);
                // Keep only the last 20 messages per conversation
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