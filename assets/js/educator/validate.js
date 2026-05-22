// Inline validation. Returns {errors: [], warnings: []} for the model.
// Errors block download / commit. Warnings don't.

import { SUPPORTED_LANGUAGES } from './model.js';

export function validateModel(model) {
  const errors = [];
  const warnings = [];
  const r = model.raw;

  if (!r.permalink || typeof r.permalink !== 'string') {
    errors.push({ section: 'metadata', field: 'permalink', msg: 'Permalink is required.' });
  } else if (!r.permalink.startsWith('/')) {
    errors.push({ section: 'metadata', field: 'permalink', msg: 'Permalink must start with "/".' });
  }

  if (!r.title || typeof r.title !== 'string' || !r.title.trim()) {
    warnings.push({ section: 'metadata', field: 'title', msg: 'Title is empty.' });
  }

  if (!r.language || !SUPPORTED_LANGUAGES.includes(r.language)) {
    errors.push({
      section: 'metadata', field: 'language',
      msg: 'Language must be one of: ' + SUPPORTED_LANGUAGES.join(', ') + '.'
    });
  }

  const points = r.info && r.info.points;
  if (points != null && points !== '' && Number.isNaN(Number(points))) {
    errors.push({ section: 'info', field: 'points', msg: 'Points must be a number.' });
  }

  const files = Array.isArray(r.files) ? r.files : [];
  const mains = files.filter(f => f && f.ismain === true);
  if (mains.length > 1) {
    errors.push({
      section: 'files', field: 'ismain',
      msg: 'Only one file may be marked as the main file (' + mains.length + ' are set).'
    });
  }

  for (let i = 0; i < files.length; i++) {
    const f = files[i] || {};
    if (!f.filename || !String(f.filename).trim()) {
      errors.push({ section: 'files', field: 'filename', msg: 'File #' + (i + 1) + ' is missing a filename.' });
    }
  }

  const proc = r.processor || {};
  if (!proc.correctcheck || !String(proc.correctcheck).trim()) {
    warnings.push({
      section: 'correctness', field: 'correctcheck',
      msg: 'Correct check is empty — the exercise will always be considered correct.'
    });
  }

  const tests = Array.isArray(proc.tests) ? proc.tests : [];
  for (let i = 0; i < tests.length; i++) {
    const t = tests[i] || {};
    const e = t.expect || {};
    const hasAny = ('stdout' in e) || ('throws' in e) || ('returns' in e) || ('vars' in e);
    if (!hasAny) {
      warnings.push({
        section: 'tests', field: 'expect',
        msg: 'Test #' + (i + 1) + ' (' + (t.name || 'unnamed') + ') has no expectations.'
      });
    }
  }

  const hints = Array.isArray(proc.hints) ? proc.hints : [];
  for (let i = 0; i < hints.length; i++) {
    const h = hints[i] || {};
    const after = h.after;
    if (after != null && (!Number.isInteger(Number(after)) || Number(after) < 0)) {
      errors.push({ section: 'hints', field: 'after', msg: 'Hint #' + (i + 1) + ' "after" must be a non-negative integer.' });
    }
  }

  return { errors, warnings };
}
