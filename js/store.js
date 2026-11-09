// Storage of all projects and settings on the device (localStorage), plus backup export/import.
// Data shape (version 1):
// {
//   format: 'toerteller', schema: 1,
//   settings: { lang: 'auto'|'nl'|'en', theme: 'auto'|'light'|'dark', wake: bool,
//               idleRemind: minutes (0 = off), idlePause: minutes after the reminder (0 = never),
//               idleFlash, idleSound, idleVibrate: bool, autoUpdate: bool },
//   lastBackup: ISO date | null,
//   projects: [{
//     id, name, created, updated,          // ISO dates
//     count,                                // current row number
//     target, repeat,                       // 0 = not set
//     notes,
//     totalMs,                              // total timed knitting time
//     timer: { running, start, acc },       // start = epoch ms of current run, acc = ms already on this row
//     log: [{ t: epoch ms, d: ms|null }]    // one entry per row added with the button (for stats/undo)
//   }]
// }
(function () {
  const KEY = 'toerteller.v1';
  const LOG_MAX = 5000;

  function empty() {
    return { format: 'toerteller', schema: 1, settings: { lang: 'auto', theme: 'auto', wake: true, idleRemind: 5, idlePause: 5, idleFlash: true, idleSound: true, idleVibrate: true, autoUpdate: true }, lastBackup: null, projects: [] };
  }

  function sanitizeProject(p) {
    const n = (v) => (Number.isFinite(+v) && +v > 0 ? Math.floor(+v) : 0);
    return {
      id: String(p.id || uid()),
      name: String(p.name || '').slice(0, 60) || '?',
      created: p.created || new Date().toISOString(),
      updated: p.updated || new Date().toISOString(),
      count: n(p.count), target: n(p.target), repeat: n(p.repeat),
      notes: String(p.notes || ''),
      totalMs: n(p.totalMs),
      timer: { running: false, start: null, acc: n(p.timer && p.timer.acc) },
      log: Array.isArray(p.log) ? p.log.filter(e => e && Number.isFinite(e.t)).map(e => ({ t: e.t, d: Number.isFinite(e.d) ? e.d : null })).slice(-LOG_MAX) : []
    };
  }

  function validate(data) {
    if (!data || data.format !== 'toerteller' || !Array.isArray(data.projects)) return null;
    const out = empty();
    Object.assign(out.settings, data.settings || {});
    out.lastBackup = data.lastBackup || null;
    out.projects = data.projects.map(sanitizeProject);
    return out;
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  let state;
  try {
    state = validate(JSON.parse(localStorage.getItem(KEY))) || empty();
    // A timer that was still running when the app was closed is stopped (sanitizeProject),
    // without counting the time the app was closed.
  } catch (e) { state = empty(); }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.error('Save failed', e); }
  }

  // Ask the browser not to clear our data under storage pressure.
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

  self.TTStore = {
    get state() { return state; },
    save,
    uid,
    newProject(fields) {
      const p = sanitizeProject(Object.assign({ id: uid() }, fields));
      state.projects.unshift(p); save(); return p;
    },
    find(id) { return state.projects.find(p => p.id === id); },
    remove(id) { state.projects = state.projects.filter(p => p.id !== id); save(); },
    touch(p) { p.updated = new Date().toISOString(); save(); },
    exportJSON() {
      const copy = JSON.parse(JSON.stringify(state));
      copy.exported = new Date().toISOString();
      copy.appVersion = self.TT_VERSION.version;
      copy.projects.forEach(p => { p.timer = { running: false, start: null, acc: p.timer.acc }; });
      return JSON.stringify(copy, null, 2);
    },
    markBackup() { state.lastBackup = new Date().toISOString(); save(); },
    parseBackup(text) {
      try { return validate(JSON.parse(text)); } catch (e) { return null; }
    },
    replaceAll(data) {
      const settings = state.settings;
      state = data; state.settings = settings; state.lastBackup = new Date().toISOString(); save();
    },
    LOG_MAX
  };
})();
