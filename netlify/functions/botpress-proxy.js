export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    try {
        // Parse incoming payload
        const payload = JSON.parse(event.body);
        
        // Validate required fields
        if (!payload.text || typeof payload.text !== 'string') {
            throw new Error("Missing or invalid 'text' in payload");
        }

        // Construct proper Botpress message format
        const botpressMessage = {
            type: 'text',
            text: payload.text,
            userId: payload.userId || `anon-${Date.now()}`,
            conversationId: payload.conversationId || 'default',
            channel: 'web',
            payload: payload.payload || {}
        };

        // Send to Botpress
        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${BOTPRESS_TOKEN}`
            },
            body: JSON.stringify(botpressMessage),
        });

        // Handle text responses that might not be JSON
        const responseText = await response.text();
        let responseData;
        
        try {
            responseData = JSON.parse(responseText);
        } catch {
            // If not JSON, return the raw text
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    text: responseText,
                    rawResponse: responseText
                })
            };
        }

        if (!response.ok) {
            console.error('Botpress error:', responseData);
            throw new Error(responseData.message || `Botpress returned ${response.status}`);
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
                error: "Failed to process request",
                details: error.message
            })
        };
    }
};