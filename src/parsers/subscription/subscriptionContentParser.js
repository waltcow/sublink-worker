import yaml from "js-yaml";
import { deepCopy } from "../../utils.js";
import { convertYamlProxyToObject } from "../convertYamlProxyToObject.js";
import { convertSurgeProxyToObject } from "../convertSurgeProxyToObject.js";
import { convertSurgeIniToJson } from "../../utils/surgeConfigParser.js";

/**
 * Try to parse content as Clash YAML format
 * @param {string} content - The content to parse
 * @returns {object|null} - Parsed result or null if not Clash format
 */
export function parseClashYaml(content) {
  try {
    const parsed = yaml.load(content);
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.proxies)) {
      const proxies = parsed.proxies
        .map((p) => convertYamlProxyToObject(p))
        .filter((p) => p != null);
      if (proxies.length > 0) {
        const configOverrides = deepCopy(parsed);
        delete configOverrides.proxies;
        return {
          type: "yamlConfig",
          proxies,
          config:
            Object.keys(configOverrides).length > 0 ? configOverrides : null,
        };
      }
    }
  } catch (e) {
    // Not valid YAML or doesn't have proxies array
  }
  return null;
}

/**
 * Try to parse content as Surge INI format
 * @param {string} content - The content to parse
 * @returns {object|null} - Parsed result or null if not Surge format
 */
export function parseSurgeIni(content) {
  // Quick heuristic: Surge configs have [Proxy] or [General] sections
  const hasSurgeSection =
    /\[Proxy\]/i.test(content) ||
    (/\[General\]/i.test(content) && /\[Rule\]/i.test(content));
  if (!hasSurgeSection) {
    return null;
  }

  try {
    const parsed = convertSurgeIniToJson(content);
    if (parsed && Array.isArray(parsed.proxies) && parsed.proxies.length > 0) {
      const proxies = parsed.proxies
        .map((line) => convertSurgeProxyToObject(line))
        .filter((p) => p != null);
      if (proxies.length > 0) {
        const configOverrides = deepCopy(parsed);
        // Remove fields that are handled separately
        delete configOverrides.proxies;

        // Convert Surge proxy-group strings to Clash-compatible objects
        if (
          Array.isArray(parsed["proxy-groups"]) &&
          parsed["proxy-groups"].length > 0
        ) {
          const proxyGroups = parsed["proxy-groups"]
            .map((line) => parseSurgeProxyGroupLine(line))
            .filter((g) => g != null);
          if (proxyGroups.length > 0) {
            configOverrides["proxy-groups"] = proxyGroups;
          } else {
            delete configOverrides["proxy-groups"];
          }
        } else {
          delete configOverrides["proxy-groups"];
        }

        return {
          type: "surgeConfig",
          proxies,
          config:
            Object.keys(configOverrides).length > 0 ? configOverrides : null,
        };
      }
    }
  } catch (e) {
    // Not valid Surge INI
    console.warn("Surge INI parsing failed:", e?.message || e);
  }
  return null;
}

/**
 * Parse Surge proxy-group line into Clash-compatible object
 * Format: "GroupName = type, Node1, Node2, key=value, ..."
 * @param {string} line - Surge proxy-group line
 * @returns {object|null} - Clash proxy-group object
 */
function parseSurgeProxyGroupLine(line) {
  if (!line || typeof line !== "string") {
    return null;
  }

  // Format: "GroupName = select, Node1, Node2, ..." or "GroupName = url-test, Node1, url=..., interval=..."
  const match = line.match(/^(.+?)\s*=\s*(\w+[-\w]*)(?:,\s*(.*))?$/);
  if (!match) {
    return null;
  }

  const [, name, type, rest] = match;
  const parts = (rest || "").split(/,\s*/).filter((p) => p.trim());

  // Separate proxy list from extra parameters
  const proxies = [];
  const extras = {};

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes("=")) {
      const eqIndex = trimmed.indexOf("=");
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      extras[key] = value;
    } else if (trimmed) {
      proxies.push(trimmed);
    }
  }

  const group = {
    name: name.trim(),
    type: type.toLowerCase() === "url-test" ? "url-test" : "select",
    proxies,
  };

  // Add url-test specific fields
  if (extras.url) {
    group.url = extras.url;
  }
  if (extras.interval) {
    group.interval = parseInt(extras.interval) || 300;
  }

  return group;
}

/**
 * Parse subscription content and extract proxies
 * Tries multiple formats in order: Clash YAML -> Surge INI -> Line-by-line
 *
 * @param {string} content - The decoded subscription content
 * @returns {object|string[]} - Parsed config object or array of lines
 */
export function parseSubscriptionContent(content) {
  if (!content || typeof content !== "string") {
    return [];
  }

  const trimmed = content.trim();
  if (!trimmed) {
    return [];
  }

  // Try Clash YAML
  const clashResult = parseClashYaml(trimmed);
  if (clashResult) {
    return clashResult;
  }

  // Try Surge INI
  const surgeResult = parseSurgeIni(trimmed);
  if (surgeResult) {
    return surgeResult;
  }

  // Fallback: split by lines (for URI lists)
  return trimmed.split("\n").filter((line) => line.trim() !== "");
}
