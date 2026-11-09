// Toerteller: screens, counter, timer, settings and backup.
(function () {
  const S = self.TTStore;
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const TAP_GUARD_MS = 700;      // ignore a second tap this soon (accidental double tap)
  const BACKUP_NAG_DAYS = 14;

  let lang = 'nl';
  let currentId = null;          // project shown in the counter view
  let tickTimer = null;
  let wakeLock = null;
  let lastTap = 0;

  // ---------- texts ----------
  function t(key, vars) {
    let s = (self.TT_TEXT[lang] && self.TT_TEXT[lang][key]) || self.TT_TEXT.en[key] || key;
    if (vars) Object.keys(vars).forEach(k => { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  function applyLanguage() {
    const pref = S.state.settings.lang;
    lang = pref === 'auto' ? ((navigator.language || 'nl').toLowerCase().startsWith('nl') ? 'nl' : 'en') : pref;
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    $$('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    const v = self.TT_VERSION;
    $$('[data-footer]').forEach(el => {
      el.innerHTML = '';
      const a = document.createElement('div'); a.textContent = 'Toerteller v' + v.version + ' · ' + t('published') + ' ' + v.date;
      const b = document.createElement('div'); b.textContent = t('footerRights');
      el.append(a, b);
    });
  }

  // ---------- colours ----------
  function applyTheme() {
    const th = S.state.settings.theme;
    if (th === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = th;
    const dark = th === 'dark' || (th === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.querySelector('meta[name="theme-color"]').content = dark ? '#1E1A1D' : '#FBF6F0';
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

  // ---------- formatting ----------
  function fmtClock(ms) {
    const s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(sec).padStart(2, '0');
  }
  function fmtDur(ms) {
    if (ms == null) return '–';
    const s = Math.round(ms / 1000);
    if (s < 60) return s + ' s';
    const h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60);
    const hu = lang === 'nl' ? 'u' : 'h';
    return h ? h + ' ' + hu + ' ' + m + ' min' : m + ' min';
  }
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleString(lang === 'nl' ? 'nl-NL' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }); } catch (e) { return iso; }
  }

  // ---------- timer ----------
  function rowMs(p) { return p.timer.acc + (p.timer.running ? Date.now() - p.timer.start : 0); }
  function totalMs(p) { return p.totalMs + (p.timer.running ? Date.now() - p.timer.start : 0); }
  function pauseTimer(p) {
    if (!p || !p.timer.running) return;
    const seg = Math.max(0, Date.now() - p.timer.start);
    p.timer.acc += seg; p.totalMs += seg; p.timer.running = false; p.timer.start = null;
    S.touch(p);
  }
  function startTimer(p) {
    if (p.timer.running) return;
    p.timer.running = true; p.timer.start = Date.now(); S.touch(p);
  }
  function pauseAll() { S.state.projects.forEach(pauseTimer); }

  // ---------- stats ----------
  function stats(p) {
    const timed = p.log.filter(e => e.d != null);
    const avg = timed.length ? timed.reduce((a, e) => a + e.d, 0) / timed.length : null;
    const last = p.log.length ? p.log[p.log.length - 1].d : null;
    const midnight = new Date(); midnight.setHours(0, 0, 0, 0);
    const today = p.log.filter(e => e.t >= midnight.getTime());
    const todayMs = today.reduce((a, e) => a + (e.d || 0), 0);
    return { avg, last, todayRows: today.length, todayMs };
  }

  // ---------- views ----------
  function show(id) {
    $$('.view').forEach(v => { v.hidden = v.id !== id; });
    window.scrollTo(0, 0);
  }

  function route() {
    const h = location.hash.replace(/^#\/?/, '');
    const [view, id] = h.split('/');
    if (currentId && !(view === 'p' && id === currentId)) { pauseTimer(S.find(currentId)); stopTick(); releaseWake(); currentId = null; }
    if (view === 'p' && S.find(id)) return openProject(id);
    if (view === 'edit' && S.find(id)) return openEdit(S.find(id));
    if (view === 'new') return openEdit(null);
    if (view === 'settings') return openSettings();
    renderHome(); show('view-home');
  }
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }

  // Home
  function renderHome() {
    const list = $('#project-list'); list.innerHTML = '';
    const ps = S.state.projects;
    $('#home-empty').hidden = ps.length > 0;
    ps.forEach(p => {
      const li = document.createElement('li');
      const a = document.createElement('a'); a.href = '#/p/' + p.id; a.className = 'project-card';
      const name = document.createElement('span'); name.className = 'pc-name'; name.textContent = p.name;
      const meta = document.createElement('span'); meta.className = 'pc-meta';
      meta.textContent = (p.target ? p.count + ' / ' + p.target : p.count) + ' ' + t('rows') + ' · ' + fmtDur(p.totalMs);
      const num = document.createElement('span'); num.className = 'pc-count'; num.textContent = p.count;
      a.append(num, name, meta);
      if (p.target) {
        const bar = document.createElement('span'); bar.className = 'pc-bar';
        const fill = document.createElement('span'); fill.style.width = Math.min(100, p.count / p.target * 100) + '%';
        bar.append(fill); a.append(bar);
      }
      li.append(a); list.append(li);
    });
    const tot = $('#home-totals');
    if (ps.length) {
      tot.hidden = false;
      tot.textContent = t('totalsLine', { p: ps.length === 1 ? t('project1') : t('projectN', { n: ps.length }), r: ps.reduce((a, p) => a + p.count, 0), t: fmtDur(ps.reduce((a, p) => a + p.totalMs, 0)) });
    } else tot.hidden = true;
    renderHints();
  }

  function renderHints() {
    const standalone = navigator.standalone || matchMedia('(display-mode: standalone)').matches;
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const ih = $('#install-hint');
    if (ios && !standalone && !localStorage.getItem('toerteller.hideInstall')) {
      ih.innerHTML = '<span>' + t('installHint') + '</span>';
      const x = document.createElement('button'); x.className = 'btn btn-small'; x.textContent = t('dismiss');
      x.onclick = () => { localStorage.setItem('toerteller.hideInstall', '1'); ih.hidden = true; };
      ih.append(x); ih.hidden = false;
    } else ih.hidden = true;

    const bh = $('#backup-hint');
    const ps = S.state.projects;
    const since = S.state.lastBackup || (ps.length ? ps.reduce((m, p) => (p.created < m ? p.created : m), ps[0].created) : null);
    const days = since ? Math.floor((Date.now() - new Date(since).getTime()) / 86400000) : 0;
    if (ps.some(p => p.count > 0) && days >= BACKUP_NAG_DAYS) {
      bh.innerHTML = '';
      const s = document.createElement('span'); s.textContent = t('backupNag', { d: days });
      const b = document.createElement('button'); b.className = 'btn btn-small'; b.textContent = t('backupNow'); b.onclick = doExport;
      bh.append(s, b); bh.hidden = false;
    } else bh.hidden = true;
  }

  // Counter
  function openProject(id) {
    currentId = id;
    const p = S.find(id);
    $('#p-notes').value = p.notes;
    renderProject(); show('view-project');
    startTick(); requestWake();
  }

  function renderProject() {
    const p = S.find(currentId); if (!p) return;
    $('#p-name').textContent = p.name;
    $('#p-count').textContent = p.count;
    $('#p-target').textContent = p.target ? t('of') + ' ' + p.target : '';
    $('#p-progress').hidden = !p.target;
    if (p.target) $('#p-progress-bar').style.width = Math.min(100, p.count / p.target * 100) + '%';
    const rep = $('#p-repeat');
    if (p.repeat && p.count > 0) {
      const i = ((p.count - 1) % p.repeat) + 1, r = Math.floor((p.count - 1) / p.repeat) + 1;
      rep.textContent = t('repeatLine', { r, i, n: p.repeat });
      rep.classList.toggle('repeat-end', i === p.repeat);
      rep.hidden = false;
    } else rep.hidden = true;
    $('#btn-minus').disabled = p.count === 0;
    $('#btn-timer').textContent = p.timer.running ? t('pause') : t('start');
    $('#btn-timer').classList.toggle('is-paused', !p.timer.running);
    renderClock();
    renderStats();
  }

  function renderClock() {
    const p = S.find(currentId); if (!p) return;
    $('#p-timer').textContent = fmtClock(rowMs(p));
    $('#p-timer').classList.toggle('paused', !p.timer.running);
  }

  function renderStats() {
    const p = S.find(currentId); if (!p) return;
    const st = stats(p);
    const rows = [
      [t('statTotal'), fmtDur(totalMs(p))],
      [t('statAvg'), fmtDur(st.avg)],
      [t('statLast'), fmtDur(st.last)],
      [t('statToday'), st.todayRows + ' ' + t('rows') + ' · ' + fmtDur(st.todayMs)]
    ];
    if (p.target && p.count < p.target) {
      const left = p.target - p.count;
      rows.push([t('statLeft'), st.avg ? t('statLeftVal', { rows: left, time: fmtDur(st.avg * left) }) : left + ' ' + t('rows')]);
    }
    const dl = $('#p-stats'); dl.innerHTML = '';
    rows.forEach(([k, v]) => {
      const d = document.createElement('div');
      const dt = document.createElement('dt'); dt.textContent = k;
      const dd = document.createElement('dd'); dd.textContent = v;
      d.append(dt, dd); dl.append(d);
    });
  }

  function startTick() { stopTick(); let n = 0; tickTimer = setInterval(() => { renderClock(); if (++n % 15 === 0) renderStats(); }, 1000); }
  function stopTick() { if (tickTimer) clearInterval(tickTimer); tickTimer = null; }

  function plus() {
    const p = S.find(currentId); if (!p) return;
    const now = Date.now();
    if (now - lastTap < TAP_GUARD_MS) return;
    lastTap = now;
    let seg = 0;
    if (p.timer.running) { seg = Math.max(0, now - p.timer.start); p.totalMs += seg; }
    const d = p.timer.acc + seg;
    p.log.push({ t: now, d: d > 0 ? d : null });
    if (p.log.length > S.LOG_MAX) p.log.shift();
    p.count += 1;
    p.timer = { running: true, start: now, acc: 0 };
    S.touch(p);
    const c = $('#btn-plus'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    renderProject();
  }

  function minus() {
    const p = S.find(currentId); if (!p || p.count === 0) return;
    p.count -= 1;
    if (p.log.length) p.log.pop();
    S.touch(p);
    toast(t('removed', { n: p.count }));
    renderProject();
  }

  function toggleTimer() {
    const p = S.find(currentId); if (!p) return;
    if (p.timer.running) pauseTimer(p); else startTimer(p);
    renderProject();
  }

  // Edit / new
  let editing = null;
  function openEdit(p) {
    editing = p;
    $('#edit-title').textContent = p ? t('editTitle') : t('newTitle');
    $('#f-name').value = p ? p.name : '';
    $('#f-target').value = p && p.target ? p.target : '';
    $('#f-repeat').value = p && p.repeat ? p.repeat : '';
    $('#f-count').value = p ? p.count : 0;
    $('#f-count-wrap').hidden = !p;
    $('#btn-delete').hidden = !p;
    show('view-edit');
    if (!p) setTimeout(() => $('#f-name').focus(), 50);
  }
  function saveEdit(ev) {
    ev.preventDefault();
    const num = (sel) => { const v = parseInt($(sel).value, 10); return Number.isFinite(v) && v > 0 ? v : 0; };
    const fields = { name: $('#f-name').value.trim() || t('newTitle'), target: num('#f-target'), repeat: num('#f-repeat') };
    if (editing) {
      Object.assign(editing, fields);
      editing.count = num('#f-count');
      S.touch(editing);
      history.replaceState(null, '', '#/p/' + editing.id); route();
    } else {
      const p = S.newProject(fields);
      history.replaceState(null, '', '#/p/' + p.id); route();
    }
  }
  function deleteProject() {
    if (!editing) return;
    if (!confirm(t('confirmDelete', { name: editing.name }))) return;
    S.remove(editing.id); editing = null;
    history.replaceState(null, '', '#/'); route();
  }

  // Settings
  function openSettings() {
    const st = S.state.settings;
    $$('#set-lang button').forEach(b => b.classList.toggle('active', b.dataset.value === st.lang));
    $$('#set-theme button').forEach(b => b.classList.toggle('active', b.dataset.value === st.theme));
    $('#set-wake').checked = !!st.wake;
    $('#last-backup').textContent = S.state.lastBackup ? t('lastBackup', { date: fmtDate(S.state.lastBackup) }) : t('neverBackup');
    show('view-settings');
  }

  async function doExport() {
    pauseAll();
    const json = S.exportJSON();
    const name = 'toerteller-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    const file = new File([json], name, { type: 'application/json' });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: name });
      } else {
        const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = name;
        document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      }
      S.markBackup(); toast(t('exportDone'));
      if (!$('#view-settings').hidden) openSettings(); else renderHints();
    } catch (e) { /* share sheet cancelled */ }
  }

  function doImport(ev) {
    const f = ev.target.files && ev.target.files[0]; ev.target.value = '';
    if (!f) return;
    f.text().then(text => {
      const data = S.parseBackup(text);
      if (!data) { alert(t('importBad')); return; }
      if (!confirm(t('confirmImport', { n: data.projects.length }))) return;
      S.replaceAll(data); toast(t('importDone')); openSettings();
    });
  }

  // ---------- keep screen on ----------
  async function requestWake() {
    if (!S.state.settings.wake || !('wakeLock' in navigator) || document.hidden || !currentId) return;
    try { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } catch (e) { /* not allowed */ }
  }
  function releaseWake() { if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; } }

  // ---------- toast ----------
  let toastT = null;
  function toast(msg, onClick) {
    const el = $('#toast'); el.textContent = msg; el.hidden = false;
    el.onclick = onClick || null; el.classList.toggle('clickable', !!onClick);
    clearTimeout(toastT); if (!onClick) toastT = setTimeout(() => { el.hidden = true; }, 2200);
  }

  // ---------- events ----------
  $('#btn-settings').onclick = () => go('#/settings');
  $('#btn-new').onclick = () => go('#/new');
  $('#btn-back').onclick = () => go('#/');
  $('#btn-settings-back').onclick = () => go('#/');
  $('#btn-edit').onclick = () => go('#/edit/' + currentId);
  $('#btn-edit-cancel').onclick = () => { if (editing) go('#/p/' + editing.id); else go('#/'); };
  $('#btn-plus').addEventListener('click', plus);
  $('#btn-minus').onclick = minus;
  $('#btn-timer').onclick = toggleTimer;
  $('#edit-form').addEventListener('submit', saveEdit);
  $('#btn-delete').onclick = deleteProject;
  $('#p-notes').addEventListener('input', (e) => { const p = S.find(currentId); if (p) { p.notes = e.target.value; S.touch(p); } });
  $('#btn-export').onclick = doExport;
  $('#file-import').addEventListener('change', doImport);
  $$('#set-lang button').forEach(b => b.onclick = () => { S.state.settings.lang = b.dataset.value; S.save(); applyLanguage(); openSettings(); });
  $$('#set-theme button').forEach(b => b.onclick = () => { S.state.settings.theme = b.dataset.value; S.save(); applyTheme(); openSettings(); });
  $('#set-wake').onchange = (e) => { S.state.settings.wake = e.target.checked; S.save(); };

  window.addEventListener('hashchange', route);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { pauseAll(); releaseWake(); }
    else if (currentId) { renderProject(); requestWake(); }
  });
  window.addEventListener('pagehide', pauseAll);

  // ---------- offline / updates ----------
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        nw && nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) toast(t('updateReady'), () => { pauseAll(); location.reload(); });
        });
      });
    }).catch(() => {});
  }

  // ---------- start ----------
  applyTheme();
  applyLanguage();
  route();
})();
