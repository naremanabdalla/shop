export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    try {
        const payload = JSON.parse(event.body);

        // Generate messageId if not provided
        const messageId = payload.messageId || `msg-${Date.now()}`;

        const botpressPayload = {
            type: "text",
            text: payload.text,
            userId: payload.userId,
            conversationId: payload.conversationId,
            messageId: messageId,  // Ensure this is included
            payload: {
                ...payload.payload,
                metadata: {
                    userId: payload.userId,
                    website: "https://shopping022.netlify.app/"
                }
            }
        };

        console.log("Sending to Botpress:", JSON.stringify(botpressPayload, null, 2));

        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(botpressPayload),
        });

        const responseText = await response.text();

        if (!response.ok) {
            console.log("Botpress raw response:", responseText);
            // Add this before returning
            console.log("Final proxy response:", {
                statusCode: 200,
                body: responseText
            }); throw new Error(`Botpress responded with ${response.status}`);
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