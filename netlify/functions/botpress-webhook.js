let conversations = {};

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    try {
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

        if (event.httpMethod === 'POST') {
            let data;
            try {
                data = JSON.parse(event.body);
            } catch (e) {
                console.log(e);
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: "Invalid JSON payload" })
                };
            }

            const userConvKey = `${data.userId}_${data.conversationId}`;
            if (!conversations[userConvKey]) {
                conversations[userConvKey] = [];
            }

            const botMessage = {
                id: data.messageId || `msg-${Date.now()}`,
                text: data.text || (data.payload?.text || "How can I help?"),
                sender: 'bot',
                userId: data.userId,
                rawData: data.payload || data,
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
        }

        return { statusCode: 405, headers, body: 'Method Not Allowed' };

    } catch (error) {
        console.error('Webhook error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};