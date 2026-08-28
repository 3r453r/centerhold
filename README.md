# Centrehold

Essays from the quiet part of the river. Live at [centrehold.com](https://centrehold.com).

This repository is the canonical source of every published essay: the markdown under
`src/content/essays/` is the text of record, and the site is built from it. Pushing to `main`
publishes.

## Shape

- `src/content/essays/*.md` -- the essays. One file per piece; frontmatter carries the title,
  lane, number, dates and a one-line description. What is here is published; drafts do not
  live in this repository.
- `src/pages/` -- the site: landing, essay index, essay pages, the Assumptions register, about.
- `src/styles/site.css` -- the palette and the landing-page motion system.
- `public/landing.js` -- the confluence: letters ride two currents to the centre, collide,
  and settle into a sentence; a particle river calms as you scroll. Progressive -- with no
  JavaScript, or with reduced motion requested, the page reads the same.

## Lanes

- **Foundations** -- the Assumptions register (A0) and the two opening essays. Read in order;
  everything downstream cites them.
- **Timeless** -- exposition of settled positions.
- **Applied** -- contemporary contested ground, each essay deriving explicitly from the
  foundations and steelmanning the strongest opposing view before answering it.
- **Event horizon** -- positions taken under uncertainty, dated and labelled as such.

## Build

```
npm install
npm run dev      # local preview
npm run build    # static output in dist/
```

Node 22. Deployed by Cloudflare Pages on push to `main` (build `npm run build`, output `dist`). The
`www` -> apex redirect is a zone-level Redirect Rule in Cloudflare, not a file here.

## Licence

Text (c) the author. Code in this repository is MIT.
