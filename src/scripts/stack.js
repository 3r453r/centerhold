// Layout and preference helpers for margin notes. No DOM here, so node --test runs them.

// Each note sits level with its anchor unless the previous note is still in the way.
export function stackNotes(anchorTops, heights, gap) {
  const tops = [];
  let floor = -Infinity;
  for (let i = 0; i < anchorTops.length; i++) {
    const top = Math.max(anchorTops[i], floor);
    tops.push(top);
    floor = top + heights[i] + gap;
  }
  return tops;
}

// The column must be at least this tall, or the last note runs into what follows.
export function requiredHeight(tops, heights) {
  let bottom = 0;
  for (let i = 0; i < tops.length; i++) bottom = Math.max(bottom, tops[i] + heights[i]);
  return bottom;
}

export function marginFits(viewportWidth, proseRight, noteMin, gap, gutter) {
  return viewportWidth - proseRight >= noteMin + gap + gutter;
}

export const PREF_KEY = 'centrehold.notes';

export function readPref(storage) {
  try {
    return storage?.getItem(PREF_KEY) === 'off' ? 'off' : 'on';
  } catch {
    return 'on';
  }
}

export function writePref(storage, value) {
  try {
    storage?.setItem(PREF_KEY, value);
  } catch {
    // Blocked storage: the choice lasts for this page view only.
  }
}
