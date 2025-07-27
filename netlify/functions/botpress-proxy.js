export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    try {
        const payload = JSON.parse(event.body);
        
        // Validate required fields
        if (!payload.text || !payload.messageId) {
            throw new Error("Missing required fields (text or messageId)");
        }

        // Construct proper Botpress message
        const botpressMessage = {
            type: payload.type || 'text',
            text: payload.text,
            userId: payload.userId,
            messageId: payload.messageId, // Forward the messageId
            conversationId: payload.conversationId || 'default',
            channel: 'web',
            payload: payload.payload || {}
        };

        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${BOTPRESS_TOKEN}`
            },
            body: JSON.stringify(botpressMessage),
        });

        const responseData = await response.json();
        
        if (!response.ok) {
            console.error('Botpress error:', responseData);
            throw new Error(responseData.message || `Botpress returned ${response.status}`);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(responseData)
        };

    } catch (error) {
        console.error('Proxy error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Failed to process request",
                details: error.message
            })
        };
    }
};