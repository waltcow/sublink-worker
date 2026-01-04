const normalize = (value) => (typeof value === "string" ? value.trim() : value);

export function uniqueNames(names = []) {
  const seen = new Set();
  const result = [];
  names.forEach((name) => {
    if (typeof name !== "string") return;
    const normalized = normalize(name);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    result.push(normalized);
  });
  return result;
}

export function withDirectReject(options = []) {
  return uniqueNames([...options, "DIRECT", "REJECT"]);
}

export function moveItemToFront(options = [], item) {
  if (!Array.isArray(options)) {
    return [];
  }
  const targetIndex = options.indexOf(item);
  if (targetIndex <= 0) {
    return options;
  }
  return [item, ...options.filter((option) => option !== item)];
}

export function moveDirectToFront(options = []) {
  return moveItemToFront(options, "DIRECT");
}

export function moveRejectToFront(options = []) {
  return moveItemToFront(options, "REJECT");
}

export function buildNodeSelectMembers({
  proxyList = [],
  translator,
  groupByCountry = false,
  manualGroupNames,
  countryGroupNames = [],
}) {
  if (!translator) {
    throw new Error("buildNodeSelectMembers requires a translator function");
  }
  const manualNames = Array.isArray(manualGroupNames) ? manualGroupNames : [];
  const autoName = translator("outboundNames.Auto Select");
  const base = groupByCountry
    ? [autoName, ...manualNames, ...countryGroupNames]
    : [autoName, ...proxyList];
  return withDirectReject(base);
}

export function buildSelectorMembers({
  proxyList = [],
  translator,
  groupByCountry = false,
  manualGroupNames,
  countryGroupNames = [],
  keywordGroupNames = [],
  filteredProxyNames = new Set(),
}) {
  if (!translator) {
    throw new Error("buildSelectorMembers requires a translator function");
  }

  // Filter out proxies that have been grouped by keywords
  const unfilteredProxyList = proxyList.filter(
    (proxyName) => !filteredProxyNames.has(proxyName),
  );

  const manualNames = Array.isArray(manualGroupNames) ? manualGroupNames : [];
  const base = groupByCountry
    ? [
        translator("outboundNames.Node Select"),
        translator("outboundNames.Auto Select"),
        ...manualNames,
        ...countryGroupNames,
        ...keywordGroupNames,
      ]
    : [
        translator("outboundNames.Node Select"),
        ...keywordGroupNames,
        ...unfilteredProxyList,
      ];
  return withDirectReject(base);
}

// 专门为关键词规则构建选择器成员
export function buildKeywordRuleMembers({ keywordGroupName, translator }) {
  if (!translator) {
    throw new Error("buildKeywordRuleMembers requires a translator function");
  }
  return withDirectReject([keywordGroupName]);
}
