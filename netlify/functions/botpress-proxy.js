export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    try {
        // Parse and validate the incoming request
        const payload = JSON.parse(event.body);
        console.log('Received payload:', payload);

        // Construct the proper Botpress message format
        const botpressMessage = {
            type: 'text',
            text: payload.text,
            userId: payload.userId,
            conversationId: payload.conversationId,
            channel: 'web',
            payload: payload.payload || {}
        };

        console.log('Sending to Botpress:', botpressMessage);

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
            throw new Error(`Botpress returned ${response.status}`);
        }

        console.log('Botpress response:', responseData);
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(responseData)
        };
    } catch (error) {
        console.error('Proxy error:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                error: "Failed to process request",
                details: error.message
            })
        };
    }
};