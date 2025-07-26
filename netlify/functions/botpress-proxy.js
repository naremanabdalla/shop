export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    try {
        const payload = JSON.parse(event.body);

        console.log("Outgoing payload to Botpress:", JSON.stringify(payload, null, 2));

        const bpResponse = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "text",
                text: payload.text,
                userId: payload.userId,
                conversationId: payload.conversationId,
                payload: {
                    ...payload.payload,
                    metadata: {
                        userId: payload.userId,
                        website: "https://shopping022.netlify.app/"
                    }
                }
            }),
        });

        const responseText = await bpResponse.text();
        console.log("Botpress raw response:", responseText);

        if (!bpResponse.ok) {
            throw new Error(`Botpress error: ${bpResponse.status} - ${responseText}`);
        }

        return {
            statusCode: 200,
            headers,
            body: responseText
        };

    } catch (error) {
        console.error('Proxy error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Failed to process request",
                details: error.message
            })
        };
    }
};