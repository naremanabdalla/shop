export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";


    try {
        const payload = JSON.parse(event.body);

        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: payload.type || "text",
                text: payload.text,
                userId: payload.userId,
                conversationId: payload.conversationId,
                payload: payload.payload
            }),
        });
        console.log("Forwarding to Botpress:", JSON.stringify(payload));
        console.log("Botpress responded:", JSON.stringify(responseData));
        const responseData = await response.json();

        // Forward the Botpress response exactly
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
                error: "Failed to reach Botpress",
                details: error.message
            })
        };
    }
};