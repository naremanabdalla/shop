// netlify/functions/botpress-webhook.js

export const handler = async (event) => {
    // 1. Verify this is a Botpress request
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' }
    }

    // 2. Parse the bot's response
    const botMessage = JSON.parse(event.body);
    console.log('Bot says:', botMessage.text);

    // 3. Return success (Botpress expects HTTP 200)
    return {
        statusCode: 200,
        body: JSON.stringify({ received: true })
    };
};