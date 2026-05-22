// Shared UI helpers used across section panels.

import { aceModeFor } from '../model.js';

// Lightweight DOM helper. el('div', {class:'x'}, [el('span', null, ['hi'])]).
export function el(tag, attrs, children) {
  const e = document.createElement(tag);
  if (attrs) {
    for (const k of Object.keys(attrs)) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k in e && typeof v === 'boolean') e[k] = v;
      else e.setAttribute(k, v);
    }
  }
  if (children) {
    for (const c of (Array.isArray(children) ? children : [children])) {
      if (c == null || c === false) continue;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
  }
  return e;
}

// A labeled text input.
export function field(opts) {
  const id = 'ed-f-' + (opts.id || Math.random().toString(36).slice(2, 8));
  const input = el('input', {
    type: opts.type || 'text',
    id, class: 'ed-input',
    value: opts.value == null ? '' : String(opts.value),
    placeholder: opts.placeholder || '',
  });
  if (opts.onInput) input.addEventListener('input', () => opts.onInput(input.value));
  const wrap = el('div', { class: 'ed-field' }, [
    opts.label ? el('label', { for: id }, [opts.label]) : null,
    input,
    opts.hint ? el('div', { class: 'ed-hint' }, [opts.hint]) : null,
  ]);
  wrap._input = input;
  return wrap;
}

export function selectField(opts) {
  const id = 'ed-f-' + (opts.id || Math.random().toString(36).slice(2, 8));
  const sel = el('select', { id, class: 'ed-select' },
    (opts.options || []).map(o =>
      el('option', { value: o.value, selected: o.value === opts.value }, [o.label || o.value])));
  if (opts.onChange) sel.addEventListener('change', () => opts.onChange(sel.value));
  const wrap = el('div', { class: 'ed-field' }, [
    opts.label ? el('label', { for: id }, [opts.label]) : null,
    sel,
    opts.hint ? el('div', { class: 'ed-hint' }, [opts.hint]) : null,
  ]);
  wrap._input = sel;
  return wrap;
}

export function checkboxField(opts) {
  const cb = el('input', { type: 'checkbox' });
  cb.checked = !!opts.value;
  if (opts.onChange) cb.addEventListener('change', () => opts.onChange(cb.checked));
  return el('label', { class: 'ed-checkbox-row' }, [cb, ' ' + (opts.label || '')]);
}

export function textareaField(opts) {
  const id = 'ed-f-' + (opts.id || Math.random().toString(36).slice(2, 8));
  const ta = el('textarea', {
    id, class: 'ed-textarea',
    placeholder: opts.placeholder || '',
    rows: opts.rows || 4,
  });
  ta.value = opts.value == null ? '' : String(opts.value);
  if (opts.onInput) ta.addEventListener('input', () => opts.onInput(ta.value));
  const wrap = el('div', { class: 'ed-field' }, [
    opts.label ? el('label', { for: id }, [opts.label]) : null,
    ta,
    opts.hint ? el('div', { class: 'ed-hint' }, [opts.hint]) : null,
  ]);
  wrap._input = ta;
  return wrap;
}

// ACE editor wrapped in a stable container. Returns the container DOM
// node with `editor` and `setValue` / `getValue` helpers attached.
export function aceEditor(opts) {
  const wrap = el('div', { class: 'ed-ace-wrap' }, [
    el('div', { class: 'ed-ace' + (opts.tall ? ' tall' : '') })
  ]);
  const host = wrap.firstChild;
  // ACE measures with bounding rects, so we need to wait for the
  // container to be laid out before instantiating.
  const init = () => {
    const editor = window.ace.edit(host);
    editor.setOptions({
      fontSize: '12px',
      showPrintMargin: false,
      wrap: true,
      useWorker: false,
    });
    editor.setTheme('ace/theme/monokai');
    editor.session.setMode(aceModeFor(opts.language || 'javascript'));
    editor.setValue(opts.value == null ? '' : String(opts.value), -1);
    if (opts.onChange) {
      editor.session.on('change', () => opts.onChange(editor.getValue()));
    }
    wrap.editor = editor;
    wrap.getValue = () => editor.getValue();
    wrap.setValue = (v) => editor.setValue(v == null ? '' : String(v), -1);
    wrap.setLanguage = (lang) => editor.session.setMode(aceModeFor(lang));
  };
  // Defer until next microtask so the wrap is in the DOM and sized.
  queueMicrotask(() => {
    if (host.isConnected) init();
    else {
      const obs = new MutationObserver(() => {
        if (host.isConnected) { obs.disconnect(); init(); }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  });
  return wrap;
}

// Recipe dropdown above an ACE editor. Picking a recipe replaces the
// editor's contents wholesale.
export function recipeRow(recipes, onPick) {
  const sel = el('select', { class: 'ed-select' }, [
    el('option', { value: '' }, ['— pick a starter recipe —']),
    ...recipes.map(r => el('option', { value: r.id }, [r.label]))
  ]);
  sel.addEventListener('change', () => {
    if (!sel.value) return;
    const recipe = recipes.find(r => r.id === sel.value);
    if (recipe) onPick(recipe.value);
    sel.value = '';
  });
  return el('div', { class: 'ed-recipe-row' }, [el('label', null, ['Recipe:']), sel]);
}

// ---- WYSIWYG editor (contenteditable) for HTML fields ----

const TOOLBAR = [
  { cmd: 'bold',          label: 'B',  title: 'Bold (Ctrl/Cmd+B)', style: 'font-weight:700' },
  { cmd: 'italic',        label: 'I',  title: 'Italic (Ctrl/Cmd+I)', style: 'font-style:italic' },
  { cmd: 'underline',     label: 'U',  title: 'Underline', style: 'text-decoration:underline' },
  null,
  { cmd: 'insertUnorderedList', label: '• List', title: 'Bulleted list' },
  { cmd: 'insertOrderedList',   label: '1. List', title: 'Numbered list' },
  null,
  { cmd: 'createLink',    label: 'Link', title: 'Insert link' },
  { cmd: 'code',          label: '<code>', title: 'Inline code' },
  { cmd: 'pre',           label: '<pre>', title: 'Code block' },
  null,
  { cmd: 'removeFormat',  label: 'Clear', title: 'Remove formatting' },
];

export function wysiwygEditor(opts) {
  const body = el('div', { class: 'ed-wysiwyg-body', contenteditable: 'true', spellcheck: 'true' });
  body.innerHTML = (opts.value == null ? '' : String(opts.value));
  const source = el('textarea', { class: 'ed-wysiwyg-source', spellcheck: 'false' });
  source.value = body.innerHTML;

  const toolbar = el('div', { class: 'ed-wysiwyg-toolbar' });
  for (const item of TOOLBAR) {
    if (item == null) { toolbar.appendChild(el('span', { class: 'ed-tb-sep' })); continue; }
    const b = el('button', { type: 'button', title: item.title, style: item.style || '' }, [item.label]);
    b.addEventListener('mousedown', e => e.preventDefault()); // keep selection
    b.addEventListener('click', () => runWysiwygCommand(item.cmd, body));
    toolbar.appendChild(b);
  }
  const toggle = el('button', { type: 'button', title: 'Toggle HTML source', style: 'margin-left:auto' }, ['Source']);
  toggle.addEventListener('mousedown', e => e.preventDefault());
  toolbar.appendChild(toggle);

  const wrap = el('div', { class: 'ed-wysiwyg-wrap' }, [toolbar, body, source]);

  const fire = () => { if (opts.onInput) opts.onInput(wrap.getValue()); };
  body.addEventListener('input', () => { source.value = body.innerHTML; fire(); });
  source.addEventListener('input', () => { body.innerHTML = source.value; fire(); });

  toggle.addEventListener('click', () => {
    if (wrap.classList.toggle('source-mode')) {
      source.value = body.innerHTML; source.focus();
    } else {
      body.innerHTML = source.value; body.focus();
    }
  });

  wrap.getValue = () => (wrap.classList.contains('source-mode') ? source.value : body.innerHTML);
  wrap.setValue = (v) => {
    const html = v == null ? '' : String(v);
    body.innerHTML = html;
    source.value = html;
  };
  return wrap;
}

function runWysiwygCommand(cmd, body) {
  body.focus();
  if (cmd === 'createLink') {
    const url = prompt('Enter URL:');
    if (!url) return;
    document.execCommand('createLink', false, url);
    return;
  }
  if (cmd === 'code') {
    document.execCommand('insertHTML', false, '<code>' + escapeHtmlForInsert(getSelectedText() || 'code') + '</code>');
    return;
  }
  if (cmd === 'pre') {
    const text = getSelectedText() || 'code';
    document.execCommand('insertHTML', false, '<pre>' + escapeHtmlForInsert(text) + '</pre>');
    return;
  }
  document.execCommand(cmd, false, null);
}

function getSelectedText() {
  const sel = window.getSelection();
  return sel ? sel.toString() : '';
}

function escapeHtmlForInsert(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---- Misc ----

export function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

export function emptyState(text) {
  return el('div', { class: 'ed-list-empty' }, [text]);
}

export function card(titleText, children, actions) {
  return el('div', { class: 'ed-card' }, [
    el('div', { class: 'ed-card-header' }, [
      el('div', { class: 'ed-card-title' }, [titleText || '']),
      actions ? el('div', { class: 'ed-card-actions' }, actions) : null,
    ]),
    el('div', null, children)
  ]);
}
