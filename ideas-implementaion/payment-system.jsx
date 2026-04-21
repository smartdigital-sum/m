import { useState } from "react";

const PLANS = [
  {
    id: "individual",
    icon: "👤",
    label: "Individual Teacher",
    tagline: "Pay per paper, no commitment",
    color: "#E85D26",
    options: [
      { id: "single",  label: "Single Paper",     papers: 1,   qOnly: 19,   qAndA: 30,   tagQ: null,             tagQA: null },
      { id: "pack5",   label: "5 Papers Pack",     papers: 5,   qOnly: 79,   qAndA: 124,  tagQ: "Save ₹16",       tagQA: "Save ₹26" },
      { id: "pack15",  label: "15 Papers Pack",    papers: 15,  qOnly: 199,  qAndA: 314,  tagQ: "Most Popular",   tagQA: "Best Deal" },
    ],
  },
  {
    id: "group",
    icon: "👥",
    label: "Group / Coaching",
    tagline: "For coaching centers & study groups",
    color: "#2563EB",
    options: [
      { id: "g20",  label: "20 Papers Pack",  papers: 20,  qOnly: 299,  qAndA: 479,  tagQ: "₹14.95/paper",  tagQA: "₹23.95/paper" },
      { id: "g50",  label: "50 Papers Pack",  papers: 50,  qOnly: 599,  qAndA: 929,  tagQ: "₹11.98/paper",  tagQA: "₹18.58/paper" },
      { id: "g100", label: "100 Papers Pack", papers: 100, qOnly: 999,  qAndA: 1499, tagQ: "Best Value",     tagQA: "Best Value" },
    ],
  },
  {
    id: "school",
    icon: "🏫",
    label: "School / Institute",
    tagline: "Unlimited papers + teacher dashboard",
    color: "#059669",
    options: [
      { id: "s_monthly", label: "Monthly Unlimited",  papers: "∞", qOnly: 799,  qAndA: 999,  tagQ: "Up to 10 teachers", tagQA: "Up to 10 teachers" },
      { id: "s_term",    label: "Term (4 months)",    papers: "∞", qOnly: 2499, qAndA: 3199, tagQ: "Save ₹697",         tagQA: "Save ₹797" },
      { id: "s_yearly",  label: "Annual Unlimited",   papers: "∞", qOnly: 5999, qAndA: 7499, tagQ: "Save ₹3,589",       tagQA: "Save ₹4,489" },
    ],
  },
];

const DEMO_PAPER = {
  title: "Class 10 — Mathematics",
  board: "CBSE",
  subject: "Mathematics",
  topic: "Quadratic Equations",
  questions: [
    { no: 1, text: "Solve x² − 5x + 6 = 0 using factorisation.", marks: 3, answer: "x = 2 and x = 3   [factors: (x−2)(x−3) = 0]" },
    { no: 2, text: "Find the discriminant of 2x² − 4x + 3 = 0 and determine the nature of roots.", marks: 2, answer: "D = b²−4ac = 16−24 = −8 < 0  →  No real roots" },
    { no: 3, text: "The product of two consecutive positive integers is 306. Form the equation and find the integers.", marks: 4, answer: "n(n+1) = 306  →  n²+n−306 = 0  →  n = 17, 18" },
    { no: 4, text: "If one root of 3x² + kx + 81 = 0 is the square of the other, find k.", marks: 5, answer: "Roots: α, α². Product = α³ = 27 → α = 3. Sum = 12 = −k/3  →  k = −36" },
  ],
};

/* ─── Watermarked / Unlocked Paper Preview ─── */
function PaperPreview({ paid, includeAnswers, paidAnswers }) {
  const p = DEMO_PAPER;
  return (
    <div style={{ position: "relative", fontFamily: "Georgia, serif", background: "#fffef7", border: "1px solid #d4c5a9", borderRadius: 10, padding: "28px 32px", boxShadow: "0 2px 16px #0001" }}>
      {/* Watermark */}
      {!paid && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 10, pointerEvents: "none", zIndex: 8 }}>
          {[...Array(6)].map((_, i) => (
            <span key={i} style={{
              position: "absolute", fontSize: 42, fontWeight: 900, color: "rgba(220,38,38,0.10)",
              transform: `rotate(-38deg)`,
              top: `${(i % 3) * 34 + 8}%`, left: `${Math.floor(i / 3) * 48 + 4}%`,
              whiteSpace: "nowrap", userSelect: "none"
            }}>DEMO ONLY</span>
          ))}
        </div>
      )}

      {/* Paper header */}
      <div style={{ textAlign: "center", borderBottom: "2px double #b8a890", paddingBottom: 14, marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#888", textTransform: "uppercase" }}>{p.board} Board</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginTop: 4 }}>{p.subject}</div>
        <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>Topic: {p.topic} &nbsp;|&nbsp; {p.title}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 10, fontSize: 12, color: "#555" }}>
          <span>Time: 2 Hours</span>
          <span>Max Marks: {p.questions.reduce((a, q) => a + q.marks, 0)}</span>
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 14, letterSpacing: 1 }}>SECTION A — Short Answer Questions</div>

      {p.questions.map((q) => {
        const blurQ = !paid && q.no > 2;
        const showAns = includeAnswers && (paid || paidAnswers);
        const blurAns = includeAnswers && !paid && !paidAnswers;
        return (
          <div key={q.no} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ minWidth: 24, fontWeight: 700, color: "#E85D26", flexShrink: 0 }}>Q{q.no}.</span>
              <div style={{ flex: 1, filter: blurQ ? "blur(5px)" : "none", transition: "filter 0.3s" }}>
                <span style={{ color: "#222", lineHeight: 1.7 }}>{q.text}</span>
                <span style={{ float: "right", fontWeight: 600, color: "#999", fontSize: 12 }}>[{q.marks} marks]</span>
              </div>
            </div>
            {/* Answer row */}
            {includeAnswers && showAns && (
              <div style={{ marginLeft: 34, marginTop: 8, padding: "9px 14px", background: "#f0fdf4", borderLeft: "3px solid #10b981", borderRadius: "0 6px 6px 0" }}>
                <div style={{ fontSize: 11, color: "#059669", fontWeight: 700, letterSpacing: 1, marginBottom: 3 }}>✅ ANSWER</div>
                <div style={{ fontSize: 13, color: "#1a3a2a", lineHeight: 1.6 }}>{q.answer}</div>
              </div>
            )}
            {includeAnswers && blurAns && (
              <div style={{ marginLeft: 34, marginTop: 8, padding: "9px 14px", background: "#fef3c7", borderLeft: "3px solid #f59e0b", borderRadius: "0 6px 6px 0", filter: blurQ ? "blur(5px)" : "none" }}>
                <div style={{ fontSize: 11, color: "#b45309", fontWeight: 700 }}>🔒 ANSWER — Unlock for ₹11 extra</div>
              </div>
            )}
          </div>
        );
      })}

      {!paid && (
        <div style={{ textAlign: "center", padding: "12px", background: "#fff3cd", borderRadius: 6, fontSize: 13, color: "#856404", border: "1px solid #ffc107", marginTop: 8 }}>
          🔒 Questions 3–4 are blurred. Pay to unlock full paper.
        </div>
      )}
      {paid && (
        <div style={{ textAlign: "center", padding: "10px", background: "#d1fae5", borderRadius: 6, fontSize: 13, color: "#065f46", border: "1px solid #10b981", marginTop: 8 }}>
          ✅ Full paper unlocked! Download below.
        </div>
      )}
    </div>
  );
}

/* ─── Payment Modal ─── */
function PaymentModal({ plan, option, includeAnswers, onClose, onSuccess }) {
  const [step, setStep] = useState("confirm");
  const [method, setMethod] = useState("upi");
  const price = includeAnswers ? option.qAndA : option.qOnly;
  const gst   = Math.round(price * 0.18);
  const total  = price + gst;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 400, padding: 32, position: "relative", boxShadow: "0 24px 64px #0004" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#bbb" }}>✕</button>

        {step === "confirm" && (
          <>
            <div style={{ fontSize: 12, color: "#aaa", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Checkout</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 2 }}>{option.label}</div>
            <div style={{ fontSize: 13, color: "#777", marginBottom: 18 }}>{plan.label}</div>

            <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
              <span style={{ background: "#fff3e0", color: "#E85D26", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>📄 Question Paper</span>
              {includeAnswers
                ? <span style={{ background: "#f0fdf4", color: "#059669", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>✅ Answer Key</span>
                : <span style={{ background: "#f5f5f5", color: "#bbb", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>No Answer Key</span>}
            </div>

            <div style={{ background: "#f8f8f8", borderRadius: 10, padding: "14px 18px", marginBottom: 18 }}>
              {includeAnswers ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 5 }}><span>Question Paper</span><span>₹{option.qOnly}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#059669", marginBottom: 5 }}><span>Answer Key</span><span>+₹{option.qAndA - option.qOnly}</span></div>
                </>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 5 }}><span>Question Paper</span><span>₹{price}</span></div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#777", marginBottom: 5 }}><span>GST (18%)</span><span>₹{gst}</span></div>
              <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, color: "#111" }}>
                <span>Total</span><span>₹{total}</span>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 8 }}>Payment Method</div>
              {[
                { id: "upi", label: "UPI / GPay / PhonePe", icon: "📱" },
                { id: "card", label: "Debit / Credit Card", icon: "💳" },
                { id: "net", label: "Net Banking", icon: "🏦" },
              ].map(m => (
                <div key={m.id} onClick={() => setMethod(m.id)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
                  borderRadius: 8, border: `2px solid ${method === m.id ? plan.color : "#e5e5e5"}`,
                  background: method === m.id ? plan.color + "10" : "#fff",
                  marginBottom: 8, cursor: "pointer", transition: "all 0.15s"
                }}>
                  <span style={{ fontSize: 18 }}>{m.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{m.label}</span>
                  {method === m.id && <span style={{ marginLeft: "auto", color: plan.color, fontWeight: 700 }}>✓</span>}
                </div>
              ))}
            </div>

            <button onClick={() => { setStep("paying"); setTimeout(() => setStep("done"), 2000); }}
              style={{ width: "100%", padding: 14, background: plan.color, color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              Pay ₹{total} →
            </button>
            <div style={{ textAlign: "center", fontSize: 11, color: "#ccc", marginTop: 10 }}>🔒 Secured by Razorpay · 256-bit SSL</div>
          </>
        )}

        {step === "paying" && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 18, display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Processing...</div>
            <div style={{ fontSize: 13, color: "#999", marginTop: 8 }}>Do not close this window</div>
            <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {step === "done" && (
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 14 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Payment Successful!</div>
            <div style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>
              {typeof option.papers === "number" ? `${option.papers} paper${option.papers > 1 ? "s" : ""}` : "Unlimited access"}{includeAnswers ? " + Answer Keys" : ""} unlocked
            </div>
            <button onClick={onSuccess} style={{ padding: "13px 36px", background: "#059669", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              View & Download ↓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [activePlan,    setActivePlan]    = useState(0);
  const [activeOption,  setActiveOption]  = useState(0);
  const [includeAnswers, setIncludeAnswers] = useState(false);
  const [showModal,     setShowModal]     = useState(false);
  const [paid,          setPaid]          = useState(false);
  const [paidAnswers,   setPaidAnswers]   = useState(false);
  const [tab,           setTab]           = useState("pricing");

  const plan   = PLANS[activePlan];
  const option = plan.options[activeOption];
  const price  = includeAnswers ? option.qAndA : option.qOnly;

  const handleSuccess = () => {
    setPaid(true);
    if (includeAnswers) setPaidAnswers(true);
    setShowModal(false);
    setTab("demo");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f4", fontFamily: "'Segoe UI', sans-serif", color: "#111" }}>

      {/* Header */}
      <div style={{ background: "#1a1a2e", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>📄 PaperGen</div>
          <div style={{ fontSize: 12, color: "#8888aa" }}>AI Question Paper Generator</div>
        </div>
        <div style={{ fontSize: 13 }}>
          {paid
            ? <span style={{ color: "#10b981", fontWeight: 700 }}>✅ Unlocked{paidAnswers ? " + Answers" : ""}</span>
            : <span style={{ color: "#8888aa" }}>Demo Mode</span>}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "22px 20px 0" }}>
        {[["pricing", "💳 Plans & Pricing"], ["demo", "📄 Preview Paper"]].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "10px 26px", borderRadius: 30, border: "2px solid #ddd",
            background: tab === t ? "#1a1a2e" : "#fff", color: tab === t ? "#fff" : "#666",
            fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
          }}>{label}</button>
        ))}
      </div>

      {/* ══════════ PRICING TAB ══════════ */}
      {tab === "pricing" && (
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "26px 18px 60px" }}>

          <div style={{ textAlign: "center", marginBottom: 26 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#1a1a2e" }}>Simple, Affordable Pricing</div>
            <div style={{ fontSize: 15, color: "#777", marginTop: 6 }}>Try the demo first — pay only when satisfied · UPI accepted</div>
          </div>

          {/* ── Plan type tabs ── */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 22 }}>
            {PLANS.map((p, i) => (
              <button key={p.id} onClick={() => { setActivePlan(i); setActiveOption(0); }} style={{
                padding: "10px 20px", borderRadius: 30,
                border: `2px solid ${activePlan === i ? p.color : "#ddd"}`,
                background: activePlan === i ? p.color : "#fff",
                color: activePlan === i ? "#fff" : "#666",
                fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
              }}>{p.icon} {p.label}</button>
            ))}
          </div>

          {/* ── Answer Key Toggle ── */}
          <div style={{ background: "#fff", borderRadius: 14, border: "2px solid #e5e7eb", padding: "18px 22px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#111", marginBottom: 3 }}>📋 Want Answer Key too?</div>
              <div style={{ fontSize: 13, color: "#777" }}>Answer key includes step-by-step solutions for every question.</div>
            </div>
            <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: "2px solid #e5e5e5" }}>
              <button onClick={() => setIncludeAnswers(false)} style={{
                padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none",
                background: !includeAnswers ? "#E85D26" : "#f5f5f5",
                color: !includeAnswers ? "#fff" : "#888", transition: "all 0.2s"
              }}>📄 Q Paper only  ₹19</button>
              <button onClick={() => setIncludeAnswers(true)} style={{
                padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none",
                background: includeAnswers ? "#059669" : "#f5f5f5",
                color: includeAnswers ? "#fff" : "#888", transition: "all 0.2s"
              }}>📄+✅ With Answers  ₹30</button>
            </div>
          </div>

          {/* ── Plan options grid ── */}
          <div style={{ background: "#fff", borderRadius: 16, border: `2px solid ${plan.color}28`, padding: "26px", boxShadow: "0 4px 20px #0001" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 26 }}>{plan.icon}</span>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{plan.label}</div>
                <div style={{ fontSize: 13, color: "#888" }}>{plan.tagline}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(172px, 1fr))", gap: 12 }}>
              {plan.options.map((opt, i) => {
                const p  = includeAnswers ? opt.qAndA : opt.qOnly;
                const tg = includeAnswers ? opt.tagQA  : opt.tagQ;
                return (
                  <div key={opt.id} onClick={() => setActiveOption(i)} style={{
                    padding: "18px 16px", borderRadius: 12, cursor: "pointer", position: "relative",
                    border: `2px solid ${activeOption === i ? plan.color : "#e5e5e5"}`,
                    background: activeOption === i ? plan.color + "0c" : "#fafafa",
                    transition: "all 0.18s"
                  }}>
                    {tg && (
                      <div style={{ position: "absolute", top: -10, right: 10, background: plan.color, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{tg}</div>
                    )}
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 8 }}>{opt.label}</div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: plan.color }}>₹{p}</div>
                    <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>
                      {typeof opt.papers === "number" ? `${opt.papers} paper${opt.papers > 1 ? "s" : ""}` : "Unlimited"}
                      {includeAnswers ? " + answers" : ""}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Per-paper breakdown */}
            {plan.id !== "school" && (
              <div style={{ marginTop: 18, padding: "12px 16px", background: "#f8f8f8", borderRadius: 10, display: "flex", gap: 20, flexWrap: "wrap", fontSize: 13, color: "#555" }}>
                <span>📄 Q Paper only: <b style={{ color: "#E85D26" }}>₹{option.qOnly}</b>{option.papers > 1 ? ` (₹${(option.qOnly/option.papers).toFixed(2)}/paper)` : ""}</span>
                <span>✅ Answer Key add‑on: <b style={{ color: "#059669" }}>+₹{option.qAndA - option.qOnly}</b></span>
                <span>🎯 Both together: <b style={{ color: "#2563EB" }}>₹{option.qAndA}</b>{option.papers > 1 ? ` (₹${(option.qAndA/option.papers).toFixed(2)}/paper)` : ""}</span>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              <button onClick={() => setTab("demo")} style={{
                flex: 1, minWidth: 130, padding: 13, border: `2px solid ${plan.color}`,
                background: "#fff", color: plan.color, borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer"
              }}>👁 Preview Demo</button>
              <button onClick={() => setShowModal(true)} style={{
                flex: 2, minWidth: 180, padding: 13, background: plan.color,
                color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer"
              }}>Pay ₹{price} & Unlock →</button>
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 12, flexWrap: "wrap" }}>
              {["✅ Instant download", "✅ PDF + DOCX", "✅ UPI accepted", "✅ No subscription"].map(f => (
                <span key={f} style={{ fontSize: 12, color: "#888" }}>{f}</span>
              ))}
            </div>
          </div>

          {/* Comparison table */}
          <div style={{ marginTop: 30, background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "16px 22px", background: "#1a1a2e" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>What's Included in Each Option?</div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f8f8f8" }}>
                  <th style={{ padding: "12px 20px", textAlign: "left", color: "#666", fontWeight: 700, borderBottom: "1px solid #eee" }}>Feature</th>
                  <th style={{ padding: "12px", textAlign: "center", color: "#E85D26", fontWeight: 700, borderBottom: "1px solid #eee" }}>📄 Q Paper Only<br /><span style={{ fontSize: 11, fontWeight: 500 }}>₹19/paper</span></th>
                  <th style={{ padding: "12px", textAlign: "center", color: "#059669", fontWeight: 700, borderBottom: "1px solid #eee" }}>📄 + ✅ With Answers<br /><span style={{ fontSize: 11, fontWeight: 500 }}>₹30/paper</span></th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Full question paper (all questions)", "✅", "✅"],
                  ["No watermark", "✅", "✅"],
                  ["PDF + DOCX download", "✅", "✅"],
                  ["Marks per question", "✅", "✅"],
                  ["Answer key / solutions", "❌", "✅"],
                  ["Step-by-step workings", "❌", "✅"],
                ].map(([feat, q, qa], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "11px 20px", color: "#444", borderBottom: "1px solid #f0f0f0" }}>{feat}</td>
                    <td style={{ padding: "11px 12px", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>{q}</td>
                    <td style={{ padding: "11px 12px", textAlign: "center", borderBottom: "1px solid #f0f0f0", fontWeight: q !== qa ? 700 : 400, color: q !== qa ? "#059669" : "inherit" }}>{qa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════ DEMO TAB ══════════ */}
      {tab === "demo" && (
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "28px 18px 60px" }}>
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e" }}>
              {paid ? "✅ Your Paper is Ready!" : "📄 Demo Preview"}
            </div>
            <div style={{ fontSize: 14, color: "#888", marginTop: 6 }}>
              {paid ? "Download your paper below" : "Watermark & blurs removed after payment"}
            </div>
          </div>

          {/* Toggle Q / Q+A when not paid */}
          {!paid && (
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 18 }}>
              <button onClick={() => setIncludeAnswers(false)} style={{
                padding: "8px 20px", borderRadius: 20, fontWeight: 700, fontSize: 13, cursor: "pointer",
                border: `2px solid ${!includeAnswers ? "#E85D26" : "#ddd"}`,
                background: !includeAnswers ? "#fff3ee" : "#fff", color: !includeAnswers ? "#E85D26" : "#999"
              }}>📄 Q Paper Only — ₹19</button>
              <button onClick={() => setIncludeAnswers(true)} style={{
                padding: "8px 20px", borderRadius: 20, fontWeight: 700, fontSize: 13, cursor: "pointer",
                border: `2px solid ${includeAnswers ? "#059669" : "#ddd"}`,
                background: includeAnswers ? "#f0fdf4" : "#fff", color: includeAnswers ? "#059669" : "#999"
              }}>📄+✅ With Answers — ₹30</button>
            </div>
          )}

          <PaperPreview paid={paid} includeAnswers={includeAnswers} paidAnswers={paidAnswers} />

          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 22, flexWrap: "wrap" }}>
            {!paid ? (
              <>
                <button onClick={() => setShowModal(true)} style={{
                  padding: "14px 28px", background: "#E85D26", color: "#fff",
                  border: "none", borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: "pointer"
                }}>🔓 Pay ₹{includeAnswers ? 30 : 19} & Unlock</button>
                <button onClick={() => setTab("pricing")} style={{
                  padding: "14px 20px", background: "#fff", color: "#666",
                  border: "2px solid #ddd", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer"
                }}>View All Plans</button>
              </>
            ) : (
              <>
                <button style={{ padding: "13px 26px", background: "#E85D26", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>⬇ Download PDF</button>
                <button style={{ padding: "13px 26px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>⬇ Download DOCX</button>
                {!paidAnswers && (
                  <button onClick={() => { setIncludeAnswers(true); setShowModal(true); }} style={{
                    padding: "13px 22px", background: "#059669", color: "#fff",
                    border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer"
                  }}>✅ Add Answer Key +₹11</button>
                )}
              </>
            )}
          </div>

          {paid && !paidAnswers && (
            <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "#aaa" }}>
              💡 Already paid for the paper? Add the answer key for just ₹11 more.
            </div>
          )}
        </div>
      )}

      {showModal && (
        <PaymentModal
          plan={plan}
          option={option}
          includeAnswers={includeAnswers}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
