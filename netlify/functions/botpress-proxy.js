export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    try {
        // Parse incoming payload
        let payload;
        try {
            payload = JSON.parse(event.body);
        } catch (e) {
            console.log(e);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Invalid JSON payload" })
            };
        }

        // Make request to Botpress
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
                payload: {
                    ...payload.payload,
                    metadata: {
                        userId: payload.userId,
                        website: "https://shopping022.netlify.app/"
                    }
                }
            })
        });

        // Handle response carefully
        const responseText = await response.text();
        let responseData;

        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            console.log(e);
            // If not JSON, create a valid response format
            responseData = {
                responses: [{
                    type: "text",
                    text: responseText,
                    payload: {
                        text: responseText
                    }
                }]
            };
        }

        if (!response.ok) {
            console.error("Botpress error:", responseData);
            throw new Error(responseData.error || "Botpress returned an error");
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(responseData)
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