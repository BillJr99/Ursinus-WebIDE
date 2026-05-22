import { el, field, clear, aceEditor, recipeRow, checkboxField, textareaField, card, emptyState } from './common.js';
import { recipesFor } from '../recipes.js';

export function renderCorrectness(host, model, ctx) {
  clear(host);
  const r = model.raw;
  if (!r.processor) r.processor = {};
  const p = r.processor;
  if (!Array.isArray(p.incorrectchecks)) p.incorrectchecks = [];

  const correct = field({
    id: 'p-correctfeedback', label: 'Message shown when correct',
    value: p.correctfeedback || '',
    placeholder: 'Correct!',
    onInput: v => { p.correctfeedback = v; ctx.markDirty(); },
  });

  const incorrect = field({
    id: 'p-incorrectfeedback', label: 'Default message shown when incorrect',
    value: p.incorrectfeedback || '',
    placeholder: 'Try again',
    onInput: v => { p.incorrectfeedback = v; ctx.markDirty(); },
  });

  const submitToggle = checkboxField({
    label: 'Show "Submit to Canvas" link after a correct answer',
    value: !!p.submitformlink,
    onChange: c => { p.submitformlink = c; ctx.markDirty(); },
  });

  // ---- Feedback process ----
  const feedbackAce = aceEditor({
    language: 'javascript', tall: true,
    value: p.feedbackprocess || '',
    onChange: v => { p.feedbackprocess = v; ctx.markDirty(); },
  });
  const feedbackRecipes = recipeRow(recipesFor('feedbackprocess', r.language || 'javascript'),
    v => feedbackAce.setValue(v));
  const feedbackField = el('div', { class: 'ed-field' }, [
    el('label', null, ['Step 1: Process the student\'s console output']),
    el('div', { class: 'ed-hint' }, [
      'JavaScript that runs after a student clicks Run. The variable feedbackString holds everything the student printed. Convert it into something the correct check can use.'
    ]),
    feedbackRecipes,
    feedbackAce,
  ]);

  // ---- Correct check ----
  const correctAce = aceEditor({
    language: 'javascript',
    value: p.correctcheck || '',
    onChange: v => { p.correctcheck = v; ctx.markDirty(); },
  });
  const correctRecipes = recipeRow(recipesFor('correctcheck', r.language || 'javascript'),
    v => correctAce.setValue(v));
  const correctField = el('div', { class: 'ed-field' }, [
    el('label', null, ['Step 2: Is the answer correct?']),
    el('div', { class: 'ed-hint' }, [
      'A JavaScript expression that must evaluate to true when the student is right. Use variables defined in step 1, or feedbackString directly.'
    ]),
    correctRecipes,
    correctAce,
  ]);

  // ---- Incorrect checks ----
  const incorrectHost = el('div');
  const renderIncorrect = () => {
    clear(incorrectHost);
    if (!p.incorrectchecks.length) {
      incorrectHost.appendChild(emptyState('No targeted hints yet. Targeted hints fire when a specific common mistake is detected.'));
      return;
    }
    p.incorrectchecks.forEach((c, idx) => {
      if (!c || typeof c !== 'object') {
        p.incorrectchecks[idx] = { incorrectcheck: '', feedback: '' };
        c = p.incorrectchecks[idx];
      }
      const checkAce = aceEditor({
        language: 'javascript',
        value: c.incorrectcheck || '',
        onChange: v => { c.incorrectcheck = v; ctx.markDirty(); },
      });
      const recipes = recipeRow(recipesFor('incorrectcheck', r.language || 'javascript'),
        v => checkAce.setValue(v));
      const fb = textareaField({
        id: 'ic-fb-' + idx, label: 'Feedback shown to the student',
        value: c.feedback || '', rows: 2,
        onInput: v => { c.feedback = v; ctx.markDirty(); },
      });
      const remove = el('button', { type: 'button', class: 'ed-btn ed-btn-sm ed-btn-danger' }, ['Remove']);
      remove.addEventListener('click', () => {
        p.incorrectchecks.splice(idx, 1); ctx.markDirty(); renderIncorrect();
      });
      incorrectHost.appendChild(card('Targeted hint #' + (idx + 1), [
        el('label', null, ['Detect when this expression is true:']),
        recipes,
        checkAce,
        fb,
      ], [remove]));
    });
  };
  renderIncorrect();

  const addIncorrect = el('button', { type: 'button', class: 'ed-btn' }, ['+ Add targeted hint']);
  addIncorrect.addEventListener('click', () => {
    p.incorrectchecks.push({ incorrectcheck: '', feedback: '' });
    ctx.markDirty();
    renderIncorrect();
  });

  host.appendChild(el('div', { class: 'ed-field-row' }, [correct, incorrect]));
  host.appendChild(submitToggle);
  host.appendChild(el('hr', { class: 'ed-divider' }));
  host.appendChild(feedbackField);
  host.appendChild(el('hr', { class: 'ed-divider' }));
  host.appendChild(correctField);
  host.appendChild(el('hr', { class: 'ed-divider' }));
  host.appendChild(el('h3', null, ['Targeted hints for common mistakes']));
  host.appendChild(incorrectHost);
  host.appendChild(addIncorrect);
}
