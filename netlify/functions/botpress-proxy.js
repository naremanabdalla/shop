export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ status: 'OK' })
        };
    }

    try {
        // Safely parse incoming payload
        let payload;
        try {
            payload = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        } catch (e) {
            console.error("JSON parse error:", e);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Invalid JSON payload" })
            };
        }

        // Validate required fields
        if (!payload.text) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Message text is required" })
            };
        }

        // Construct Botpress payload
        const botpressPayload = {
            type: "text",
            text: payload.text,
            userId: payload.userId || `user-${Date.now()}`,
            conversationId: payload.conversationId || `conv-${Date.now()}`,
            payload: {
                type: "text",
                text: payload.text,
                ...(payload.deviceInfo || {})
            },
            channel: "web"
        };

        console.log("Sending to Botpress:", JSON.stringify(botpressPayload, null, 2));

        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(botpressPayload)
        });

        // Handle both JSON and non-JSON responses
        let responseData;
        try {
            responseData = await response.json();
        } catch (e) {
            console.warn("Non-JSON response from Botpress:", await response.text());
            responseData = { text: "Received non-JSON response" };
        }

        if (!response.ok) {
            console.error("Botpress API error:", response.status, responseData);
            throw new Error(responseData.message || `Botpress returned ${response.status}`);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                ...responseData,
                conversationId: botpressPayload.conversationId
            })
        };

    } catch (error) {
        console.error("Proxy error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Failed to process request",
                message: error.message,
                ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
            })
        };
    }
};