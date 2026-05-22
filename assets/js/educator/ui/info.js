import { el, field, clear, wysiwygEditor, card } from './common.js';

export function renderInfo(host, model, ctx) {
  clear(host);
  const r = model.raw;
  if (!r.info) r.info = {};
  if (!Array.isArray(r.info.goals)) r.info.goals = [];

  // Points
  const points = field({
    id: 'info-points',
    label: 'Points',
    type: 'number',
    value: r.info.points != null ? r.info.points : '',
    onInput: v => { r.info.points = v === '' ? '' : Number(v); ctx.markDirty(); },
  });

  // Packages (Pyodide only)
  const packages = field({
    id: 'info-packages',
    label: 'Pyodide packages',
    value: r.info.packages || '',
    placeholder: 'numpy,matplotlib',
    hint: 'Comma-separated list of Python packages to load. Pyodide language only.',
    onInput: v => { r.info.packages = v; ctx.markDirty(); },
  });
  packages.style.display = (r.language === 'pyodide') ? '' : 'none';
  ctx.on('language-changed', lang => {
    packages.style.display = (lang === 'pyodide') ? '' : 'none';
  });

  // Prev/next links
  const prev = field({
    id: 'info-prev', label: 'Previous exercise URL (optional)',
    value: r.info.prev || '',
    onInput: v => { if (v) r.info.prev = v; else delete r.info.prev; ctx.markDirty(); },
  });
  const next = field({
    id: 'info-next', label: 'Next exercise URL (optional)',
    value: r.info.next || '',
    onInput: v => { if (v) r.info.next = v; else delete r.info.next; ctx.markDirty(); },
  });

  // Instructions — rich-text WYSIWYG that serializes to HTML.
  const wInstr = wysiwygEditor({
    value: r.info.instructions || '',
    onInput: v => { r.info.instructions = v; ctx.markDirty(); refreshPreview(); },
  });
  const previewPane = el('div', { class: 'ed-preview-pane' });
  const refreshPreview = () => {
    previewPane.innerHTML = r.info.instructions || '<em style="opacity:0.6">(empty)</em>';
  };
  refreshPreview();

  const instructionsField = el('div', { class: 'ed-field' }, [
    el('label', null, ['Instructions']),
    el('div', { class: 'ed-hint' }, [
      'Rich-text editor. The HTML stays in the markdown file under info.instructions and renders on the exercise page.'
    ]),
    wInstr,
    el('label', { class: 'ed-mt-8' }, ['Preview']),
    previewPane,
  ]);

  // Goals — repeatable list
  const goalsHost = el('div');
  const renderGoals = () => {
    clear(goalsHost);
    if (!r.info.goals.length) {
      goalsHost.appendChild(el('div', { class: 'ed-list-empty' }, ['No goals yet — click "Add goal" below.']));
      return;
    }
    r.info.goals.forEach((g, idx) => {
      const editor = wysiwygEditor({
        value: g || '',
        onInput: v => { r.info.goals[idx] = v; ctx.markDirty(); },
      });
      const removeBtn = el('button', { type: 'button', class: 'ed-btn ed-btn-sm ed-btn-danger' }, ['Remove']);
      removeBtn.addEventListener('click', () => {
        r.info.goals.splice(idx, 1); ctx.markDirty(); renderGoals();
      });
      goalsHost.appendChild(card('Goal #' + (idx + 1), [editor], [removeBtn]));
    });
  };
  renderGoals();

  const addGoalBtn = el('button', { type: 'button', class: 'ed-btn' }, ['+ Add goal']);
  addGoalBtn.addEventListener('click', () => {
    r.info.goals.push(''); ctx.markDirty(); renderGoals();
  });

  host.appendChild(el('div', { class: 'ed-field-row' }, [points, prev, next]));
  host.appendChild(packages);
  host.appendChild(el('hr', { class: 'ed-divider' }));
  host.appendChild(instructionsField);
  host.appendChild(el('hr', { class: 'ed-divider' }));
  host.appendChild(el('h3', null, ['Learning goals']));
  host.appendChild(el('div', { class: 'ed-hint' }, ['Each goal is rendered as a list item on the exercise page.']));
  host.appendChild(goalsHost);
  host.appendChild(addGoalBtn);
}
