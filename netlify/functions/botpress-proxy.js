export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    console.log("Incoming request:", event); // Debug log

    try {
        // Parse payload safely
        const payload = JSON.parse(event.body || '{}');
        console.log("Parsed payload:", payload);

        // Validate required fields
        const messageText = payload.text || payload.payload?.text;
        if (!messageText) {
            console.error("Validation failed: Missing text");
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Message text is required" })
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
                text: messageText
            },
            channel: "web"
        };

        console.log("Sending to Botpress:", botpressPayload);

        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(botpressPayload),
            timeout: 5000 // 5 second timeout
        });

        const responseData = await response.json();
        console.log("Botpress response:", responseData);

        if (!response.ok) {
            throw new Error(responseData.message || `Botpress error: ${response.status}`);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(responseData)
        };
    } catch (error) {
        console.error("Critical error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Failed to process request",
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};