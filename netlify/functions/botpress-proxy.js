export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    try {
        const payload = JSON.parse(event.body);

        console.log("Sending to Botpress:", payload);

        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD`
            },
            body: JSON.stringify({
                type: "text",
                text: payload.text,
                userId: payload.userId,
                conversationId: payload.conversationId,
                payload: {
                    metadata: {
                        userId: payload.userId
                    }
                }
            })
        });

        const responseData = await response.json();
        console.log("Botpress response:", responseData);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(responseData)
        };

    } catch (error) {
        console.error("Proxy error:", error);
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