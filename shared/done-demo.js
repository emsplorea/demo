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
