# Disconnected website

Static site (HTML / CSS / JS, no build step). Open `index.html` in a browser, or serve the
folder with any static server:

```bash
python -m http.server 8000     # then visit http://localhost:8000
```

## Structure

```
disconnectedemf/
├── index.html              Home: hero, why care, assessment, standards, contact details (#contact)
├── pages/
│   ├── why-emf.html        Why care? What an EMF is, artificial waves, health, electrosensitivity
│   ├── assessment.html     The assessment: 4 steps, coverage table, FAQ
│   ├── standards.html      More ▸ Standards: Bio-Initiative, SBM-2024, IGNIR
│   ├── about.html          More ▸ About
│   ├── resources.html      More ▸ Resources: books, reports, research indexes
│   ├── blog.html           Blog index (rendered from js/blog.js)
│   └── blog-post.html      Article template: copy this to write a new post
├── css/
│   ├── base.css            Design tokens (colours, type scale, spacing), reset, utilities
│   ├── layout.css          Header, navigation, hero, sections, grids, footer
│   └── components.css      Buttons, cards, steps, accordions, tables, forms, blog cards
├── js/
│   ├── main.js             Nav, dropdown, sticky header, accordions, scroll reveal, back-to-top
│   ├── contact-form.js     Unused: validation for the contact form that used to be on the home page
│   ├── coverage-map.js     "Where we work" tooltip that reveals the drive-time map
│   └── blog.js             Blog post data + index rendering and topic filters
└── img/
    ├── logo/               Logo files
    ├── map_distance.png    Drive-time map shown by the "Where we work" tooltip
    └── hero/               Drop `living-space.jpg` here to replace the hero gradient
```

## Common edits

**Brand colours**: `css/base.css`, the `:root` block at the top. `--orange` and `--ink` come
straight from the logo; `--green` is the secondary accent.

**Navigation and footer**: the markup is repeated in every page (no build step, so nothing to
compile). Change one, then apply the same change to the others.

**SEO metadata**: same story — each page carries its own `<title>`, description, `rel="canonical"`,
Open Graph tags and JSON-LD block in the `<head>`. The title and description are written out three
times per page (the tag, `og:title`, `og:description`), so change all three together. Canonical and
`og:url` must be the absolute `https://www.disconnectedemf.co.uk/...` address of that page.
New pages need: a head block copied from a sibling with the URLs changed, a `BreadcrumbList`
JSON-LD, and an entry added to `sitemap.xml`.

**Hero image**: save a photo as `img/hero/living-space.jpg`. Until then a gradient shows in its
place; the CSS already layers a white wash over the photo so the headline stays readable.

**Contact**: the `#contact` section on the home page lists an email address, a phone number and the
area covered, with "Email us" and "Call us" buttons. There is no form to fill in. The old form's
validation is still in `js/contact-form.js`, no longer loaded by any page; delete it, along with the
form styles in section 6 of `css/components.css`, if a form is not coming back.

**Coverage map**: the information icon beside "Where we work" in the contact section reveals
`img/map_distance.png`, the drive-time map around Kendal. To update it, export a new image, save it
over that file and correct the `width`, `height` and `alt` on the `<img>` in `index.html`. Opening
and closing the tooltip lives in `js/coverage-map.js`.

**Blog**: add an article by copying `pages/blog-post.html`, then adding an entry to the `POSTS`
array at the top of `js/blog.js` (title, excerpt, date, readingTime, tags, url). Topic filters are
generated from the tags automatically.

## Placeholders to replace before going live

- The founder biography and equipment list in `pages/about.html`.
- The four sample blog posts in `js/blog.js`.
- `img/og-image.png` at 1200x630, for link previews. Until it exists, `og:image` points at the
  logo, which is the wrong shape and gets letterboxed. Update the `og:image` line in all 6
  indexable pages once it is made.
- PNG favicons (48x48 or larger, plus an `apple-touch-icon`) exported from `img/logo/logo_svg.svg`.
  Only the SVG is declared today; Google prefers a raster icon beside search results.
- Remove the `noindex` lines from `pages/blog.html` and `pages/blog-post.html` when real posts
  replace the samples, and add both URLs to `sitemap.xml`.
