import { decodeBase64 } from '../../utils.js';
import { parseSubscriptionContent } from './subscriptionContentParser.js';

/**
 * Generate hash for cache key from URL
 * @param {string} url - The URL to hash
 * @returns {Promise<string>} - Hex string hash
 */
async function hashUrl(url) {
    const encoder = new TextEncoder();
    const data = encoder.encode(url);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Fetch with timeout support
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>} - Fetch response
 */
async function fetchWithTimeout(url, options, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
    }
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry wrapper with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise<any>} - Result of function
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            if (attempt < maxRetries) {
                // Exponential backoff: 1s, 2s, 4s
                const delay = baseDelay * Math.pow(2, attempt);
                console.warn(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms. Error: ${error.message}`);
                await sleep(delay);
            }
        }
    }

    throw lastError;
}

/**
 * Decode content, trying Base64 first, then URL decoding if needed
 * @param {string} text - Raw text content
 * @returns {string} - Decoded content
 */
function decodeContent(text) {
    let decodedText;
    try {
        decodedText = decodeBase64(text.trim());
        if (decodedText.includes('%')) {
            decodedText = decodeURIComponent(decodedText);
        }
    } catch (e) {
        decodedText = text;
        if (decodedText.includes('%')) {
            try {
                decodedText = decodeURIComponent(decodedText);
            } catch (urlError) {
                console.warn('Failed to URL decode the text:', urlError);
            }
        }
    }
    return decodedText;
}

/**
 * Detect the format of subscription content
 * @param {string} content - Decoded subscription content
 * @returns {'clash'|'singbox'|'unknown'} - Detected format
 */
function detectFormat(content) {
    const trimmed = content.trim();

    // Try JSON (Sing-Box format)
    if (trimmed.startsWith('{')) {
        try {
            const parsed = JSON.parse(trimmed);
            if (parsed.outbounds || parsed.inbounds || parsed.route) {
                return 'singbox';
            }
        } catch {
            // Not valid JSON
        }
    }

    // Try YAML (Clash format) - check for proxies: key
    if (trimmed.includes('proxies:')) {
        return 'clash';
    }

    return 'unknown';
}

/**
 * Fetch subscription content from a URL and parse it
 * @param {string} url - The subscription URL to fetch
 * @param {string} userAgent - Optional User-Agent header
 * @returns {Promise<object|string[]|null>} - Parsed subscription content
 */
export async function fetchSubscription(url, userAgent) {
    try {
        const headers = new Headers();
        if (userAgent) {
            headers.set('User-Agent', userAgent);
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const decodedText = decodeContent(text);

        return parseSubscriptionContent(decodedText);
    } catch (error) {
        console.error('Error fetching or parsing HTTP(S) content:', error);
        return null;
    }
}

/**
 * Fetch subscription content and detect its format without parsing
 * @param {string} url - The subscription URL to fetch
 * @param {string} userAgent - Optional User-Agent header
 * @param {object} options - Optional parameters
 * @param {object} options.kv - KV store instance for caching
 * @param {number} options.cacheTtl - Cache TTL in seconds (default: 300)
 * @param {number} options.timeout - Request timeout in milliseconds (default: 10000)
 * @param {number} options.maxRetries - Maximum number of retries (default: 3)
 * @param {number} options.retryDelay - Base retry delay in milliseconds (default: 1000)
 * @returns {Promise<{content: string, format: 'clash'|'singbox'|'unknown', url: string}|null>}
 */
export async function fetchSubscriptionWithFormat(url, userAgent, options = {}) {
    const {
        kv = null,
        cacheTtl = 300,
        timeout = 10000,
        maxRetries = 3,
        retryDelay = 1000
    } = options;

    try {
        // Try to get from cache if KV is available
        if (kv && cacheTtl > 0) {
            try {
                const cacheKey = `sub_cache:${await hashUrl(url)}`;
                const cached = await kv.get(cacheKey);

                if (cached) {
                    const parsedCache = JSON.parse(cached);
                    // console.log(`[Cache HIT] Subscription cache hit for URL: ${url.substring(0, 50)}...`);
                    return parsedCache;
                }
            } catch (cacheError) {
                console.warn('Cache read error:', cacheError);
                // Continue to fetch if cache fails
            }
        }

        // Fetch from remote with retry and timeout
        const fetchFn = async () => {
            const headers = new Headers();
            if (userAgent) {
                headers.set('User-Agent', userAgent);
            }

            const response = await fetchWithTimeout(
                url,
                {
                    method: 'GET',
                    headers: headers
                },
                timeout
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return response;
        };

        // Execute fetch with retry mechanism
        const response = await retryWithBackoff(fetchFn, maxRetries, retryDelay);
        const text = await response.text();
        const content = decodeContent(text);
        const format = detectFormat(content);

        const result = { content, format, url };

        // Store to cache if KV is available
        if (kv && cacheTtl > 0) {
            try {
                const cacheKey = `sub_cache:${await hashUrl(url)}`;
                await kv.put(cacheKey, JSON.stringify(result), { expirationTtl: cacheTtl });
                // console.log(`[Cache SET] Cached subscription for ${cacheTtl}s: ${url.substring(0, 50)}...`);
            } catch (cacheError) {
                console.warn('Cache write error:', cacheError);
                // Don't fail the request if cache write fails
            }
        }

        return result;
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return null;
    }
}
