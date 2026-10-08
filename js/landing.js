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
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
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
    if (reduce || duration <= 0) {
      el.textContent = formatMoney(target);
      return;
    }
    var start = 0;
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatMoney(Math.round(start + (target - start) * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function runGauges() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      countUp(el, Number(el.getAttribute('data-count')), 1100);
    });
    document.querySelectorAll('.gauge-fill').forEach(function (el) {
      el.classList.add('is-on');
    });
  }

  var money = document.getElementById('money');
  if (money) {
    if (!reduce && 'IntersectionObserver' in window) {
      var gio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runGauges();
            gio.disconnect();
          }
        });
      }, { threshold: 0.35 });
      gio.observe(money);
    } else {
      runGauges();
    }
  }

  function runSmsThread() {
    var phone = document.getElementById('sms-thread');
    if (!phone) return;
    var inbound = phone.querySelector('.sms-in');
    var outbound = phone.querySelector('.sms-out');
    if (!inbound || !outbound) return;

    var replies = ['Y', 'N', 'R'];
    var i = 0;

    if (reduce) {
      outbound.textContent = 'Y';
      inbound.classList.add('is-on');
      outbound.classList.add('is-on');
      return;
    }

    function cycle() {
      inbound.classList.remove('is-on');
      outbound.classList.remove('is-on');
      outbound.textContent = replies[i % replies.length];
      i += 1;
      setTimeout(function () { inbound.classList.add('is-on'); }, 400);
      setTimeout(function () { outbound.classList.add('is-on'); }, 1800);
      setTimeout(cycle, 5600);
    }

    cycle();
  }

  var subs = document.getElementById('subs');
  if (subs) {
    if (!reduce && 'IntersectionObserver' in window) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runSmsThread();
            sio.disconnect();
          }
        });
      }, { threshold: 0.35 });
      sio.observe(subs);
    } else {
      runSmsThread();
    }
  }
})();
