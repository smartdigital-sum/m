// ================================================================
// Smart Digital Resume Builder — Auth & Credits Config
// ----------------------------------------------------------------
// Real auth/credits/dashboard logic lives in
// /assets/js/sd-account.js. This file only sets per-app config.
// ================================================================

window.SD_APP_CONFIG = {
  appKey:           'resumeBuilder',
  resource:         'resume',
  resourcePlural:   'resumes',
  planEmoji:        '📄',
  historyTitle:     'Recent Resumes',
  totalField:       'resumesTotal',
  usedField:        'resumesUsed',
  remainingField:   'resumesRemaining',
  reserveFnName:    'reserveResumeCredit',
  releaseFnName:    'releaseResumeCredit',
  saveHistoryFnName:'saveResumeHistory',
  pendingGenerateFn:'proceedToGenerate',
  postUpdateHookName:'updateWizardGenerateBtn',
  demoLimit:        1,
  historyTitleFor:  (d) => d.name || '—',
  historyMetaFor:   (d) => d.role || d.template || ''
};
