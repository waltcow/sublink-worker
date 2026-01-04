import yaml from "js-yaml";
import { deepCopy } from "../../utils.js";
import { convertYamlProxyToObject } from "../convertYamlProxyToObject.js";

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
 * Parse subscription content and extract proxies
 * Tries multiple formats in order: Clash YAML -> Line-by-line
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

  // Fallback: split by lines (for URI lists)
  return trimmed.split("\n").filter((line) => line.trim() !== "");
}
