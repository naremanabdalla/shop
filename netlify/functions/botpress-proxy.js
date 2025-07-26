export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    try {
        const payload = JSON.parse(event.body);

        // Send to Botpress
        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type: "text",
                text: payload.text,
                userId: payload.userId,
                conversationId: payload.conversationId
            })
        });

        // Get the raw response text
        const responseText = await response.text();

        // Forward the exact Botpress response
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: responseText
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                error: "Proxy error",
                details: error.message
            })
        };
    }
};