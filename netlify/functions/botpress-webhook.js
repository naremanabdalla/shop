// netlify/functions/botpress-webhook.js
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
        const { conversationId } = event.queryStringParameters || {};
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                messages: conversations[conversationId] || []
            })
        };
    }

    if (event.httpMethod === 'POST') {
        try {
            const { conversationId, text } = JSON.parse(event.body);

            if (!conversations[conversationId]) {
                conversations[conversationId] = [];
            }

            const newMessage = {
                id: `msg-${Date.now()}`,
                text: text || "I'm having trouble understanding. Can you rephrase?",
                sender: 'bot',
                timestamp: new Date().toISOString()
            };

            conversations[conversationId].push(newMessage);
            console.log('New bot message:', newMessage);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: newMessage })
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