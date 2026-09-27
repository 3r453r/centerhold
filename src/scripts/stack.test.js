import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stackNotes, requiredHeight, marginFits, readPref, writePref, PREF_KEY } from './stack.js';

test('notes sit level with their anchors when there is room', () => {
  assert.deepEqual(stackNotes([100, 400], [50, 50], 12), [100, 400]);
});

test('a note that would overlap the previous one is pushed below it', () => {
  assert.deepEqual(stackNotes([100, 120, 130], [80, 40, 40], 12), [100, 192, 244]);
});

test('no notes, no tops', () => {
  assert.deepEqual(stackNotes([], [], 12), []);
});

test('required height reaches the lowest note bottom', () => {
  assert.equal(requiredHeight([100, 192, 244], [80, 40, 40]), 284);
  assert.equal(requiredHeight([], []), 0);
});

test('margin fits only when the space right of the column holds note + gap + gutter', () => {
  assert.equal(marginFits(1920, 1500, 240, 40, 16), true); // 420 >= 296
  assert.equal(marginFits(1920, 1624, 240, 40, 16), true); // 296, the boundary
  assert.equal(marginFits(1920, 1625, 240, 40, 16), false);
});

test('preference defaults to on, remembers off, and survives blocked storage', () => {
  const mem = new Map();
  const store = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) };
  assert.equal(readPref(store), 'on');
  writePref(store, 'off');
  assert.equal(mem.get(PREF_KEY), 'off');
  assert.equal(readPref(store), 'off');
  const blocked = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  assert.equal(readPref(blocked), 'on');
  assert.doesNotThrow(() => writePref(blocked, 'off'));
  assert.equal(readPref(undefined), 'on');
});
