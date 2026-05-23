// Walk _pages/Ursinus-Exercises/**/*.md, parse front-matter, and cross-reference
// against EXERCISES in solutions.mjs to detect coverage drift.
//
// Returns an array of DiscoveredExercise objects:
//   { path, url, layout, title, status }
// where status is one of:
//   'covered'         — has an entry in EXERCISES (may have skip:)
//   'missing-solution' — discovered on disk but absent from EXERCISES
//
// Works correctly when the submodule is empty (returns []).

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { EXERCISES } from './solutions.mjs';

const EXERCISES_DIR = new URL('../../_pages/Ursinus-Exercises', import.meta.url).pathname;

// Minimal YAML front-matter parser — handles the subset used by exercise files.
function parseFrontMatter(src) {
    const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return {};
    const block = match[1];
    const result = {};
    // Simple key: value (single-line values only — enough for layout, title, permalink)
    for (const line of block.split(/\r?\n/)) {
        const m = line.match(/^(\w[\w-]*):\s*(.*)$/);
        if (m) result[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
    return result;
}

// Derive a site URL from the file path (mirrors Jekyll's _pages permalink logic).
// Jekyll drops the leading _pages/ and replaces .md with .html.
function urlFromPath(filePath) {
    const rel = path.relative(EXERCISES_DIR, filePath);
    return '/' + rel.replace(/\.md$/, '.html');
}

function walkDir(dir, results = []) {
    if (!existsSync(dir)) return results;
    for (const entry of readdirSync(dir)) {
        const full = path.join(dir, entry);
        const stat = statSync(full);
        if (stat.isDirectory()) {
            walkDir(full, results);
        } else if (entry.endsWith('.md')) {
            results.push(full);
        }
    }
    return results;
}

// Build a lookup set from solutions.mjs URLs for O(1) cross-reference.
const coveredUrls = new Set(EXERCISES.map(e => e.url));

export function discoverExercises() {
    const files = walkDir(EXERCISES_DIR);
    const discovered = [];

    for (const filePath of files) {
        let src;
        try { src = readFileSync(filePath, 'utf8'); } catch { continue; }
        const fm = parseFrontMatter(src);

        // Use explicit permalink if present, otherwise derive from path.
        const url = fm.permalink ? fm.permalink : urlFromPath(filePath);
        const layout = fm.layout || '';
        const title = fm.title || path.basename(filePath, '.md');

        const status = coveredUrls.has(url) ? 'covered' : 'missing-solution';
        discovered.push({ path: filePath, url, layout, title, status });
    }

    return discovered;
}

// Return only the exercises that are missing from solutions.mjs.
export function findMissing() {
    return discoverExercises().filter(e => e.status === 'missing-solution');
}

// Return exercises grouped by layout name.
export function byLayout() {
    const map = {};
    for (const ex of discoverExercises()) {
        (map[ex.layout] = map[ex.layout] || []).push(ex);
    }
    return map;
}
