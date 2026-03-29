/**
 * Smart Digital — Global Configuration
 * Centralizing API keys, model settings, and business defaults.
 */

window.SMART_DIGITAL_CONFIG = {
  // --- AI API CONFIG (OPENROUTER) ---
  OPENROUTER: {
    API_KEY: "SECURE_PROXIED_VIA_NETLIFY",
    PROVIDER: "OPENROUTER",
    MODEL: "stepfun/step-3-5-flash",
    MAX_TOKENS: 1500,
    TEMPERATURE: 0.5,
    ENDPOINT: "https://openrouter.ai/api/v1/chat/completions"
  },

  // --- BUSINESS DEFAULTS ---
  ADMIN_EMAIL: "sumanbisas123@gmail.com",
};

// --- COMPATIBILITY ALIASES ---
// This ensures that all sub-apps looking for 'GLOBAL_CONFIG' still work perfectly.
window.GLOBAL_CONFIG = window.SMART_DIGITAL_CONFIG.OPENROUTER;

// Compatibility for Node script testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.SMART_DIGITAL_CONFIG;
}
