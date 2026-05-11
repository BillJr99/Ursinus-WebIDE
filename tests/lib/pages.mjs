// Canonical map of language → representative URL on the locally-built site.
// Used by every spec so that adding/removing a language touches one file.
//
// Only includes languages whose exercise pages use _layouts/exercise.html
// (the layout the new features live in). R and Horstmann use separate
// layouts and are intentionally excluded.

export const LANGUAGES = [
    { lang: 'java',           langFamily: 'java',       url: '/Modules/IDE/Exercise.html',                    label: 'Java (IDE)' },
    { lang: 'java',           langFamily: 'java',       url: '/Modules/Arrays/Exercise.html',                 label: 'Java (Arrays)' },
    { lang: 'cpp',            langFamily: 'cpp',        url: '/Modules/Cpp/CppIntro.html',                    label: 'C++' },
    { lang: 'python',         langFamily: 'python',     url: '/Modules/Python/Warmup/Exercise.html',          label: 'Python (Brython)' },
    { lang: 'pyodide',        langFamily: 'python',     url: '/Modules/Pyodide/PlotTenHeads.html',            label: 'Pyodide' },
    { lang: 'javascript',     langFamily: 'javascript', url: '/Modules/Javascript/MinIndex.html',             label: 'JavaScript' },
    { lang: 'sql',            langFamily: 'sql',        url: '/Modules/SQL/Warmup/Exercise.html',             label: 'SQL' },
    { lang: 'scheme',         langFamily: '*',          url: '/Modules/Scheme/Warmup/Exercise.html',          label: 'Scheme' },
    { lang: 'prolog',         langFamily: '*',          url: '/Modules/Prolog/Warmup/Exercise.html',          label: 'Prolog' },
    { lang: 'graphics_view',  langFamily: 'java',       url: '/Modules/Graphics/ViewOrthographic.html',       label: 'Graphics (View)' },
    { lang: 'graphics_shader',langFamily: 'java',       url: '/Modules/Graphics/IlluminationLambertian.html', label: 'Graphics (Shader)' },
];

// Pick one representative per language family for tests that don't need
// every variant (theme cycling etc. are layout-level, language doesn't matter).
export const ONE_PER_LANG = LANGUAGES.filter(
    (l, i, arr) => arr.findIndex(x => x.lang === l.lang) === i
);
