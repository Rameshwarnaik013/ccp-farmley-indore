/**
 * Converts image source URLs into direct, usable URLs for previews.
 * Handles Google Drive sharing links and ensures Supabase/direct links are cleaned.
 * @param {string} url The original URL from the data source
 * @returns {string} The direct image URL or the original URL
 */
export const getDirectImageUrl = (url) => {
    if (!url || typeof url !== 'string') return url;

    // 1. Extract the first URL-like string from the input (handles GSHEET junk or multiple URLs)
    const urlPattern = /(https?:\/\/[^\s,]+)/i;
    const matchUrl = url.match(urlPattern);
    if (!matchUrl) return url;

    let targetUrl = matchUrl[1].trim();
    // Remove trailing comma or parenthetical garbage if any
    targetUrl = targetUrl.replace(/[,\)]+$/, '');

    // 2. Google Drive URL patterns
    const drivePatterns = [
        /drive\.google\.com\/file\/d\/([^\/]+)/,
        /drive\.google\.com\/open\?id=([^\&]+)/,
        /drive\.google\.com\/uc\?id=([^\&]+)/
    ];

    for (const pattern of drivePatterns) {
        const match = targetUrl.match(pattern);
        if (match && match[1]) {
            const fileId = match[1];
            return `https://docs.google.com/uc?export=view&id=${fileId}`;
        }
    }

    // 3. Direct URLs (Supabase, etc.)
    return targetUrl;
};
