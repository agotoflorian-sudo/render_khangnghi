import fs from 'fs';
import path from 'path';

const wranglerPath = path.join(process.cwd(), 'wrangler.jsonc');
const projectName = String(
    process.env.WRANGLER_CI_OVERRIDE_NAME || process.env.CLOUDFLARE_WORKER_NAME || ''
).trim();

if (!projectName) {
    if (process.env.WORKERS_CI) {
        console.warn(
            'Cloudflare CI is running but Project name (WRANGLER_CI_OVERRIDE_NAME) is empty. wrangler.jsonc was not synced.'
        );
    }
    process.exit(0);
}

if (!fs.existsSync(wranglerPath)) {
    process.exit(0);
}

const config = JSON.parse(fs.readFileSync(wranglerPath, 'utf8'));
const previousName = config.name;
config.name = projectName;

if (Array.isArray(config.services)) {
    for (const service of config.services) {
        if (service?.binding === 'WORKER_SELF_REFERENCE') {
            service.service = projectName;
        }
    }
}

fs.writeFileSync(wranglerPath, `${JSON.stringify(config, null, '\t')}\n`);
console.log(`Using Cloudflare Project name: ${projectName}${previousName && previousName !== projectName ? ` (was ${previousName})` : ''}`);
