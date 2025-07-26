let conversations = {};

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    if (event.httpMethod === 'GET') {
        const { conversationId, userId, lastTimestamp } = event.queryStringParameters || {};
        const userConversationKey = `${userId}_${conversationId}`;

        const convMessages = conversations[userConversationKey] || [];
        const filteredMessages = lastTimestamp
            ? convMessages.filter(msg => msg.timestamp > parseInt(lastTimestamp))
            : convMessages;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                messages: filteredMessages,
                lastTimestamp: filteredMessages.length > 0
                    ? Math.max(...filteredMessages.map(m => m.timestamp))
                    : Date.now()
            })
        };
    }

    if (event.httpMethod === 'POST') {
        try {
            const data = JSON.parse(event.body);
            const userConversationKey = `${data.userId}_${data.conversationId}`;

            if (!conversations[userConversationKey]) {
                conversations[userConversationKey] = [];
            }

            const newMessage = {
                id: data.messageId || `msg-${Date.now()}`,
                text: data.text || data.payload?.text || "Bot response",
                sender: 'bot',
                userId: data.userId,
                timestamp: Date.now(),
                rawData: data.payload
            };

            conversations[userConversationKey].push(newMessage);
            conversations[userConversationKey] = conversations[userConversationKey].slice(-50);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true })
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