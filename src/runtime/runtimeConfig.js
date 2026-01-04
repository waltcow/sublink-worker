/**
 * @typedef {Object} KeyValueStore
 * @property {(key: string) => Promise<string | null>} get
 * @property {(key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>} put
 * @property {(key: string) => Promise<void>} delete
 */

/**
 * @typedef {(request: Request) => Promise<Response>} AssetFetcher
 */

/**
 * @typedef {Object} RuntimeConfig
 * @property {number} [configTtlSeconds]
 * @property {number} [shortLinkTtlSeconds]
 * @property {string[]} [defaultExclude]
 * @property {number} [subscriptionCacheTtl]
 */

/**
 * @typedef {Object} RuntimeBindings
 * @property {KeyValueStore | null} [kv]
 * @property {AssetFetcher | null} [assetFetcher]
 * @property {Console} [logger]
 * @property {RuntimeConfig} [config]
 */

const DEFAULTS = {
  configTtlSeconds: 60 * 60 * 24 * 30,
  defaultExclude: [],
  subscriptionCacheTtl: 300, // 5 minutes default cache
};

/**
 * Parse default exclude keywords from environment variable
 * Supports comma-separated string or JSON array
 * @param {string | undefined} raw - Raw value from environment
 * @returns {string[]} - Parsed array of keywords
 */
function parseDefaultExclude(raw) {
  if (!raw) return [];
  if (typeof raw !== "string") return [];

  const trimmed = raw.trim();
  if (!trimmed) return [];

  // Try parse as JSON first
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (k) => typeof k === "string" && k.trim().length > 0,
        );
      }
    } catch {
      // Not valid JSON, fall through to comma-separated parsing
    }
  }

  // Parse as comma-separated string
  return trimmed
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);
}

/**
 * Normalize optional runtime bindings and provide safe defaults.
 *
 * @param {RuntimeBindings | undefined} runtime
 * @returns {{ kv: KeyValueStore | null, assetFetcher: AssetFetcher | null, logger: Console, config: RuntimeConfig & { configTtlSeconds: number, shortLinkTtlSeconds: number | null, defaultExclude: string[], subscriptionCacheTtl: number } }}
 */
export function normalizeRuntime(runtime = {}) {
  return {
    kv: runtime.kv ?? null,
    assetFetcher: runtime.assetFetcher ?? null,
    logger: runtime.logger ?? console,
    config: {
      configTtlSeconds:
        runtime.config?.configTtlSeconds ?? DEFAULTS.configTtlSeconds,
      shortLinkTtlSeconds: runtime.config?.shortLinkTtlSeconds ?? null,
      defaultExclude: runtime.config?.defaultExclude ?? DEFAULTS.defaultExclude,
      subscriptionCacheTtl:
        runtime.config?.subscriptionCacheTtl ?? DEFAULTS.subscriptionCacheTtl,
    },
  };
}

export { parseDefaultExclude };
