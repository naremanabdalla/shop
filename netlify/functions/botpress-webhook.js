let conversations = {};

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Cache-Control',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    if (event.httpMethod === 'GET') {
        const { conversationId, lastTimestamp } = event.queryStringParameters || {};

        if (!conversationId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "conversationId is required" })
            };
        }

        const convMessages = conversations[conversationId]?.messages || [];
        const newMessages = lastTimestamp
            ? convMessages.filter(msg => msg.timestamp > parseInt(lastTimestamp))
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
        console.log('Incoming webhook payload:', JSON.parse(event.body));
        try {
            const botResponse = JSON.parse(event.body);
            const conversationId = botResponse.conversationId;

            if (!conversationId) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: "conversationId is required" })
                };
            }

            // Initialize conversation if it doesn't exist
            if (!conversations[conversationId]) {
                conversations[conversationId] = {
                    messages: [],
                    createdAt: Date.now(),
                    userId: botResponse.userId
                };
            }

            const botMessage = {
                id: botResponse.messageId || `msg-${Date.now()}`,
                text: botResponse.text || botResponse.payload?.text || "How can I help you?",
                sender: 'bot',
                rawData: botResponse,
                timestamp: Date.now()
            };

            // Deduplicate before adding
            const exists = conversations[conversationId].messages.some(
                m => m.id === botMessage.id
            );

            if (!exists) {
                conversations[conversationId].messages.push(botMessage);
                // Keep only the last 50 messages to prevent memory issues
                conversations[conversationId].messages = conversations[conversationId].messages
                    .slice(-50);
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: "Message processed successfully" })
            };
        } catch (error) {
            console.error('Webhook POST error:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: "Internal server error",
                    details: error.message
                })
            };
        }
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method Not Allowed' })
    };
};