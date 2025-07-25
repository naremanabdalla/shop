// netlify/functions/botpress-webhook.js
const messages = [];

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
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ messages })
        };
    }

    if (event.httpMethod === 'POST') {
        try {
            const botMessage = JSON.parse(event.body);
            messages.push({
                id: Date.now(),
                text: botMessage.text,
                sender: 'bot'
            });

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