// Storage of all projects and settings on the device (localStorage), plus backup export/import.
// Data shape (schema 2):
// {
//   format: 'toerteller', schema: 2,
//   settings: { lang: 'auto'|'nl'|'en'|'da'|'de'|'no'|'sv', theme: 'auto'|'light'|'dark', wake: bool,
//               idleRemind: minutes (0 = off), idlePause: minutes after the reminder (0 = never),
//               idleFlash, idleSound, idleVibrate: bool, autoUpdate: bool },
//   lastBackup: ISO date | null,
//   projects: [{
//     id, name, type,                       // type = key from js/templates.js
//     created, updated,                     // ISO dates
//     parts: [{
//       id, name, done,                     // done = part finished
//       count,                              // current row number
//       target, repeat,                     // 0 = not set
//       notes,
//       totalMs,                            // total timed knitting time
//       timer: { running, start, acc },     // start = epoch ms of current run, acc = ms already on this row
//       log: [{ t: epoch ms, d: ms|null }]  // one entry per row added with the button (for stats/undo)
//     }]
//   }]
// }
// Schema 1 (0.1.0: one counter per project) is converted to a project with one part.
(function () {
  // Live and test version (…/dev/) share the website's storage, so each uses its own key.
  const KEY = self.TT_CHANNEL.dev ? 'toerteller-dev.v1' : 'toerteller.v1';   // the content carries the schema number
  const LOG_MAX = 5000;

  function defaults() {
    return { lang: 'auto', theme: 'auto', wake: true, idleRemind: 5, idlePause: 5, idleFlash: true, idleSound: true, idleVibrate: true, autoUpdate: true };
  }
  function empty() {
    return { format: 'toerteller', schema: 2, settings: defaults(), lastBackup: null, projects: [] };
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  const n = (v) => (Number.isFinite(+v) && +v > 0 ? Math.floor(+v) : 0);

  function sanitizePart(p) {
    return {
      id: String(p.id || uid()),
      name: String(p.name || '').slice(0, 60) || '?',
      done: !!p.done,
      count: n(p.count), target: n(p.target), repeat: n(p.repeat),
      notes: String(p.notes || ''),
      totalMs: n(p.totalMs),
      // A timer that was still running when the app was closed is stopped, without counting the closed time.
      timer: { running: false, start: null, acc: n(p.timer && p.timer.acc) },
      log: Array.isArray(p.log) ? p.log.filter(e => e && Number.isFinite(e.t)).map(e => ({ t: e.t, d: Number.isFinite(e.d) ? e.d : null })).slice(-LOG_MAX) : []
    };
  }

  function sanitizeProject(p, schema, mainPartName) {
    const parts = schema >= 2 && Array.isArray(p.parts)
      ? p.parts.map(sanitizePart)
      : [sanitizePart(Object.assign({}, p, { id: uid(), name: mainPartName }))];   // schema 1: the old counter becomes one part
    if (!parts.length) parts.push(sanitizePart({ name: mainPartName }));
    return {
      id: String(p.id || uid()),
      name: String(p.name || '').slice(0, 60) || '?',
      type: String(p.type || 'other'),
      created: p.created || new Date().toISOString(),
      updated: p.updated || new Date().toISOString(),
      parts
    };
  }

  function validate(data, mainPartName) {
    if (!data || data.format !== 'toerteller' || !Array.isArray(data.projects)) return null;
    const schema = +data.schema || 1;
    const out = empty();
    Object.assign(out.settings, data.settings || {});
    out.lastBackup = data.lastBackup || null;
    out.projects = data.projects.map(p => sanitizeProject(p, schema, mainPartName));
    return out;
  }

  const MAIN = { nl: 'Hoofddeel', en: 'Main part', da: 'Hoveddel', de: 'Hauptteil', no: 'Hoveddel', sv: 'Huvuddel' };
  function mainName() {
    let pref = 'auto';
    try { pref = JSON.parse(localStorage.getItem(KEY)).settings.lang || 'auto'; } catch (e) { /* none yet */ }
    if (MAIN[pref]) return MAIN[pref];
    const list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'];
    for (const l of list) {
      let c = String(l).toLowerCase().slice(0, 2);
      if (c === 'nb' || c === 'nn') c = 'no';
      if (MAIN[c]) return MAIN[c];
    }
    return MAIN.en;
  }

  let state;
  try { state = validate(JSON.parse(localStorage.getItem(KEY)), mainName()) || empty(); } catch (e) { state = empty(); }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.error('Save failed', e); }
  }
  save();   // stores converted 0.1.0 data as schema 2 right away

  // Ask the browser not to clear our data under storage pressure.
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

  self.TTStore = {
    get state() { return state; },
    save,
    uid,
    mainName,
    newPart: (fields) => sanitizePart(Object.assign({ id: uid() }, fields)),
    newProject(fields, partNames) {
      const p = sanitizeProject(Object.assign({ id: uid(), parts: partNames.map(x => (typeof x === 'string' ? { name: x } : x)) }, fields), 2, mainName());
      state.projects.unshift(p); save(); return p;
    },
    find(id) { return state.projects.find(p => p.id === id); },
    findPart(pid, partId) { const p = this.find(pid); return p ? p.parts.find(x => x.id === partId) || null : null; },
    allParts() { return state.projects.flatMap(p => p.parts); },
    remove(id) { state.projects = state.projects.filter(p => p.id !== id); save(); },
    touch(project) { if (project) project.updated = new Date().toISOString(); save(); },
    exportJSON() {
      const copy = JSON.parse(JSON.stringify(state));
      copy.exported = new Date().toISOString();
      copy.appVersion = self.TT_VERSION.version;
      copy.projects.forEach(p => p.parts.forEach(x => { x.timer = { running: false, start: null, acc: x.timer.acc }; }));
      return JSON.stringify(copy, null, 2);
    },
    markBackup() { state.lastBackup = new Date().toISOString(); save(); },
    parseBackup(text) {
      try { return validate(JSON.parse(text), mainName()); } catch (e) { return null; }
    },
    replaceAll(data) {
      const settings = state.settings;
      state = data; state.settings = settings; state.lastBackup = new Date().toISOString(); save();
    },
    LOG_MAX
  };
})();
