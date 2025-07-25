// netlify/functions/botpress-proxy.js
export const handler = async (event) => {
    // 1. Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
    };

    // 2. Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    // 3. Validate request method
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    // 4. Parse and validate body
    let payload;
    try {
        payload = JSON.parse(event.body);

        if (!payload.text || typeof payload.text !== 'string') {
            throw new Error('Missing or invalid "text" field');
        }

        if (!payload.userId || typeof payload.userId !== 'string') {
            throw new Error('Missing or invalid "userId" field');
        }
    } catch (error) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: `Invalid request: ${error.message}` })
        };
    }

    // 5. Configure Botpress request (USE YOUR ACTUAL OUTGOING URL)
    const BOTPRESS_URL = "https://webhook.botpress.cloud/772fb704-48bc-435c-8b83-23d299738100";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    // 6. Construct proper Botpress payload
    const botpressPayload = {
        type: "text",
        text: payload.text,
        userId: payload.userId,
        conversationId: payload.conversationId || "default",
        messageId: payload.messageId || `msg-${Date.now()}`,
        payload: {
            ...(payload.payload || {}),
            website: "https://shopping022.netlify.app/"
        }
    };

    try {
        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(botpressPayload)
        });

        // 7. Handle Botpress response
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Botpress responded with ${response.status}: ${errorBody}`);
        }

        return {
            statusCode: 200,
            headers,
            body: await response.text()
        };
    } catch (error) {
        console.error('Proxy error:', {
            error: error.message,
            input: payload,
            botpressPayload
        });

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Failed to communicate with Botpress",
                details: error.message
            })
        };
    }
};