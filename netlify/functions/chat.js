export const handler = async (event) => {
  // CORS configuration for local development
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const { messages, model, temperature, max_tokens } = body;
    const API_KEY = process.env.OPENROUTER_API_KEY;

    if (!API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "OPENROUTER_API_KEY is not set in Netlify Environment Variables." }),
      };
    }

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid request: 'messages' should be an array." }),
      };
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": "https://smartdigitalkampur.netlify.app/", // Required by OpenRouter for free models
        "X-Title": "Smart Digital"
      },
      body: JSON.stringify({
        model: model || "stepfun/step-3-5-flash",
        temperature: temperature !== undefined ? temperature : 0.4,
        max_tokens: max_tokens || 1000,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: errData.error?.message || `OpenRouter API Error: ${response.status}` }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Netlify Function Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error: Failed to connect to OpenRouter AI." }),
    };
  }
};
