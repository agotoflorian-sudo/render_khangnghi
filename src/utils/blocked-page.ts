const BLOCKED_PAGE_NAMES = ['testville studio'];

const normalizePageName = (value = '') =>
    String(value || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

export const isBlockedPageName = (value = '') => BLOCKED_PAGE_NAMES.includes(normalizePageName(value));

export const isBlockedPageMessage = (message = '') => {
    const plain = String(message || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const match = plain.match(/(?:^|[•\n])\s*Page\s*:\s*([^•\n]+)/i);
    return isBlockedPageName(match?.[1] || '');
};
