// ================================================================
// Smart Digital ExamCraft — Razorpay: Create Order (server-side)
// ----------------------------------------------------------------
// Prices are computed HERE from a fixed table so the browser can
// never tamper with the amount. Mirrors PLANS in apps/examcraft/app.js.
// Requires Netlify env vars: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
// ================================================================

const GST_RATE = 0.18;
const ANSWER_UPGRADE_BASE_PRICE = 13; // ₹15 checkout total after rounded GST

// Base (pre-GST) prices, indexed by plan id then option index.
const PLAN_PRICES = {
  individual: [
    { qOnly: 25,    qAndA: 38 },
    { qOnly: 106,   qAndA: 169 },
    { qOnly: 296,   qAndA: 508 },
  ],
  answerUpgrade: [
    { qOnly: ANSWER_UPGRADE_BASE_PRICE, qAndA: ANSWER_UPGRADE_BASE_PRICE },
  ],
  group: [
    { qOnly: 508,   qAndA: 762 },
    { qOnly: 1059,  qAndA: 1694 },
    { qOnly: 1694,  qAndA: 2542 },
  ],
  school: [
    { qOnly: 2119,  qAndA: 3178 },
    { qOnly: 6355,  qAndA: 9534 },
    { qOnly: 12711, qAndA: 19068 },
  ],
};

function checkoutTotal(base) {
  const b = Number(base) || 0;
  return b + Math.round(b * GST_RATE);
}

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

  const { planId, optionIdx, includeAnswers, email } = body;

  const plan = PLAN_PRICES[planId];
  if (!plan) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Unknown plan." }) };
  }
  const opt = plan[Number(optionIdx)];
  if (!opt) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Unknown plan option." }) };
  }

  const base =
    planId === "answerUpgrade"
      ? ANSWER_UPGRADE_BASE_PRICE
      : (includeAnswers ? opt.qAndA : opt.qOnly);

  const total = checkoutTotal(base);
  const amountPaise = total * 100; // Razorpay works in paise

  const KEY_ID = process.env.RAZORPAY_KEY_ID;
  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
  if (!KEY_ID || !KEY_SECRET) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Razorpay keys are not set on the server." }) };
  }

  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");

  try {
    const r = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: `ec_${Date.now()}`,
        notes: {
          planId,
          optionIdx: String(optionIdx),
          includeAnswers: String(!!includeAnswers),
          email: email || "",
        },
      }),
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      return { statusCode: r.status, headers, body: JSON.stringify({ error: data?.error?.description || `Razorpay order failed (${r.status})` }) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        orderId: data.id,
        amount: amountPaise,
        currency: "INR",
        keyId: KEY_ID, // public key, safe to send to the browser
      }),
    };
  } catch (err) {
    console.error("Razorpay order failed:", err);
    return { statusCode: 502, headers, body: JSON.stringify({ error: "Could not reach Razorpay." }) };
  }
};
