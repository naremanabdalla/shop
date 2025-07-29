const isProduction = typeof process !== 'undefined' && process.env.NETLIFY === 'true';

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
        // Parse the incoming payload
        const payload = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

        if (!payload || (!payload.text && !payload.payload?.text)) {
            throw new Error("Message text is required");
        }

        // Construct the Botpress payload
        const botpressPayload = {
            type: "text",
            text: payload.text || payload.payload?.text,
            userId: payload.userId || `user-${Date.now()}`,
            conversationId: payload.conversationId || `conv-${Date.now()}`,
            payload: {
                type: "text",
                text: payload.text || payload.payload?.text
            },
            channel: "web",
            metadata: {
                website: "https://shopping022.netlify.app/",
                userAgent: payload.deviceInfo?.userAgent || "unknown",
                ts: Date.now()
            }
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

        const responseData = await response.json();

        if (!response.ok) {
            console.error("Botpress API error:", responseData);
            throw new Error(responseData.message || `Botpress returned ${response.status}`);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: responseData
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
                ...(isProduction ? {} : { stack: error.stack })
            })
        };
    }
};