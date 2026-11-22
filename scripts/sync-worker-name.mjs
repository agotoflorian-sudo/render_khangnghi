import fs from 'fs';
import path from 'path';

const wranglerPath = path.join(process.cwd(), 'wrangler.jsonc');
const ciName = String(
    process.env.WRANGLER_CI_OVERRIDE_NAME || process.env.CLOUDFLARE_WORKER_NAME || ''
).trim();

if (!ciName || !fs.existsSync(wranglerPath)) {
    process.exit(0);
}

const config = JSON.parse(fs.readFileSync(wranglerPath, 'utf8'));
const currentName = config.name;
config.name = ciName;

if (Array.isArray(config.services)) {
    for (const service of config.services) {
        if (service?.binding === 'WORKER_SELF_REFERENCE') {
            service.service = ciName;
        }
    }
}

fs.writeFileSync(wranglerPath, `${JSON.stringify(config, null, '\t')}\n`);
if (currentName !== ciName) {
    console.log(`Synced wrangler Worker name: ${currentName} -> ${ciName}`);
}
