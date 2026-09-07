/* ==========================================================================
   Disconnected: blog.js
   Renders the blog index from the POSTS array below and filters it by topic.

   To publish a new article:
     1. Copy pages/blog-post.html to pages/blog/<your-slug>.html and edit it.
     2. Add an entry at the top of POSTS with its url, date, tags and excerpt.
   ========================================================================== */
(function () {
  'use strict';

  var POSTS = [
    {
      title: 'Five habits that cut your night-time EMF exposure',
      excerpt: 'The bedroom is where the body repairs itself. These five changes cost almost nothing and remove a large share of the exposure you sleep in.',
      date: '2026-08-18',
      readingTime: '6 min read',
      tags: ['Practical tips', 'Sleep'],
      url: 'blog-post.html'
    },
    {
      title: 'Wi-Fi, DECT and smart meters: what actually radiates at home',
      excerpt: 'A walk through the usual suspects in a British home, what each one emits, and which ones are worth dealing with first.',
      date: '2026-07-02',
      readingTime: '8 min read',
      tags: ['Sources', 'Measurement'],
      url: 'blog-post.html'
    },
    {
      title: 'Why official limits and biological limits are not the same thing',
      excerpt: 'National standards are built around heating effects. Bio-Initiative, SBM-2024 and IGNIR start from biology, and land orders of magnitude lower.',
      date: '2026-05-21',
      readingTime: '7 min read',
      tags: ['Standards', 'Science'],
      url: 'blog-post.html'
    },
    {
      title: 'What an assessment report looks like, page by page',
      excerpt: 'Measurements area by area, a comparison against building-biology thresholds, and a prioritised list of what to change first.',
      date: '2026-04-09',
      readingTime: '5 min read',
      tags: ['Assessment'],
      url: 'blog-post.html'
    }
  ];

  function formatDate(iso) {
    var date = new Date(iso + 'T00:00:00');
    if (isNaN(date.getTime())) return iso;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function initials(title) {
    return title.trim().charAt(0).toUpperCase();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function postCard(post) {
    var tags = post.tags.map(function (tag) {
      return '<span class="tag">' + escapeHtml(tag) + '</span>';
    }).join(' ');

    return [
      '<article class="post-card" data-reveal>',
      '  <div class="post-card__media" aria-hidden="true">' + escapeHtml(initials(post.title)) + '</div>',
      '  <div class="post-card__body">',
      '    <div class="post-card__meta">',
      '      <time datetime="' + escapeHtml(post.date) + '">' + escapeHtml(formatDate(post.date)) + '</time>',
      '      <span aria-hidden="true">·</span>',
      '      <span>' + escapeHtml(post.readingTime) + '</span>',
      '    </div>',
      '    <h3><a href="' + escapeHtml(post.url) + '">' + escapeHtml(post.title) + '</a></h3>',
      '    <p>' + escapeHtml(post.excerpt) + '</p>',
      '    <div class="post-card__meta">' + tags + '</div>',
      '    <a class="link-arrow" href="' + escapeHtml(post.url) + '">Read the article</a>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function init() {
    var list = document.getElementById('post-list');
    var filterBar = document.getElementById('post-filters');
    if (!list) return;

    var active = 'All';

    function render() {
      var visible = POSTS.filter(function (post) {
        return active === 'All' || post.tags.indexOf(active) !== -1;
      });

      list.innerHTML = visible.length
        ? visible.map(postCard).join('')
        : '<p class="empty-state">No articles under this topic yet, check back soon.</p>';

      list.classList.toggle('grid--3', visible.length > 0);

      // Newly injected cards still need to fade in.
      Array.prototype.forEach.call(list.querySelectorAll('[data-reveal]'), function (el) {
        el.classList.add('is-visible');
      });
    }

    if (filterBar) {
      var tags = ['All'];
      POSTS.forEach(function (post) {
        post.tags.forEach(function (tag) {
          if (tags.indexOf(tag) === -1) tags.push(tag);
        });
      });

      filterBar.innerHTML = tags.map(function (tag) {
        return '<button type="button" class="filter' + (tag === 'All' ? ' is-active' : '') +
          '" data-tag="' + escapeHtml(tag) + '">' + escapeHtml(tag) + '</button>';
      }).join('');

      filterBar.addEventListener('click', function (event) {
        var button = event.target.closest('.filter');
        if (!button) return;
        active = button.getAttribute('data-tag');
        Array.prototype.forEach.call(filterBar.querySelectorAll('.filter'), function (el) {
          el.classList.toggle('is-active', el === button);
        });
        render();
      });
    }

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
