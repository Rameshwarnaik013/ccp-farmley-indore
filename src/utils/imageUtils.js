/**
 * Converts image source URLs into direct, usable URLs for previews.
 * Handles Google Drive sharing links and ensures Supabase/direct links are cleaned.
 * @param {string} url The original URL from the data source
 * @returns {string} The direct image URL or the original URL
 */
export const getDirectImageUrl = (url) => {
    if (!url || typeof url !== 'string') return url;

    // 1. Handle potential comma-separated URLs (take the first one)
    const firstUrl = url.split(',')[0].trim();

    // 2. Google Drive URL patterns
    const drivePatterns = [
        /drive\.google\.com\/file\/d\/([^\/]+)/,
        /drive\.google\.com\/open\?id=([^\&]+)/,
        /drive\.google\.com\/uc\?id=([^\&]+)/
    ];

    for (const pattern of drivePatterns) {
        const match = firstUrl.match(pattern);
        if (match && match[1]) {
            const fileId = match[1];
            return `https://docs.google.com/uc?export=view&id=${fileId}`;
        }
    }

    // 3. Supabase or other direct URLs
    // Supabase URLs like https://zppwyfqtiyztjlmehrad.supabase.co/storage/v1/object/public/...
    // are already direct, but we ensure they are trimmed and parsed.
    return firstUrl;
};
