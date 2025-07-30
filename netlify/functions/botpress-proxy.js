export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ status: 'OK' })
        };
    }

    try {
        // Store the raw body before any parsing attempts
        const rawBody = event.body;
        
        // Parse the body just once
        let payload;
        try {
            payload = JSON.parse(rawBody);
        } catch (e) {
            console.error("JSON parse error:", e);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: "Invalid JSON format",
                    receivedBody: rawBody
                })
            };
        }

        // Validate required fields
        const messageText = payload.text || (payload.payload && payload.payload.text);
        if (!messageText) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: "Message text is required",
                    receivedPayload: payload
                })
            };
        }

        // Construct Botpress payload
        const botpressPayload = {
            type: "text",
            text: messageText,
            userId: payload.userId || `user-${Date.now()}`,
            conversationId: payload.conversationId || `conv-${Date.now()}`,
            payload: {
                type: "text",
                text: messageText,
                ...(payload.deviceInfo || {})
            },
            channel: "web"
        };

        console.log("Sending to Botpress:", botpressPayload);

        // Make request to Botpress
        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(botpressPayload)
        });

        // Handle response (read only once)
        const responseText = await response.text();
        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch {
            responseData = { text: responseText };
        }

        if (!response.ok) {
            console.error("Botpress API error:", response.status, responseData);
            throw new Error(responseData.message || `Botpress error: ${response.status}`);
        }

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
                error: "Failed to process request",
                message: error.message
            })
        };
    }
};