/* ==========================================================================
   Disconnected: coverage-map.js
   The information icon next to "Where we work" reveals the drive-time map.
   Opens on hover, on keyboard focus and on tap, so it is not hover-only:
   touch devices have no hover at all, and the icon has to stay reachable
   from the keyboard.
   ========================================================================== */
(function () {
  'use strict';

  var OPEN_DELAY = 80;    /* ignore a cursor that only crosses the icon */
  var CLOSE_DELAY = 220;  /* let the pointer travel from icon to panel */

  function initInfotip() {
    var panel = document.querySelector('.infotip');
    if (!panel) return;

    var trigger = document.querySelector('.infotip__trigger');
    var item = panel.closest('.has-infotip');
    if (!trigger || !item) return;

    var openTimer = null;
    var closeTimer = null;

    function setOpen(open) {
      window.clearTimeout(openTimer);
      window.clearTimeout(closeTimer);
      panel.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    }

    function isOpen() {
      return trigger.getAttribute('aria-expanded') === 'true';
    }

    function openSoon() {
      window.clearTimeout(closeTimer);
      openTimer = window.setTimeout(function () { setOpen(true); }, OPEN_DELAY);
    }

    function closeSoon() {
      window.clearTimeout(openTimer);
      closeTimer = window.setTimeout(function () { setOpen(false); }, CLOSE_DELAY);
    }

    trigger.addEventListener('mouseenter', openSoon);
    trigger.addEventListener('mouseleave', closeSoon);
    panel.addEventListener('mouseenter', function () { window.clearTimeout(closeTimer); });
    panel.addEventListener('mouseleave', closeSoon);

    trigger.addEventListener('focus', function () { setOpen(true); });
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      setOpen(!isOpen());
    });

    item.addEventListener('focusout', function (event) {
      if (!item.contains(event.relatedTarget)) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        trigger.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (isOpen() && !item.contains(event.target)) setOpen(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInfotip);
  } else {
    initInfotip();
  }
})();
