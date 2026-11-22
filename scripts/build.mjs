import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const isCloudflareWorkersCI =
    process.env.WORKERS_CI === '1' ||
    process.env.WORKERS_CI === 'true' ||
    Boolean(process.env.WORKERS_CI_BUILD_UUID);

// Cloudflare git builds run `pnpm run build` then `wrangler deploy`.
// Wrangler expects the OpenNext bundle in `.open-next/`.
if (isCloudflareWorkersCI && process.env.OPENNEXT_BUILD !== '1') {
    execSync('opennextjs-cloudflare build', {
        stdio: 'inherit',
        env: { ...process.env, OPENNEXT_BUILD: '1' }
    });
    process.exit(0);
}

// OpenNext/Cloudflare Workers cannot run Next 16 Turbopack output.
execSync('next build --webpack', { stdio: 'inherit' });

const authenticationSrc = path.join('public', 'static', 'media', 'authentication.png');
if (fs.existsSync(authenticationSrc)) {
    for (const destDir of [
        path.join('.next', 'static', 'media'),
        path.join('.next', 'dev', 'static', 'media')
    ]) {
        fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(authenticationSrc, path.join(destDir, 'authentication.png'));
    }
}

// Chỉ đóng gói Cloudflare khi bật tường minh — tránh Render/Netlify (CI=true) chạy nhầm.
const packageForCloudflare =
    process.env.PACKAGE_FOR_CLOUDFLARE === '1' && process.env.OPENNEXT_BUILD !== '1';

if (packageForCloudflare) {
    execSync('opennextjs-cloudflare build', {
        stdio: 'inherit',
        env: { ...process.env, OPENNEXT_BUILD: '1' },
    });
}
