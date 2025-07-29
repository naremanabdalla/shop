// botpress-proxy.js
const isProduction = typeof process !== 'undefined' && process.env.NETLIFY === 'true';

export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    try {
        const payload = JSON.parse(event.body || '{}');

        // Enhanced validation
        if (!payload.text && !(payload.payload?.text)) {
            throw new Error("Missing required text content");
        }

        // Proper Botpress payload structure
        const botpressPayload = {
            type: payload.type || "text",
            text: payload.text || payload.payload?.text || "",
            userId: payload.userId || `anon-${Math.random().toString(36).substr(2, 9)}`,
            conversationId: payload.conversationId || `conv-${Date.now()}`,
            payload: {
                type: "text",
                text: payload.text || payload.payload?.text || ""
            },
            channel: "web",
            metadata: {
                ...(payload.metadata || {}),
                website: "https://shopping022.netlify.app/",
                userAgent: payload.deviceInfo?.userAgent || "unknown",
                isMobile: payload.deviceInfo?.isMobile || false
            }
        };

        if (!isProduction) {
            console.log("Sending to Botpress:", JSON.stringify(botpressPayload, null, 2));
        }

        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(botpressPayload)
        });

        const responseData = await response.json();

        // Check for Botpress-specific errors
        if (!response.ok || responseData.code >= 400) {
            throw new Error(responseData.message || `Botpress error: ${response.status}`);
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
            statusCode: error.message.includes("400") ? 400 : 500,
            headers,
            body: JSON.stringify({
                error: "Failed to process request",
                details: error.message,
                ...(!isProduction && { stack: error.stack })
            })
        };
    }
};