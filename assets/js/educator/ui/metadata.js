import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS } from '../model.js';
import { el, field, selectField, clear } from './common.js';

export function renderMetadata(host, model, ctx) {
  clear(host);
  const r = model.raw;

  const titleField = field({
    id: 'title',
    label: 'Title',
    value: r.title || '',
    placeholder: 'e.g. CS173 — Introduction to Arrays',
    onInput: v => { r.title = v; ctx.markDirty(); },
  });

  const permalinkField = field({
    id: 'permalink',
    label: 'Permalink',
    value: r.permalink || '',
    placeholder: '/Modules/Arrays/Exercise',
    hint: 'Where the published exercise will live on the site. Must start with "/".',
    onInput: v => { r.permalink = v; ctx.markDirty(); },
  });

  const langField = selectField({
    id: 'language',
    label: 'Language',
    value: r.language || 'java',
    options: SUPPORTED_LANGUAGES.map(l => ({ value: l, label: LANGUAGE_LABELS[l] || l })),
    onChange: v => {
      r.language = v;
      ctx.markDirty();
      ctx.emit('language-changed', v);
    },
  });

  const asmtId = field({
    id: 'canvasasmtid',
    label: 'Canvas assignment ID',
    value: r.canvasasmtid || '',
    placeholder: 'optional — e.g. 137462',
    onInput: v => { r.canvasasmtid = v; ctx.markDirty(); },
  });

  const canvasPoints = field({
    id: 'canvaspoints',
    label: 'Canvas points',
    type: 'number',
    value: r.canvaspoints != null ? r.canvaspoints : '',
    onInput: v => { r.canvaspoints = v === '' ? '' : Number(v); ctx.markDirty(); },
  });

  const halfTries = field({
    id: 'canvashalftries',
    label: 'Award half credit after N attempts (optional)',
    type: 'number',
    value: r.canvashalftries != null ? r.canvashalftries : '',
    hint: 'Leave blank to disable. When set, after N failed attempts students automatically receive half credit.',
    onInput: v => {
      if (v === '') delete r.canvashalftries;
      else r.canvashalftries = Number(v);
      ctx.markDirty();
    },
  });

  host.appendChild(titleField);
  host.appendChild(permalinkField);
  host.appendChild(langField);
  host.appendChild(el('div', { class: 'ed-field-row' }, [asmtId, canvasPoints, halfTries]));
}
