/**
 * Converts image source URLs into direct, usable URLs for previews.
 * Handles Google Drive sharing links and ensures Supabase/direct links are cleaned.
 * @param {string} url The original URL from the data source
 * @returns {string} The direct image URL or the original URL
 */
export const getDirectImageUrl = (url) => {
    if (!url || typeof url !== 'string') return null;

    // 1. Extract the first URL-like string from the input (handles GSHEET junk, HYPERLINK formulas, or multiple URLs)
    // This regex looks for http(s) followed by non-space characters, 
    // but stops before quotes, commas, parentheses, or closing brackets
    const urlPattern = /(https?:\/\/[^"'\s,)\}\]]+)/i;
    const matchUrl = url.match(urlPattern);

    // If no absolute URL is found, return null to signify "no valid image"
    if (!matchUrl) return null;

    let targetUrl = matchUrl[1].trim();

    // 2. Google Drive URL patterns for direct viewing
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

    // 3. Direct URLs (Supabase, S3, etc.) - ensure it starts with http
    return targetUrl.startsWith('http') ? targetUrl : null;
};

/**
 * Scans an object for any property that looks like a web URL (image link).
 * Very helpful when GSheet column names are unpredictable.
 */
export const findAnyImageUrl = (row) => {
    if (!row || typeof row !== 'object') return null;

    // 1. Try common keys first
    const priorityKeys = ['Images', 'Image', 'Proof', 'URL', 'images', 'image', 'proof', 'url'];
    for (const key of priorityKeys) {
        const val = row[key];
        if (val && typeof val === 'string' && val.toLowerCase().includes('http')) {
            const extracted = getDirectImageUrl(val);
            if (extracted) return extracted;
        }
    }

    // 2. Backup: Scan ALL keys for any absolute HTTP URL
    for (const key in row) {
        const val = row[key];
        if (typeof val === 'string' && val.toLowerCase().includes('http')) {
            const extracted = getDirectImageUrl(val);
            if (extracted) return extracted;
        }
    }

    return null;
};
