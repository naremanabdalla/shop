export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    // ✅ Define CORS headers (all browsers and devices will need this)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
    };

    try {
        const payload = JSON.parse(event.body);

        const enhancedPayload = {
            ...payload,
            type: payload.type || "text",
            conversationVersion: payload.conversationVersion || 0,
            userId: payload.userId,
            conversationId: payload.conversationId
        };

        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(enhancedPayload),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const textResponse = await response.text();

        // ✅ Dynamic site origin for internal call
        const siteUrl =
            event.headers['x-forwarded-host'] ||
            event.headers.host ||
            "shopping022.netlify.app";
        const protocol = event.headers['x-forwarded-proto'] || 'https';

        await fetch(`${protocol}://${siteUrl}/.netlify/functions/botpress-webhook`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: textResponse
        });

        return {
            statusCode: 200,
            headers,
            body: textResponse
        };
    } catch (error) {
        console.error('Proxy error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Failed to reach Botpress",
                details: error.message
            })
        };
    }
};
