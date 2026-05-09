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
    no_fallback,
    provider,        // "anthropic" → skip Groq, go straight to Claude
    system,          // optional separate system prompt (Anthropic-native style)
    prefill_json,    // when true, prefills the assistant turn with "{" so Claude
                     // is forced to continue valid JSON. The "{" is stitched
                     // back onto the response so callers parse complete JSON.
  } = body;

  if (!messages || !Array.isArray(messages)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request: 'messages' should be an array." }) };
  }

  const GROQ_KEY = process.env.GROQ_API_KEY;
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

  // ─────────────────────────────────────────────────────────────
  // BRANCH A: Direct Claude (used by examcraft Assamese + vision)
  // Returns Claude's NATIVE response shape so callers can keep
  // reading data.content[0].text unchanged.
  // ─────────────────────────────────────────────────────────────
  if (provider === "anthropic") {
    if (!ANTHROPIC_KEY) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "ANTHROPIC_API_KEY is not set on the server." }) };
    }

    // Allow caller to pass either Anthropic-native messages (content arrays for vision)
    // or OpenAI-style (string content with role "system" mixed in). Normalize.
    const inlineSystemParts = messages.filter((m) => m.role === "system").map((m) => m.content).filter(Boolean);
    const claudeMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));
    const systemPrompt = [system, ...inlineSystemParts].filter(Boolean).join("\n\n");

    // Prefill the assistant turn with "{" so Claude must continue with valid JSON.
    // Without this, Sonnet/Haiku occasionally wrap output in prose or markdown
    // fences which then fail JSON.parse on the client.
    if (prefill_json) {
      claudeMessages.push({ role: "assistant", content: "{" });
    }

    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: model || "claude-sonnet-4-6",
          max_tokens: max_tokens || 4096,
          temperature: temperature !== undefined ? temperature : 0.4,
          ...(systemPrompt ? { system: systemPrompt } : {}),
          messages: claudeMessages,
        }),
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        return { statusCode: r.status, headers, body: JSON.stringify({ error: data.error?.message || `Claude API Error: ${r.status}` }) };
      }
      // Stitch the prefilled "{" back onto the first text block so callers
      // reading data.content[0].text get a complete JSON document.
      if (prefill_json && Array.isArray(data.content) && data.content[0]?.type === "text") {
        data.content[0].text = "{" + (data.content[0].text || "");
      }
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    } catch (error) {
      console.error("Direct Claude call failed:", error);
      return { statusCode: 502, headers, body: JSON.stringify({ error: "Claude is unreachable." }) };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // BRANCH B: Groq with optional Claude fallback (default path)
  // ─────────────────────────────────────────────────────────────
  const allowFallback = no_fallback !== true;

  if (!GROQ_KEY && !(allowFallback && ANTHROPIC_KEY)) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "No AI provider key available for this request." }) };
  }

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

  if (!allowFallback) {
    return { statusCode: lastGroqError?.status || 500, headers, body: JSON.stringify({ error: lastGroqError?.message || "Groq unavailable." }) };
  }
  if (!ANTHROPIC_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Groq failed and ANTHROPIC_API_KEY is not set." }) };
  }

  try {
    const wantsJson = response_format?.type === "json_object" || prefill_json === true;
    const systemParts = messages.filter((m) => m.role === "system").map((m) => m.content);
    if (wantsJson) systemParts.push("You must respond with a single valid JSON object only. No prose, no markdown, no code fences.");
    const systemPrompt = systemParts.join("\n\n");

    const claudeMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content ?? "") }));

    // Prefill assistant turn with "{" when JSON is expected — forces Claude to
    // continue valid JSON instead of prose/markdown wrappers.
    if (wantsJson) {
      claudeMessages.push({ role: "assistant", content: "{" });
    }

    // Floor max_tokens for the fallback Claude path. Groq's response_format gives
    // tight JSON, but Claude's JSON is wordier — a 1200-token cap (the typical
    // examcraft estimate for a 10-question English paper) routinely truncates
    // mid-JSON, which is unrecoverable on the client.
    const fallbackMaxTokens = wantsJson
      ? Math.max(max_tokens || 1000, 2500)
      : (max_tokens || 1000);

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: fallbackMaxTokens,
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
    let text = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
    if (wantsJson) text = "{" + text;

    // Fallback path normalizes to OpenAI shape so apps reading data.choices[0].message.content keep working
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
