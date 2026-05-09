/**
 * Smart Digital — Global Configuration
 * Centralizing API keys, model settings, and business defaults.
 */

window.SMART_DIGITAL_CONFIG = {
  // --- AI API CONFIG (GROQ) ---
  GROQ: {
    API_KEY: "SECURE_PROXIED_VIA_NETLIFY",
    PROVIDER: "GROQ",
    MODEL: "llama-3.3-70b-versatile",
    MAX_TOKENS: 4000,
    TEMPERATURE: 0.5,
    ENDPOINT: "https://api.groq.com/openai/v1/chat/completions"
  },

  CLAUDE: {
    PROVIDER: "ANTHROPIC",
    MODEL: "claude-sonnet-4-20250514",
    ENDPOINT: "https://api.anthropic.com/v1/messages"
  },

  // --- BUSINESS DEFAULTS ---
  ADMIN_EMAIL: "sumanbisas123@gmail.com",
};

// --- COMPATIBILITY ALIASES ---
// This ensures that all sub-apps looking for 'GLOBAL_CONFIG' still work perfectly.
window.GLOBAL_CONFIG = window.SMART_DIGITAL_CONFIG.GROQ;

// Compatibility for Node script testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.SMART_DIGITAL_CONFIG;
}
