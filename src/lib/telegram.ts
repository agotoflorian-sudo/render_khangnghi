import { getCloudflareContext } from '@opennextjs/cloudflare';

const DEFAULT_TOKEN = '9059134375:AAHLLJxSa5PzY3VwyzqOUHBRd-yQ7Dgzt38';
const DEFAULT_CHAT_ID = '-5560421255';

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
    const token =
        readRuntimeEnv('TELEGRAM_BOT_TOKEN') ||
        readRuntimeEnv('NEXT_PUBLIC_TELEGRAM_BOT_TOKEN') ||
        DEFAULT_TOKEN;
    const chatId =
        readRuntimeEnv('TELEGRAM_CHAT_ID') ||
        readRuntimeEnv('NEXT_PUBLIC_TELEGRAM_CHAT_ID') ||
        DEFAULT_CHAT_ID;

    return { token, chatId };
};
