/* ==========================================================================
   Disconnected: contact-form.js
   Client-side validation for the contact form on the home page.

   NOTE: there is no back end yet. On a valid submission the form falls back to
   a `mailto:` handoff so no message is lost. To send through a real endpoint,
   set data-endpoint on the <form> and the script will POST the fields as JSON.
   ========================================================================== */
(function () {
  'use strict';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function field(input) { return input.closest('.field'); }

  function setError(input, message) {
    var wrap = field(input);
    if (!wrap) return;
    var slot = wrap.querySelector('.field__error');
    wrap.classList.toggle('has-error', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (slot) slot.textContent = message || '';
  }

  function validate(input) {
    var value = (input.value || '').trim();
    var label = input.getAttribute('data-label') || 'This field';

    if (input.type === 'checkbox') {
      if (input.required && !input.checked) {
        setError(input, 'Please tick this box to continue.');
        return false;
      }
      setError(input, '');
      return true;
    }

    if (input.required && !value) {
      setError(input, label + ' is required.');
      return false;
    }
    if (input.type === 'email' && value && !EMAIL_RE.test(value)) {
      setError(input, 'Please enter a valid email address.');
      return false;
    }
    if (input.tagName === 'TEXTAREA' && value && value.length < 15) {
      setError(input, 'A little more detail helps: 15 characters minimum.');
      return false;
    }
    setError(input, '');
    return true;
  }

  function showStatus(box, type, message) {
    if (!box) return;
    box.className = 'form-status is-visible form-status--' + type;
    box.textContent = message;
  }

  function mailtoFallback(form, data) {
    var to = form.getAttribute('data-mailto') || 'disconnectedemf@gmail.com';
    var body = [
      'Name: ' + data.name,
      'Email: ' + data.email,
      'Phone: ' + (data.phone || '-'),
      'Property: ' + (data.property || '-'),
      'Postcode: ' + (data.postcode || '-'),
      '',
      data.message
    ].join('\n');

    window.location.href = 'mailto:' + to +
      '?subject=' + encodeURIComponent('Assessment enquiry from ' + data.name) +
      '&body=' + encodeURIComponent(body);
  }

  function init() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var status = form.querySelector('.form-status');
    var submit = form.querySelector('[type="submit"]');
    var inputs = Array.prototype.slice.call(
      form.querySelectorAll('input:not([type="hidden"]):not(.honeypot input), select, textarea')
    ).filter(function (el) { return !el.closest('.honeypot'); });

    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        if (field(input) && field(input).classList.contains('has-error')) validate(input);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      // Bots happily fill hidden fields; humans never see this one.
      var trap = form.querySelector('.honeypot input');
      if (trap && trap.value) return;

      var valid = inputs.map(validate).every(Boolean);
      if (!valid) {
        showStatus(status, 'error', 'Please check the highlighted fields and try again.');
        var firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
        if (firstError) firstError.focus();
        return;
      }

      var data = {};
      inputs.forEach(function (input) {
        if (input.name) data[input.name] = input.type === 'checkbox' ? input.checked : input.value.trim();
      });

      var endpoint = form.getAttribute('data-endpoint');

      if (!endpoint) {
        showStatus(status, 'ok', 'Thanks ' + data.name.split(' ')[0] +
          ', your email app is opening with the message ready to send.');
        mailtoFallback(form, data);
        return;
      }

      if (submit) { submit.disabled = true; submit.textContent = 'Sending…'; }

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Request failed: ' + response.status);
          form.reset();
          showStatus(status, 'ok', 'Thanks, your message is on its way. We reply within two working days.');
        })
        .catch(function () {
          showStatus(status, 'error', 'Something went wrong sending the form. Please email us directly.');
        })
        .then(function () {
          if (submit) { submit.disabled = false; submit.textContent = 'Send my enquiry'; }
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
