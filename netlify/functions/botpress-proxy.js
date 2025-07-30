// botpress-proxy.js - SIMPLIFIED VERSION WITHOUT PROCESS CHECKS
export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ status: 'OK' })
        };
    }

    try {
        const payload = JSON.parse(event.body || '{}');
console.log("Received payload:", payload);
        // Validate payload
        if (!payload.text && !payload.payload?.text) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Message text is required" })
            };
        }

        // Build Botpress payload
        const botpressPayload = {
            type: "text",
            text: payload.text || payload.payload?.text,
            userId: payload.userId || `user-${Date.now()}`,
            conversationId: payload.conversationId || `conv-${Date.now()}`,
            payload: {
                type: "text",
                text: payload.text || payload.payload?.text
            },
            channel: "web"
        };

        console.log("Debug: Sending to Botpress", botpressPayload); // Basic log

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
            statusCode: response.status,
            headers,
            body: JSON.stringify(responseData)
        };

    } catch (error) {
        console.error("Error in proxy:", error);
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