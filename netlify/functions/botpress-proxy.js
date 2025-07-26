export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    // Validate request method
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse and validate payload
        let payload;
        try {
            payload = JSON.parse(event.body);
            if (!payload.text || !payload.userId || !payload.messageId || !payload.conversationId) {
                throw new Error('Missing required fields');
            }
        } catch (parseError) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Invalid request',
                    details: parseError.message,
                    required: ['text', 'userId', 'messageId', 'conversationId']
                })
            };
        }

        // Construct complete Botpress payload
        const bpPayload = {
            type: "text",
            text: payload.text,
            userId: payload.userId,
            conversationId: payload.conversationId,
            messageId: payload.messageId, // Critical missing field
            payload: {
                metadata: {
                    userId: payload.userId,
                    website: "https://shopping022.netlify.app/",
                    // Include all original payload data
                    ...(payload.payload || {})
                }
            }
        };

        console.log("Sending to Botpress:", JSON.stringify(bpPayload, null, 2));

        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bpPayload)
        });

        const responseText = await response.text();

        if (!response.ok) {
            console.error("Botpress error response:", responseText);
            throw new Error(`Botpress error: ${response.status} - ${responseText}`);
        }

        return {
            statusCode: 200,
            headers,
            body: responseText
        };

    } catch (error) {
        console.error('Proxy error:', {
            message: error.message,
            stack: error.stack
        });

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Failed to process request",
                details: error.message,
                type: "proxy_error"
            })
        };
    }
};