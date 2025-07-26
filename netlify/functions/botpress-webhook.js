let conversations = {};

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    if (event.httpMethod === 'GET') {
        const { conversationId, userId, lastTimestamp } = event.queryStringParameters || {};

        // Create conversation key with version if available
        const versionMatch = conversationId?.match(/-(\d+)$/);
        const version = versionMatch ? versionMatch[1] : 0;
        const baseId = versionMatch ? conversationId.slice(0, -versionMatch[0].length) : conversationId;
        const conversationKey = `${userId}-${baseId || "default"}`;

        const convMessages = conversations[conversationKey]?.[version] || [];

        const newMessages = lastTimestamp
            ? convMessages.filter(msg => msg.timestamp > parseInt(lastTimestamp))
            : [];

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

    if (event.httpMethod === 'POST') {
        try {
            const botResponse = JSON.parse(event.body);
            const baseConversationId = botResponse.conversationId?.replace(/-\d+$/, "") || "default";
            const version = botResponse.conversationVersion || 0;
            const conversationKey = `${botResponse.userId}-${baseConversationId}`;

            // Initialize conversation structure if needed
            if (!conversations[conversationKey]) {
                conversations[conversationKey] = {};
            }
            if (!conversations[conversationKey][version]) {
                conversations[conversationKey][version] = [];
            }

            const botMessage = {
                id: botResponse.botpressMessageId || botResponse.messageId || `msg-${Date.now()}`,
                text: botResponse.payload?.text || botResponse.text || "How can I help you?",
                sender: 'bot',
                userId: botResponse.userId,
                rawData: botResponse,
                timestamp: Date.now()
            };

            // Deduplicate before adding
            const exists = conversations[conversationKey][version].some(
                m => m.id === botMessage.id
            );

            if (!exists) {
                conversations[conversationKey][version].push(botMessage);
                // Keep only the last 20 messages per conversation version
                conversations[conversationKey][version] = conversations[conversationKey][version].slice(-20);
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true })
            };
        } catch (error) {
            console.error('Webhook error:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: error.message })
            };
        }
    }

    return { statusCode: 405, headers, body: 'Method Not Allowed' };
};