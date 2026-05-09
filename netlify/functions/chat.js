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

  const { messages, model, temperature, max_tokens, response_format, no_fallback } = body;

  if (!messages || !Array.isArray(messages)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request: 'messages' should be an array." }) };
  }

  const GROQ_KEY = process.env.GROQ_API_KEY;
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  const allowFallback = no_fallback !== true;

  if (!GROQ_KEY && !(allowFallback && ANTHROPIC_KEY)) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "No AI provider key available for this request." }) };
  }

  // 1) Try Groq first
  let lastGroqError = null;
  if (GROQ_KEY) {
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
      lastGroqError = { status: r.status, message: errData.error?.message || `Groq API Error: ${r.status}` };
      if (!allowFallback) {
        return { statusCode: r.status, headers, body: JSON.stringify({ error: lastGroqError.message }) };
      }
      console.warn(`Groq failed (${r.status}). Falling back to Claude.`);
    } catch (err) {
      lastGroqError = { status: 502, message: err?.message || "Groq network error" };
      if (!allowFallback) {
        return { statusCode: 502, headers, body: JSON.stringify({ error: "Groq is unreachable." }) };
      }
      console.warn("Groq network error. Falling back to Claude.", err?.message);
    }
  }

  // 2) Fall back to Claude (Anthropic) — skipped when caller sent no_fallback: true
  if (!allowFallback) {
    return { statusCode: lastGroqError?.status || 500, headers, body: JSON.stringify({ error: lastGroqError?.message || "Groq unavailable." }) };
  }
  if (!ANTHROPIC_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Groq failed and ANTHROPIC_API_KEY is not set." }) };
  }

  try {
    const wantsJson = response_format?.type === "json_object";
    const systemParts = messages.filter((m) => m.role === "system").map((m) => m.content);
    if (wantsJson) systemParts.push("You must respond with a single valid JSON object only. No prose, no markdown, no code fences.");
    const systemPrompt = systemParts.join("\n\n");

    const claudeMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content ?? "") }));

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: max_tokens || 1000,
        temperature: temperature !== undefined ? temperature : 0.4,
        ...(systemPrompt ? { system: systemPrompt } : {}),
        messages: claudeMessages,
      }),
    });

    if (!r.ok) {
      const errData = await r.json().catch(() => ({}));
      return { statusCode: r.status, headers, body: JSON.stringify({ error: errData.error?.message || `Claude API Error: ${r.status}` }) };
    }

    const data = await r.json();
    const text = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");

    // Normalize to OpenAI shape so all existing apps keep working unchanged
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: data.id,
        model: data.model,
        provider: "anthropic-fallback",
        choices: [{ index: 0, message: { role: "assistant", content: text }, finish_reason: data.stop_reason || "stop" }],
        usage: data.usage
          ? { prompt_tokens: data.usage.input_tokens, completion_tokens: data.usage.output_tokens, total_tokens: (data.usage.input_tokens || 0) + (data.usage.output_tokens || 0) }
          : undefined,
      }),
    };
  } catch (error) {
    console.error("Claude fallback error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Both Groq and Claude failed." }) };
  }
};
