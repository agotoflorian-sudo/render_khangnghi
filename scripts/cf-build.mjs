import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const preload = path.join(path.dirname(fileURLToPath(import.meta.url)), 'win-symlink-fallback.cjs');
const nodeOptions = [process.env.NODE_OPTIONS, `--require ${JSON.stringify(preload)}`].filter(Boolean).join(' ');

execSync('opennextjs-cloudflare build', {
    stdio: 'inherit',
    env: {
        ...process.env,
        OPENNEXT_BUILD: '1',
        NODE_OPTIONS: nodeOptions
    }
});
