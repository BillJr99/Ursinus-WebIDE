import { el, field, clear, aceEditor, recipeRow, checkboxField, emptyState } from './common.js';
import { recipesFor } from '../recipes.js';

export function renderFiles(host, model, ctx) {
  clear(host);
  const r = model.raw;
  if (!Array.isArray(r.files)) r.files = [];
  if (!Array.isArray(r.openFilesOnLoad)) r.openFilesOnLoad = [];

  let activeIdx = r.files.length ? 0 : -1;

  const filesList = el('div', { id: 'ed-files-list' });
  const editorPane = el('div', { id: 'ed-files-editor' });

  // Sidebar actions
  const addFileBtn = el('button', { type: 'button', class: 'ed-btn ed-btn-sm', style: 'width:100%; margin-bottom:6px' }, ['+ Add file']);
  addFileBtn.addEventListener('click', () => {
    const next = { filename: 'NewFile.txt', name: 'newfile', ismain: false, isreadonly: false, isvisible: true, code: '' };
    r.files.push(next);
    activeIdx = r.files.length - 1;
    ctx.markDirty();
    renderList(); renderEditor();
  });

  const renderList = () => {
    clear(filesList);
    filesList.appendChild(addFileBtn);
    if (!r.files.length) {
      filesList.appendChild(emptyState('No files yet.'));
      return;
    }
    r.files.forEach((f, idx) => {
      const flags = [];
      if (f.ismain) flags.push('main');
      if (f.isreadonly) flags.push('ro');
      if (f.isvisible === false) flags.push('hidden');
      const row = el('div', { class: 'ed-file-row' + (idx === activeIdx ? ' active' : '') }, [
        el('span', null, [f.filename || '(unnamed)']),
        flags.length ? el('span', { class: 'ed-file-flag' }, ['(' + flags.join(',') + ')']) : null,
      ]);
      row.addEventListener('click', () => { activeIdx = idx; renderList(); renderEditor(); });
      filesList.appendChild(row);
    });
  };

  const renderEditor = () => {
    clear(editorPane);
    if (activeIdx < 0 || !r.files[activeIdx]) {
      editorPane.appendChild(emptyState('Add a file to start.'));
      return;
    }
    const f = r.files[activeIdx];

    const filename = field({
      id: 'file-filename', label: 'Filename',
      value: f.filename || '',
      placeholder: 'e.g. PrimeArray.java',
      onInput: v => { f.filename = v; ctx.markDirty(); renderList(); renderOpenFiles(); },
    });
    const name = field({
      id: 'file-name', label: 'Tab name / key',
      value: f.name || '',
      placeholder: 'short, lowercase identifier — e.g. primearray',
      hint: 'Lowercase identifier used internally. Often a slug of the filename.',
      onInput: v => { f.name = v; ctx.markDirty(); },
    });

    const ismainCb = checkboxField({
      label: 'Main file (the file whose output is checked)',
      value: !!f.ismain,
      onChange: c => {
        if (c) {
          // Only one file can be main at a time. Unset all others.
          r.files.forEach((other, j) => { if (j !== activeIdx) other.ismain = false; });
        }
        f.ismain = c; ctx.markDirty(); renderList();
      },
    });
    const roCb = checkboxField({
      label: 'Read-only',
      value: !!f.isreadonly,
      onChange: c => { f.isreadonly = c; ctx.markDirty(); renderList(); },
    });
    const visCb = checkboxField({
      label: 'Visible to students',
      value: f.isvisible !== false,
      onChange: c => { f.isvisible = c; ctx.markDirty(); renderList(); },
    });
    const exclCb = checkboxField({
      label: 'Exclude from student-side export',
      value: !!f.excludeFromExport,
      onChange: c => {
        if (c) f.excludeFromExport = true; else delete f.excludeFromExport;
        ctx.markDirty();
      },
    });

    const aceWrap = aceEditor({
      language: r.language || 'javascript', tall: true,
      value: f.code || '',
      onChange: v => { f.code = v; ctx.markDirty(); },
    });
    const recipes = recipesFor('filecode', r.language || 'javascript');
    const recipePicker = recipes.length ? recipeRow(recipes, v => aceWrap.setValue(v)) : null;

    // Respond to language changes — swap ACE mode.
    const langHandler = (lang) => { if (aceWrap.setLanguage) aceWrap.setLanguage(lang); };
    ctx.on('language-changed', langHandler);

    const removeBtn = el('button', { type: 'button', class: 'ed-btn ed-btn-danger' }, ['Delete file']);
    removeBtn.addEventListener('click', () => {
      if (!confirm('Delete "' + (f.filename || 'this file') + '"?')) return;
      r.files.splice(activeIdx, 1);
      activeIdx = Math.min(activeIdx, r.files.length - 1);
      ctx.markDirty();
      renderList(); renderEditor(); renderOpenFiles();
    });

    editorPane.appendChild(el('div', { class: 'ed-field-row' }, [filename, name]));
    editorPane.appendChild(el('div', { class: 'ed-field-row' }, [ismainCb, roCb, visCb, exclCb]));
    editorPane.appendChild(el('label', { style: 'margin-top:8px' }, ['Starter code']));
    if (recipePicker) editorPane.appendChild(recipePicker);
    editorPane.appendChild(aceWrap);
    editorPane.appendChild(el('div', { class: 'ed-mt-8', style: 'text-align:right' }, [removeBtn]));
  };

  const openFilesHost = el('div');
  const renderOpenFiles = () => {
    clear(openFilesHost);
    if (!r.files.length) {
      openFilesHost.appendChild(emptyState('Add files first.'));
      return;
    }
    r.files.forEach((f) => {
      const cb = el('input', { type: 'checkbox' });
      cb.checked = r.openFilesOnLoad.includes(f.filename);
      cb.addEventListener('change', () => {
        const idx = r.openFilesOnLoad.indexOf(f.filename);
        if (cb.checked && idx === -1) r.openFilesOnLoad.push(f.filename);
        else if (!cb.checked && idx !== -1) r.openFilesOnLoad.splice(idx, 1);
        ctx.markDirty();
      });
      openFilesHost.appendChild(el('label', { class: 'ed-checkbox-row' }, [cb, ' ' + (f.filename || '(unnamed)')]));
    });
  };

  const layout = el('div', { id: 'ed-files-layout' }, [filesList, editorPane]);
  host.appendChild(layout);
  host.appendChild(el('hr', { class: 'ed-divider' }));
  host.appendChild(el('h3', null, ['Open on page load']));
  host.appendChild(el('div', { class: 'ed-hint' }, ['Files checked here will be opened automatically in the IDE when a student visits the exercise.']));
  host.appendChild(openFilesHost);

  renderList();
  renderEditor();
  renderOpenFiles();
}
