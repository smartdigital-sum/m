// ================================================================
// Smart Digital ShopWrite — Auth & Credits Config
// ----------------------------------------------------------------
// Real auth/credits/dashboard logic lives in
// /assets/js/sd-account.js. This file only sets per-app config.
// ================================================================

window.SD_APP_CONFIG = {
  appKey:           'shopwrite',
  resource:         'description',
  resourcePlural:   'descriptions',
  planEmoji:        '🛒',
  historyTitle:     'Recent Descriptions',
  totalField:       'descriptionsTotal',
  usedField:        'descriptionsUsed',
  remainingField:   'descriptionsRemaining',
  reserveFnName:    'reserveDescriptionCredit',
  releaseFnName:    'releaseDescriptionCredit',
  saveHistoryFnName:'saveShopwriteHistory',
  pendingGenerateFn:'generateDescription',
  postUpdateHookName:null,
  demoLimit:        5,
  historyTitleFor:  (d) => d.productName || d.name || '—',
  historyMetaFor:   (d) => d.category || ''
};
