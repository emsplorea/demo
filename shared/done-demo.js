(function () {
  var root = document.documentElement;
  var buttons = document.querySelectorAll('[data-set-theme]');
  var meta = document.querySelector('meta[name="theme-color"]');
  var bars = { light: '#FFFFFF', dark: '#120428', dim: '#1C1B24' };
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set-theme') === theme)); });
    if (meta) meta.setAttribute('content', bars[theme]);
  }
  apply(root.getAttribute('data-theme') || 'light');
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var theme = b.getAttribute('data-set-theme');
      apply(theme);
      try { localStorage.setItem('done-demo-theme', theme); } catch (e) {}
    });
  });

  if (!('IntersectionObserver' in window)) return;
  document.querySelectorAll('.flow').forEach(function (flow) {
    var links = flow.querySelectorAll('.stepnav a');
    var nav = flow.querySelector('.stepnav ol');
    var current = null;
    function mark(id) {
      if (id === current) return;
      current = id;
      links.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + id;
        if (on) {
          a.setAttribute('aria-current', 'step');
          var left = a.parentElement.offsetLeft - 16;
          if (nav && (left < nav.scrollLeft || left + a.offsetWidth > nav.scrollLeft + nav.clientWidth)) nav.scrollTo({ left: left, behavior: 'smooth' });
        } else {
          a.removeAttribute('aria-current');
        }
      });
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) mark(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    flow.querySelectorAll('.step').forEach(function (s) { io.observe(s); });
  });
})();

(function () {
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-film]').forEach(function (film) {
    var data = JSON.parse(film.getAttribute('data-film'));
    var beats = data.beats;
    var stage = film.querySelector('.film-stage');
    var caption = film.querySelector('[data-caption]');
    var bar = film.querySelector('[data-progress]');
    var play = film.querySelector('[data-play]');
    var playLabel = play.querySelector('span');
    var restart = film.querySelector('[data-restart]');
    var chapters = film.querySelectorAll('[data-chapter]');
    var panels = film.querySelectorAll('[data-panel]');
    var screens = film.querySelectorAll('[data-screen]');
    var actors = {};
    var initCls = {};
    film.querySelectorAll('[data-actor]').forEach(function (a) {
      var id = a.getAttribute('data-actor');
      actors[id] = a;
      initCls[id] = a.getAttribute('class').replace(/^actor\s*/, '');
    });
    var total = 0;
    var starts = beats.map(function (b) { var s = total; total += b.d; return s; });
    var index = 0;
    var timer = null;
    var playing = false;
    var ended = false;
    var touched = false;
    var autoPaused = false;
    var beatStart = 0;
    var remaining = 0;
    var walkTimers = [];

    function stateAt(i) {
      var st = {};
      Object.keys(actors).forEach(function (id) {
        var p = (data.init[id] || [0, 0]);
        st[id] = { x: p[0], y: p[1], o: null, cls: initCls[id] };
      });
      for (var j = 0; j <= i; j++) {
        var a = beats[j].a || {};
        Object.keys(a).forEach(function (id) {
          var s = st[id];
          var v = a[id];
          if (v.x != null) s.x = v.x;
          if (v.y != null) s.y = v.y;
          if (v.o != null) s.o = v.o;
          if (v.cls != null) s.cls = v.cls;
          if (j < i) s.cls = s.cls.replace(/\bwalk\b/, '');
        });
      }
      return st;
    }
    function place(el, s, dur) {
      el.style.transitionDuration = dur + 'ms';
      el.style.transform = 'translate(' + s.x + 'px,' + s.y + 'px)';
      el.style.opacity = s.o == null ? '' : String(s.o);
      el.setAttribute('class', ('actor ' + s.cls).trim());
    }
    function show(i, animate) {
      index = i;
      var b = beats[i];
      var st = stateAt(i);
      walkTimers.forEach(clearTimeout);
      walkTimers = [];
      if (!animate || reduced) film.classList.add('film--jump');
      Object.keys(actors).forEach(function (id) {
        var a = (b.a || {})[id];
        var s = st[id];
        if (animate && !reduced && a) {
          if (a.from) {
            place(actors[id], { x: a.from[0], y: a.from[1], o: s.o, cls: s.cls }, 0);
            actors[id].getBoundingClientRect();
          }
          place(actors[id], s, a.t || 0);
          if (/\bwalk\b/.test(s.cls)) {
            walkTimers.push(setTimeout(function () { actors[id].classList.remove('walk'); }, a.t || 0));
          }
        } else {
          place(actors[id], { x: s.x, y: s.y, o: s.o, cls: s.cls.replace(/\bwalk\b/, '') }, 0);
        }
      });
      stage.setAttribute('data-flags', b.flags || '');
      panels.forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== b.panel; });
      if (b.screen) screens.forEach(function (s) { s.hidden = s.getAttribute('data-screen') !== b.screen; });
      caption.textContent = b.cap;
      chapters.forEach(function (c) {
        if (Number(c.getAttribute('data-chapter')) === b.ch) c.setAttribute('aria-current', 'step'); else c.removeAttribute('aria-current');
      });
      if (film.classList.contains('film--jump')) {
        requestAnimationFrame(function () { requestAnimationFrame(function () { film.classList.remove('film--jump'); }); });
      }
    }
    function setBar(ms, dur) {
      bar.style.transition = dur ? 'width ' + dur + 'ms linear' : 'none';
      bar.style.width = (100 * ms / total) + '%';
    }
    function schedule(ms) {
      clearTimeout(timer);
      beatStart = Date.now();
      remaining = ms;
      setBar(starts[index] + (beats[index].d - ms), 0);
      bar.getBoundingClientRect();
      setBar(starts[index] + beats[index].d, ms);
      timer = setTimeout(advance, ms);
    }
    function advance() {
      if (index >= beats.length - 1) { finish(); return; }
      show(index + 1, true);
      schedule(beats[index].d);
    }
    function label(text, pressed) {
      playLabel.textContent = text;
      play.setAttribute('aria-pressed', String(pressed));
    }
    function start() {
      if (ended) { ended = false; show(0, false); remaining = 0; }
      playing = true;
      autoPaused = false;
      caption.setAttribute('aria-live', 'off');
      label(data.labels.pause, true);
      schedule(remaining || beats[index].d);
    }
    function pause(auto) {
      if (!playing) return;
      clearTimeout(timer);
      playing = false;
      autoPaused = !!auto;
      remaining = Math.max(0, remaining - (Date.now() - beatStart));
      setBar(starts[index] + beats[index].d - remaining, 0);
      caption.setAttribute('aria-live', 'polite');
      label(data.labels.play, false);
    }
    function finish() {
      playing = false;
      ended = true;
      remaining = 0;
      setBar(total, 0);
      caption.setAttribute('aria-live', 'polite');
      label(data.labels.replay, false);
    }
    function jump(i) {
      touched = true;
      ended = false;
      clearTimeout(timer);
      show(i, false);
      remaining = 0;
      if (playing) schedule(beats[i].d);
      else { setBar(starts[i], 0); caption.setAttribute('aria-live', 'polite'); label(data.labels.play, false); }
    }
    play.addEventListener('click', function () { touched = true; if (playing) pause(); else start(); });
    restart.addEventListener('click', function () { jump(0); });
    chapters.forEach(function (c) {
      c.addEventListener('click', function () {
        var ch = Number(c.getAttribute('data-chapter'));
        for (var i = 0; i < beats.length; i++) { if (beats[i].ch === ch) { jump(i); return; } }
      });
    });
    show(0, false);
    setBar(0, 0);
    if (!reduced && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !playing && !ended && (!touched || autoPaused)) start();
          else if (!e.isIntersecting && playing) pause(true);
        });
      }, { threshold: 0.5 }).observe(stage);
    }
  });
})();

(function () {
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-mpsim]').forEach(function (root) {
    var D = JSON.parse(root.getAttribute('data-mpsim'));
    var t = D.t;
    var MAX = 6;
    var TERMS = ['Bar 1', 'Bar 2', 'Bar 3'];
    var $ = function (s) { return root.querySelector(s); };
    var el = {
      tabs: $('[data-mps-tabs]'), order: $('[data-mps-order]'), grid: $('[data-mps-sendgrid]'), free: $('[data-mps-free]'),
      devices: $('[data-mps-devices]'), served: $('[data-mps-served]'), open: $('[data-mps-open]'), live: $('[data-mps-live]'),
      plus: $('[data-mps-new]'), auto: $('[data-mps-auto]'), autoText: $('[data-mps-autotext]'), help: $('[data-mps-help]'), reducedNote: $('[data-mps-reduced]')
    };
    var S;
    var timers = [];

    function fmt(s, v) { return s.replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }); }
    function money(n) { return 'kr ' + n + ',00'; }
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function product(id) { for (var i = 0; i < D.products.length; i++) if (D.products[i].id === id) return D.products[i]; }
    function total(o) { var s = 0; Object.keys(o.lines).forEach(function (k) { s += product(k).price * o.lines[k]; }); return s; }
    function count(o) { var s = 0; Object.keys(o.lines).forEach(function (k) { s += o.lines[k]; }); return s; }
    function order(id) { for (var i = 0; i < S.orders.length; i++) if (S.orders[i].id === id) return S.orders[i]; return null; }
    function term(i) { return S.terms[i]; }
    function label(o) { return '#' + o.n; }
    function announce(msg) { el.live.textContent = ''; setTimeout(function () { el.live.textContent = msg; }, 30); }
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }

    function newOrder(lines) {
      if (S.orders.length >= MAX) { announce(t.aFull); return null; }
      S.seq += 1;
      var used = S.orders.map(function (o) { return o.n; });
      var n = 1; while (used.indexOf(n) !== -1) n++;
      var o = { id: 'o' + S.seq, n: n, lines: lines || {}, state: 'editable', term: null, sentAt: 0, checking: false };
      S.orders.push(o);
      S.orders.sort(function (a, b) { return a.n - b.n; });
      S.selected = o.id;
      return o;
    }
    function reset(scenario) {
      clearTimers();
      S = { scenario: scenario || 'calm', orders: [], seq: 0, selected: null, served: 0, auto: true, sends: 0, terms: TERMS.map(function (name) { return { name: name, state: 'free', order: null }; }) };
      newOrder({ pils: 2, nachos: 1 });
      render();
    }
    function nextAfterSend(sent) {
      if (!S.auto) return;
      for (var i = 0; i < S.orders.length; i++) {
        var o = S.orders[i];
        if (o.id !== sent.id && o.state === 'editable') { S.selected = o.id; return; }
      }
      newOrder();
    }
    function send(ti) {
      var o = order(S.selected);
      var tm = term(ti);
      if (!o || o.state !== 'editable' || count(o) === 0 || tm.state !== 'free') return;
      o.state = 'pending'; o.term = ti; o.sentAt = Date.now();
      tm.state = 'busy'; tm.order = o.id;
      S.sends += 1;
      announce(fmt(t.aSent, { order: label(o), terminal: tm.name }));
      schedule(o);
      nextAfterSend(o);
      render();
    }
    function schedule(o) {
      if (reduced || S.scenario === 'calm') return;
      var outcome = 'approved';
      var delay = 3200 + Math.round(Math.random() * 2200);
      if (S.scenario === 'problems') {
        outcome = S.sends === 1 ? 'declined' : S.sends === 2 ? 'unknown' : 'approved';
        delay = 2400;
      }
      timers.push(setTimeout(function () { if (o.state === 'pending') resolve(o.term, outcome); }, delay));
    }
    function resolve(ti, outcome) {
      var tm = term(ti);
      var o = order(tm.order);
      if (!o || o.state !== 'pending') return;
      if (outcome === 'approved') {
        S.orders = S.orders.filter(function (x) { return x.id !== o.id; });
        tm.state = 'free'; tm.order = null;
        S.served += 1;
        if (S.selected === o.id) { if (S.orders.length) S.selected = S.orders[0].id; else newOrder(); }
        if (!S.orders.length) newOrder();
        announce(fmt(t.aPaid, { order: label(o), terminal: tm.name }));
      } else if (outcome === 'declined') {
        o.state = 'declined'; tm.state = 'free'; tm.order = null;
        announce(fmt(t.aDeclined, { order: label(o) }));
      } else {
        o.state = 'unknown'; tm.state = 'unknown';
        announce(fmt(t.aUnknown, { order: label(o) }));
      }
      render();
    }
    function checkStatus(o) {
      if (o.state !== 'unknown' || o.checking) return;
      o.checking = true;
      render();
      timers.push(setTimeout(function () {
        var tm = term(o.term);
        S.orders = S.orders.filter(function (x) { return x.id !== o.id; });
        tm.state = 'free'; tm.order = null;
        S.served += 1;
        if (S.selected === o.id) { if (S.orders.length) S.selected = S.orders[0].id; else newOrder(); }
        if (!S.orders.length) newOrder();
        announce(fmt(t.aStatusOk, { order: label(o) }));
        render();
      }, reduced ? 0 : 1200));
    }

    function tabHtml(o) {
      var status = o.state === 'pending' ? fmt(t.tabPending, { terminal: TERMS[o.term] }) : o.state === 'declined' ? t.tabDeclined : o.state === 'unknown' ? t.tabUnknown : t.tabNew;
      return '<button type="button" class="mps-tab is-' + o.state + '" data-key="tab-' + o.id + '" data-mps-tab="' + o.id + '" aria-pressed="' + (o.id === S.selected) + '"><b>' + label(o) + '</b><span>' + money(total(o)) + '</span><em>' + esc(status) + '</em></button>';
    }
    function linesHtml(o) {
      var keys = Object.keys(o.lines).filter(function (k) { return o.lines[k] > 0; });
      if (!keys.length) return '<p class="mps-empty">' + t.empty + '</p>';
      return '<ul class="mps-lines">' + keys.map(function (k) { var p = product(k); return '<li><span>' + o.lines[k] + '</span><span>' + esc(p.name) + '</span><b>' + money(p.price * o.lines[k]) + '</b></li>'; }).join('') + '</ul>';
    }
    function orderHtml(o) {
      var head = '<div class="mps-order-head"><b>' + label(o) + '</b><span>' + t.total + ' <strong>' + money(total(o)) + '</strong></span></div>';
      if (o.state === 'pending') {
        return head + '<div class="mps-state is-pending"><span class="mps-ico" aria-hidden="true">⏳</span><b>' + t.pending + '</b><span>' + fmt(t.pendingSub, { amount: money(total(o)), terminal: TERMS[o.term] }) + '</span><span class="mps-elapsed" data-mps-elapsed="' + o.id + '">' + fmt(t.seconds, { s: Math.floor((Date.now() - o.sentAt) / 1000) }) + '</span></div>';
      }
      if (o.state === 'declined') {
        return head + '<div class="mps-state is-declined"><span class="mps-ico" aria-hidden="true">✕</span><b>' + t.declined + '</b><div class="mps-actions"><button type="button" class="mps-btn mps-btn--primary" data-key="retry" data-mps-retry>' + t.retry + '</button><button type="button" class="mps-btn" data-key="cancel" data-mps-cancel>' + t.cancelOrder + '</button></div></div>';
      }
      if (o.state === 'unknown') {
        return head + '<div class="mps-state is-unknown"><span class="mps-ico" aria-hidden="true">?</span><b>' + t.unknown + '</b><span>' + t.unknownSub + '</span><div class="mps-actions"><button type="button" class="mps-btn mps-btn--primary" data-key="check" data-mps-check' + (o.checking ? ' disabled' : '') + '>' + (o.checking ? t.checking : t.checkStatus) + '</button></div></div>';
      }
      return head + linesHtml(o);
    }
    function render() {
      var active = document.activeElement && root.contains(document.activeElement) ? document.activeElement.getAttribute('data-key') : null;
      var sel = order(S.selected);
      el.tabs.innerHTML = S.orders.map(tabHtml).join('');
      el.plus.disabled = S.orders.length >= MAX;
      el.order.innerHTML = sel ? orderHtml(sel) : '';
      var canSend = sel && sel.state === 'editable' && count(sel) > 0;
      var free = S.terms.filter(function (x) { return x.state === 'free'; }).length;
      el.free.textContent = fmt(t.free, { n: free, m: S.terms.length });
      el.grid.innerHTML = S.terms.map(function (tm, i) {
        var st = tm.state === 'free' ? t.stFree : tm.state === 'busy' ? t.stBusy : t.stUnknown;
        var ok = canSend && tm.state === 'free';
        var aria = ok ? fmt(t.sendTo, { order: label(sel), terminal: tm.name }) : tm.name + ', ' + st;
        return '<button type="button" class="mps-term is-' + tm.state + '" data-key="send-' + i + '" data-mps-send="' + i + '" aria-label="' + esc(aria) + '"' + (ok ? '' : ' disabled') + '><span class="mps-dot" aria-hidden="true"></span><b>' + tm.name + '</b><span>' + st + '</span></button>';
      }).join('');
      el.devices.innerHTML = S.terms.map(function (tm, i) {
        var o = tm.order ? order(tm.order) : null;
        var screen = tm.state === 'busy' && o ? '<b>' + money(total(o)) + '</b><span>' + t.termTap + '</span>' : tm.state === 'unknown' ? '<b>?</b><span>' + t.termNoAnswer + '</span>' : '<span>' + t.termReady + '</span>';
        var controls = tm.state === 'busy' ? '<div class="mps-outcomes" role="group" aria-label="' + esc(fmt(t.outcomeLabel, { terminal: tm.name })) + '"><button type="button" class="mps-out is-ok" data-key="ok-' + i + '" data-mps-out="' + i + ':approved">' + t.approve + '</button><button type="button" class="mps-out is-no" data-key="no-' + i + '" data-mps-out="' + i + ':declined">' + t.decline + '</button><button type="button" class="mps-out is-unk" data-key="unk-' + i + '" data-mps-out="' + i + ':unknown">' + t.noAnswer + '</button></div>' : '';
        return '<div class="mps-device is-' + tm.state + '"><p class="mps-device-name">' + tm.name + '</p><div class="mps-screen">' + screen + '</div>' + controls + '</div>';
      }).join('');
      el.served.textContent = S.served;
      el.open.textContent = S.orders.length + ' / ' + MAX;
      el.auto.setAttribute('aria-checked', String(S.auto));
      el.autoText.textContent = S.auto ? t.on : t.off;
      root.querySelectorAll('[data-mps-add],[data-mps-typical]').forEach(function (b) { b.disabled = !(sel && sel.state === 'editable'); });
      if (active) {
        var again = root.querySelector('[data-key="' + active + '"]');
        if (again && !again.disabled) again.focus();
        else if (sel) { var tab = root.querySelector('[data-key="tab-' + sel.id + '"]'); if (tab) tab.focus(); }
      }
    }

    root.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || !root.contains(b) || b.disabled) return;
      var sel = order(S.selected);
      if (b.hasAttribute('data-mps-add')) { if (sel && sel.state === 'editable') { var id = b.getAttribute('data-mps-add'); sel.lines[id] = (sel.lines[id] || 0) + 1; render(); } }
      else if (b.hasAttribute('data-mps-typical')) { if (sel && sel.state === 'editable') { var picks = [['pils', 2], ['cola', 1], ['nachos', 1], ['ipa', 1], ['popcorn', 1], ['cider', 2]]; var a = picks[S.seq % picks.length], c = picks[(S.seq + 2) % picks.length]; sel.lines[a[0]] = (sel.lines[a[0]] || 0) + a[1]; sel.lines[c[0]] = (sel.lines[c[0]] || 0) + c[1]; render(); } }
      else if (b.hasAttribute('data-mps-new')) { newOrder(); render(); }
      else if (b.hasAttribute('data-mps-tab')) { S.selected = b.getAttribute('data-mps-tab'); render(); }
      else if (b.hasAttribute('data-mps-send')) { send(Number(b.getAttribute('data-mps-send'))); }
      else if (b.hasAttribute('data-mps-out')) { var p = b.getAttribute('data-mps-out').split(':'); resolve(Number(p[0]), p[1]); }
      else if (b.hasAttribute('data-mps-retry')) { if (sel) { sel.state = 'editable'; sel.term = null; render(); } }
      else if (b.hasAttribute('data-mps-cancel')) { if (sel) { S.orders = S.orders.filter(function (x) { return x.id !== sel.id; }); if (S.orders.length) S.selected = S.orders[0].id; else newOrder(); render(); } }
      else if (b.hasAttribute('data-mps-check')) { if (sel) checkStatus(sel); }
      else if (b.hasAttribute('data-mps-auto')) { S.auto = !S.auto; render(); }
      else if (b.hasAttribute('data-mps-reset')) { reset(S.scenario); }
      else if (b.hasAttribute('data-mps-scenario')) {
        var k = b.getAttribute('data-mps-scenario');
        root.querySelectorAll('[data-mps-scenario]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        el.help.textContent = t.scenarioHelp[k];
        reset(k);
      }
    });
    setInterval(function () {
      root.querySelectorAll('[data-mps-elapsed]').forEach(function (n) {
        var o = order(n.getAttribute('data-mps-elapsed'));
        if (o) n.textContent = fmt(t.seconds, { s: Math.floor((Date.now() - o.sentAt) / 1000) });
      });
    }, 1000);
    if (reduced) el.reducedNote.hidden = false;
    reset('calm');
  });
})();
