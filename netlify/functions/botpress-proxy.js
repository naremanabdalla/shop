export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    try {
        const payload = JSON.parse(event.body);

        console.log("Forwarding to Botpress:", JSON.stringify(payload, null, 2));

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

        if (!response.ok) {
            throw new Error(`Botpress responded with ${response.status}`);
        }

        const responseText = await response.text();
        console.log("Botpress raw response:", responseText);

        // Try to parse JSON, fallback to raw text if fails
        try {
            const responseData = JSON.parse(responseText);
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify(responseData)
            };
        } catch (e) {
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: responseText
            };
        }

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