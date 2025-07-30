export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    try {
        const payload = JSON.parse(event.body);
        
        // Generate consistent session IDs
        const sessionId = payload.userId || `anon-${Date.now()}`;
        const conversationId = payload.conversationId || `conv-${sessionId}-${Date.now()}`;

        const botpressPayload = {
            type: "text",
            text: payload.text,
            userId: sessionId,
            conversationId: conversationId,
            payload: {
                text: payload.text,
                type: "text",
                deviceInfo: payload.deviceInfo || {}
            },
            channel: "web"
        };

        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(botpressPayload)
        });

        const responseData = await response.json();

        return {
            statusCode: response.ok ? 200 : 502,
            headers,
            body: JSON.stringify({
                ...responseData,
                conversationId: conversationId // Return the conversation ID
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Failed to process request",
                message: error.message
            })
        };
    }
};