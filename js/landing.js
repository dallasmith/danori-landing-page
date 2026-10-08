(function () {
  var header = document.querySelector('header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');

  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-acc-item');
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-acc-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
        var openBtn = openItem.querySelector('.faq-q');
        if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  function formatMoney(n) {
    return '$' + n.toLocaleString('en-US');
  }

  function countUp(el, target, duration) {
    el._gaugeGen = (el._gaugeGen || 0) + 1;
    var gen = el._gaugeGen;
    if (reduce || duration <= 0) {
      el.textContent = formatMoney(target);
      return;
    }
    var start = 0;
    var t0 = null;
    function step(ts) {
      if (gen !== el._gaugeGen) return;
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatMoney(Math.round(start + (target - start) * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function runGauge(card) {
    var el = card.querySelector('[data-count]');
    var fill = card.querySelector('.gauge-fill');
    if (el) countUp(el, Number(el.getAttribute('data-count')), reduce ? 0 : 1100);
    if (fill) fill.classList.add('is-on');
  }

  function resetGauge(card) {
    var el = card.querySelector('[data-count]');
    var fill = card.querySelector('.gauge-fill');
    if (el) {
      el._gaugeGen = (el._gaugeGen || 0) + 1;
      el.textContent = formatMoney(0);
    }
    if (fill) {
      fill.style.transition = 'none';
      fill.classList.remove('is-on');
      void fill.offsetWidth;
      fill.style.transition = '';
    }
  }

  var gaugeCards = document.querySelectorAll('.gauge');
  if (gaugeCards.length) {
    if ('IntersectionObserver' in window) {
      var gio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) runGauge(entry.target);
          else resetGauge(entry.target);
        });
      }, { threshold: 0.1 });
      gaugeCards.forEach(function (card) { gio.observe(card); });
    } else {
      gaugeCards.forEach(runGauge);
    }
  }

  var smsTimers = [];
  var smsRunning = false;
  var smsIndex = 0;

  function clearSmsTimers() {
    smsTimers.forEach(clearTimeout);
    smsTimers = [];
  }

  function stopSmsThread() {
    smsRunning = false;
    clearSmsTimers();
    var phone = document.getElementById('sms-thread');
    if (!phone) return;
    var inbound = phone.querySelector('.sms-in');
    var outbound = phone.querySelector('.sms-out');
    var typing = phone.querySelector('.sms-typing');
    if (inbound) inbound.classList.remove('is-on');
    if (outbound) outbound.classList.remove('is-on');
    if (typing) typing.classList.remove('is-on');
  }

  function runSmsThread() {
    var phone = document.getElementById('sms-thread');
    if (!phone) return;
    var inbound = phone.querySelector('.sms-in');
    var outbound = phone.querySelector('.sms-out');
    var typing = phone.querySelector('.sms-typing');
    if (!inbound || !outbound) return;

    var replies = ['Y', 'N', 'R'];

    if (reduce) {
      outbound.textContent = 'Y';
      inbound.classList.add('is-on');
      outbound.classList.add('is-on');
      if (typing) typing.classList.remove('is-on');
      return;
    }

    stopSmsThread();
    smsRunning = true;
    smsIndex = 0;

    function cycle() {
      if (!smsRunning) return;
      inbound.classList.remove('is-on');
      outbound.classList.remove('is-on');
      if (typing) typing.classList.remove('is-on');
      outbound.textContent = replies[smsIndex % replies.length];
      smsIndex += 1;
      smsTimers.push(setTimeout(function () {
        if (smsRunning) inbound.classList.add('is-on');
      }, 400));
      smsTimers.push(setTimeout(function () {
        if (smsRunning && typing) typing.classList.add('is-on');
      }, 1800));
      smsTimers.push(setTimeout(function () {
        if (!smsRunning) return;
        if (typing) typing.classList.remove('is-on');
        outbound.classList.add('is-on');
      }, 2800));
      smsTimers.push(setTimeout(cycle, 6600));
    }

    cycle();
  }

  var subs = document.getElementById('subs');
  if (subs) {
    if (!reduce && 'IntersectionObserver' in window) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) runSmsThread();
          else stopSmsThread();
        });
      }, { threshold: 0.35 });
      sio.observe(subs);
    } else {
      runSmsThread();
    }
  }

  var stickyBar = document.getElementById('mobile-cta-bar');
  var hero = document.getElementById('hero');
  var finalCta = document.getElementById('final-cta');
  if (stickyBar && hero && 'IntersectionObserver' in window) {
    var heroInView = true;
    var ctaInView = false;
    function syncStickyCta() {
      var show = !heroInView && !ctaInView;
      stickyBar.classList.toggle('is-visible', show);
      stickyBar.setAttribute('aria-hidden', show ? 'false' : 'true');
      var link = stickyBar.querySelector('a');
      if (link) link.tabIndex = show ? 0 : -1;
    }
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target === hero) heroInView = entry.isIntersecting;
        if (entry.target === finalCta) ctaInView = entry.isIntersecting;
      });
      syncStickyCta();
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    cio.observe(hero);
    if (finalCta) cio.observe(finalCta);
  }

  var toggle = document.querySelector('.pricing-toggle');
  if (toggle) {
    function setPeriod(period) {
      var annual = period === 'annual';
      toggle.querySelectorAll('button').forEach(function (btn) {
        var on = btn.getAttribute('data-period') === period;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      document.querySelectorAll('.pricing-amount').forEach(function (el) {
        el.textContent = annual ? el.getAttribute('data-annual') : el.getAttribute('data-monthly');
      });
      document.querySelectorAll('.pricing-period').forEach(function (el) {
        el.textContent = annual ? '/year' : '/month';
      });
      document.querySelectorAll('.pricing-save').forEach(function (el) {
        el.hidden = !annual;
      });
    }
    toggle.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setPeriod(btn.getAttribute('data-period'));
      });
    });
  }
})();
