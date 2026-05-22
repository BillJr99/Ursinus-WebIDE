import { el, field, selectField, checkboxField, clear, emptyState } from './common.js';
import * as gh from '../github.js';
import { parseMarkdown } from '../parser.js';
import { serializeMarkdown } from '../serializer.js';
import { adoptRaw } from '../model.js';
import { validateModel } from '../validate.js';

export function renderSync(host, model, ctx) {
  clear(host);

  const status = el('div', { id: 'ed-gh-status' });
  const setStatus = (text, kind) => {
    status.className = kind ? kind : '';
    status.textContent = text || '';
  };

  // ---- Token entry ----
  const tokenInput = el('input', {
    type: 'password', class: 'ed-input', placeholder: 'Paste a fine-grained PAT',
    autocomplete: 'off',
  });
  const persistCb = el('input', { type: 'checkbox' });
  persistCb.checked = gh.hasPersistedToken();
  const saveBtn = el('button', { type: 'button', class: 'ed-btn ed-btn-primary' }, ['Use token']);
  const forgetBtn = el('button', { type: 'button', class: 'ed-btn ed-btn-danger' }, ['Forget']);

  // If a token is already saved, show the existing-token state.
  let hasToken = gh.hasPersistedToken();
  const updateForgetButton = () => { forgetBtn.style.display = (gh.getToken() ? '' : 'none'); };
  updateForgetButton();

  saveBtn.addEventListener('click', async () => {
    const tok = tokenInput.value.trim();
    if (!tok) { setStatus('Paste a token first.', 'err'); return; }
    gh.setToken(tok, persistCb.checked);
    tokenInput.value = '';
    updateForgetButton();
    setStatus('Checking token…', 'info');
    try {
      const user = await gh.getAuthedUser();
      setStatus('Signed in as ' + (user.login || '(unknown)'), 'ok');
      await loadRepos();
    } catch (e) {
      setStatus('Token rejected: ' + e.message, 'err');
    }
  });
  forgetBtn.addEventListener('click', () => {
    gh.forgetToken();
    persistCb.checked = false;
    updateForgetButton();
    repoSelect.innerHTML = '';
    branchSelect.innerHTML = '';
    treeHost.innerHTML = '';
    setStatus('Token forgotten.', 'info');
  });

  const tokenSection = el('div', null, [
    el('label', null, ['GitHub Personal Access Token']),
    el('div', { class: 'ed-hint' }, [
      'Create a fine-grained PAT at ',
      el('a', { href: 'https://github.com/settings/personal-access-tokens', target: '_blank', rel: 'noopener' }, ['github.com/settings/personal-access-tokens']),
      ' scoped to a single repository with Contents: Read and write. The token is held only in this tab unless you check the box below — anything in localStorage can be read by any JavaScript loaded on this page.'
    ]),
    el('div', { class: 'ed-token-row ed-mt-8' }, [tokenInput, saveBtn, forgetBtn]),
    el('label', { class: 'ed-checkbox-row ed-mt-8' }, [persistCb, ' Remember this token on this device (localStorage)']),
    status,
  ]);
  host.appendChild(tokenSection);
  host.appendChild(el('hr', { class: 'ed-divider' }));

  // ---- Repo / branch / path ----
  const last = gh.loadLastUsed() || {};
  const repoSelect = el('select', { class: 'ed-select' });
  const branchSelect = el('select', { class: 'ed-select' });
  const pathInput = el('input', { type: 'text', class: 'ed-input', value: last.basePath || '', placeholder: 'optional sub-directory, e.g. Java' });

  const loadRepos = async () => {
    setStatus('Loading repositories…', 'info');
    try {
      const repos = await gh.listUserRepos();
      repoSelect.innerHTML = '';
      repoSelect.appendChild(el('option', { value: '' }, ['— pick a repository —']));
      for (const r of repos) {
        const v = r.full_name;
        const opt = el('option', { value: v }, [v]);
        if (v === (last.owner + '/' + last.repo)) opt.selected = true;
        repoSelect.appendChild(opt);
      }
      setStatus('Found ' + repos.length + ' repositories.', 'ok');
      if (repoSelect.value) await loadBranches();
    } catch (e) {
      setStatus('Failed to list repos: ' + e.message, 'err');
    }
  };

  const loadBranches = async () => {
    const fn = repoSelect.value;
    if (!fn) return;
    const [owner, repo] = fn.split('/');
    setStatus('Loading branches…', 'info');
    try {
      const branches = await gh.listBranches(owner, repo);
      branchSelect.innerHTML = '';
      for (const b of branches) {
        const opt = el('option', { value: b.name }, [b.name]);
        if (b.name === last.branch) opt.selected = true;
        branchSelect.appendChild(opt);
      }
      // Default to main / master if no last branch.
      if (!last.branch) {
        const preferred = ['main', 'master'].find(n => branches.find(b => b.name === n));
        if (preferred) branchSelect.value = preferred;
      }
      setStatus('', '');
    } catch (e) {
      setStatus('Failed to list branches: ' + e.message, 'err');
    }
  };

  repoSelect.addEventListener('change', loadBranches);

  const browseBtn = el('button', { type: 'button', class: 'ed-btn ed-btn-primary' }, ['Browse files']);
  browseBtn.addEventListener('click', () => loadTree(''));

  const repoSection = el('div', null, [
    el('div', { class: 'ed-field-row' }, [
      el('div', { class: 'ed-field' }, [el('label', null, ['Repository']), repoSelect]),
      el('div', { class: 'ed-field' }, [el('label', null, ['Branch']), branchSelect]),
      el('div', { class: 'ed-field' }, [el('label', null, ['Sub-directory (optional)']), pathInput]),
    ]),
    el('div', { class: 'ed-mt-8' }, [browseBtn]),
  ]);
  host.appendChild(repoSection);
  host.appendChild(el('hr', { class: 'ed-divider' }));

  // ---- File tree ----
  const treeHost = el('div', { id: 'ed-gh-tree' });
  host.appendChild(el('h3', null, ['Repository files']));
  host.appendChild(treeHost);

  const loadTree = async (subPath) => {
    const fn = repoSelect.value;
    if (!fn) { setStatus('Pick a repository first.', 'err'); return; }
    const [owner, repo] = fn.split('/');
    const branch = branchSelect.value;
    const base = pathInput.value.replace(/^\/+|\/+$/g, '');
    const full = [base, subPath].filter(Boolean).join('/');
    clear(treeHost);
    treeHost.appendChild(el('div', { class: 'ed-hint' }, ['Loading ' + (full || '(root)') + ' …']));
    try {
      const items = await gh.listContents(owner, repo, full, branch);
      clear(treeHost);

      // Up-one row if we are below the base
      if (full !== base) {
        const up = el('div', { class: 'ed-gh-row dir' }, [
          el('span', { class: 'ed-gh-glyph' }, ['↩']),
          el('span', null, ['..'])
        ]);
        up.addEventListener('click', () => {
          const parent = full.split('/').slice(0, -1).join('/');
          const rel = parent === base ? '' : parent.slice(base ? base.length + 1 : 0);
          loadTree(rel);
        });
        treeHost.appendChild(up);
      }

      const arr = Array.isArray(items) ? items : [items];
      arr.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      let any = false;
      for (const it of arr) {
        if (it.type === 'dir') {
          any = true;
          const row = el('div', { class: 'ed-gh-row dir' }, [
            el('span', { class: 'ed-gh-glyph' }, ['📁']),
            el('span', null, [it.name])
          ]);
          row.addEventListener('click', () => {
            const rel = (subPath ? subPath + '/' : '') + it.name;
            loadTree(rel);
          });
          treeHost.appendChild(row);
        } else if (it.type === 'file' && /\.(md|markdown)$/i.test(it.name)) {
          any = true;
          const row = el('div', { class: 'ed-gh-row file' }, [
            el('span', { class: 'ed-gh-glyph' }, ['📄']),
            el('span', null, [it.name])
          ]);
          row.addEventListener('click', () => loadFile(owner, repo, branch, it.path, it.name));
          treeHost.appendChild(row);
        }
      }
      if (!any) treeHost.appendChild(emptyState('No markdown files or sub-directories here.'));
    } catch (e) {
      clear(treeHost);
      treeHost.appendChild(el('div', { class: 'ed-error-msg' }, ['Load failed: ' + e.message]));
    }
  };

  const loadFile = async (owner, repo, branch, path, name) => {
    if (model.dirty && !confirm('You have unsaved changes. Replace them with ' + name + ' from GitHub?')) return;
    setStatus('Loading ' + path + ' …', 'info');
    try {
      const { text, sha } = await gh.getFile(owner, repo, path, branch);
      const parsed = parseMarkdown(text);
      ctx.loadModel({
        raw: parsed.raw,
        bodyAfterFrontmatter: parsed.body,
        github: { owner, repo, branch, path, sha },
        dirty: false,
      });
      gh.saveLastUsed({ owner, repo, branch, basePath: pathInput.value });
      setStatus('Loaded ' + path + ' (sha ' + sha.slice(0, 7) + ')', 'ok');
      renderGhActions();
    } catch (e) {
      setStatus('Load failed: ' + e.message, 'err');
    }
  };

  // ---- Commit / PR actions on the currently-loaded file ----
  const actionsHost = el('div');
  host.appendChild(el('hr', { class: 'ed-divider' }));
  host.appendChild(el('h3', null, ['Save to GitHub']));
  host.appendChild(actionsHost);

  const renderGhActions = () => {
    clear(actionsHost);
    const g = model.github || {};
    if (!g.owner || !g.path) {
      actionsHost.appendChild(emptyState('Load a file from GitHub above (or open a local file and then pick a target path here).'));
      return;
    }
    const target = field({
      id: 'gh-target', label: 'Target path in repository',
      value: g.path, onInput: v => { g.path = v; },
    });
    const commitMsg = field({
      id: 'gh-msg', label: 'Commit message',
      value: 'Update ' + (g.path.split('/').pop() || ''),
    });
    const prCheck = checkboxField({ label: 'Open a Pull Request instead of committing to the branch', value: false, onChange: v => { prFlow = v; } });
    let prFlow = false;
    const commitBtn = el('button', { type: 'button', class: 'ed-btn ed-btn-primary' }, ['Commit to ' + g.branch]);
    commitBtn.addEventListener('click', async () => {
      const v = validateModel(model);
      if (v.errors.length) {
        setStatus('Fix ' + v.errors.length + ' validation error(s) before saving (see Preview tab).', 'err');
        return;
      }
      try {
        const text = serializeMarkdown(model);
        setStatus('Committing…', 'info');
        if (prFlow) {
          const newBranch = 'educator/' + slug(g.path) + '-' + Date.now();
          await gh.createBranch(g.owner, g.repo, newBranch, g.branch);
          // PUT on the new branch with the same sha (the file at branch HEAD).
          const put = await gh.putFile(g.owner, g.repo, target._input.value, newBranch, text, commitMsg._input.value, g.sha);
          const pr = await gh.createPullRequest(g.owner, g.repo, newBranch, g.branch,
            commitMsg._input.value, 'Authored via the WebIDE Educator tool.');
          setStatus('PR opened: ' + pr.html_url, 'ok');
          model.dirty = false; ctx.refreshDirty();
        } else {
          const put = await gh.putFile(g.owner, g.repo, target._input.value, g.branch, text, commitMsg._input.value, g.sha);
          if (put && put.content && put.content.sha) g.sha = put.content.sha;
          if (put && put.content && put.content.path) g.path = put.content.path;
          model.dirty = false; ctx.refreshDirty();
          setStatus('Committed ' + (put.commit ? put.commit.sha.slice(0, 7) : '') + ' to ' + g.branch, 'ok');
        }
        gh.saveLastUsed({ owner: g.owner, repo: g.repo, branch: g.branch, basePath: pathInput.value });
      } catch (e) {
        if (e.status === 409) {
          setStatus('File changed on the server. Reload it before saving again.', 'err');
        } else {
          setStatus('Commit failed: ' + e.message, 'err');
        }
      }
    });
    actionsHost.appendChild(el('div', null, [
      el('div', { class: 'ed-hint' }, ['Loaded from ' + g.owner + '/' + g.repo + '@' + g.branch + ':' + g.path]),
      target, commitMsg, prCheck,
      el('div', { class: 'ed-mt-8' }, [commitBtn]),
    ]));
  };
  renderGhActions();

  // If we already had a token in localStorage, eagerly load repos.
  if (gh.getToken()) {
    setStatus('Token found — verifying…', 'info');
    gh.getAuthedUser()
      .then(u => { setStatus('Signed in as ' + (u.login || '(unknown)'), 'ok'); return loadRepos(); })
      .catch(e => setStatus('Saved token rejected: ' + e.message, 'err'));
  }

  // Refresh action panel whenever the loaded model changes.
  ctx.on('model-loaded', renderGhActions);

  // Rate-limit warning surface.
  gh.onRateLimitLow((remaining) => {
    if (remaining < 10) setStatus('GitHub rate limit getting low (' + remaining + ' calls remaining).', 'err');
  });
}

function slug(path) {
  return String(path).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'file';
}
