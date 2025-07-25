// netlify/functions/botpress-webhook.js
let botMessages = []; // Store bot replies

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    // Frontend polls for messages
    if (event.httpMethod === 'GET') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ messages: botMessages })
        };
    }

    // Botpress sends replies here
    if (event.httpMethod === 'POST') {
        try {
            const { text } = JSON.parse(event.body);

            // Store the new bot message
            const newMessage = {
                id: `bot-${Date.now()}`,
                text: text || "I didn't understand that",
                sender: 'bot'
            };

            botMessages.push(newMessage);
            console.log('Stored bot reply:', newMessage);

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