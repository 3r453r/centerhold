import { stackNotes, requiredHeight, marginFits, readPref, writePref } from './stack.js';

const NOTE_MIN = 220; // px; narrower than this a margin note is a column of broken words
const NOTE_MAX = 340;
// Tables and figures break out up to 3em past the column (pages.css), so notes start beyond that.
const BREAKOUT_EM = 3;
const BREAKOUT_PAD = 16;
const GUTTER = 24;
const STACK_GAP = 14;

export function initSidenotes(doc = document, win = window) {
  const article = doc.querySelector('article.read');
  const prose = article?.querySelector('.prose');
  if (!prose || !prose.querySelector('section.footnotes')) return;

  let storage;
  try {
    storage = win.localStorage;
  } catch {
    storage = undefined;
  }

  const notes = [];
  const lastAfter = new Map();
  for (const ref of prose.querySelectorAll('a[data-footnote-ref]')) {
    const id = ref.getAttribute('href').slice(1);
    const li = doc.getElementById(id);
    if (!li) continue;

    const aside = doc.createElement('aside');
    aside.className = 'sidenote';
    aside.id = `side-${id}`;
    aside.innerHTML = li.innerHTML;
    aside.querySelectorAll('[data-footnote-backref]').forEach((a) => a.remove());
    const num = doc.createElement('span');
    num.className = 'sidenote-num';
    num.textContent = ref.textContent;
    aside.prepend(num);

    // Insert after the top-level block holding the ref, after any earlier note from that block.
    let block = ref;
    while (block.parentElement && block.parentElement !== prose) block = block.parentElement;
    (lastAfter.get(block) ?? block).after(aside);
    lastAfter.set(block, aside);

    ref.setAttribute('aria-controls', aside.id);
    ref.setAttribute('aria-expanded', 'false');
    ref.addEventListener('click', (e) => {
      e.preventDefault();
      if (article.classList.contains('notes-margin')) {
        aside.classList.add('flash');
        aside.scrollIntoView({ block: 'nearest' });
        win.setTimeout(() => aside.classList.remove('flash'), 2500);
        return;
      }
      const open = aside.classList.toggle('open');
      ref.setAttribute('aria-expanded', String(open));
    });
    notes.push({ ref, aside });
  }
  if (notes.length === 0) return;
  article.classList.add('notes-enhanced');

  function layout() {
    const vw = doc.documentElement.clientWidth;
    const proseRect = prose.getBoundingClientRect();
    const gap = BREAKOUT_EM * parseFloat(win.getComputedStyle(prose).fontSize) + BREAKOUT_PAD;
    prose.style.setProperty('--note-gap', `${gap}px`);
    // Notes off: no margin column; markers stay and open their note inline, as on a phone.
    const fits =
      !article.classList.contains('notes-off') && marginFits(vw, proseRect.right, NOTE_MIN, gap, GUTTER);
    article.classList.toggle('notes-margin', fits);
    if (!fits) {
      for (const n of notes) n.aside.style.top = '';
      prose.style.minHeight = '';
      return;
    }
    const width = Math.min(NOTE_MAX, vw - proseRect.right - gap - GUTTER);
    prose.style.setProperty('--note-width', `${width}px`);
    const anchorTops = notes.map((n) => n.ref.getBoundingClientRect().top - proseRect.top);
    const heights = notes.map((n) => n.aside.offsetHeight);
    const tops = stackNotes(anchorTops, heights, STACK_GAP);
    notes.forEach((n, i) => {
      n.aside.style.top = `${tops[i]}px`;
    });
    prose.style.minHeight = `${requiredHeight(tops, heights)}px`;
  }

  let frame = 0;
  const schedule = () => {
    win.cancelAnimationFrame(frame);
    frame = win.requestAnimationFrame(layout);
  };

  const toggle = doc.querySelector('.notes-toggle');
  // The page names its notes ("precise notes" on essays, "plain notes" on the register).
  const label = toggle ? toggle.textContent.replace(/:\s*(on|off)\s*$/, '') : '';
  const apply = (pref) => {
    article.classList.toggle('notes-off', pref === 'off');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(pref === 'on'));
      toggle.textContent = `${label}: ${pref}`;
    }
    schedule();
  };
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      const next = article.classList.contains('notes-off') ? 'on' : 'off';
      writePref(storage, next);
      apply(next);
    });
  }

  apply(readPref(storage));
  // First pass runs now: a background tab never fires animation frames, and would keep notes hidden.
  layout();
  win.addEventListener('resize', schedule);
  win.addEventListener('load', layout);
  doc.addEventListener('visibilitychange', layout);
  doc.fonts?.ready.then(layout);
}
