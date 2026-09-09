/* Premium v2 — lightweight, progressively enhanced interactions. */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const bengaliDigits = '০১২৩৪৫৬৭৮৯';
  const toBengali = (value) => String(value).replace(/\d/g, (digit) => bengaliDigits[Number(digit)]);
  const normalizePhone = (value) => value.trim()
    .replace(/[০-৯]/g, (digit) => String(bengaliDigits.indexOf(digit)))
    .replace(/[\s-]/g, '');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileNav = window.matchMedia('(max-width: 1023px)');
  const header = $('#siteHeader');
  const nav = $('#siteNav');
  const navToggle = $('#navToggle');
  const backTop = $('#backTop');
  const progress = $('#scrollProgress');
  const navLinks = $$('a[href^="#"]', nav);
  const navSections = navLinks.map((link) => ({ link, section: $(link.hash) }))
    .filter(({ section }) => section);

  $('#year').textContent = toBengali(new Date().getFullYear());

  // CTA belongs to .header-actions, not the collapsible menu.
  function setMenu(open, returnFocus = false) {
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন');
    if (returnFocus) navToggle.focus({ preventScroll: true });
  }
  document.documentElement.classList.add('nav-ready');
  navToggle.addEventListener('click', () => {
    setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
  });
  navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
  $('.header-cta').addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false, true);
    }
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setMenu(false);
  });
  document.addEventListener('focusin', (event) => {
    if (!header.contains(event.target)) setMenu(false);
  });
  mobileNav.addEventListener('change', () => setMenu(false));

  // A single rAF per frame handles progress, sticky shadow and scroll-spy.
  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame = 0;
    const y = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    header.classList.toggle('scrolled', y > 12);
    backTop.hidden = y < 500;

    let active = navSections[0];
    const threshold = header.getBoundingClientRect().height + 100;
    navSections.forEach((entry) => {
      if (entry.section.getBoundingClientRect().top <= threshold) active = entry;
    });
    if (maxScroll > 0 && y >= maxScroll - 4) active = navSections[navSections.length - 1];
    navSections.forEach(({ link }) => {
      const isActive = link === active?.link;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleScroll() {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll);
  }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });
  window.addEventListener('load', scheduleScroll, { once: true });
  if (document.fonts?.ready) document.fonts.ready.then(scheduleScroll);
  updateScroll();
  backTop.addEventListener('click', () => {
    // Move focus away from a control that will become hidden after scrolling.
    $('.brand', header).focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });

  // Static, final counter values remain usable when JS or IO is unavailable.
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.remove('is-pending');
        revealObserver.unobserve(target);
      });
    }, { threshold: 0.08 });
    $$('.reveal').forEach((element) => {
      element.classList.add('is-pending');
      revealObserver.observe(element);
    });

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        counterObserver.unobserve(target);
        const end = Number(target.dataset.count);
        const suffix = target.dataset.suffix || '';
        const start = performance.now();
        const duration = 1450;
        function count(now) {
          const fraction = reducedMotion.matches ? 1 : Math.min(1, (now - start) / duration);
          const value = Math.round(end * (1 - Math.pow(1 - fraction, 3)));
          target.textContent = toBengali(value) + suffix;
          if (fraction < 1) window.requestAnimationFrame(count);
        }
        window.requestAnimationFrame(count);
      });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach((element) => counterObserver.observe(element));

    reducedMotion.addEventListener('change', (event) => {
      if (!event.matches) return;
      revealObserver.disconnect();
      counterObserver.disconnect();
      $$('.reveal.is-pending').forEach((element) => element.classList.remove('is-pending'));
      $$('[data-count]').forEach((element) => {
        element.textContent = toBengali(element.dataset.count) + (element.dataset.suffix || '');
      });
    });
  }

  // Pause control for the continuous animation (also pauses on hover/focus).
  const marquee = $('.court-marquee');
  const marqueeToggle = $('#marqueeToggle');
  marquee.classList.add('marquee-ready');
  marqueeToggle.hidden = false;
  marqueeToggle.addEventListener('click', () => {
    const paused = marquee.classList.toggle('paused');
    marqueeToggle.setAttribute('aria-pressed', String(paused));
    marqueeToggle.setAttribute('aria-label', paused ? 'আদালতের তালিকার স্ক্রল চালু করুন' : 'আদালতের তালিকার স্ক্রল থামান');
    marqueeToggle.textContent = paused ? '▶' : 'Ⅱ';
  });

  // Native details/summary is keyboard accessible, and works without JS.
  // Enhance to a single-open accordion without fixed-height clipping.
  const faqItems = $$('.faq-item');
  faqItems.forEach((item) => {
    $('summary', item).addEventListener('click', () => {
      if (item.open) return;
      // Close siblings before the native default action opens this item.
      // Listening to delayed `toggle` events can race during fast key presses.
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  // Netlify Deploy Preview toolbar: hide only on deploy-preview hostnames, once.
  const previewHost = /^deploy-preview-\d+--[^.]+\.netlify\.app$/i.test(location.hostname);
  const params = new URLSearchParams(location.search);
  if (previewHost && !params.has('ntl-drawer-state') && !params.has('ntl-drawer-visible')) {
    params.set('ntl-drawer-state', 'hidden');
    const query = params.toString();
    const nextUrl = location.pathname + (query ? `?${query}` : '') + location.hash;
    window.location.replace(nextUrl);
  }

  // Local validation only: nothing is submitted to a server or stored.
  const form = $('#contactForm');
  const status = $('#formStatus');
  const fields = ['fName', 'fPhone', 'fTopic', 'fMessage'].map((id) => $(`#${id}`));
  form.noValidate = true;
  fields.forEach((input) => {
    const clearError = () => {
      input.removeAttribute('aria-invalid');
      $(`#${input.id}Error`).textContent = '';
      status.textContent = '';
      status.className = 'form-status';
    };
    input.addEventListener('input', clearError);
    input.addEventListener('change', clearError);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    fields.forEach((input) => {
      input.removeAttribute('aria-invalid');
      $(`#${input.id}Error`).textContent = '';
    });
    status.textContent = '';
    status.className = 'form-status';
    const name = $('#fName').value.trim();
    const phone = normalizePhone($('#fPhone').value);
    const topic = $('#fTopic').value;
    const message = $('#fMessage').value.trim();
    let firstInvalid = null;
    function fail(id, error) {
      const input = $(`#${id}`);
      input.setAttribute('aria-invalid', 'true');
      $(`#${id}Error`).textContent = error;
      firstInvalid ||= input;
    }
    if (name.length < 2 || name.length > 100) {
      fail('fName', 'অনুগ্রহ করে ২–১০০ অক্ষরের নাম লিখুন।');
    }
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(phone)) {
      fail('fPhone', 'সঠিক মোবাইল নম্বর লিখুন, যেমন: ০১৭১১-২৩৪৫৬৭।');
    }
    if (!topic) fail('fTopic', 'অনুগ্রহ করে পরামর্শের বিষয় নির্বাচন করুন।');
    if (message.length < 10 || message.length > 1500) {
      fail('fMessage', 'অনুগ্রহ করে ১০–১৫০০ অক্ষরে সমস্যাটি লিখুন।');
    }
    if (firstInvalid) {
      status.className = 'form-status error';
      status.textContent = 'কিছু তথ্য ঠিক করা প্রয়োজন। চিহ্নিত ঘরগুলো দেখে আবার চেষ্টা করুন।';
      firstInvalid.focus();
      return;
    }

    const subject = `আইনি পরামর্শের অনুরোধ — ${topic} — ${name}`;
    const body = `নাম: ${name}\nমোবাইল: ${phone}\nবিষয়: ${topic}\n\nসমস্যার বিবরণ:\n${message}`;
    const mailto = `mailto:adv.armanhossain.du@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    // Do not claim delivery, or clear the user's text: an email app may be absent.
    status.className = 'form-status success';
    status.textContent = 'আপনার ইমেইল অ্যাপে খসড়া খোলার অনুরোধ করা হয়েছে। বার্তাটি এখনো পাঠানো হয়নি — ইমেইল অ্যাপ থেকে পাঠান। অ্যাপ না খুললে সরাসরি ফোন বা হোয়াটসঅ্যাপ ব্যবহার করুন।';
    window.location.href = mailto;
  });
})();
