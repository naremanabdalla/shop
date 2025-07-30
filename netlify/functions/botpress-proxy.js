export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    console.log("Received event:", JSON.stringify({
        method: event.httpMethod,
        path: event.path,
        body: event.body
    }, null, 2));

    try {
        // 1. Parse the incoming payload
        let payload;
        try {
            payload = JSON.parse(event.body || '{}');
        } catch (e) {
            console.error("JSON parse error:", e);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Invalid JSON format" })
            };
        }

        // 2. Validate required fields
        const messageText = payload.text || payload.payload?.text;
        if (!messageText) {
            console.error("Missing text field");
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: "Message text is required",
                    received: payload
                })
            };
        }

        // 3. Prepare Botpress payload
        const botpressPayload = {
            type: "text",
            text: messageText,
            userId: payload.userId || `user-${Date.now()}`,
            conversationId: payload.conversationId || `conv-${Date.now()}`,
            payload: {
                type: "text",
                text: messageText
            },
            channel: "web"
        };

        console.log("Sending to Botpress:", botpressPayload);

        // 4. Make the request to Botpress
        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(botpressPayload)
        });

        // 5. Handle the response
        let responseData;
        try {
            responseData = await response.json();
        } catch (e) {
            console.error("Failed to parse Botpress response:", e);
            responseData = { error: "Invalid response from Botpress" };
        }

        if (!response.ok) {
            console.error("Botpress error:", response.status, responseData);
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
                message: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};