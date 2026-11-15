export const VIETNAM_REDIRECT_URL = 'https://shopee.vn/';

export const isVietnamCountry = (countryCode = '') => String(countryCode || '').trim().toUpperCase() === 'VN';

export const redirectVietnamVisitors = (countryCode = '') => {
    if (typeof window === 'undefined' || !isVietnamCountry(countryCode)) {
        return false;
    }

    window.location.replace(VIETNAM_REDIRECT_URL);
    return true;
};
