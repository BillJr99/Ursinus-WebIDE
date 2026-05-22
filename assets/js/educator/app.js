// Educator authoring tool entry point.
//
// Owns the in-memory `model`, wires the top-bar actions (new / upload /
// download), and dispatches section renders when the user picks an
// item in the left rail.

import { makeModel, defaultExercise } from './model.js';
import { parseMarkdown } from './parser.js';
import { serializeMarkdown } from './serializer.js';
import { validateModel } from './validate.js';

import { renderMetadata } from './ui/metadata.js';
import { renderInfo } from './ui/info.js';
import { renderFiles } from './ui/files.js';
import { renderCorrectness } from './ui/correctness.js';
import { renderHints } from './ui/hints.js';
import { renderTests } from './ui/tests.js';
import { renderPreview } from './ui/preview.js';
import { renderSync } from './ui/sync.js';

const SECTIONS = {
  metadata: renderMetadata,
  info: renderInfo,
  files: renderFiles,
  correctness: renderCorrectness,
  hints: renderHints,
  tests: renderTests,
  preview: renderPreview,
  sync: renderSync,
};

// Simple in-page event bus shared by all section modules.
const handlers = {};
function on(event, cb) { (handlers[event] = handlers[event] || []).push(cb); }
function emit(event, payload) { (handlers[event] || []).forEach(cb => { try { cb(payload); } catch (e) { console.error(e); } }); }

let model = makeModel(defaultExercise());

function markDirty() {
  if (!model.dirty) {
    model.dirty = true;
    refreshDirtyIndicator();
  }
}

function refreshDirtyIndicator() {
  const ind = document.getElementById('ed-dirty-indicator');
  if (!ind) return;
  ind.hidden = !model.dirty;
}

function loadModel(next) {
  model = makeModel(next.raw);
  model.bodyAfterFrontmatter = next.bodyAfterFrontmatter || '';
  model.github = Object.assign({ sha: null, owner: null, repo: null, branch: null, path: null }, next.github || {});
  model.dirty = !!next.dirty;
  refreshDirtyIndicator();
  rerenderActive();
  emit('model-loaded', model);
  emit('language-changed', model.raw.language || 'java');
}

const ctx = {
  markDirty,
  on, emit,
  refreshDirty: refreshDirtyIndicator,
  loadModel,
  get model() { return model; },
};

function rerenderActive() {
  const active = document.querySelector('.ed-rail-item.active');
  if (!active) return;
  showSection(active.dataset.section);
}

function showSection(name) {
  document.querySelectorAll('.ed-rail-item').forEach(b => b.classList.toggle('active', b.dataset.section === name));
  document.querySelectorAll('.ed-section').forEach(s => {
    const on = (s.id === 'ed-section-' + name);
    s.classList.toggle('active', on);
    s.hidden = !on;
  });
  const host = document.getElementById('ed-form-' + name);
  if (!host) return;
  const render = SECTIONS[name];
  if (!render) return;
  render(host, model, ctx);
}

function setBanner(kind, html) {
  const b = document.getElementById('ed-banner');
  if (!b) return;
  b.className = kind || '';
  b.innerHTML = html || '';
  b.hidden = !html;
}

function summarizeIssues(issues, label) {
  if (!issues.length) return '';
  const items = issues.map(i => '<li>' + escapeHtml(i.section) + '.' + escapeHtml(i.field) + ': ' + escapeHtml(i.msg) + '</li>').join('');
  return '<strong>' + label + ':</strong><ul>' + items + '</ul>';
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function permalinkSlug() {
  const p = (model.raw && model.raw.permalink) ? String(model.raw.permalink) : '';
  const last = p.split('/').filter(Boolean).pop() || 'exercise';
  return last.replace(/[^A-Za-z0-9._-]+/g, '-');
}

function downloadCurrent() {
  const v = validateModel(model);
  if (v.errors.length) {
    setBanner('', summarizeIssues(v.errors, 'Fix these before downloading'));
    return;
  }
  let text;
  try { text = serializeMarkdown(model); }
  catch (e) { setBanner('', 'Serialization error: ' + escapeHtml(e.message)); return; }
  const blob = new Blob([text], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = permalinkSlug() + '.md';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 0);
  model.dirty = false;
  refreshDirtyIndicator();
  const banner = v.warnings.length
    ? summarizeIssues(v.warnings, 'Downloaded with warnings')
    : '<strong>Downloaded ' + escapeHtml(a.download) + '.</strong>';
  setBanner(v.warnings.length ? 'warn' : 'success', banner);
}

function uploadFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = parseMarkdown(String(reader.result || ''));
      loadModel({ raw: parsed.raw, bodyAfterFrontmatter: parsed.body, github: model.github, dirty: false });
      setBanner('success', '<strong>Loaded ' + escapeHtml(file.name) + '.</strong>');
    } catch (e) {
      setBanner('', 'Could not parse ' + escapeHtml(file.name) + ': ' + escapeHtml(e.message));
    }
  };
  reader.onerror = () => setBanner('', 'Could not read ' + escapeHtml(file.name) + '.');
  reader.readAsText(file);
}

function newExercise() {
  if (model.dirty && !confirm('You have unsaved changes. Discard them and start fresh?')) return;
  loadModel({ raw: defaultExercise(), bodyAfterFrontmatter: '', github: {}, dirty: false });
  setBanner('info', 'Started a new exercise.');
}

function wire() {
  if (!window.jsyaml) {
    setBanner('', 'js-yaml failed to load — the editor cannot parse or serialize markdown. Check your network / asset paths.');
  }

  document.querySelectorAll('.ed-rail-item').forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.section));
  });

  document.getElementById('ed-btn-new').addEventListener('click', newExercise);
  document.getElementById('ed-btn-upload').addEventListener('click', () => {
    document.getElementById('ed-file-input').click();
  });
  document.getElementById('ed-file-input').addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) uploadFile(f);
    e.target.value = '';
  });
  document.getElementById('ed-btn-download').addEventListener('click', downloadCurrent);

  // Render the default section.
  showSection('metadata');

  // Warn on tab close if there are unsaved changes.
  window.addEventListener('beforeunload', (e) => {
    if (model.dirty) { e.preventDefault(); e.returnValue = ''; }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wire);
} else {
  wire();
}

// Exposed for debugging / tests.
window.WEBIDE_EDUCATOR_DEBUG = {
  get model() { return model; },
  parseMarkdown,
  serializeMarkdown,
  validateModel,
  loadModel,
};
