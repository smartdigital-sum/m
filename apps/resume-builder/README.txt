================================================================
  SMART DIGITAL SERVICE — AI Resume Builder
  Setup & Usage Guide
================================================================

QUICK START (5 minutes)
─────────────────────────────────────────────────────────────

1. OPEN config.js IN A TEXT EDITOR (Notepad, VS Code, etc.)

2. PASTE YOUR ANTHROPIC API KEY:
   Change: ANTHROPIC_API_KEY: 'YOUR_API_KEY_HERE'
   To:     ANTHROPIC_API_KEY: 'sk-ant-...'

   → Get your key at: https://console.anthropic.com/account/keys
   → Create a free account → Click "Create Key" → Copy it

3. SET YOUR UPI ID:
   Change: UPI_ID: 'YOUR_UPI_ID'
   To:     UPI_ID: 'yourname@paytm'   (or @ybl, @okaxis, etc.)

4. SAVE config.js

5. DOUBLE-CLICK index.html to open in your browser
   (Chrome or Edge recommended for best PDF export)

6. DONE! Share the folder via a web host or just run locally.

================================================================
 FILE STRUCTURE
================================================================

resume-builder/
├── index.html       ← Main app (open this in browser)
├── style.css        ← All styling
├── config.js        ← 🔑 YOUR CONFIG (edit this!)
├── app.js           ← Wizard logic & API calls
├── templates.js     ← 3 resume template designs
├── export.js        ← PDF & Word download functions
└── README.txt       ← This file

================================================================
 OPTIONAL CUSTOMISATION
================================================================

Change prices:
  Edit RESUME_PRICE and COVER_LETTER_PRICE in config.js

Add WhatsApp support button:
  Set WHATSAPP_NUMBER: '919876543210' in config.js
  (Use full number with country code, no + sign)

Change brand name:
  Edit BRAND_NAME in config.js

================================================================
 SHARING WITH CUSTOMERS
================================================================

Option A — Run locally:
  Just open index.html on your computer and share your screen,
  OR let customers sit at your desk to fill the form.

Option B — Host online (free):
  Upload the entire folder to:
  • Netlify Drop: drag & drop at netlify.com/drop
  • GitHub Pages: free static hosting
  • InfinityFree: free web hosting

Option C — Google Drive / WhatsApp:
  Zip the folder and share via WhatsApp or Drive.
  Customer opens index.html from their device.

================================================================
 SECURITY NOTE
================================================================

Your Anthropic API key is stored in config.js (plain text).
• Safe for local/private use
• If hosting publicly, consider a simple backend proxy
• Monitor your usage at console.anthropic.com

================================================================
 PRICING SUGGESTION
================================================================

Resume only:          ₹199
Resume + Cover Letter: ₹298 (shown as ₹299)
Custom pricing:        Edit in config.js anytime

================================================================
 SUPPORT
================================================================

If the resume doesn't generate:
• Check your API key in config.js
• Make sure you have internet connection
• Check browser console (F12) for error messages

================================================================
  Built with ❤ by Smart Digital Service
================================================================
