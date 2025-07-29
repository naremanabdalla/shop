export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    // Enhanced headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    try {
        // Parse and validate the incoming payload
        const payload = JSON.parse(event.body || '{}');

        if (!payload.text && !payload.type) {
            throw new Error("Missing required fields: text or type");
        }

        // Construct the proper Botpress payload
        const botpressPayload = {
            type: payload.type || "text",
            text: payload.text || "",
            userId: payload.userId || `anon-${Math.random().toString(36).substr(2, 9)}`,
            conversationId: payload.conversationId || `conv-${Date.now()}`,
            payload: payload.payload || {},
            channel: "web",
            metadata: {
                website: "https://shopping022.netlify.app/",
                userAgent: payload.deviceInfo?.userAgent || "unknown",
                isMobile: payload.deviceInfo?.isMobile || false
            }
        };

        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(botpressPayload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Botpress responded with ${response.status}: ${errorText}`);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                botpressResponse: await response.json()
            })
        };
    } catch (error) {
        console.error('Proxy error:', error);
        return {
            statusCode: error.message.includes("400") ? 400 : 500,
            headers,
            body: JSON.stringify({
                error: "Failed to process request",
                details: error.message,
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined
            })
        };
    }
};