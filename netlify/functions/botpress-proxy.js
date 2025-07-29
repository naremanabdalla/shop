// Top of botpress-proxy.js
const isProduction = typeof process !== 'undefined' && process.env.NETLIFY === 'true';

export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    try {
        const payload = JSON.parse(event.body || '{}');

        if (!payload.text && !(payload.payload && payload.payload.text)) {
            throw new Error("Missing required text content");
        }

        const botpressPayload = {
            // ... (keep your existing payload structure)
        };

        if (!isProduction) {
            console.log("Sending to Botpress:", JSON.stringify(botpressPayload, null, 2));
        }

        const response = await fetch(BOTPRESS_URL, {
            // ... (keep your existing fetch options)
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(`Botpress API error: ${response.status}`);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: responseData
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Failed to process request",
                details: error.message,
                ...(!isProduction && { stack: error.stack })
            })
        };
    }
};