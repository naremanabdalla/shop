let conversations = {};

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

    // Frontend polling
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

    // Handle Botpress webhook
    if (event.httpMethod === 'POST') {
        try {
            const botResponse = JSON.parse(event.body);
            console.log('Raw Botpress response:', botResponse); // Debug log

            const conversationId = botResponse.conversationId || "default";

            if (!conversations[conversationId]) {
                conversations[conversationId] = [];
            }

            // Extract the actual message text from Botpress response
            const botMessage = {
                id: botResponse.botpressMessageId || `msg-${Date.now()}`,
                text: botResponse.payload?.text || "Received an unsupported message format",
                sender: 'bot',
                rawData: botResponse // Store full payload for debugging
            };

            conversations[conversationId].push(botMessage);
            console.log('Processed bot message:', botMessage);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true })
            };
        } catch (error) {
            console.error('Webhook error:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: error.message })
            };
        }
    }

    return { statusCode: 405, headers, body: 'Method Not Allowed' };
};