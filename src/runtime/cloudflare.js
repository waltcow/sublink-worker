import { CloudflareKVAdapter } from "../adapters/kv/cloudflareKv.js";
import { parseDefaultExclude } from "./runtimeConfig.js";

function parseNumber(value) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function createCloudflareRuntime(env) {
  return {
    kv: env?.SUBLINK_KV ? new CloudflareKVAdapter(env.SUBLINK_KV) : null,
    assetFetcher: env?.ASSETS ? (request) => env.ASSETS.fetch(request) : null,
    logger: console,
    config: {
      defaultExclude: parseDefaultExclude(env?.DEFAULT_EXCLUDE),
      subscriptionCacheTtl:
        parseNumber(env?.SUBSCRIPTION_CACHE_TTL) ?? undefined,
    },
  };
}
