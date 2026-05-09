// ================================================================
// Smart Digital LipiAntar (Translator) — Auth & Credits Config
// ----------------------------------------------------------------
// Real auth/credits/dashboard logic lives in
// /assets/js/sd-account.js. This file only sets per-app config.
// ================================================================

window.SD_APP_CONFIG = {
  appKey:           'translator',
  resource:         'document',
  resourcePlural:   'documents',
  planEmoji:        '🌐',
  historyTitle:     'Recent Translations',
  totalField:       'docsTotal',
  usedField:        'docsUsed',
  remainingField:   'docsRemaining',
  reserveFnName:    'reserveDocCredit',
  releaseFnName:    'releaseDocCredit',
  saveHistoryFnName:'saveTranslationHistory',
  pendingGenerateFn:'handleTranslate',
  pendingGenerateFlag:'_pendingTranslate',
  postUpdateHookName:'updateTranslateBtn',
  demoLimit:        1,
  historyTitleFor:  (d) => `${d.src || '—'} → ${d.tgt || '—'}`,
  historyMetaFor:   (d) => d.tone || (d.words ? `${d.words} words` : '')
};
