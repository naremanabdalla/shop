// Store conversations in memory (for demo - replace with DB in production)
let conversations = {};

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    // GET - For polling new messages
    if (event.httpMethod === 'GET') {
        const { conversationId, userId, lastTimestamp } = event.queryStringParameters || {};

        // KEY CHANGE: Create unique conversation ID combining user + conversation
        const userConversationKey = `${userId}_${conversationId}`;
        const convMessages = conversations[userConversationKey] || [];

        // Filter messages newer than lastTimestamp
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
                    : lastTimestamp || Date.now()
            })
        };
    }

    // POST - For receiving bot responses
    if (event.httpMethod === 'POST') {
        try {
            const botResponse = JSON.parse(event.body);

            // KEY CHANGE: Include userId in conversation key
            const userConversationKey = `${botResponse.userId}_${botResponse.conversationId || "default"}`;

            if (!conversations[userConversationKey]) {
                conversations[userConversationKey] = [];
            }

            const botMessage = {
                id: botResponse.messageId || `msg-${Date.now()}`,
                text: botResponse.text || "How can I help you?",
                sender: 'bot',
                userId: botResponse.userId, // Track which user this belongs to
                timestamp: Date.now(),
                rawData: botResponse.payload // Preserve original data
            };

            // Deduplicate messages
            const exists = conversations[userConversationKey].some(
                m => m.id === botMessage.id
            );

            if (!exists) {
                conversations[userConversationKey].push(botMessage);
                // Keep only the last 50 messages
                conversations[userConversationKey] = conversations[userConversationKey].slice(-50);
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
                body: JSON.stringify({
                    error: "Failed to process message",
                    details: error.message
                })
            };
        }
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Method Not Allowed" })
    };
};