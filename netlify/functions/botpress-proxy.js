export const handler = async (event) => {
  const BOTPRESS_URL = "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b";
  const BOTPRESS_TOKEN = "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD";

  try {
    // Forward the exact same payload to Botpress
    const response = await fetch(BOTPRESS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BOTPRESS_TOKEN}`
      },
      body: event.body // Forward the exact same body
    });

    if (!response.ok) throw new Error(`Botpress returned ${response.status}`);

    // Return the raw Botpress response
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: await response.text()
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: "Failed to communicate with Botpress",
        details: error.message
      })
    };
  }
};