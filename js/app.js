// Toerteller: screens, counter, timer, settings and backup.
(function () {
  const S = self.TTStore;
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const TAP_GUARD_MS = 700;      // ignore a second tap this soon (accidental double tap)
  const BACKUP_NAG_DAYS = 14;

  let lang = 'nl';
  let cur = null;                // { pid, partId } shown in the counter view
  let tickTimer = null;
  let wakeLock = null;
  let lastTap = 0;
  let lastActivity = Date.now();  // last touch in the counter screen (for the inactivity reminder)
  let idleAlertAt = 0;            // when the reminder went off (0 = not now)
  let audioCtx = null;

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
      const a = document.createElement('div'); a.textContent = 'Toerteller v' + v.version + ' · ' + (v.date === 'unreleased' ? t('unreleased') : t('published') + ' ' + v.date);
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
  function nRows(n) { return n + ' ' + (n === 1 ? t('row').toLowerCase() : t('rows')); }
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

  // ---------- timer (per part) ----------
  function rowMs(x) { return x.timer.acc + (x.timer.running ? Date.now() - x.timer.start : 0); }
  function totalMs(x) { return x.totalMs + (x.timer.running ? Date.now() - x.timer.start : 0); }
  function pauseTimer(x) {
    if (!x || !x.timer.running) return;
    const seg = Math.max(0, Date.now() - x.timer.start);
    x.timer.acc += seg; x.totalMs += seg; x.timer.running = false; x.timer.start = null;
    S.touch();
  }
  function startTimer(x) {
    if (x.timer.running) return;
    x.timer.running = true; x.timer.start = Date.now(); S.touch();
  }
  function pauseAll() { S.allParts().forEach(pauseTimer); }

  // ---------- current project / part ----------
  function cproj() { return cur ? S.find(cur.pid) : null; }
  function cp() { return cur ? S.findPart(cur.pid, cur.partId) : null; }
  function typeOf(p) { return self.TT_TYPES.find(x => x.key === p.type) || self.TT_TYPES[self.TT_TYPES.length - 1]; }
  function projTotals(p) {
    const rows = p.parts.reduce((a, x) => a + x.count, 0);
    const allTarget = p.parts.every(x => x.target);
    const target = allTarget ? p.parts.reduce((a, x) => a + x.target, 0) : 0;
    const ms = p.parts.reduce((a, x) => a + totalMs(x), 0);
    const done = p.parts.filter(x => x.done).length;
    return { rows, target, ms, done, n: p.parts.length };
  }

  // ---------- stats ----------
  function stats(x) {
    const timed = x.log.filter(e => e.d != null);
    const avg = timed.length ? timed.reduce((a, e) => a + e.d, 0) / timed.length : null;
    const last = x.log.length ? x.log[x.log.length - 1].d : null;
    const midnight = new Date(); midnight.setHours(0, 0, 0, 0);
    const today = x.log.filter(e => e.t >= midnight.getTime());
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
    const [view, id, sub] = h.split('/');
    if (cur && !(view === 'c' && id === cur.pid && sub === cur.partId)) { pauseTimer(cp()); stopTick(); releaseWake(); cur = null; }
    if (view !== 'p') reorderMode = false;
    const p = id ? S.find(id) : null;
    if (view === 'p' && p) return openParts(p);
    if (view === 'c' && p && S.findPart(id, sub)) return openCounter(id, sub);
    if (view === 'part' && p && S.findPart(id, sub)) return openPartEdit(p, S.findPart(id, sub));
    if (view === 'addpart' && p) return openPartEdit(p, null);
    if (view === 'pedit' && p) return openProjectForm(p);
    if (view === 'new') return openProjectForm(null);
    if (view === 'settings') return openSettings();
    renderHome(); show('view-home');
  }
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }

  function card(href, num, name, meta, frac) {
    const a = document.createElement(href ? 'a' : 'div'); if (href) a.href = href; a.className = 'project-card';
    const nEl = document.createElement('span'); nEl.className = 'pc-count'; nEl.textContent = num;
    const nm = document.createElement('span'); nm.className = 'pc-name'; nm.textContent = name;
    const mt = document.createElement('span'); mt.className = 'pc-meta'; mt.textContent = meta;
    a.append(nEl, nm, mt);
    if (frac != null) {
      const bar = document.createElement('span'); bar.className = 'pc-bar';
      const fill = document.createElement('span'); fill.style.width = Math.min(100, frac * 100) + '%';
      bar.append(fill); a.append(bar);
    }
    return a;
  }

  // Home
  function renderHome() {
    const list = $('#project-list'); list.innerHTML = '';
    const ps = S.state.projects;
    $('#home-empty').hidden = ps.length > 0;
    ps.forEach(p => {
      const tt = projTotals(p), ty = typeOf(p);
      const meta = ty.icon + ' ' + ty[lang] + ' · ' + (tt.n > 1 ? t('partsDone', { d: tt.done, n: tt.n }) + ' · ' : '') + fmtDur(tt.ms);
      const li = document.createElement('li');
      li.append(card('#/p/' + p.id, tt.rows, p.name, meta, tt.target ? tt.rows / tt.target : null));
      list.append(li);
    });
    const tot = $('#home-totals');
    if (ps.length) {
      tot.hidden = false;
      const parts = S.allParts();
      tot.textContent = t('totalsLine', { p: ps.length === 1 ? t('project1') : t('projectN', { n: ps.length }), r: parts.reduce((a, x) => a + x.count, 0), t: fmtDur(parts.reduce((a, x) => a + x.totalMs, 0)) });
    } else tot.hidden = true;
    renderHints();
  }

  function renderHints() {
    const standalone = navigator.standalone || matchMedia('(display-mode: standalone)').matches;
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const android = /Android/i.test(navigator.userAgent);
    const ih = $('#install-hint');
    if ((ios || android) && !standalone && !localStorage.getItem('toerteller.hideInstall')) {
      ih.innerHTML = '<span>' + t(ios ? 'installHint' : 'installHintAndroid') + '</span>';
      if (installPrompt) {
        const ib = document.createElement('button'); ib.className = 'btn btn-small'; ib.textContent = t('install');
        ib.onclick = () => { installPrompt.prompt(); installPrompt.userChoice.finally(() => { installPrompt = null; renderHints(); }); };
        ih.append(ib);
      }
      const x = document.createElement('button'); x.className = 'btn btn-small'; x.textContent = t('dismiss');
      x.onclick = () => { localStorage.setItem('toerteller.hideInstall', '1'); ih.hidden = true; };
      ih.append(x); ih.hidden = false;
    } else ih.hidden = true;

    const bh = $('#backup-hint');
    const ps = S.state.projects;
    const since = S.state.lastBackup || (ps.length ? ps.reduce((m, p) => (p.created < m ? p.created : m), ps[0].created) : null);
    const days = since ? Math.floor((Date.now() - new Date(since).getTime()) / 86400000) : 0;
    if (S.allParts().some(x => x.count > 0) && days >= BACKUP_NAG_DAYS) {
      bh.innerHTML = '';
      const s = document.createElement('span'); s.textContent = t('backupNag', { d: days });
      const b = document.createElement('button'); b.className = 'btn btn-small'; b.textContent = t('backupNow'); b.onclick = doExport;
      bh.append(s, b); bh.hidden = false;
    } else bh.hidden = true;
  }

  // Project: list of parts
  let reorderMode = false;
  function openParts(p) {
    $('#pp-name').textContent = p.name;
    const tt = projTotals(p), ty = typeOf(p);
    $('#pp-totals').textContent = ty.icon + ' ' + ty[lang] + ' · ' + t('partsDone', { d: tt.done, n: tt.n }) + ' · ' + nRows(tt.rows) + ' · ' + fmtDur(tt.ms);
    const list = $('#part-list'); list.innerHTML = ''; list.classList.toggle('reordering', reorderMode);
    p.parts.forEach((x, i) => {
      const li = document.createElement('li'); li.className = 'part-item' + (x.done ? ' is-done' : '');
      const meta = (x.done ? '✓ ' + t('finished') + ' · ' : '') + (x.target ? x.count + ' / ' + x.target + ' ' + t('rows') : nRows(x.count)) + ' · ' + fmtDur(x.totalMs);
      const c = card(reorderMode ? null : '#/c/' + p.id + '/' + x.id, x.count, x.name, meta, x.target ? x.count / x.target : null);
      li.append(c);
      if (reorderMode) {
        const box = document.createElement('div'); box.className = 'move-btns';
        [['↑', -1], ['↓', 1]].forEach(([lbl, d]) => {
          const b = document.createElement('button'); b.className = 'btn btn-small'; b.textContent = lbl;
          b.setAttribute('aria-label', d < 0 ? t('moveUp') : t('moveDown'));
          b.disabled = (i + d < 0) || (i + d >= p.parts.length);
          b.onclick = () => { const a = p.parts; [a[i], a[i + d]] = [a[i + d], a[i]]; S.touch(p); openParts(p); };
          box.append(b);
        });
        li.append(box);
      }
      list.append(li);
    });
    $('#btn-reorder').hidden = p.parts.length < 2;
    $('#btn-reorder').textContent = reorderMode ? t('reorderDone') : t('reorder');
    $('#btn-add-part').hidden = reorderMode;
    show('view-parts');
  }

  // Counter
  function openCounter(pid, partId) {
    cur = { pid, partId };
    $('#p-notes').value = cp().notes;
    markActivity();
    renderProject(); show('view-project');
    startTick(); requestWake();
  }

  function renderProject() {
    const x = cp(), p = cproj(); if (!x) return;
    $('#p-name').textContent = x.name;
    $('#p-project').textContent = p.name;
    $('#p-count').textContent = x.count;
    $('#p-target').textContent = x.target ? t('of') + ' ' + x.target : '';
    $('#p-progress').hidden = !x.target;
    if (x.target) $('#p-progress-bar').style.width = Math.min(100, x.count / x.target * 100) + '%';
    const rep = $('#p-repeat');
    if (x.repeat && x.count > 0) {
      const i = ((x.count - 1) % x.repeat) + 1, r = Math.floor((x.count - 1) / x.repeat) + 1;
      rep.textContent = t('repeatLine', { r, i, n: x.repeat });
      rep.classList.toggle('repeat-end', i === x.repeat);
      rep.hidden = false;
    } else rep.hidden = true;
    $('#btn-minus').disabled = x.count === 0;
    $('#btn-timer').textContent = x.timer.running ? t('pause') : t('start');
    $('#btn-timer').classList.toggle('is-paused', !x.timer.running);
    $('#btn-plus').classList.toggle('is-done', x.done);
    renderClock();
    renderStats();
  }

  function renderClock() {
    const x = cp(); if (!x) return;
    $('#p-timer').textContent = fmtClock(rowMs(x));
    $('#p-timer').classList.toggle('paused', !x.timer.running);
  }

  function renderStats() {
    const x = cp(), p = cproj(); if (!x) return;
    const st = stats(x);
    const rows = [
      [t('statTotal'), fmtDur(totalMs(x))],
      [t('statAvg'), fmtDur(st.avg)],
      [t('statLast'), fmtDur(st.last)],
      [t('statToday'), nRows(st.todayRows) + ' · ' + fmtDur(st.todayMs)]
    ];
    if (x.target && x.count < x.target) {
      const left = x.target - x.count;
      rows.push([t('statLeft'), st.avg ? t('statLeftVal', { rows: left, time: fmtDur(st.avg * left) }) : nRows(left)]);
    }
    if (p.parts.length > 1) {
      const tt = projTotals(p);
      rows.push([t('statProject'), nRows(tt.rows) + ' · ' + fmtDur(tt.ms)]);
    }
    const dl = $('#p-stats'); dl.innerHTML = '';
    rows.forEach(([k, v]) => {
      const d = document.createElement('div');
      const dt = document.createElement('dt'); dt.textContent = k;
      const dd = document.createElement('dd'); dd.textContent = v;
      d.append(dt, dd); dl.append(d);
    });
  }

  function startTick() { stopTick(); let n = 0; tickTimer = setInterval(() => { renderClock(); checkIdle(); if (++n % 15 === 0) renderStats(); }, 1000); }
  function stopTick() { if (tickTimer) clearInterval(tickTimer); tickTimer = null; }

  // ---------- inactivity reminder and auto-pause ----------
  function markActivity() {
    lastActivity = Date.now();
    if (idleAlertAt) { idleAlertAt = 0; document.body.classList.remove('idle-alert'); $('#idle-banner').hidden = true; }
  }
  function checkIdle() {
    const x = cp(); const st = S.state.settings;
    if (!x || !x.timer.running || !st.idleRemind) return;
    const now = Date.now(), remindMs = st.idleRemind * 60000;
    if (!idleAlertAt && now - lastActivity >= remindMs) {
      idleAlertAt = now;
      if (st.idleFlash) document.body.classList.add('idle-alert');
      const b = $('#idle-banner'); b.textContent = t('idleAsk', { m: st.idleRemind }); b.hidden = false;
      if (st.idleSound) beep();
      if (st.idleVibrate && navigator.vibrate) navigator.vibrate([250, 120, 250]);
    }
    if (idleAlertAt && st.idlePause && now - idleAlertAt >= st.idlePause * 60000) {
      // Pause, and don't count the minutes since the reminder went off.
      const seg = Math.max(0, idleAlertAt - x.timer.start);
      x.timer.acc += seg; x.totalMs += seg; x.timer.running = false; x.timer.start = null;
      S.touch();
      idleAlertAt = 0; document.body.classList.remove('idle-alert'); $('#idle-banner').hidden = true;
      toast(t('idlePaused'), () => { $('#toast').hidden = true; });
      renderProject();
    }
  }
  function unlockAudio() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) { audioCtx = null; }
  }
  function beep() {
    if (!audioCtx) return;
    try {
      [0, 0.28].forEach((d, i) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = 'sine'; o.frequency.value = i ? 880 : 660;
        const t0 = audioCtx.currentTime + d;
        g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.4, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
        o.connect(g).connect(audioCtx.destination); o.start(t0); o.stop(t0 + 0.25);
      });
    } catch (e) { /* no sound */ }
  }

  function plus() {
    const x = cp(); if (!x) return;
    const now = Date.now();
    if (now - lastTap < TAP_GUARD_MS) return;
    lastTap = now;
    let seg = 0;
    if (x.timer.running) { seg = Math.max(0, now - x.timer.start); x.totalMs += seg; }
    const d = x.timer.acc + seg;
    x.log.push({ t: now, d: d > 0 ? d : null });
    if (x.log.length > S.LOG_MAX) x.log.shift();
    x.count += 1;
    x.timer = { running: true, start: now, acc: 0 };
    S.touch(cproj());
    const c = $('#btn-plus'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    renderProject();
    if (x.target && x.count === x.target && !x.done) toast(t('targetReached'));
  }

  function minus() {
    const x = cp(); if (!x || x.count === 0) return;
    x.count -= 1;
    if (x.log.length) x.log.pop();
    S.touch(cproj());
    toast(t('removed', { n: x.count }));
    renderProject();
  }

  function toggleTimer() {
    const x = cp(); if (!x) return;
    if (x.timer.running) pauseTimer(x); else startTimer(x);
    renderProject();
  }

  // ---------- new project / edit project ----------
  let npEditing = null, npType = 'sweater', npItems = [];   // npItems: [{ name, on }]
  function openProjectForm(p) {
    npEditing = p;
    $('#np-title').textContent = p ? t('editProjectTitle') : t('newTitle');
    $('#np-name').value = p ? p.name : '';
    $('#np-type-wrap').hidden = !!p;
    $('#np-parts-wrap').hidden = !!p;
    $('#btn-delete-project').hidden = !p;
    $('#np-submit').textContent = p ? t('save') : t('startProject');
    if (!p) { selectType('sweater'); setTimeout(() => $('#np-name').focus(), 50); }
    show('view-newproject');
  }
  function renderTypes() {
    const box = $('#np-types'); box.innerHTML = '';
    self.TT_TYPES.forEach(ty => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'type-btn' + (ty.key === npType ? ' active' : '');
      const i = document.createElement('span'); i.className = 'type-icon'; i.textContent = ty.icon;
      const l = document.createElement('span'); l.textContent = ty[lang];
      b.append(i, l); b.onclick = () => selectType(ty.key);
      box.append(b);
    });
  }
  function selectType(key) {
    npType = key;
    const ty = self.TT_TYPES.find(x => x.key === key);
    const custom = npItems.filter(x => x.custom);
    npItems = ty.parts.map(x => ({ name: x[lang], on: x.on })).concat(custom);
    $('#np-pair-row').hidden = !ty.pair;
    $('#np-pair').checked = !!ty.pair;
    renderTypes(); renderNpItems();
  }
  function renderNpItems() {
    const ul = $('#np-parts'); ul.innerHTML = '';
    npItems.forEach((it, i) => {
      const li = document.createElement('li');
      const lab = document.createElement('label'); lab.className = 'check-row';
      const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = it.on; cb.onchange = () => { it.on = cb.checked; };
      const sp = document.createElement('span'); sp.textContent = it.name;
      lab.append(cb, sp); li.append(lab);
      if (it.custom) {
        const x = document.createElement('button'); x.type = 'button'; x.className = 'btn btn-small remove-btn'; x.textContent = '✕';
        x.setAttribute('aria-label', t('remove')); x.onclick = () => { npItems.splice(i, 1); renderNpItems(); };
        li.append(x);
      }
      ul.append(li);
    });
    $('#np-parts-wrap').querySelector('.help').hidden = false;
  }
  function addCustom() {
    const v = $('#np-custom').value.trim(); if (!v) return;
    npItems.push({ name: v.slice(0, 60), on: true, custom: true });
    $('#np-custom').value = ''; renderNpItems(); $('#np-custom').focus();
  }
  function saveProjectForm(ev) {
    ev.preventDefault();
    const name = $('#np-name').value.trim() || t('newTitle');
    if (npEditing) { npEditing.name = name; S.touch(npEditing); history.replaceState(null, '', '#/p/' + npEditing.id); return route(); }
    let names = npItems.filter(x => x.on).map(x => x.name);
    if ($('#np-pair').checked && !$('#np-pair-row').hidden && names.length) {
      names = names.map(nm => nm + ' · ' + t('left')).concat(names.map(nm => nm + ' · ' + t('right')));
    }
    if (!names.length) names = [S.mainName()];
    const p = S.newProject({ name, type: npType }, names);
    npItems = [];
    history.replaceState(null, '', '#/p/' + p.id); route();
  }
  function deleteProject() {
    if (!npEditing) return;
    if (!confirm(t('confirmDelete', { name: npEditing.name }))) return;
    S.remove(npEditing.id); npEditing = null;
    history.replaceState(null, '', '#/'); route();
  }

  // ---------- new / edit part ----------
  let editing = null, editProject = null;
  function openPartEdit(p, x) {
    editProject = p; editing = x;
    $('#edit-title').textContent = x ? t('editPartTitle') : t('addPartTitle');
    $('#f-name').value = x ? x.name : '';
    $('#f-target').value = x && x.target ? x.target : '';
    $('#f-repeat').value = x && x.repeat ? x.repeat : '';
    $('#f-count').value = x ? x.count : 0;
    $('#f-done').checked = !!(x && x.done);
    $('#f-count-wrap').hidden = !x;
    $('#f-done-wrap').hidden = !x;
    $('#btn-copy-part').hidden = !x;
    $('#btn-delete').hidden = !x || p.parts.length < 2;
    // suggestions: parts of this project type that are not in the project yet
    const have = new Set(p.parts.map(y => y.name.toLowerCase()));
    const sug = typeOf(p).parts.map(y => y[lang]).filter(nm => !have.has(nm.toLowerCase()));
    const box = $('#f-suggest'); box.innerHTML = '';
    sug.forEach(nm => { const c = document.createElement('button'); c.type = 'button'; c.className = 'chip'; c.textContent = nm; c.onclick = () => { $('#f-name').value = nm; }; box.append(c); });
    $('#f-suggest-wrap').hidden = !!x || !sug.length;
    show('view-edit');
    if (!x) setTimeout(() => $('#f-name').focus(), 50);
  }
  function saveEdit(ev) {
    ev.preventDefault();
    const num = (sel) => { const v = parseInt($(sel).value, 10); return Number.isFinite(v) && v > 0 ? v : 0; };
    const fields = { name: $('#f-name').value.trim() || S.mainName(), target: num('#f-target'), repeat: num('#f-repeat') };
    const p = editProject;
    if (editing) {
      Object.assign(editing, fields);
      editing.count = num('#f-count');
      editing.done = $('#f-done').checked;
      S.touch(p);
      history.replaceState(null, '', '#/c/' + p.id + '/' + editing.id); route();
    } else {
      p.parts.push(S.newPart(fields)); S.touch(p);
      history.replaceState(null, '', '#/p/' + p.id); route();
    }
  }
  function copyPart() {
    if (!editing) return;
    const p = editProject;
    const copy = S.newPart({ name: t('copyOf', { name: editing.name }).slice(0, 60), target: editing.target, repeat: editing.repeat, notes: editing.notes });
    p.parts.splice(p.parts.indexOf(editing) + 1, 0, copy); S.touch(p);
    toast(t('copied'));
    history.replaceState(null, '', '#/part/' + p.id + '/' + copy.id); route();
  }
  function deletePart() {
    if (!editing) return;
    const p = editProject;
    if (!confirm(t('confirmDeletePart', { name: editing.name }))) return;
    p.parts = p.parts.filter(y => y !== editing); S.touch(p); editing = null;
    history.replaceState(null, '', '#/p/' + p.id); route();
  }

  // Settings
  function openSettings() {
    const st = S.state.settings;
    $$('#set-lang button').forEach(b => b.classList.toggle('active', b.dataset.value === st.lang));
    $$('#set-theme button').forEach(b => b.classList.toggle('active', b.dataset.value === st.theme));
    $('#set-wake').checked = !!st.wake;
    $('#set-idle-remind').value = String(st.idleRemind);
    $('#set-idle-pause').value = String(st.idlePause);
    $('#set-idle-flash').checked = !!st.idleFlash;
    $('#set-idle-sound').checked = !!st.idleSound;
    $('#set-idle-vibrate').checked = !!st.idleVibrate;
    $('#idle-details').hidden = !st.idleRemind;
    $('#set-autoupdate').checked = !!st.autoUpdate;
    $('#update-version').textContent = 'v' + self.TT_VERSION.version;
    $('#update-status').textContent = '';
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
    if (!S.state.settings.wake || !('wakeLock' in navigator) || document.hidden || !cur) return;
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
  $('#btn-parts-back').onclick = () => go('#/');
  $('#btn-project-edit').onclick = () => { const id = location.hash.split('/')[2]; go('#/pedit/' + id); };
  $('#btn-add-part').onclick = () => { const id = location.hash.split('/')[2]; go('#/addpart/' + id); };
  $('#btn-reorder').onclick = () => { reorderMode = !reorderMode; route(); };
  $('#btn-back').onclick = () => go('#/p/' + cur.pid);
  $('#btn-settings-back').onclick = () => go('#/');
  $('#btn-edit').onclick = () => go('#/part/' + cur.pid + '/' + cur.partId);
  $('#btn-edit-cancel').onclick = () => { if (editing) go('#/c/' + editProject.id + '/' + editing.id); else go('#/p/' + editProject.id); };
  $('#btn-np-cancel').onclick = () => { if (npEditing) go('#/p/' + npEditing.id); else go('#/'); };
  $('#np-form').addEventListener('submit', saveProjectForm);
  $('#np-custom-add').onclick = addCustom;
  $('#np-custom').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } });
  $('#btn-delete-project').onclick = deleteProject;
  $('#btn-plus').addEventListener('click', plus);
  $('#btn-minus').onclick = minus;
  $('#btn-timer').onclick = toggleTimer;
  $('#edit-form').addEventListener('submit', saveEdit);
  $('#btn-delete').onclick = deletePart;
  $('#btn-copy-part').onclick = copyPart;
  $('#p-notes').addEventListener('input', (e) => { const x = cp(); if (x) { x.notes = e.target.value; S.touch(cproj()); } });
  $('#btn-export').onclick = doExport;
  $('#file-import').addEventListener('change', doImport);
  $$('#set-lang button').forEach(b => b.onclick = () => { S.state.settings.lang = b.dataset.value; S.save(); applyLanguage(); openSettings(); });
  // (part names are stored as typed; changing the language later doesn't rename them)
  $$('#set-theme button').forEach(b => b.onclick = () => { S.state.settings.theme = b.dataset.value; S.save(); applyTheme(); openSettings(); });
  $('#set-wake').onchange = (e) => { S.state.settings.wake = e.target.checked; S.save(); };
  $('#set-autoupdate').onchange = (e) => { S.state.settings.autoUpdate = e.target.checked; S.save(); };
  $('#btn-check-update').onclick = () => manualCheck();
  $('#set-idle-remind').onchange = (e) => { S.state.settings.idleRemind = +e.target.value; S.save(); openSettings(); };
  $('#set-idle-pause').onchange = (e) => { S.state.settings.idlePause = +e.target.value; S.save(); };
  [['#set-idle-flash', 'idleFlash'], ['#set-idle-sound', 'idleSound'], ['#set-idle-vibrate', 'idleVibrate']].forEach(([sel, key]) => {
    $(sel).onchange = (e) => { S.state.settings[key] = e.target.checked; S.save(); if (key === 'idleSound' && e.target.checked) { unlockAudio(); beep(); } };
  });
  $('#set-idle-vibrate-row').hidden = !('vibrate' in navigator);
  // Any touch in the counter screen counts as "still knitting".
  $('#view-project').addEventListener('pointerdown', () => { markActivity(); unlockAudio(); });

  // Android/Chrome: offer its own install button
  let installPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installPrompt = e; if (!$('#view-home').hidden) renderHints(); });

  window.addEventListener('hashchange', route);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { pauseAll(); releaseWake(); }
    else if (cur) { markActivity(); renderProject(); requestWake(); }
  });
  window.addEventListener('pagehide', pauseAll);

  // ---------- offline / updates ----------
  // Checks on start, whenever the app comes back to the front, and every 30 minutes.
  // A new version installs in the background; the app reloads itself at a quiet moment
  // (not while the row timer is running in the counter screen). Projects are never touched.
  let swReg = null, updatePending = false;
  const UPDATE_EVERY_MS = 30 * 60000;
  function quietMoment() { const x = cp(); return !(x && x.timer.running); }
  function applyUpdate() {
    if (!updatePending) return;
    if (S.state.settings.autoUpdate && quietMoment()) { pauseAll(); location.reload(); return; }
    toast(t('updateReady'), () => { pauseAll(); location.reload(); });
  }
  function checkForUpdate() { if (swReg) return swReg.update().catch(() => {}); return Promise.resolve(); }
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
      swReg = reg;
      setInterval(() => { if (!document.hidden) checkForUpdate(); }, UPDATE_EVERY_MS);
    }).catch(() => {});
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) return;           // first install, nothing to update
      updatePending = true; applyUpdate();
    });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { checkForUpdate(); if (updatePending) applyUpdate(); } });
    window.addEventListener('hashchange', () => { if (updatePending) setTimeout(applyUpdate, 50); });
  }

  async function manualCheck() {
    const el = $('#update-status'); el.textContent = t('checking');
    if (!swReg) { el.textContent = t('upToDate', { v: self.TT_VERSION.version }); return; }
    await checkForUpdate();
    if (swReg.installing || swReg.waiting || updatePending) { el.textContent = t('updateFound'); setTimeout(() => { updatePending = true; pauseAll(); location.reload(); }, 1500); }
    else el.textContent = t('upToDate', { v: self.TT_VERSION.version });
  }

  // Tell the user once after an update.
  try {
    const seen = localStorage.getItem('toerteller.version');
    if (seen && seen !== self.TT_VERSION.version) setTimeout(() => toast(t('updated', { v: self.TT_VERSION.version })), 400);
    localStorage.setItem('toerteller.version', self.TT_VERSION.version);
  } catch (e) { /* ignore */ }

  // ---------- start ----------
  applyTheme();
  applyLanguage();
  route();
})();
