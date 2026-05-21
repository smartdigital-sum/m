export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: "Method Not Allowed" };

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON body." }) };
  }

  const {
    messages,
    model,
    temperature,
    max_tokens,
    response_format,
  } = body;

  if (!messages || !Array.isArray(messages)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request: 'messages' should be an array." }) };
  }

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "GROQ_API_KEY is not set on the server." }) };
  }

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model: model || "llama-3.3-70b-versatile",
        temperature: temperature !== undefined ? temperature : 0.4,
        max_tokens: max_tokens || 1000,
        messages,
        ...(response_format ? { response_format } : {}),
      }),
    });

    if (r.ok) {
      const data = await r.json();
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }
    const errData = await r.json().catch(() => ({}));
    return { statusCode: r.status, headers, body: JSON.stringify({ error: errData.error?.message || `Groq API Error: ${r.status}` }) };
  } catch (err) {
    console.error("Groq call failed:", err);
    return { statusCode: 502, headers, body: JSON.stringify({ error: "Groq is unreachable." }) };
  }
};
