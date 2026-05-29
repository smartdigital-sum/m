// ================================================================
// Smart Digital ExamCraft — Razorpay: Verify Payment (server-side)
// ----------------------------------------------------------------
// Confirms the payment signature is genuine before unlocking. The
// signature can only be reproduced with the secret key, so a faked
// success from the browser will fail here.
// Requires Netlify env var: RAZORPAY_KEY_SECRET
// ================================================================

import crypto from "node:crypto";

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

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return { statusCode: 400, headers, body: JSON.stringify({ verified: false, error: "Missing payment fields." }) };
  }

  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
  if (!KEY_SECRET) {
    return { statusCode: 500, headers, body: JSON.stringify({ verified: false, error: "Razorpay secret is not set on the server." }) };
  }

  const expected = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  let verified = false;
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(razorpay_signature, "utf8");
    verified = a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    verified = false;
  }

  return {
    statusCode: verified ? 200 : 400,
    headers,
    body: JSON.stringify({ verified }),
  };
};
