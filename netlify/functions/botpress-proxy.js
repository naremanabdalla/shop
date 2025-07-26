export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    try {
        const payload = JSON.parse(event.body);

        console.log("Forwarding to Botpress:", JSON.stringify(payload, null, 2));

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
                conversationId: payload.conversationId,
                messageId: payload.messageId,
                payload: {
                    ...payload.payload,
                    metadata: {
                        userId: payload.userId,
                        website: "https://shopping022.netlify.app/"
                    }
                }
            })
        });

        const responseText = await response.text();
        console.log("Raw Botpress response:", responseText);

        if (!response.ok) {
            throw new Error(`Botpress error: ${response.status} - ${responseText}`);
        }

        // Forward the exact Botpress response
        return {
            statusCode: 200,
            headers,
            body: responseText // Forward as-is
        };

    } catch (error) {
        console.error('Proxy error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Proxy error",
                details: error.message
            })
        };
    }
};