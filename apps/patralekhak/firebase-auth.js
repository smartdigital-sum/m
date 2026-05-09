// ================================================================
// Smart Digital PatraLekhak — Auth & Credits Config
// ----------------------------------------------------------------
// Real auth/credits/dashboard logic lives in
// /assets/js/sd-account.js. This file only wires the per-app
// config (resource names, function aliases) before that shared
// module loads.
// ================================================================

window.SD_APP_CONFIG = {
  appKey:           'patralekhak',
  resource:         'letter',
  resourcePlural:   'letters',
  planEmoji:        '✉️',
  historyTitle:     'Recent Letters',
  totalField:       'lettersTotal',
  usedField:        'lettersUsed',
  remainingField:   'lettersRemaining',
  reserveFnName:    'reserveLetterCredit',
  releaseFnName:    'releaseLetterCredit',
  saveHistoryFnName:'saveLetterHistory',
  pendingGenerateFn:'proceedToGenerate',
  postUpdateHookName:'updateGenerateButton',
  demoLimit:        1,
  historyTitleFor:  (d) => d.recipientName || d.name || d.role || '—',
  historyMetaFor:   (d) => d.template || d.type || ''
};
