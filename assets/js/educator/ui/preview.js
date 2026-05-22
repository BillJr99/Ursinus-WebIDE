import { el, clear } from './common.js';
import { serializeMarkdown } from '../serializer.js';
import { validateModel } from '../validate.js';

export function renderPreview(host, model) {
  clear(host);
  const banner = el('div', { class: 'ed-hint', style: 'margin-bottom:10px' }, [
    'Two views below. Form Summary recaps the structured fields. Serialized Markdown shows the exact .md content that Download / Commit will produce.'
  ]);

  const refreshBtn = el('button', { type: 'button', class: 'ed-btn' }, ['Refresh preview']);
  const summaryHost = el('div', { class: 'ed-preview-pane' });
  const markdownHost = el('pre', { class: 'ed-preview-pane ed-mono', style: 'white-space:pre-wrap; max-height:520px; overflow:auto' });

  const refresh = () => {
    refreshSummary(summaryHost, model);
    refreshMarkdown(markdownHost, model);
  };
  refreshBtn.addEventListener('click', refresh);

  host.appendChild(banner);
  host.appendChild(refreshBtn);
  host.appendChild(el('h3', null, ['Form Summary']));
  host.appendChild(summaryHost);
  host.appendChild(el('h3', null, ['Serialized Markdown']));
  host.appendChild(markdownHost);
  refresh();
}

function refreshSummary(host, model) {
  clear(host);
  const r = model.raw;
  const v = validateModel(model);

  const facts = el('ul');
  const add = (k, val) => facts.appendChild(el('li', null, [el('strong', null, [k + ': ']), String(val)]));

  add('Title', r.title || '(empty)');
  add('Permalink', r.permalink || '(empty)');
  add('Language', r.language || '(empty)');
  add('Points', r.info && r.info.points != null ? r.info.points : '(unset)');
  add('Files', (r.files || []).length + ' file(s)');
  add('Goals', (r.info && r.info.goals ? r.info.goals.length : 0) + ' goal(s)');
  add('Hints', (r.processor && r.processor.hints ? r.processor.hints.length : 0));
  add('Tests', (r.processor && r.processor.tests ? r.processor.tests.length : 0));

  host.appendChild(facts);

  if (v.errors.length) {
    host.appendChild(el('div', { style: 'color:#f14c4c; margin-top:6px' }, [
      el('strong', null, [v.errors.length + ' error(s) block download/commit:']),
      el('ul', null, v.errors.map(e => el('li', null, [e.section + '.' + e.field + ': ' + e.msg])))
    ]));
  }
  if (v.warnings.length) {
    host.appendChild(el('div', { style: 'color:#cca700; margin-top:6px' }, [
      el('strong', null, [v.warnings.length + ' warning(s):']),
      el('ul', null, v.warnings.map(e => el('li', null, [e.section + '.' + e.field + ': ' + e.msg])))
    ]));
  }
}

function refreshMarkdown(host, model) {
  clear(host);
  try {
    host.textContent = serializeMarkdown(model);
  } catch (e) {
    host.textContent = 'Serialization error: ' + (e && e.message ? e.message : String(e));
  }
}
