// netlify/functions/botpress-proxy.js
export const handler = async (event) => {
    const BOTPRESS_URL = "https://webhook.botpress.cloud/772fb704-48bc-435c-8b83-23d299738100";
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

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
};