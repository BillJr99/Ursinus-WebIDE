// Thin wrapper around the GitHub REST API for the educator tool.
// PAT-based auth; the token is held in memory by default and only
// persisted to localStorage when the educator opts in via the
// "Remember on this device" checkbox.

const API = 'https://api.github.com';
const LS_KEY = 'educator.gh.pat';
const LS_LAST = 'educator.gh.last';

// In-memory token for this tab only. Survives unless the tab reloads.
let _token = null;

export function setToken(token, persist) {
  _token = token || null;
  if (persist && token) {
    try { localStorage.setItem(LS_KEY, token); } catch (e) { /* quota / private mode */ }
  } else {
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
  }
}

export function getToken() {
  if (_token) return _token;
  try {
    const t = localStorage.getItem(LS_KEY);
    if (t) { _token = t; return t; }
  } catch (e) {}
  return null;
}

export function hasPersistedToken() {
  try { return !!localStorage.getItem(LS_KEY); } catch (e) { return false; }
}

export function forgetToken() {
  _token = null;
  try { localStorage.removeItem(LS_KEY); } catch (e) {}
}

export function saveLastUsed(obj) {
  try { localStorage.setItem(LS_LAST, JSON.stringify(obj)); } catch (e) {}
}

export function loadLastUsed() {
  try { return JSON.parse(localStorage.getItem(LS_LAST) || 'null'); } catch (e) { return null; }
}

// Surfaces rate-limit info via the callback if remaining drops low.
let _rateLimitCb = null;
export function onRateLimitLow(cb) { _rateLimitCb = cb; }

async function ghFetch(path, opts) {
  const token = getToken();
  if (!token) throw new Error('No GitHub token. Paste one in the GitHub Sync panel.');

  const url = path.startsWith('http') ? path : (API + path);
  const headers = Object.assign({
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Authorization': 'Bearer ' + token,
  }, (opts && opts.headers) || {});

  const res = await fetch(url, Object.assign({}, opts || {}, { headers }));

  const remaining = parseInt(res.headers.get('X-RateLimit-Remaining') || '999', 10);
  if (_rateLimitCb && remaining < 50) {
    try { _rateLimitCb(remaining); } catch (e) {}
  }

  let data = null;
  const ct = res.headers.get('Content-Type') || '';
  if (ct.includes('application/json') || ct.includes('+json')) {
    try { data = await res.json(); } catch (e) { /* empty body */ }
  } else {
    try { data = await res.text(); } catch (e) {}
  }

  if (!res.ok) {
    const msg = (data && data.message) ? data.message : ('HTTP ' + res.status);
    const err = new Error('GitHub: ' + msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// --- Public API ---

export async function getAuthedUser() {
  return ghFetch('/user');
}

export async function listUserRepos() {
  // Paginate up to 200 repos — plenty for the educator use case.
  const out = [];
  for (let page = 1; page <= 2; page++) {
    const batch = await ghFetch('/user/repos?per_page=100&sort=updated&page=' + page);
    if (!Array.isArray(batch) || !batch.length) break;
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

export async function listBranches(owner, repo) {
  return ghFetch('/repos/' + enc(owner) + '/' + enc(repo) + '/branches?per_page=100');
}

export async function listContents(owner, repo, path, branch) {
  const p = path ? path.replace(/^\/+|\/+$/g, '') : '';
  const url = '/repos/' + enc(owner) + '/' + enc(repo) + '/contents/' + encPath(p)
    + (branch ? '?ref=' + encodeURIComponent(branch) : '');
  return ghFetch(url);
}

export async function getFile(owner, repo, path, branch) {
  const data = await listContents(owner, repo, path, branch);
  if (data && data.type === 'file' && typeof data.content === 'string') {
    const text = decodeBase64Utf8(data.content);
    return { text, sha: data.sha, raw: data };
  }
  throw new Error('Path is not a file: ' + path);
}

export async function putFile(owner, repo, path, branch, text, message, sha) {
  const body = {
    message: message || ('Update ' + path),
    content: encodeBase64Utf8(text),
    branch,
  };
  if (sha) body.sha = sha;
  const p = path.replace(/^\/+/, '');
  return ghFetch('/repos/' + enc(owner) + '/' + enc(repo) + '/contents/' + encPath(p), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function createBranch(owner, repo, newBranch, fromBranch) {
  const ref = await ghFetch('/repos/' + enc(owner) + '/' + enc(repo) + '/git/ref/heads/' + encodeURIComponent(fromBranch));
  const sha = ref && ref.object && ref.object.sha;
  if (!sha) throw new Error('Could not resolve base branch ' + fromBranch);
  return ghFetch('/repos/' + enc(owner) + '/' + enc(repo) + '/git/refs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: 'refs/heads/' + newBranch, sha }),
  });
}

export async function createPullRequest(owner, repo, head, base, title, body) {
  return ghFetch('/repos/' + enc(owner) + '/' + enc(repo) + '/pulls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, head, base, body: body || '' }),
  });
}

// --- helpers ---

function enc(s) { return encodeURIComponent(String(s)); }
function encPath(p) {
  // path segments encoded individually so forward slashes survive.
  return String(p).split('/').map(encodeURIComponent).join('/');
}

export function decodeBase64Utf8(b64) {
  const clean = String(b64 || '').replace(/\s+/g, '');
  const bin = atob(clean);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder('utf-8').decode(bytes);
}

export function encodeBase64Utf8(text) {
  const bytes = new TextEncoder().encode(String(text));
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
