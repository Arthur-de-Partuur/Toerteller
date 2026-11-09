// Step-by-step "add to Home Screen" guide, used by the app (index.html) and the install page (install.html).
// iPhone can't install a web app by itself, so we show exactly which buttons to tap, per phone and Safari version.
(function () {
  const ICON = {
    dots: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="7.5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="16.5" cy="12" r="1.6"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9H6.5A1.5 1.5 0 0 0 5 10.5v9A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 17.5 9H16M12 15V3M8.5 6.5 12 3l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    add: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    kebab: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5.5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="18.5" r="1.8"/></svg>'
  };

  // 'ios26' (Safari 26+: ⋯ then Share), 'ios' (older Safari: Share at the bottom), 'ios-other' (Chrome, WhatsApp … on iPhone),
  // 'android', or 'other' (computer).
  function platform() {
    const ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (ios) {
      const safari = /Safari\//.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\/|FBAN|FBAV|Instagram|WhatsApp|Line\//.test(ua);
      if (!safari) return 'ios-other';
      const v = +((ua.match(/Version\/(\d+)/) || [])[1] || 0);
      return v >= 26 ? 'ios26' : 'ios';
    }
    if (/Android/i.test(ua)) return 'android';
    return 'other';
  }
  function isIpad() { return /iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }

  function fill(s) { return s.replace(/\{(dots|share|add|kebab)\}/g, (m, k) => '<span class="g-ico">' + ICON[k] + '</span>'); }
  const step = (s) => '<span class="g-text">' + fill(s) + '</span>';

  // List of steps (HTML strings) for a platform; t = the translate function.
  function steps(pf, t) {
    if (pf === 'ios26') return [t('gIos26a'), t('gIosShare'), t('gIosAdd'), t('gIos26Done')].map(step);
    if (pf === 'ios') return [t('gIosOldShare'), t('gIosAdd'), t('gIosOldDone')].map(step);
    if (pf === 'ios-other') return [t('gIosOther')].map(step);
    if (pf === 'android') return [t('gAndroid1'), t('gAndroid2')].map(step);
    return [];
  }

  // Where the bouncing arrow points (the button in Safari's bar under the page), or null.
  function arrowSpot(pf) {
    if (isIpad()) return null;   // iPad: the buttons are at the top
    if (pf === 'ios26') return 'right';
    if (pf === 'ios') return 'center';
    return null;
  }

  self.TTGuide = { platform, steps, arrowSpot, ICON, fill };
})();
