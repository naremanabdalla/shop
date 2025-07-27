import { db } from '../../src/auth/firebse'; // Make sure path is correct

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    try {
        // Handle GET requests (polling from frontend)
        if (event.httpMethod === 'GET') {
            const { userId, lastTimestamp } = event.queryStringParameters || {};
            
            if (!userId) {
                throw new Error('Missing userId');
            }

            // Query messages from Firestore
            const messagesRef = db.collection('conversations')
                .doc(userId)
                .collection('messages')
                .orderBy('timestamp', 'asc');

            const snapshot = await messagesRef.get();
            const allMessages = snapshot.docs.map(doc => doc.data());

            // Filter by timestamp if provided
            const newMessages = lastTimestamp 
                ? allMessages.filter(msg => msg.timestamp > parseInt(lastTimestamp))
                : allMessages;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    messages: newMessages,
                    lastTimestamp: newMessages.length > 0 
                        ? Math.max(...newMessages.map(m => m.timestamp))
                        : lastTimestamp || Date.now()
                })
            };
        }

        // Handle POST requests (from Botpress webhook)
        if (event.httpMethod === 'POST') {
            const botResponse = JSON.parse(event.body);
            const { userId } = botResponse;

            if (!userId) {
                throw new Error('Missing userId in webhook payload');
            }

            const botMessage = {
                id: botResponse.messageId || `msg-${Date.now()}`,
                text: botResponse.payload?.text || botResponse.text || "Bot response",
                sender: 'bot',
                rawData: botResponse,
                timestamp: Date.now()
            };

            // Store in Firestore
            await db.collection('conversations')
                .doc(userId)
                .collection('messages')
                .add(botMessage);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Webhook error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Internal server error",
                details: error.message
            })
        };
    }
};