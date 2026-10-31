const { spawnSync } = require('node:child_process');
// Kept for existing callers; the main deploy command now builds the complete static site.
const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const result = spawnSync(command, ['run', 'deploy'], { stdio: 'inherit', shell: process.platform === 'win32' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
