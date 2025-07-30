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
        // Parse the incoming payload
        let payload;
        try {
            payload = JSON.parse(event.body || '{}');
        } catch (e) {console.log(e)
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Invalid JSON payload" })
            };
        }

        // Validate required fields
        if (!payload.text && !(payload.payload && payload.payload.text)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Message text is required" })
            };
        }

        // Construct the Botpress payload
        const botpressPayload = {
            type: payload.type || "text",
            text: payload.text || payload.payload?.text || "",
            userId: payload.userId || `user-${Date.now()}`,
            conversationId: payload.conversationId || `conv-${Date.now()}`,
            payload: {
                type: "text",
                text: payload.text || payload.payload?.text || ""
            },
            channel: "web",
            metadata: {
                website: "https://shopping022.netlify.app/",
                ts: Date.now()
            }
        };

        console.log("Sending to Botpress:", JSON.stringify(botpressPayload, null, 2));

        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(botpressPayload)
        });

        // Handle non-JSON responses
        const responseText = await response.text();
        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch {
            responseData = { message: responseText };
        }

        if (!response.ok) {
            console.error("Botpress API error:", responseData);
            throw new Error(responseData.message || `Botpress returned ${response.status}`);
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