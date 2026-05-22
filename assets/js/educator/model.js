// The canonical in-memory model for an exercise. We keep the parsed
// YAML object as `raw` so any keys the UI doesn't know about flow
// through serialization untouched. Section UIs read/write through
// accessors that mutate `raw` in place.

export const SUPPORTED_LANGUAGES = [
  'java', 'javascript', 'cpp', 'python', 'pyodide',
  'sql', 'scheme', 'prolog', 'graphics_view', 'graphics_shader', 'r'
];

export const LANGUAGE_LABELS = {
  java: 'Java',
  javascript: 'JavaScript',
  cpp: 'C++',
  python: 'Python (Brython)',
  pyodide: 'Python (Pyodide)',
  sql: 'SQL',
  scheme: 'Scheme',
  prolog: 'Prolog',
  graphics_view: 'Graphics (View)',
  graphics_shader: 'Graphics (Shader)',
  r: 'R'
};

// ACE editor mode per exercise language.
export function aceModeFor(language) {
  switch (language) {
    case 'java':            return 'ace/mode/java';
    case 'javascript':      return 'ace/mode/javascript';
    case 'cpp':             return 'ace/mode/c_cpp';
    case 'python':
    case 'pyodide':         return 'ace/mode/python';
    case 'sql':             return 'ace/mode/sql';
    case 'scheme':          return 'ace/mode/scheme';
    case 'prolog':          return 'ace/mode/prolog';
    case 'graphics_shader': return 'ace/mode/glsl';
    case 'graphics_view':   return 'ace/mode/javascript';
    case 'r':               return 'ace/mode/text';
    default:                return 'ace/mode/text';
  }
}

export function defaultExercise() {
  return {
    layout: 'exercise',
    permalink: '/Modules/MyModule/Exercise',
    title: 'My Exercise',
    language: 'java',
    info: {
      points: 1,
      instructions: '',
      goals: []
    },
    canvasasmtid: '',
    canvaspoints: 1,
    processor: {
      correctfeedback: 'Correct!',
      incorrectfeedback: 'Try again',
      submitformlink: false,
      feedbackprocess: '',
      correctcheck: 'true',
      incorrectchecks: []
    },
    files: [],
    openFilesOnLoad: []
  };
}

// Wraps a parsed YAML object with a stable shape, filling in defaults
// for known sections so the UI doesn't have to null-check everywhere.
// We mutate `raw` in place rather than copying so unknown keys persist.
export function adoptRaw(raw) {
  if (!raw || typeof raw !== 'object') raw = {};

  if (!('layout' in raw)) raw.layout = 'exercise';
  if (!raw.info || typeof raw.info !== 'object') raw.info = {};
  if (!Array.isArray(raw.info.goals)) raw.info.goals = [];
  if (!raw.processor || typeof raw.processor !== 'object') raw.processor = {};
  if (!Array.isArray(raw.processor.incorrectchecks)) raw.processor.incorrectchecks = [];
  if (raw.processor.hints && !Array.isArray(raw.processor.hints)) raw.processor.hints = [];
  if (raw.processor.tests && !Array.isArray(raw.processor.tests)) raw.processor.tests = [];
  if (!Array.isArray(raw.files)) raw.files = [];
  if (raw.openFilesOnLoad && !Array.isArray(raw.openFilesOnLoad)) raw.openFilesOnLoad = [];

  return raw;
}

// Small helpers used by the validators and serializer to know which
// fields should always render as block scalars even when they happen to
// be empty/single-line at the moment.
export const CODE_FIELD_PATHS = [
  'processor.feedbackprocess',
  'processor.correctcheck',
  // incorrectchecks[].incorrectcheck and files[].code are handled by
  // path-matching in the serializer; see serializer.js
];

export function makeModel(raw) {
  const adopted = adoptRaw(raw);
  return {
    raw: adopted,
    bodyAfterFrontmatter: '',
    github: { sha: null, owner: null, repo: null, branch: null, path: null },
    dirty: false
  };
}
