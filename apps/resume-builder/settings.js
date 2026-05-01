// ================================================================
//  SMART DIGITAL RESUME BUILDER — AI Resume Maker
//  settings.js  —  Edit this file to set up your app
// ================================================================
//
//  QUICK SETUP (2 steps):
//  1. Replace 'YOUR_UPI_ID' with your UPI ID (e.g. name@paytm)
//  2. Save → Open index.html in a browser → Done!
//
//  API key is set in ../../assets/js/config.js (uses Groq)
//
// ================================================================

const CONFIG = {

  // 💳 UPI Payment Details (shown in plans modal)
  UPI_ID:   'YOUR_UPI_ID',          // e.g.  smartdigital@paytm
  UPI_NAME: 'Smart Digital Service',

  // 💰 Pricing in ₹
  SINGLE_PRICE: 10,   // 1 resume generation
  BUNDLE_PRICE: 40,   // 5 resume generations

  // 🏢 Branding
  BRAND_NAME: 'Resume Builder',
  TAGLINE:    'AI-Powered Resumes for Students & Freshers',

  // 📞 Optional WhatsApp support button (include country code, no +)
  //    Leave blank '' to hide the button
  WHATSAPP_NUMBER: '',   // e.g. '919876543210'
};
