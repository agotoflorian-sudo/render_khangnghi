import { execSync } from 'child_process';

execSync('node scripts/sync-worker-name.mjs', { stdio: 'inherit' });
execSync('opennextjs-cloudflare deploy', {
    stdio: 'inherit',
    env: process.env
});
