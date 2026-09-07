/* ==========================================================================
   Disconnected: main.js
   Site-wide behaviour: navigation, sticky header, accordions, scroll reveal,
   table of contents highlighting, back-to-top button.
   Every module bails out silently when its markup is absent, so this file can
   be loaded on every page.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------ */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) setOpen(false);
    });
  }

  /* ------------------------------------------------------------------
     "More" dropdown: hover on desktop, tap to expand on mobile
     ------------------------------------------------------------------ */
  function initSubmenus() {
    var items = document.querySelectorAll('.nav__item--has-menu');
    if (!items.length) return;

    Array.prototype.forEach.call(items, function (item) {
      var trigger = item.querySelector('.nav__submenu-toggle');
      if (!trigger) return;

      function setOpen(open) {
        item.classList.toggle('is-open', open);
        trigger.setAttribute('aria-expanded', String(open));
      }

      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        setOpen(!item.classList.contains('is-open'));
      });

      item.addEventListener('mouseenter', function () {
        if (window.innerWidth > 960) setOpen(true);
      });
      item.addEventListener('mouseleave', function () {
        if (window.innerWidth > 960) setOpen(false);
      });
      item.addEventListener('focusout', function (event) {
        if (window.innerWidth > 960 && !item.contains(event.relatedTarget)) setOpen(false);
      });

      document.addEventListener('click', function (event) {
        if (window.innerWidth > 960 && !item.contains(event.target)) setOpen(false);
      });
    });
  }

  /* ------------------------------------------------------------------
     Header shadow once the page is scrolled
     ------------------------------------------------------------------ */
  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    function update() {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ------------------------------------------------------------------
     Accordions
     ------------------------------------------------------------------ */
  function initAccordions() {
    var accordions = document.querySelectorAll('.accordion');
    if (!accordions.length) return;

    Array.prototype.forEach.call(accordions, function (accordion) {
      var trigger = accordion.querySelector('.accordion__trigger');
      var panel = accordion.querySelector('.accordion__panel');
      if (!trigger || !panel) return;

      trigger.setAttribute('aria-expanded', String(accordion.classList.contains('is-open')));

      trigger.addEventListener('click', function () {
        var open = !accordion.classList.contains('is-open');
        accordion.classList.toggle('is-open', open);
        trigger.setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* ------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------ */
  function initReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-visible'); });
      return;
    }

    document.documentElement.setAttribute('data-reveal-ready', '');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Number(el.getAttribute('data-reveal-delay') || 0);
        window.setTimeout(function () { el.classList.add('is-visible'); }, delay);
        observer.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    Array.prototype.forEach.call(targets, function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------
     Table of contents: highlight the section currently on screen
     ------------------------------------------------------------------ */
  function initToc() {
    var toc = document.querySelector('.toc');
    if (!toc || !('IntersectionObserver' in window)) return;

    var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    var sections = links
      .map(function (link) { return document.getElementById(link.getAttribute('href').slice(1)); })
      .filter(Boolean);
    if (!sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ------------------------------------------------------------------
     Back to top
     ------------------------------------------------------------------ */
  function initBackToTop() {
    var button = document.querySelector('.to-top');
    if (!button) return;

    function update() {
      button.classList.toggle('is-visible', window.scrollY > 700);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });

    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     Current year in the footer
     ------------------------------------------------------------------ */
  function initYear() {
    var slots = document.querySelectorAll('[data-year]');
    Array.prototype.forEach.call(slots, function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function init() {
    initNav();
    initSubmenus();
    initStickyHeader();
    initAccordions();
    initReveal();
    initToc();
    initBackToTop();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
