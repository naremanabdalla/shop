/* eslint-env node */
export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_j47qAbJPowRIOXPInfJn0ZdKKWYZvkUdxL13";

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

        // ✅ Fix: move .netlify/functions/... outside the fallback value
        await fetch(`${process.env.URL || "https://shopping022.netlify.app"}/.netlify/functions/botpress-webhook`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: textResponse
        });

        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: textResponse
        };
    } catch (error) {
        console.error('Proxy error:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                error: "Failed to reach Botpress",
                details: error.message
            })
        };
    }
};
