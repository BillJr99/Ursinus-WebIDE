// Aggregates the harness `results` array into:
//   - reports/report.md  — markdown summary
//   - reports/report.html — HTML with embedded screenshots
//   - reports/results.json — raw JSON for CI consumption

import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const REPORTS = new URL('./reports/', import.meta.url).pathname;
const SCREENS_DIR = path.join(REPORTS, 'screens');

const STATUS_ICON = {
    pass:             '✓',
    fail:             '✗',
    skip:             '⊘',
    'missing-solution': '⚠',
};

export function generate(results, meta = {}) {
    mkdirSync(REPORTS, { recursive: true });
    mkdirSync(SCREENS_DIR, { recursive: true });

    const total   = results.length;
    const passed  = results.filter(r => r.status === 'pass').length;
    const failed  = results.filter(r => r.status === 'fail').length;
    const skipped = results.filter(r => r.status === 'skip').length;
    const drift   = results.filter(r => r.status === 'missing-solution').length;
    // "bad" = anything that should block CI (fail + drift)
    const bad     = failed + drift;
    const pct     = total ? Math.round((passed / total) * 100) : 0;
    const totalMs = results.reduce((s, r) => s + (r.durationMs || 0), 0);

    // Group by spec
    const bySpec = {};
    for (const r of results) {
        bySpec[r.spec] = bySpec[r.spec] || [];
        bySpec[r.spec].push(r);
    }

    // ---- Markdown ----
    let md = `# Ursinus-WebIDE test report\n\n`;
    md += `- **Generated:** ${new Date().toISOString()}\n`;
    md += `- **Browser:** ${meta.browser || 'Chromium (headless)'}\n`;
    md += `- **Base URL:** ${meta.baseUrl || ''}\n`;
    md += `- **Result:** ${passed}/${total} passed (${pct}%) — ${failed} failed, ${skipped} skipped, ${drift} missing-solution — total ${(totalMs / 1000).toFixed(1)}s\n\n`;

    const nonPass = results.filter(r => r.status !== 'pass' && r.status !== 'skip');
    if (nonPass.length) {
        md += `## Failures / drift\n\n`;
        for (const f of nonPass) {
            const icon = STATUS_ICON[f.status] || '?';
            md += `- **${icon} [${f.spec}] ${f.name}** — ${f.message}\n`;
            if (f.error) md += `  \`\`\`\n  ${f.error.split('\n').slice(0, 4).join('\n  ')}\n  \`\`\`\n`;
        }
        md += '\n';
    }

    md += `## Per-spec results\n\n`;
    for (const spec of Object.keys(bySpec).sort()) {
        const arr = bySpec[spec];
        const sp = arr.filter(r => r.status === 'pass').length;
        const sf = arr.filter(r => r.status === 'fail').length;
        const ss = arr.filter(r => r.status === 'skip').length;
        const sd = arr.filter(r => r.status === 'missing-solution').length;
        let heading = `${spec} — ${sp}/${arr.length} passed`;
        if (ss) heading += `, ${ss} skipped`;
        if (sd) heading += `, ${sd} ⚠ missing-solution`;
        md += `### ${heading}\n\n`;
        md += `| | Test | Time | Notes |\n|---|---|--:|---|\n`;
        for (const r of arr) {
            const icon = STATUS_ICON[r.status] || '?';
            const note = (r.message || '').replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 120);
            md += `| ${icon} | ${r.name.replace(/\|/g, '\\|')} | ${r.durationMs}ms | ${note} |\n`;
        }
        md += `\n`;
    }

    writeFileSync(path.join(REPORTS, 'report.md'), md);

    // ---- HTML ----
    const escape = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    let html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><title>Ursinus-WebIDE test report</title>
<style>
:root { --pass:#23d18b; --fail:#f48771; --warn:#e5c07b; --skip:#888; --bg:#1e1e1e; --fg:#d4d4d4; --muted:#888; --card:#252526; --border:#3c3c3c; }
* { box-sizing: border-box; }
body { margin:0; padding:24px; background:var(--bg); color:var(--fg); font-family:-apple-system,Segoe UI,sans-serif; line-height:1.5; }
h1 { margin:0 0 4px; }
.summary { display:flex; gap:16px; flex-wrap:wrap; margin:18px 0 28px; }
.stat { background:var(--card); border:1px solid var(--border); padding:12px 18px; border-radius:6px; min-width:120px; }
.stat .num { font-size:28px; font-weight:700; }
.stat.pass .num { color:var(--pass); }
.stat.fail .num { color:var(--fail); }
.stat.warn .num { color:var(--warn); }
.stat.skip .num { color:var(--skip); }
.stat .label { font-size:11px; text-transform:uppercase; color:var(--muted); letter-spacing:1px; }
.spec { background:var(--card); border:1px solid var(--border); border-radius:6px; padding:14px 18px; margin:14px 0; }
.spec h3 { margin:0 0 10px; font-size:15px; display:flex; align-items:center; gap:10px; }
.spec h3 .count { font-size:11px; color:var(--muted); font-weight:400; }
table { width:100%; border-collapse:collapse; font-size:13px; }
td { padding:6px 8px; border-bottom:1px dashed rgba(255,255,255,0.06); vertical-align:top; }
td.icon { width:24px; }
td.icon.pass { color:var(--pass); }
td.icon.fail { color:var(--fail); }
td.icon.skip { color:var(--skip); }
td.icon.warn { color:var(--warn); }
td.time { color:var(--muted); text-align:right; width:60px; font-family:Consolas,monospace; }
td.note { color:var(--muted); font-size:12px; }
.error { background:#2d1f1f; color:#f48771; padding:6px 8px; margin-top:4px; font-family:Consolas,monospace; font-size:11px; white-space:pre-wrap; border-left:3px solid var(--fail); }
.shots { display:flex; flex-wrap:wrap; gap:10px; margin-top:8px; }
.shot { width:200px; background:var(--bg); border:1px solid var(--border); padding:4px; border-radius:3px; }
.shot img { width:100%; height:auto; display:block; cursor:zoom-in; }
.shot .caption { font-size:10px; color:var(--muted); padding:2px 0; word-break:break-all; }
.fail-row { background:#2a1818; }
.drift-row { background:#2a2510; }
a { color:#9cdcfe; }
</style></head><body>
<h1>Ursinus-WebIDE test report</h1>
<p style="color:var(--muted); margin:4px 0 0;">${new Date().toLocaleString()} · ${escape(meta.baseUrl || '')}</p>
<div class="summary">
  <div class="stat"><div class="num">${total}</div><div class="label">Total</div></div>
  <div class="stat pass"><div class="num">${passed}</div><div class="label">Passed</div></div>
  <div class="stat fail"><div class="num">${failed}</div><div class="label">Failed</div></div>
  <div class="stat skip"><div class="num">${skipped}</div><div class="label">Skipped</div></div>
  <div class="stat warn"><div class="num">${drift}</div><div class="label">Missing solution</div></div>
  <div class="stat"><div class="num">${pct}%</div><div class="label">Pass rate</div></div>
  <div class="stat"><div class="num">${(totalMs / 1000).toFixed(1)}s</div><div class="label">Total time</div></div>
</div>`;

    if (nonPass.length) {
        html += `<div class="spec"><h3 style="color:var(--fail)">Failures &amp; drift (${nonPass.length})</h3><table>`;
        for (const f of nonPass) {
            const iconChar = STATUS_ICON[f.status] || '?';
            const cls = f.status === 'missing-solution' ? 'warn' : 'fail';
            html += `<tr><td class="icon ${cls}">${iconChar}</td><td><strong>[${escape(f.spec)}]</strong> ${escape(f.name)}<div class="note">${escape(f.message)}</div>`;
            if (f.error) html += `<div class="error">${escape(f.error.split('\n').slice(0, 6).join('\n'))}</div>`;
            html += `</td></tr>`;
        }
        html += `</table></div>`;
    }

    for (const spec of Object.keys(bySpec).sort()) {
        const arr = bySpec[spec];
        const sp = arr.filter(r => r.status === 'pass').length;
        const sf = arr.filter(r => r.status !== 'pass' && r.status !== 'skip').length;
        const ss = arr.filter(r => r.status === 'skip').length;
        html += `<div class="spec"><h3>${escape(spec)} <span class="count">${sp}/${arr.length} passed${ss ? `, ${ss} skipped` : ''}</span></h3><table>`;
        for (const r of arr) {
            const iconChar = STATUS_ICON[r.status] || '?';
            const iconCls  = r.status === 'pass' ? 'pass' : r.status === 'skip' ? 'skip' : r.status === 'missing-solution' ? 'warn' : 'fail';
            const rowCls   = r.status === 'pass' ? '' : r.status === 'skip' ? '' : r.status === 'missing-solution' ? 'drift-row' : 'fail-row';
            html += `<tr class="${rowCls}"><td class="icon ${iconCls}">${iconChar}</td>`;
            html += `<td>${escape(r.name)}<div class="note">${escape(r.message || '')}</div>`;
            if (r.screenshots && r.screenshots.length) {
                html += `<div class="shots">`;
                for (const s of r.screenshots) {
                    html += `<div class="shot"><a href="screens/${s}" target="_blank"><img src="screens/${s}" alt=""></a><div class="caption">${escape(s)}</div></div>`;
                }
                html += `</div>`;
            }
            html += `</td><td class="time">${r.durationMs}ms</td></tr>`;
        }
        html += `</table></div>`;
    }

    html += `</body></html>`;
    writeFileSync(path.join(REPORTS, 'report.html'), html);

    writeFileSync(path.join(REPORTS, 'results.json'), JSON.stringify({
        generatedAt: new Date().toISOString(),
        meta,
        summary: { total, passed, failed, skipped, drift, pct, durationMs: totalMs },
        results,
    }, null, 2));

    return {
        total, passed,
        failed: bad,   // for backwards-compat: non-zero when CI should fail
        pct,
        reportPath: path.join(REPORTS, 'report.html'),
    };
}
