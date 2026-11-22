import { getCloudflareContext } from '@opennextjs/cloudflare';

const readValue = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const readProcessEnv = (key: string) => readValue(process.env[key]);

const readCloudflareEnv = (key: string) => {
    try {
        const { env } = getCloudflareContext();
        return readValue((env as Record<string, unknown>)[key]);
    } catch {
        return '';
    }
};

const readRuntimeEnv = (key: string) => readCloudflareEnv(key) || readProcessEnv(key);

export const getTelegramConfig = () => {
    const token = readRuntimeEnv('TELEGRAM_BOT_TOKEN') || readRuntimeEnv('NEXT_PUBLIC_TELEGRAM_BOT_TOKEN');
    const chatId = readRuntimeEnv('TELEGRAM_CHAT_ID') || readRuntimeEnv('NEXT_PUBLIC_TELEGRAM_CHAT_ID');

    if (!token || !chatId) {
        throw new Error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in Cloudflare Variables and Secrets');
    }

    return { token, chatId };
};
