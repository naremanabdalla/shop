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
        // Parse and validate incoming payload
        let payload;
        try {
            payload = JSON.parse(event.body);
            if (!payload.text || !payload.userId) {
                throw new Error('Missing required fields');
            }
        } catch (parseError) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Invalid request body',
                    details: parseError.message
                })
            };
        }

        // Prepare Botpress payload
        const bpPayload = {
            type: "text",
            text: payload.text,
            userId: payload.userId,
            conversationId: payload.conversationId || `conv-${Date.now()}`,
            payload: {
                metadata: {
                    userId: payload.userId,
                    website: "https://shopping022.netlify.app/"
                }
            }
        };

        // Make request to Botpress
        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bpPayload),
            timeout: 5000 // Add timeout
        });

        // Handle Botpress response
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Botpress responded with ${response.status}: ${errorText}`);
        }

        const responseData = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(responseData)
        };

    } catch (error) {
        console.error('Proxy error details:', {
            error: error.message,
            stack: error.stack,
            event: event
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