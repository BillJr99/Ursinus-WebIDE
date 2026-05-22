import { el, field, clear, aceEditor, recipeRow, textareaField, selectField, card, emptyState } from './common.js';
import { recipesFor } from '../recipes.js';

const EXPECT_KINDS = [
  { value: 'stdout',  label: 'stdout matches regex' },
  { value: 'returns', label: 'value equals (JSON)' },
  { value: 'throws',  label: 'throws / does not throw' },
  { value: 'vars',    label: 'variables equal (JSON object)' },
];

function detectExpectKind(expect) {
  if (!expect || typeof expect !== 'object') return '';
  if ('stdout'  in expect) return 'stdout';
  if ('returns' in expect) return 'returns';
  if ('throws'  in expect) return 'throws';
  if ('vars'    in expect) return 'vars';
  return '';
}

export function renderTests(host, model, ctx) {
  clear(host);
  const r = model.raw;
  if (!r.processor) r.processor = {};
  if (!Array.isArray(r.processor.tests)) r.processor.tests = [];

  const intro = el('div', { class: 'ed-hint', style: 'margin-bottom:10px' }, [
    'Unit tests run inside the same runtime as the student\'s code. Pick an "expect" kind below; only the matching field is used.'
  ]);
  host.appendChild(intro);

  const listHost = el('div');

  const render = () => {
    clear(listHost);
    if (!r.processor.tests.length) {
      listHost.appendChild(emptyState('No tests yet.'));
      return;
    }
    r.processor.tests.forEach((t, idx) => {
      if (!t || typeof t !== 'object') { t = { name: '', code: '', expect: {} }; r.processor.tests[idx] = t; }
      if (!t.expect) t.expect = {};

      const name = field({
        id: 'test-name-' + idx, label: 'Test name',
        value: t.name || '',
        placeholder: 'e.g. fact(5) returns 120',
        onInput: v => { t.name = v; ctx.markDirty(); },
      });

      const codeAce = aceEditor({
        language: r.language || 'javascript',
        value: t.code || '',
        onChange: v => { t.code = v; ctx.markDirty(); },
      });
      const codeRecipes = recipeRow(recipesFor('testcode', r.language || 'javascript'),
        v => codeAce.setValue(v));
      ctx.on('language-changed', lang => { if (codeAce.setLanguage) codeAce.setLanguage(lang); });

      const expectBody = el('div', { class: 'ed-mt-8' });
      const kindSel = selectField({
        id: 'test-expect-' + idx, label: 'Expectation kind',
        value: detectExpectKind(t.expect),
        options: [{ value: '', label: '(none)' }, ...EXPECT_KINDS],
        onChange: v => {
          for (const k of EXPECT_KINDS) { if (k.value !== v) delete t.expect[k.value]; }
          if (v && !(v in t.expect)) {
            t.expect[v] = (v === 'throws') ? false : '';
          }
          ctx.markDirty(); renderExpectBody();
        },
      });

      const renderExpectBody = () => {
        clear(expectBody);
        const kind = detectExpectKind(t.expect);
        if (!kind) return;
        if (kind === 'stdout') {
          const f = field({
            id: 'test-exp-stdout-' + idx, label: 'Expected stdout (regex)',
            value: t.expect.stdout || '',
            onInput: v => { t.expect.stdout = v; ctx.markDirty(); },
          });
          expectBody.appendChild(f);
        } else if (kind === 'returns') {
          const f = textareaField({
            id: 'test-exp-ret-' + idx, label: 'Expected return value (JSON literal)',
            value: typeof t.expect.returns === 'string' ? t.expect.returns : JSON.stringify(t.expect.returns),
            rows: 2,
            onInput: v => {
              try { t.expect.returns = JSON.parse(v); } catch (e) { t.expect.returns = v; }
              ctx.markDirty();
            },
          });
          expectBody.appendChild(f);
        } else if (kind === 'throws') {
          const f = selectField({
            id: 'test-exp-throws-' + idx, label: 'Throws?',
            value: t.expect.throws ? 'true' : 'false',
            options: [{ value: 'false', label: 'Does not throw' }, { value: 'true', label: 'Throws' }],
            onChange: v => { t.expect.throws = (v === 'true'); ctx.markDirty(); },
          });
          expectBody.appendChild(f);
        } else if (kind === 'vars') {
          const f = textareaField({
            id: 'test-exp-vars-' + idx, label: 'Expected variables (JSON object)',
            value: typeof t.expect.vars === 'string' ? t.expect.vars : JSON.stringify(t.expect.vars || {}, null, 2),
            rows: 3,
            onInput: v => {
              try { t.expect.vars = JSON.parse(v); } catch (e) { t.expect.vars = v; }
              ctx.markDirty();
            },
          });
          expectBody.appendChild(f);
        }
      };
      renderExpectBody();

      const remove = el('button', { type: 'button', class: 'ed-btn ed-btn-sm ed-btn-danger' }, ['Remove']);
      remove.addEventListener('click', () => {
        r.processor.tests.splice(idx, 1); ctx.markDirty(); render();
      });

      listHost.appendChild(card('Test #' + (idx + 1), [
        name,
        el('label', { class: 'ed-mt-8' }, ['Test code']),
        codeRecipes,
        codeAce,
        kindSel,
        expectBody,
      ], [remove]));
    });
  };
  render();

  const addBtn = el('button', { type: 'button', class: 'ed-btn' }, ['+ Add test']);
  addBtn.addEventListener('click', () => {
    r.processor.tests.push({ name: 'New test', code: '', expect: {} });
    ctx.markDirty(); render();
  });

  host.appendChild(listHost);
  host.appendChild(addBtn);
}
