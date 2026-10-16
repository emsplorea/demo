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
