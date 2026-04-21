# ExamCraft Pro - Business Model & Pricing Strategy

## Executive Summary

**Target Market**: Schools, tuition centers, and individual teachers in Assam and Northeast India
**Value Proposition**: AI-powered question paper generation that saves 2-3 hours of manual work per paper
**Monetization Model**: Demo preview + paid packs + answer-key upgrade + institutional plans

## Current Implementation Snapshot

This section reflects the current ExamCraft app behavior in code.

| Area | Current Behavior |
|------|------------------|
| Authentication | Firebase email/password accounts with phone-based lookup for login |
| Free access | 2 demo papers total per logged-in user |
| Demo preview | First 2 questions visible, remaining questions blurred, answer key locked |
| Demo export | ❌ No export/download until the paper is unlocked |
| Export formats | ✅ PDF, ✅ Text, ✅ Print |
| Individual pricing | ₹19 single paper, ₹79 for 5 papers, ₹199 for 15 papers |
| Answer key pricing | ₹11 upgrade for an already generated paper |
| Group pricing | ₹299 for 20, ₹599 for 50, ₹999 for 100 papers |
| School pricing | ₹799 monthly, ₹2499 term, ₹5999 annual (`q-only`) with higher answer-inclusive tiers |
| Payment state | Simulated client-side checkout for now; Razorpay not integrated yet |
| Credit tracking | Firestore-based user credits and generation history |
| Production AI calls | Routed through Netlify function proxy |

---

## 1. Cost Analysis

### 1.1 AI API Costs (Groq)

| Model | Input Cost | Output Cost | Avg Cost per Paper* |
|-------|-----------|-------------|---------------------|
| llama-3.3-70b-versatile | $0.59/1M tokens | $0.79/1M tokens | **~₹3-5 per paper** |
| llama-3.1-8b-instant (cheaper) | $0.18/1M tokens | $0.22/1M tokens | **~₹1-2 per paper** |

*Average paper: ~800 tokens input, ~1200 tokens output

**Monthly API Cost Estimate:**
- 100 papers/month: ₹300-500
- 500 papers/month: ₹1,500-2,500
- 1,000 papers/month: ₹3,000-5,000

### 1.2 Hosting Costs (Netlify)

| Tier | Bandwidth | Build Minutes | Cost |
|------|-----------|---------------|------|
| **Free** (Starter) | 100GB/month | 300 min/month | **₹0** |
| Pro | 1TB/month | 6,000 min/month | $19/month (~₹1,600) |

**Recommendation**: Stay on Netlify Free tier initially. It supports:
- Up to 125,000 function invocations/month
- 100GB bandwidth
- Good for 1,000+ users easily

### 1.3 Other Costs

| Item | Monthly Cost |
|------|--------------|
| Domain (smartdigital.example.com) | ₹100-200 |
| Payment Gateway (Razorpay) | 2% per transaction |
| Email service (SendGrid free) | ₹0 |
| Analytics (Google Analytics) | ₹0 |
| **Total Fixed Costs** | **₹100-200/month** |

---

## 2. Recommended Pricing Strategy

### 2.1 Freemium Model Structure

```
┌─────────────────────────────────────────────────────────────┐
│  FREE DEMO (₹0)                                            │
│  • 2 demo papers per logged-in user                        │
│  • First 2 questions visible, rest blurred                 │
│  • Answer key locked                                       │
│  • No export/download                                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  INDIVIDUAL PACKS                                           │
│  • Single Paper: ₹19                                       │
│  • 5 Papers Pack: ₹79                                      │
│  • 15 Papers Pack: ₹199                                    │
│  • Answer-inclusive pricing available                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  GROUP / COACHING PACKS                                    │
│  • 20 Papers: ₹299                                         │
│  • 50 Papers: ₹599                                         │
│  • 100 Papers: ₹999                                        │
│  • Higher pricing when bundled with answers                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  SCHOOL / INSTITUTE PLANS                                  │
│  • Monthly Unlimited: ₹799 / ₹999 with answers            │
│  • Term (4 months): ₹2499 / ₹3199 with answers            │
│  • Annual Unlimited: ₹5999 / ₹7499 with answers           │
│  • Unlimited usage model                                   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Detailed Pricing Tiers

#### **FREE DEMO** - Lead Generation
| Feature | Limit |
|---------|-------|
| Demo papers | 2 total per logged-in user |
| Preview | First 2 questions clear, rest blurred |
| Download | ❌ No |
| Watermark | Yes - demo watermark |
| Account required | ✅ Yes |
| Answer key | ❌ No |

#### **INDIVIDUAL TEACHER** - Pay Per Pack
| Feature | Details |
|---------|---------|
| Single Paper | ₹19 |
| 5 Papers Pack | ₹79 |
| 15 Papers Pack | ₹199 |
| With answers | ₹30 / ₹124 / ₹314 |
| Export formats | PDF, Text, Print |

#### **ANSWER KEY UPGRADE** - Existing Paper Only
| Feature | Details |
|---------|---------|
| Price | ₹11 (+ GST shown in checkout UI) |
| Use case | Add answers to an already generated paper |
| Availability | Only after a paper has been generated |
| Output | Same paper with answer key visibility unlocked |

#### **GROUP / COACHING** - Shared Packs
| Feature | Details |
|---------|---------|
| 20 Papers | ₹299 |
| 50 Papers | ₹599 |
| 100 Papers | ₹999 |
| With answer keys | ₹479 / ₹929 / ₹1499 |

#### **SCHOOL / INSTITUTE** - Unlimited
| Feature | Details |
|---------|---------|
| Monthly Unlimited | ₹799 |
| Monthly Unlimited + Answers | ₹999 |
| Term (4 months) | ₹2499 |
| Term + Answers | ₹3199 |
| Annual Unlimited | ₹5999 |
| Annual + Answers | ₹7499 |
| Current export options | PDF, Text, Print |

---

## 3. Pricing Psychology & Local Market Considerations

### 3.1 Why These Prices Work for Assam/Northeast India

| Factor | Analysis |
|--------|----------|
| **Teacher salary context** | Govt teachers earn ₹30K-60K, private ₹15K-25K |
| **Time saved** | 2-3 hours per paper = ₹150-300 value at minimum wage |
| **Competitor pricing** | Generic AI tools: ₹500-2000/month. We're 4x cheaper |
| **Perceived value** | "Less than a cup of tea per day" (₹199 ≈ ₹6.6/day) |
| **School budget** | Schools spend ₹500-2000/month on stationery; ₹999 is reasonable |

### 3.2 Price Anchoring Strategy

```
Pay-per-paper:     ₹19  (makes monthly look cheap)
Monthly:          ₹199  (SWEET SPOT - main seller)
Yearly:         ₹1,999  (appears as discount, locks users)
School:           ₹999  (bulk discount for institutions)
```

### 3.3 Promotional Pricing

| Campaign | Pricing | Duration |
|----------|---------|----------|
| **Launch Offer** | ₹99/month (50% off) | First 100 subscribers |
| **Teacher's Day** | ₹149/month | September |
| **Annual Subscription** | ₹1,599 (₹400 off) | Year-end |
| **School Bulk** | ₹7,999/year (20% off) | Always available |
| **Referral** | 1 month free | Per successful referral |

---

## 4. Revenue Projections

### Conservative Scenario (Year 1)

| Month | Free Users | Paid Users | Pay-per-paper | Monthly Revenue |
|-------|------------|------------|---------------|-----------------|
| 1-3 | 500 | 10 | 50 papers | ₹2,940 |
| 4-6 | 1,000 | 25 | 150 papers | ₹7,835 |
| 7-9 | 1,500 | 50 | 300 papers | ₹15,670 |
| 10-12 | 2,000 | 100 | 500 papers | ₹29,450 |

**Year 1 Total: ~₹1,75,000**
**Costs: ~₹6,000**
**Net: ~₹1,69,000**

### Growth Scenario (Year 2)

| Quarter | Subscribers | Schools | Monthly Revenue |
|---------|-------------|---------|-----------------|
| Q1 | 300 | 5 | ₹64,695 |
| Q2 | 500 | 10 | ₹1,09,450 |
| Q3 | 800 | 20 | ₹1,79,120 |
| Q4 | 1,200 | 30 | ₹2,69,670 |

**Year 2 Total: ~₹6,00,000**

---

## 5. Payment Gateway Integration

### 5.1 Recommended: Razorpay (India)

**Why Razorpay:**
- 2% transaction fee (lowest in India)
- Supports UPI, Cards, Netbanking, Wallets
- Easy integration
- Instant settlement
- Built-in subscription management

**Alternative: Stripe (if going global)**
- 2% + ₹3 per transaction
- Better international support

### 5.2 Integration Steps

1. **Current state:** Checkout UI already exists and payment is simulated client-side.
2. **Next step:** Create Razorpay account and get Test + Live keys.
3. **Then implement backend order creation + verification:**
   ```javascript
   // Add to app.js
   function initiatePayment(plan, amount) {
     // Call your backend
     fetch('/.netlify/functions/create-order', {
       method: 'POST',
       body: JSON.stringify({ amount, plan })
     })
     .then(r => r.json())
     .then(order => {
       const options = {
         key: RAZORPAY_KEY,
         amount: order.amount,
         currency: "INR",
         name: "ExamCraft Pro",
         description: plan,
         order_id: order.id,
         handler: function(response) {
           verifyPayment(response);
         }
       };
       new Razorpay(options).open();
     });
   }
   ```

4. **Verify payments via Netlify Function before unlocking credits**

### 5.3 Payment Flow

```
User generates a paper
        ↓
Show demo preview or paid preview state
        ↓
User opens pricing / checkout modal
        ↓
Current app: simulated payment success after timeout
        ↓
Future app: Razorpay checkout → verify payment
        ↓
Enable export, store plan/credits in Firestore
```

---

## 6. Implementation Plan

### Phase 1: MVP (Immediate - Week 1-2)
- [x] Add preview/paywall flow
- [x] Track usage per user in Firestore
- [x] Add watermark + blur for demo preview
- [x] Add pricing/payment modal UI
- [ ] Integrate Razorpay test mode

### Phase 2: User Accounts (Week 3-4)
- [x] Firebase email/password auth
- [x] Store plan and credit status in Firestore
- [x] Generation count tracking per user
- [x] Purchase / paper history subcollection

### Phase 3: Full Subscription (Month 2)
- [ ] Razorpay subscription integration
- [ ] Automatic renewal handling
- [ ] Email receipts
- [ ] Subscription management page

### Phase 4: School Dashboard (Month 3)
- [ ] Multi-user accounts
- [ ] Admin controls
- [ ] Usage analytics

---

## 7. Technical Implementation Guide

### 7.1 Demo Enforcement (Current Implementation)

Current implementation uses:

- Firebase Auth + Firestore user documents
- `demoUsed` stored per user
- hard stop after 2 demo papers
- preview blur + answer-key lock for demo state

### 7.2 Download Restriction

Current implementation:

- export is blocked for demo users
- unlocked users can export as PDF, Text, or Print
- credit entitlement is checked from current plan/payment state, not localStorage

### 7.3 Watermark Addition (Current State)

Current preview behavior:

- watermark overlay shows on locked/demo papers
- first two questions remain readable
- remaining questions are blurred
- answer key stays locked until unlocked

---

## 8. Marketing & Growth Strategy

### 8.1 Free as Lead Magnet
- "Try 2 demo papers after sign-in"
- Teachers will share the free version = organic growth
- Watermark = free advertising

### 8.2 Conversion Triggers
- After 2 demo papers: show pricing prompt / credits exhausted flow
- When trying to download: "Download available for subscribers only"
- On screen view: "Blur answer key" (show only to subscribers)

### 8.3 Referral Program
- "Refer a teacher, get 1 month free"
- Simple referral code system

### 8.4 School Outreach
- Direct sales to principals
- Demo account for schools
- Group discount offers

---

## 9. Competitive Analysis

| Competitor | Price | Our Advantage |
|------------|-------|---------------|
| Question.ai | ₹499/month | We cost 60% less |
| Test Generator | $10/month | Local board support |
| Manual creation | ₹150-300/paper | We cost ₹19/paper |
| ChatGPT | Free but setup needed | One-click, board-specific |

---

## 10. Success Metrics

| Metric | Target (6 months) |
|--------|-------------------|
| Free registrations | 5,000 |
| Free → Paid conversion | 5% |
| Monthly subscribers | 250 |
| School clients | 10 |
| Monthly revenue | ₹50,000 |
| Customer acquisition cost | <₹50 |
| Churn rate | <10%/month |

---

## Summary & Next Steps

### Immediate Actions:
1. ⏳ **Create Razorpay account** (Free, takes 10 minutes)
2. ✅ **Implement free tier limits** (2 hours of coding)
3. ✅ **Add paywall modal** (1 hour)
4. ✅ **Add watermark to free papers** (30 minutes)
5. ⏳ **Replace simulated payment flow** with real Razorpay checkout + verification

### Recommended Starting Point:
**Launch with:**
- Free demo (2 papers total, no export)
- Individual single paper: ₹19
- 5-paper pack: ₹79

**This gives you:**
- Zero risk for users
- Clear value proposition
- Sustainable margins
- Room to scale

---

*Document created: 2026-03-30*
*Review monthly for pricing optimization*
