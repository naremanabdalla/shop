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
        const { conversationId, userId } = event.queryStringParameters || {};
        const convKey = `${userId}_${conversationId}`;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                messages: conversations[convKey] || [],
                lastTimestamp: Date.now()
            })
        };
    }

    if (event.httpMethod === 'POST') {
        try {
            const data = JSON.parse(event.body);
            const convKey = `${data.userId}_${data.conversationId}`;

            if (!conversations[convKey]) {
                conversations[convKey] = [];
            }

            const newMessage = {
                id: `msg-${Date.now()}`,
                text: data.text,
                sender: 'bot',
                timestamp: Date.now()
            };

            conversations[convKey].push(newMessage);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: newMessage })
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