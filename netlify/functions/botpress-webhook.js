
let conversations = {};

export const handler = async (event) => {
    console.log('Incoming request:', event.httpMethod, event.queryStringParameters, event.body);
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    if (event.httpMethod === 'GET') {
        const { conversationId, lastTimestamp } = event.queryStringParameters || {};
        const convMessages = conversations[conversationId] || [];

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
        try {
            const botResponse = JSON.parse(event.body);
            const baseConversationId = botResponse.conversationId || "default";
            const conversationId = `${baseConversationId}-${botResponse.conversationVersion || 0}`;

            if (!conversations[conversationId]) {
                conversations[conversationId] = [];
            }

            const botMessage = {
                id: botResponse.botpressMessageId || `msg-${Date.now()}`,
                text: botResponse.payload?.text || "How can I help you?",
                sender: 'bot',
                rawData: botResponse,
                timestamp: Date.now()
            };

            // Deduplicate before adding
            const exists = conversations[conversationId].some(
                m => m.id === botMessage.id
            );

            if (!exists) {
                conversations[conversationId].push(botMessage);
                conversations[conversationId] = conversations[conversationId]
                    .slice(-20);
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