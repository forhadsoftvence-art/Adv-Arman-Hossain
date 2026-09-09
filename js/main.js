/* অ্যাডভোকেট আরমান হোসেন — ইন্টার‌্যাকশন স্ক্রিপ্ট */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর */
  var BN = '০১২৩৪৫৬৭৮৯';
  function toBn(v) {
    return String(v).replace(/\d/g, function (d) { return BN[+d]; });
  }

  /* ফুটারে চলতি বছর (বাংলায়) */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = toBn(new Date().getFullYear());

  /* হেডার শ্যাডো + ব্যাক-টু-টপ */
  var header = $('#siteHeader');
  var backTop = $('#backTop');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('scrolled', y > 10);
    backTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* মোবাইল মেনু */
  var navToggle = $('#navToggle');
  navToggle.addEventListener('click', function () {
    var open = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন');
  });
  $$('#siteNav a').forEach(function (a) {
    a.addEventListener('click', function () {
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* স্ক্রল-স্পাই: সক্রিয় সেকশনে মেনু হাইলাইট */
  var navLinks = $$('#siteNav a[href^="#"]').filter(function (a) { return !a.classList.contains('nav-cta'); });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    $$('main section[id]').forEach(function (s) { spy.observe(s); });

    /* রিভিল অ্যানিমেশন */
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el) { ro.observe(el); });

    /* পরিসংখ্যান কাউন্টার (বাংলা সংখ্যায়) */
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        var el = e.target;
        var end = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var t0 = null;
        var DUR = 1500;
        function step(t) {
          if (t0 === null) t0 = t;
          var p = Math.min(1, (t - t0) / DUR);
          var v = Math.round(end * (1 - Math.pow(1 - p, 3)));
          el.textContent = toBn(v) + suffix;
          if (p < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    $$('[data-count]').forEach(function (el) { co.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* প্রশ্নোত্তর অ্যাকর্ডিয়ন */
  $$('.faq-item').forEach(function (item) {
    var btn = $('.faq-q', item);
    var ans = $('.faq-a', item);
    btn.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      ans.style.maxHeight = open ? ans.scrollHeight + 'px' : '0px';
    });
  });

  /* যোগাযোগ ফর্ম — যাচাই + মেইলটো */
  var form = $('#contactForm');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    $$('.field-error', form).forEach(function (e) { e.textContent = ''; });
    var status = $('#formStatus');
    var els = form.elements;
    var name = els.fName.value.trim();
    var phone = els.fPhone.value.trim().replace(/[\s-]/g, '');
    var topic = els.fTopic.value;
    var msg = els.fMessage.value.trim();
    var ok = true;

    function fail(input, message) {
      ok = false;
      var box = input.closest('.field').querySelector('.field-error');
      if (box) box.textContent = message;
    }

    if (name.length < 2) fail(els.fName, 'অনুগ্রহ করে আপনার নাম লিখুন।');

    /* ০১৭XXXXXXXX / +88017XXXXXXXX — বাংলা ও ইংরেজি দুই ধরনের সংখ্যাই গ্রহণযোগ্য */
    var phDigits = phone
      .replace(/[০-৯]/g, function (c) { return String(BN.indexOf(c)); });
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(phDigits)) {
      fail(els.fPhone, 'সঠিক মোবাইল নম্বর লিখুন (যেমন: ০১৭XXXXXXXX)।');
    }
    if (msg.length < 10) fail(els.fMessage, 'কমপক্ষে ১০ অক্ষরের বিবরণ লিখুন।');

    if (!ok) {
      status.className = 'form-status error';
      status.textContent = '⚠ কিছু তথ্য ঠিকভাবে লেখা হয়নি — অনুগ্রহ করে সংশোধন করুন।';
      return;
    }

    var subject = encodeURIComponent('ওয়েবসাইটের মাধ্যমে আইনি পরামর্শের অনুরোধ — ' + name);
    var body = encodeURIComponent(
      'নাম: ' + name + '\nমোবাইল: ' + phone + '\nবিষয়: ' + topic + '\n\nসমস্যার বিবরণ:\n' + msg
    );
    window.location.href = 'mailto:adv.armanhossain.du@gmail.com?subject=' + subject + '&body=' + body;

    status.className = 'form-status success';
    status.textContent = '✔ ধন্যবাদ, ' + name + '! আপনার ইমেইল অ্যাপ খুলে গেছে — বার্তাটি পাঠালেই দ্রুত যোগাযোগ করা হবে। জরুরি প্রয়োজনে সরাসরি কল করুন।';
    form.reset();
  });
})();
