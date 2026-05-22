// Serializes a model back to `---\nYAML\n---\nbody` markdown.
//
// The hard part: code-bearing fields must render as YAML `|` literal
// block scalars so multi-line JS / Java / Python inside them keeps its
// indentation. js-yaml's default String type will pick plain or
// double-quoted style based on heuristics; to force `|` at specific
// paths we wrap their values in a CodeBlock class before dumping and
// register a custom Type that defaults that class to literal style.

// Paths whose String value should always render as a `|` block scalar.
// Array paths use `[]` to mean "any index".
const CODE_PATHS = [
  'processor.feedbackprocess',
  'processor.correctcheck',
  'processor.incorrectchecks[].incorrectcheck',
  'processor.tests[].code',
  'files[].code'
];

class CodeBlock {
  constructor(value) {
    this.value = value == null ? '' : String(value);
  }
}

function buildSchema() {
  if (!window.jsyaml) {
    throw new Error('js-yaml is not loaded');
  }
  // A scalar Type whose predicate matches our CodeBlock wrapper and
  // defaultStyle forces `|` literal style on dump. The String tag is
  // intentionally reused so dump emits a plain scalar (no `!!code` tag).
  const CodeType = new window.jsyaml.Type('tag:yaml.org,2002:str', {
    kind: 'scalar',
    resolve: () => true,
    construct: (data) => data,
    predicate: (data) => data instanceof CodeBlock,
    represent: (data) => data.value,
    defaultStyle: '|',
  });
  return window.jsyaml.DEFAULT_SCHEMA.extend([CodeType]);
}

// Walks `obj` and wraps strings at every matching CODE_PATH in a
// CodeBlock. Mutates a *cloned* copy so the caller's object stays as
// plain strings.
function wrapCodePaths(obj) {
  const clone = deepClone(obj);
  for (const path of CODE_PATHS) {
    applyPath(clone, path.split('.'), (parent, key, val) => {
      if (typeof val === 'string') parent[key] = new CodeBlock(val);
    });
  }
  return clone;
}

function applyPath(node, segs, fn) {
  if (node == null || !segs.length) return;
  const seg = segs[0];
  const rest = segs.slice(1);
  if (seg.endsWith('[]')) {
    const key = seg.slice(0, -2);
    const arr = node[key];
    if (!Array.isArray(arr)) return;
    if (!rest.length) {
      // Wrap each array element directly — used if the array itself
      // holds raw strings. Not currently needed, but cheap to support.
      for (let i = 0; i < arr.length; i++) fn(arr, i, arr[i]);
      return;
    }
    for (const item of arr) applyPath(item, rest, fn);
    return;
  }
  if (!rest.length) {
    if (Object.prototype.hasOwnProperty.call(node, seg)) {
      fn(node, seg, node[seg]);
    }
    return;
  }
  if (node[seg] != null && typeof node[seg] === 'object') {
    applyPath(node[seg], rest, fn);
  }
}

function deepClone(v) {
  if (v == null || typeof v !== 'object') return v;
  if (Array.isArray(v)) return v.map(deepClone);
  const out = {};
  for (const k of Object.keys(v)) out[k] = deepClone(v[k]);
  return out;
}

// Public: serialize a model to a complete markdown document.
export function serializeMarkdown(model) {
  const schema = buildSchema();
  const wrapped = wrapCodePaths(model.raw);

  // Normalize multi-line code values to use \n line endings (not \r\n)
  // so js-yaml emits clean blocks. The CodeBlock wrapper holds the raw
  // string; we re-wrap if we touched any.
  normalizeCodeBlockNewlines(wrapped);

  let yaml;
  try {
    yaml = window.jsyaml.dump(wrapped, {
      schema,
      lineWidth: -1,   // never line-wrap plain scalars
      noRefs: true,
      sortKeys: false,
      quotingType: '"',
      forceQuotes: false,
    });
  } catch (e) {
    const err = new Error('YAML dump error: ' + (e && e.message ? e.message : String(e)));
    err.cause = e;
    throw err;
  }

  // js-yaml emits `feedbackprocess: !!str |` because our CodeBlock
  // resolves via a custom Type even though it shares the String tag.
  // The `!!str` is redundant for any scalar style; strip it.
  yaml = yaml.replace(/^(\s*(?:-\s+)?[A-Za-z_][\w.-]*:)\s*!!str\s+([|>][-+]?\d*)\s*$/gm, '$1 $2');
  yaml = yaml.replace(/^(\s*-)\s*!!str\s+([|>][-+]?\d*)\s*$/gm, '$1 $2');

  const body = model.bodyAfterFrontmatter || '';
  // Front matter delimiters per Jekyll convention.
  return '---\n' + yaml + '---\n' + body;
}

function normalizeCodeBlockNewlines(node) {
  if (node == null) return;
  if (node instanceof CodeBlock) {
    node.value = node.value.replace(/\r\n/g, '\n');
    return;
  }
  if (Array.isArray(node)) { node.forEach(normalizeCodeBlockNewlines); return; }
  if (typeof node === 'object') {
    for (const k of Object.keys(node)) normalizeCodeBlockNewlines(node[k]);
  }
}

// Exposed for tests / debugging.
export const __internal = { wrapCodePaths, CodeBlock, CODE_PATHS };
