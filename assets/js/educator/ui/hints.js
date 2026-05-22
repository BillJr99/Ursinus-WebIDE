import { el, field, clear, textareaField, card, emptyState } from './common.js';

export function renderHints(host, model, ctx) {
  clear(host);
  const r = model.raw;
  if (!r.processor) r.processor = {};
  if (!Array.isArray(r.processor.hints)) r.processor.hints = [];

  const intro = el('div', { class: 'ed-hint', style: 'margin-bottom:10px' }, [
    'Hints unlock progressively as a student makes failed attempts. The "After N attempts" field is how many failed Run clicks the student needs before the hint becomes visible.'
  ]);
  host.appendChild(intro);

  const listHost = el('div');

  const render = () => {
    clear(listHost);
    if (!r.processor.hints.length) {
      listHost.appendChild(emptyState('No hints yet.'));
      return;
    }
    r.processor.hints.forEach((h, idx) => {
      if (!h || typeof h !== 'object') { h = { after: 1, text: '' }; r.processor.hints[idx] = h; }
      const afterF = field({
        id: 'hint-after-' + idx, label: 'After N attempts',
        type: 'number', value: h.after != null ? h.after : 1,
        onInput: v => { h.after = Number(v); ctx.markDirty(); },
      });
      const textF = textareaField({
        id: 'hint-text-' + idx, label: 'Hint text',
        value: h.text || '', rows: 3,
        onInput: v => { h.text = v; ctx.markDirty(); },
      });
      const remove = el('button', { type: 'button', class: 'ed-btn ed-btn-sm ed-btn-danger' }, ['Remove']);
      remove.addEventListener('click', () => {
        r.processor.hints.splice(idx, 1); ctx.markDirty(); render();
      });
      listHost.appendChild(card('Hint #' + (idx + 1), [
        el('div', { class: 'ed-field-row' }, [afterF]),
        textF,
      ], [remove]));
    });
  };
  render();

  const addBtn = el('button', { type: 'button', class: 'ed-btn' }, ['+ Add hint']);
  addBtn.addEventListener('click', () => {
    const last = r.processor.hints[r.processor.hints.length - 1];
    const after = last && last.after ? Number(last.after) + 2 : 1;
    r.processor.hints.push({ after, text: '' });
    ctx.markDirty(); render();
  });

  host.appendChild(listHost);
  host.appendChild(addBtn);
}
