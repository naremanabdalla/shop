export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/YOUR_WEBHOOK";
    const BOTPRESS_TOKEN = "YOUR_TOKEN";

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
        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${BOTPRESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`Botpress error: ${response.status}`);

        return {
            statusCode: 200,
            headers,
            body: await response.text()
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};