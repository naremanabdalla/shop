// netlify/functions/botpress-webhook.js
const messages = []; // Temporary storage for bot replies

export const handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    // Handle GET requests (for polling)
    if (event.httpMethod === 'GET') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ messages })
        };
    }

    // Handle POST requests (from Botpress)
    if (event.httpMethod === 'POST') {
        try {
            const botMessage = JSON.parse(event.body);
            console.log('Received from Botpress:', botMessage);

            // Store the message
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