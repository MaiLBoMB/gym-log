(() => {
  'use strict';

  // ---------- Storage (all data stays on this device) ----------
  const KEYS = { history: 'gymlog.history', current: 'gymlog.current', weights: 'gymlog.weights' };
  let warnedStorage = false;
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch {
        if (!warnedStorage) { warnedStorage = true; alert('Saving failed. Private Browsing blocks storage – open the app in a normal Safari tab or from the Home Screen.'); }
        return false;
      }
    },
    del(key) { try { localStorage.removeItem(key); } catch { /* ignore */ } }
  };

  // ---------- Helpers ----------
  const $ = (sel, el = document) => el.querySelector(sel);
  const app = $('#app');
  const days = PLAN.days;
  const dayById = id => days.find(d => d.id === id);
  const exIn = (day, id) => day.exercises.find(e => e.id === id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const unitOf = ex => (ex.unit === 's' || ex.unit === 'min' ? ex.unit : '');
  const unitWord = u => (u === 's' ? 'seconds' : u === 'min' ? 'minutes' : 'reps');
  const targetReps = ex => { const m = String(ex.reps).match(/\d+/); return m ? Number(m[0]) : 0; };
  const fmtClock = sec => { sec = Math.max(0, Math.floor(sec)); return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); };
  const fmtDate = iso => new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const fmtKg = n => (Math.round(n * 100) / 100).toLocaleString('en-GB');

  const repsText = ex => ex.unit === 'min' ? `${esc(ex.reps)} min` : `${ex.sets} × ${esc(ex.reps)}${ex.unit === 's' ? 's' : ''}`;

  let view = 'workout';
  let selectedDay = null;
  let flash = '';
  let tick = null;

  function history() { return store.get(KEYS.history, []); }

  function current() {
    const s = store.get(KEYS.current, null);
    if (!s || !dayById(s.dayId)) return null;
    // Keep the session in step with the plan if plan.js was edited mid-session
    const day = dayById(s.dayId);
    day.exercises.forEach(ex => {
      const st = s.exercises[ex.id] || (s.exercises[ex.id] = { weight: '', sets: [] });
      while (st.sets.length < ex.sets) st.sets.push(null);
      if (st.sets.length > ex.sets) st.sets.length = ex.sets;
    });
    return s;
  }
  const saveCurrent = s => store.set(KEYS.current, s);

  function suggestedDayId() {
    const h = history();
    if (!h.length) return days[0].id;
    const i = days.findIndex(d => d.id === h[h.length - 1].dayId);
    return days[(i + 1) % days.length].id;
  }

  function estimateMinutes(day) {
    const workTime = ex => (ex.unit === 'min' ? targetReps(ex) * 60 : ex.unit === 's' ? targetReps(ex) : 45);
    const work = day.exercises.reduce((t, ex) => t + ex.sets * workTime(ex) + (ex.sets - 1) * (ex.rest || 0) + 60, 0);
    return Math.round(work / 60 + (PLAN.warmupMinutes || 0) + (PLAN.cooldownMinutes || 0));
  }

  function lastPerformance(exId) {
    const h = history();
    for (let i = h.length - 1; i >= 0; i--) {
      const e = h[i].exercises.find(x => x.id === exId);
      if (e && e.sets.length) return e;
    }
    return null;
  }

  function countSets(s) {
    const day = dayById(s.dayId);
    let done = 0, total = 0;
    day.exercises.forEach(ex => { total += ex.sets; done += s.exercises[ex.id].sets.filter(r => r != null).length; });
    return { done, total };
  }

  function volumeOf(entry) {
    return entry.exercises.reduce((t, e) => t + (e.unit ? 0 : (e.weight || 0) * e.sets.reduce((a, b) => a + b, 0)), 0);
  }

  // ---------- Rendering ----------
  function render() {
    document.querySelectorAll('.tabs [role=tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.view === view)));
    clearInterval(tick); tick = null;
    if (view === 'history') renderHistory();
    else { const s = current(); s ? renderSession(s) : renderPicker(); }
  }

  function renderPicker() {
    const next = suggestedDayId();
    if (!selectedDay || !dayById(selectedDay)) selectedDay = next;
    const day = dayById(selectedDay);
    app.innerHTML = `
      ${flash ? `<p class="flash" role="status">${esc(flash)}</p>` : ''}
      <h2 class="h-section">Choose today's session</h2>
      <div class="plates" role="radiogroup" aria-label="Session">
        ${days.map(d => `
          <button type="button" class="plate-pick day-${esc(d.id)}" role="radio" aria-checked="${d.id === selectedDay}" data-action="pick" data-day="${esc(d.id)}">
            <span class="disc" aria-hidden="true">${esc(d.id)}</span>
            <span class="pick-label">${esc(d.focus)}</span>
            ${d.id === next ? '<span class="next">Up next</span>' : ''}
          </button>`).join('')}
      </div>
      <section class="card preview day-${esc(day.id)}">
        <h3 class="ex-name">${esc(day.name)}: ${esc(day.focus)}</h3>
        <p class="meta">About ${estimateMinutes(day)} minutes including warm-up</p>
        <ol class="preview-list">
          ${day.exercises.map(ex => `<li><span>${esc(ex.name)}</span><span class="muted">${repsText(ex)}</span></li>`).join('')}
        </ol>
        <button type="button" class="btn btn-primary" data-action="start" data-day="${esc(day.id)}">Start ${esc(day.name)}</button>
        ${PLAN.progression ? `<p class="meta" style="margin-top:12px">${esc(PLAN.progression)}</p>` : ''}
      </section>`;
    flash = '';
  }

  function exerciseCard(ex, st) {
    const u = unitOf(ex);
    const last = lastPerformance(ex.id);
    const lastText = last
      ? `Last time: ${last.weight ? fmtKg(last.weight) + ' kg × ' : ''}${last.sets.map(r => r + (u === 'min' ? ' min' : u)).join(', ')}`
      : '';
    return `
      <article class="card ex">
        <h3 class="ex-name">${esc(ex.name)}</h3>
        <p class="meta">${repsText(ex)}${ex.rest ? `, rest ${ex.rest}s` : ''}</p>
        ${ex.image ? `<img class="ex-photo" src="${esc(ex.image)}" alt="" loading="lazy" onerror="this.remove()">` : ''}
        ${ex.note ? `<p class="note">${esc(ex.note)}</p>` : ''}
        <a class="howto" href="${esc(ex.video || 'https://www.youtube.com/results?search_query=' + encodeURIComponent(ex.name + ' how to'))}" target="_blank" rel="noopener">How to do it</a>
        ${ex.weighted ? `
          <div class="weight">
            <label for="w-${esc(ex.id)}">Weight (kg)</label>
            <div class="stepper">
              <button type="button" class="step" data-action="wdown" data-ex="${esc(ex.id)}" aria-label="Decrease weight">−</button>
              <input id="w-${esc(ex.id)}" class="w-input" data-ex="${esc(ex.id)}" inputmode="decimal" autocomplete="off" placeholder="0" value="${esc(st.weight)}">
              <button type="button" class="step" data-action="wup" data-ex="${esc(ex.id)}" aria-label="Increase weight">+</button>
            </div>
          </div>` : ''}
        ${lastText ? `<p class="last">${esc(lastText)}</p>` : ''}
        <div class="sets" role="group" aria-label="Sets for ${esc(ex.name)}">
          ${st.sets.map((r, i) => `
            <button type="button" class="set ${r != null ? 'done' : ''}" data-action="set" data-ex="${esc(ex.id)}" data-i="${i}"
              aria-pressed="${r != null}" aria-label="Set ${i + 1}${r != null ? `, done, ${r} ${unitWord(u)}` : ''}">
              ${r != null ? r : targetReps(ex)}${u ? `<small>${u}</small>` : ''}
            </button>`).join('')}
        </div>
      </article>`;
  }

  function renderSession(s) {
    const day = dayById(s.dayId);
    const { done, total } = countSets(s);
    app.innerHTML = `
      <section class="day-${esc(day.id)}">
        <div class="session-head">
          <div>
            <h2 class="session-title">${esc(day.name)}</h2>
            <p class="meta">${esc(day.focus)}</p>
          </div>
          <div class="clock">
            <span id="elapsed" class="clock-num">0:00</span>
            <span class="meta">of ${PLAN.targetMinutes}:00</span>
          </div>
        </div>
        <div class="progress"><span style="width:${total ? (done / total) * 100 : 0}%"></span></div>
        <p class="meta">${done} of ${total} sets done</p>
        <p class="hint">Tap a plate when you finish the set. The rest timer starts on its own. Tap a filled plate to change the reps.</p>
        ${day.warmup ? `<div class="card stage"><p><strong>Warm-up.</strong> ${esc(day.warmup)}</p></div>` : ''}
        ${day.exercises.map(ex => exerciseCard(ex, s.exercises[ex.id])).join('')}
        ${day.cooldown ? `<div class="card stage"><p><strong>Cool-down.</strong> ${esc(day.cooldown)}</p></div>` : ''}
        <div class="actions">
          <button type="button" class="btn btn-primary" data-action="finish">Finish and save</button>
          <button type="button" class="btn btn-quiet" data-action="discard">Discard session</button>
        </div>
      </section>`;
    const el = $('#elapsed');
    const update = () => {
      const sec = (Date.now() - Date.parse(s.startedAt)) / 1000;
      el.textContent = fmtClock(sec);
      el.classList.toggle('over', sec > PLAN.targetMinutes * 60);
    };
    update();
    tick = setInterval(update, 1000);
  }

  function renderHistory() {
    const h = history();
    const monday = new Date(); monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    const thisWeek = h.filter(e => new Date(e.startedAt) >= monday);
    const weekDays = new Set(thisWeek.map(e => e.dayId));

    app.innerHTML = `
      <div class="stats">
        <div class="stat">
          <span class="stat-num">${thisWeek.length}<small> / ${days.length}</small></span>
          <span class="meta">This week</span>
          <div class="week-plates" aria-hidden="true">
            ${days.map(d => `<span class="day-${esc(d.id)} ${weekDays.has(d.id) ? 'on' : ''}"></span>`).join('')}
          </div>
        </div>
        <div class="stat">
          <span class="stat-num">${h.length}</span>
          <span class="meta">Sessions logged</span>
        </div>
      </div>
      <h2 class="h-section">Past sessions</h2>
      ${h.length ? `<ul class="log">${h.slice().reverse().map(entryHtml).join('')}</ul>`
        : `<p class="empty">No sessions yet. Start one from the Workout tab and it appears here when you tap Finish and save.</p>`}
      <section class="card">
        <h2 class="h-section">Backup</h2>
        <p class="meta">Your log is stored on this iPhone only. Export a backup every few weeks, and import it if you change phone.</p>
        <div class="row">
          <button type="button" class="btn" data-action="export">Export backup</button>
          <label class="btn" for="import-file">Import backup</label>
          <input type="file" id="import-file" class="sr-only" accept=".json,application/json">
        </div>
      </section>`;
  }

  function entryHtml(e) {
    const mins = Math.round(e.durationSec / 60);
    const sets = e.exercises.reduce((t, x) => t + x.sets.length, 0);
    const vol = volumeOf(e);
    return `
      <li class="day-${esc(e.dayId)}">
        <details>
          <summary>
            <span class="chip" aria-hidden="true">${esc(e.dayId)}</span>
            <span class="log-main">
              <strong>${esc(fmtDate(e.startedAt))}, ${esc(e.dayName)}</strong>
              <span class="meta">${mins} min, ${sets} sets${vol ? `, ${fmtKg(vol)} kg moved` : ''}</span>
            </span>
          </summary>
          <div class="log-body">
            <ul>
              ${e.exercises.filter(x => x.sets.length).map(x => `
                <li><span>${esc(x.name)}</span>
                <span class="muted">${x.weight ? fmtKg(x.weight) + ' kg × ' : ''}${x.sets.map(r => r + (x.unit === 'min' ? ' min' : x.unit || '')).join(', ')}</span></li>`).join('')}
            </ul>
            <button type="button" class="btn btn-quiet" data-action="delete" data-id="${esc(e.id)}">Delete this session</button>
          </div>
        </details>
      </li>`;
  }

  // ---------- Actions ----------
  function startSession(dayId) {
    const day = dayById(dayId);
    const weights = store.get(KEYS.weights, {});
    const s = { dayId, startedAt: new Date().toISOString(), exercises: {} };
    day.exercises.forEach(ex => {
      s.exercises[ex.id] = { weight: ex.weighted && weights[ex.id] != null ? String(weights[ex.id]) : '', sets: Array(ex.sets).fill(null) };
    });
    saveCurrent(s);
    keepAwake();
    render();
    window.scrollTo(0, 0);
  }

  function tapSet(exId, i) {
    const s = current(); if (!s) return;
    const ex = exIn(dayById(s.dayId), exId); if (!ex) return;
    const sets = s.exercises[exId].sets;
    if (sets[i] == null) {
      sets[i] = targetReps(ex);
      const isLastSetOfSession = countSets(s).done === countSets(s).total;
      if (!isLastSetOfSession) startRest(ex.rest);
    } else {
      const w = unitWord(unitOf(ex)); const label = w[0].toUpperCase() + w.slice(1);
      const v = prompt(`${label} for set ${i + 1}. Clear it to untick the set.`, sets[i]);
      if (v === null) return;
      const n = parseInt(v, 10);
      sets[i] = Number.isFinite(n) && n > 0 ? n : null;
    }
    saveCurrent(s);
    render();
  }

  function stepWeight(exId, dir) {
    const s = current(); if (!s) return;
    const ex = exIn(dayById(s.dayId), exId);
    const inc = ex.increment || PLAN.defaultIncrement || 2.5;
    const cur = parseFloat(String(s.exercises[exId].weight).replace(',', '.')) || 0;
    const next = Math.max(0, Math.round((cur + dir * inc) * 100) / 100);
    s.exercises[exId].weight = String(next);
    saveCurrent(s);
    const input = document.getElementById('w-' + exId);
    if (input) input.value = s.exercises[exId].weight;
  }

  function finishSession() {
    const s = current(); if (!s) return;
    const day = dayById(s.dayId);
    const { done, total } = countSets(s);
    const msg = done ? `Save this session? ${done} of ${total} sets done.` : 'No sets ticked yet. Save anyway?';
    if (!confirm(msg)) return;

    const ended = new Date();
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      dayId: day.id,
      dayName: day.name,
      startedAt: s.startedAt,
      endedAt: ended.toISOString(),
      durationSec: Math.round((ended - Date.parse(s.startedAt)) / 1000),
      exercises: day.exercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        unit: unitOf(ex),
        weight: ex.weighted ? (parseFloat(String(s.exercises[ex.id].weight).replace(',', '.')) || 0) : 0,
        sets: s.exercises[ex.id].sets.filter(r => r != null)
      }))
    };

    const h = history(); h.push(entry);
    if (!store.set(KEYS.history, h)) return;
    const weights = store.get(KEYS.weights, {});
    entry.exercises.forEach(e => { if (e.weight > 0) weights[e.id] = e.weight; });
    store.set(KEYS.weights, weights);
    store.del(KEYS.current);
    stopRest(); releaseAwake();

    selectedDay = null;
    flash = `Saved ${day.name}: ${Math.round(entry.durationSec / 60)} min, ${done} of ${total} sets.`;
    render();
    window.scrollTo(0, 0);
  }

  function discardSession() {
    if (!confirm('Discard this session? Nothing from it will be saved.')) return;
    store.del(KEYS.current);
    stopRest(); releaseAwake();
    render();
  }

  function deleteEntry(id) {
    if (!confirm('Delete this session from your history?')) return;
    store.set(KEYS.history, history().filter(e => e.id !== id));
    render();
  }

  async function exportBackup() {
    const data = { app: 'gym-log', version: 1, exportedAt: new Date().toISOString(), history: history(), weights: store.get(KEYS.weights, {}) };
    const name = `gym-log-backup-${new Date().toISOString().slice(0, 10)}.json`;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    try {
      const file = new File([blob], name, { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Gym Log backup' });
        return;
      }
    } catch (err) { if (err && err.name === 'AbortError') return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  function importBackup(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const incoming = Array.isArray(data) ? data : data.history;
        if (!Array.isArray(incoming)) throw new Error('bad');
        const valid = incoming.filter(e => e && e.id && e.dayId && e.startedAt && Array.isArray(e.exercises));
        const byId = new Map(history().map(e => [e.id, e]));
        let added = 0;
        valid.forEach(e => { if (!byId.has(e.id)) { byId.set(e.id, e); added++; } });
        const merged = [...byId.values()].sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt));
        store.set(KEYS.history, merged);
        if (data.weights && typeof data.weights === 'object') {
          store.set(KEYS.weights, Object.assign({}, data.weights, store.get(KEYS.weights, {})));
        }
        alert(`Import finished. ${added} new session${added === 1 ? '' : 's'} added.`);
        render();
      } catch {
        alert('That file isn\'t a Gym Log backup. Choose a file exported from this app.');
      }
    };
    reader.readAsText(file);
  }

  // ---------- Rest timer ----------
  const restbar = $('#restbar');
  let rest = null, restTimer = null, audioCtx = null;

  function startRest(sec) {
    if (!sec) return;
    unlockAudio();
    rest = { endsAt: Date.now() + sec * 1000, total: sec };
    restbar.classList.remove('ended');
    restbar.hidden = false;
    clearInterval(restTimer);
    restTimer = setInterval(updateRest, 250);
    updateRest();
  }
  function updateRest() {
    if (!rest) return;
    const left = (rest.endsAt - Date.now()) / 1000;
    if (left <= 0) { endRest(true); return; }
    $('#rest-time').textContent = fmtClock(Math.ceil(left));
    $('#rest-fill').style.transform = `scaleX(${Math.min(1, left / rest.total)})`;
  }
  function endRest(alertUser) {
    clearInterval(restTimer); rest = null;
    if (!alertUser) { restbar.hidden = true; return; }
    beep();
    restbar.classList.add('ended');
    $('#rest-time').textContent = 'Next set';
    $('#rest-fill').style.transform = 'scaleX(0)';
    setTimeout(() => { if (!rest) { restbar.hidden = true; restbar.classList.remove('ended'); } }, 4000);
  }
  const stopRest = () => endRest(false);

  function unlockAudio() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch { /* no audio */ }
  }
  function beep() {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    if (!audioCtx) return;
    try {
      const t0 = audioCtx.currentTime;
      [0, 0.25, 0.5].forEach(t => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.frequency.value = 880;
        g.gain.setValueAtTime(0.0001, t0 + t);
        g.gain.exponentialRampToValueAtTime(0.3, t0 + t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + t + 0.18);
        o.connect(g).connect(audioCtx.destination);
        o.start(t0 + t); o.stop(t0 + t + 0.2);
      });
    } catch { /* ignore */ }
  }

  // Keep the screen on during a session where the phone allows it
  let wakeLock = null;
  async function keepAwake() {
    try { if ('wakeLock' in navigator && !wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } }
    catch { wakeLock = null; }
  }
  function releaseAwake() { try { wakeLock && wakeLock.release(); } catch { /* ignore */ } wakeLock = null; }

  // ---------- Events ----------
  document.querySelector('.tabs').addEventListener('click', e => {
    const b = e.target.closest('[data-view]'); if (!b) return;
    view = b.dataset.view; render(); window.scrollTo(0, 0);
  });

  app.addEventListener('click', e => {
    const t = e.target.closest('[data-action]'); if (!t) return;
    const { action, day, ex, i, id } = t.dataset;
    if (action === 'pick') { selectedDay = day; render(); }
    else if (action === 'start') { unlockAudio(); startSession(day); }
    else if (action === 'set') { unlockAudio(); tapSet(ex, Number(i)); }
    else if (action === 'wup') stepWeight(ex, 1);
    else if (action === 'wdown') stepWeight(ex, -1);
    else if (action === 'finish') finishSession();
    else if (action === 'discard') discardSession();
    else if (action === 'delete') deleteEntry(id);
    else if (action === 'export') exportBackup();
  });

  app.addEventListener('input', e => {
    const t = e.target;
    if (!t.classList.contains('w-input')) return;
    const s = current(); if (!s) return;
    s.exercises[t.dataset.ex].weight = t.value.replace(',', '.');
    saveCurrent(s);
  });

  app.addEventListener('change', e => {
    if (e.target.id === 'import-file' && e.target.files[0]) importBackup(e.target.files[0]);
  });

  $('#rest-add').addEventListener('click', () => { if (rest) { rest.endsAt += 15000; rest.total += 15; updateRest(); } });
  $('#rest-skip').addEventListener('click', stopRest);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      updateRest();
      if (current()) keepAwake();
    }
  });

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  render();
})();
