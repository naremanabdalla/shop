import { db } from "../../src/auth/firebse"; // Your Firebase initialization file

export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    try {
        const payload = JSON.parse(event.body);
        const { userId, conversationId } = payload;

        if (!userId) {
            throw new Error('Missing userId');
        }

        // Enhanced payload with conversation tracking
        const enhancedPayload = {
            ...payload,
            conversationVersion: payload.conversationVersion || 0,
            // Add device info for debugging
            metadata: {
                ...(payload.metadata || {}),
                timestamp: Date.now(),
                userAgent: event.headers['user-agent']
            }
        };

        // 1. Forward to Botpress
        const bpResponse = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(enhancedPayload),
        });

        if (!bpResponse.ok) throw new Error(`Botpress error: ${bpResponse.status}`);

        // 2. Store in Firebase for cross-device access
        if (conversationId && userId) {
            await db.collection('conversations')
                .doc(conversationId)
                .collection('messages')
                .add({
                    ...enhancedPayload,
                    direction: 'outgoing',
                    timestamp: Date.now()
                });
        }

        return {
            statusCode: 200,
            headers,
            body: await bpResponse.text()
        };
    } catch (error) {
        console.error('Proxy error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Failed to process message",
                details: error.message
            })
        };
    }
};