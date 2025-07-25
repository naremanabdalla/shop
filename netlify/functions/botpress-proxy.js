// netlify/functions/botpress-proxy.js
export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhost.botpress.cloud/77210704-480c-435c-8083-2262997/36180"; // Use OUTGOING URL
    const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

    try {
        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: event.body,
        });

        const data = await response.json();
        console.log('Botpress proxy response:', data);

        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: "Proxy error: " + error.message })
        };
    }
};