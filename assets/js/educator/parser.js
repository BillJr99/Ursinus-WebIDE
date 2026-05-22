// Reads a Jekyll-style markdown file (`---` YAML front matter then body)
// into a {raw, body} pair. Tolerant of files without front matter and of
// trailing whitespace.

import { adoptRaw } from './model.js';

const FM_START = /^---\s*\r?\n/;
const FM_END = /\r?\n---\s*(?:\r?\n|$)/;

export function parseMarkdown(text) {
  if (typeof text !== 'string') text = String(text || '');

  // Strip a leading BOM if the file came from Windows.
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);

  if (!FM_START.test(text)) {
    return { raw: adoptRaw({}), body: text };
  }

  // Drop the opening `---\n`
  const afterStart = text.replace(FM_START, '');
  const endIdx = afterStart.search(FM_END);
  if (endIdx < 0) {
    // Unterminated front matter — treat the whole thing as body.
    return { raw: adoptRaw({}), body: text };
  }

  const yamlText = afterStart.slice(0, endIdx);
  const afterEndMatch = afterStart.slice(endIdx).match(FM_END);
  const body = afterStart.slice(endIdx + (afterEndMatch ? afterEndMatch[0].length : 0));

  let raw;
  try {
    raw = window.jsyaml ? window.jsyaml.load(yamlText) : null;
  } catch (e) {
    const err = new Error('YAML parse error: ' + (e && e.message ? e.message : String(e)));
    err.cause = e;
    throw err;
  }

  return { raw: adoptRaw(raw), body };
}
