export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/772fb704-48bc-435c-8b83-23d299738100";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    try {
        const payload = JSON.parse(event.body);

        // Add conversation version to payload
        const enhancedPayload = {
            ...payload,
            conversationVersion: payload.conversationVersion || 0
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

        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: await response.text()
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