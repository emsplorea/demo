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
  var sim = document.querySelector('[data-sim]');
  if (!sim) return;
  var data = JSON.parse(sim.getAttribute('data-steps-json'));
  var list = sim.querySelector('[data-steps]');
  var prev = sim.querySelector('[data-prev]');
  var next = sim.querySelector('[data-next]');
  var play = sim.querySelector('[data-play]');
  var live = sim.querySelector('[data-live]');
  var screens = sim.querySelectorAll('[data-screen]');
  var countdownEl = sim.querySelector('[data-countdown]');
  var scenario = 'card';
  var index = 0;
  var timer = null;
  var countdown = null;
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(id) {
    screens.forEach(function (s) { s.hidden = s.getAttribute('data-screen') !== id; });
  }
  function renderList() {
    list.innerHTML = '';
    data.steps[scenario].forEach(function (st, i) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = '<span aria-hidden="true">' + (i + 1) + '</span><strong></strong><em></em>';
      b.querySelector('strong').textContent = st[0];
      b.querySelector('em').textContent = st[1];
      b.addEventListener('click', function () { stop(); go(i); });
      li.appendChild(b);
      list.appendChild(li);
    });
  }
  function go(i) {
    var steps = data.steps[scenario];
    index = Math.max(0, Math.min(i, steps.length - 1));
    list.querySelectorAll('button').forEach(function (b, j) {
      if (j === index) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    var id = data.screens[scenario][index];
    clearInterval(countdown);
    if (id === 'groups' && !reduced) {
      show('fetching');
      setTimeout(function () { if (data.screens[scenario][index] === 'groups') show('groups'); }, 700);
    } else {
      show(id);
    }
    if (id === 'done' && countdownEl) {
      var n = 5;
      countdownEl.textContent = n;
      countdown = setInterval(function () { n = n > 1 ? n - 1 : 5; countdownEl.textContent = n; }, 1000);
    }
    prev.disabled = index === 0;
    next.disabled = index === steps.length - 1;
    live.textContent = 'Steg ' + (index + 1) + ' av ' + steps.length + ': ' + steps[index][0] + '. ' + steps[index][1];
  }
  function stop() {
    clearInterval(timer);
    timer = null;
    play.setAttribute('aria-pressed', 'false');
    play.textContent = 'Spill av';
  }
  prev.addEventListener('click', function () { stop(); go(index - 1); });
  next.addEventListener('click', function () { stop(); go(index + 1); });
  play.addEventListener('click', function () {
    if (timer) { stop(); return; }
    if (index === data.steps[scenario].length - 1) go(0);
    play.setAttribute('aria-pressed', 'true');
    play.textContent = 'Pause';
    timer = setInterval(function () {
      if (index >= data.steps[scenario].length - 1) { stop(); return; }
      go(index + 1);
    }, 3200);
  });
  sim.querySelectorAll('[data-scenario]').forEach(function (b) {
    b.addEventListener('click', function () {
      stop();
      scenario = b.getAttribute('data-scenario');
      sim.querySelectorAll('[data-scenario]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      renderList();
      go(0);
    });
  });
  renderList();
  go(0);
})();
