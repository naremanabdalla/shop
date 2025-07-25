let conversations = {};

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };

    if (event.httpMethod === 'GET') {
        const { conversationId, lastMessageId } = event.queryStringParameters || {};
        const convMessages = conversations[conversationId] || [];

        // Only return messages newer than lastMessageId
        const newMessages = lastMessageId
            ? convMessages.filter(msg => msg.id > lastMessageId)
            : convMessages;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ messages: newMessages })
        };
    }

    if (event.httpMethod === 'POST') {
        try {
            const botResponse = JSON.parse(event.body);
            const conversationId = botResponse.conversationId || "default";

            if (!conversations[conversationId]) {
                conversations[conversationId] = [];
            }

            const botMessage = {
                id: botResponse.botpressMessageId || `msg-${Date.now()}`,
                text: botResponse.payload?.text || "I didn't understand that",
                sender: 'bot',
                timestamp: Date.now(),
                rawData: botResponse
            };

            conversations[conversationId].push(botMessage);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, lastMessageId: botMessage.id })
            };
        } catch (error) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
        }
    }

    return { statusCode: 405, headers, body: 'Method Not Allowed' };
};