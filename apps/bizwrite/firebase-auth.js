// ================================================================
// Smart Digital BizWrite — Auth & Credits Config
// ----------------------------------------------------------------
// Real auth/credits/dashboard logic lives in
// /assets/js/sd-account.js. This file only sets per-app config.
// ================================================================

window.SD_APP_CONFIG = {
  appKey:           'bizwrite',
  resource:         'kit',
  resourcePlural:   'kits',
  planEmoji:        '🛍️',
  historyTitle:     'Recent Profile Kits',
  totalField:       'kitsTotal',
  usedField:        'kitsUsed',
  remainingField:   'kitsRemaining',
  reserveFnName:    'reserveKitCredit',
  releaseFnName:    'releaseKitCredit',
  saveHistoryFnName:'saveBizwriteHistory',
  pendingGenerateFn:'generateDescriptions',
  postUpdateHookName:'updateGenerateButton',
  demoLimit:        1,
  historyTitleFor:  (d) => d.businessName || d.name || '—',
  historyMetaFor:   (d) => d.businessType || d.outputLang || ''
};
