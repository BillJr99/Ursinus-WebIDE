// Tiny helper for spawning a python http.server in the background.
// We intentionally don't add a node http server dep — python3 ships with
// the sandbox and the tests don't need anything fancier.

import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

export async function startServer({ root, port = 8765 } = {}) {
    if (!root) throw new Error('startServer({root}) is required');
    const proc = spawn('python3', ['-m', 'http.server', String(port)], {
        cwd: root,
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: false,
    });
    let started = false;
    proc.stderr.on('data', d => {
        if (/Serving HTTP/.test(d.toString())) started = true;
    });
    // Wait briefly for the server to come up; probe by trying a fetch
    for (let i = 0; i < 25; i++) {
        await sleep(100);
        try {
            const r = await fetch(`http://localhost:${port}/`, { method: 'HEAD' });
            if (r.status === 200 || r.status === 404) {
                started = true;
                break;
            }
        } catch (_e) { /* keep trying */ }
    }
    if (!started) throw new Error('Static server failed to start on port ' + port);
    return {
        port,
        // Idempotent: resolve exactly once whether the process exits cleanly,
        // is force-killed after the SIGKILL timeout, or fails to receive a
        // signal at all. Clears the SIGKILL timer on a clean exit so we don't
        // try to kill a dead PID.
        stop: () => new Promise(resolve => {
            let done = false;
            const finish = () => { if (done) return; done = true; clearTimeout(killTimer); resolve(); };
            proc.once('close', finish);
            const killTimer = setTimeout(() => {
                try { proc.kill('SIGKILL'); } catch (_e) {}
                finish();
            }, 1500);
            try { proc.kill('SIGTERM'); }
            catch (_e) { finish(); }
        })
    };
}
