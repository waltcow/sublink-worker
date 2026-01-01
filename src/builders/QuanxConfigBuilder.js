import { BaseConfigBuilder } from './BaseConfigBuilder.js';
import { QUANX_CONFIG, QUANX_RULE_SET_BASE_URL, generateRules } from '../config/index.js';
import { addProxyWithDedup } from './helpers/proxyHelpers.js';
import { groupProxiesByCountry, groupProxiesByKeyword } from '../utils.js';

const QUANX_RULE_TAG_MAP = {
	'category-ads-all': 'Advertising/Advertising.list',
	'category-ai-!cn': [
		'OpenAI/OpenAI.list',	
		'Claude/Claude.list'
	],
	'category-cryptocurrency': [
		'Cryptocurrency/Cryptocurrency.list',
		'Crypto/Crypto.list'
	],
	'category-scholar-!cn': 'Scholar/Scholar.list',
	'geolocation-cn': 'China/China.list',
	'geolocation-!cn': 'Global/Global.list',
	'cn': 'China/China.list',
	'private': 'Lan/Lan.list',
	'youtube': 'YouTube/YouTube.list',
	'google': 'Google/Google.list',
	'bilibili': 'BiliBili/BiliBili.list',
	'github': 'GitHub/GitHub.list',
	'gitlab': 'GitLab/GitLab.list',
	'microsoft': 'Microsoft/Microsoft.list',
	'apple': 'Apple/Apple.list',
	'telegram': 'Telegram/Telegram.list',
	'facebook': 'Facebook/Facebook.list',
	'instagram': 'Instagram/Instagram.list',
	'twitter': 'Twitter/Twitter.list',
	'tiktok': 'TikTok/TikTok.list',
	'linkedin': 'LinkedIn/LinkedIn.list',
	'netflix': 'Netflix/Netflix.list',
	'hulu': 'Hulu/Hulu.list',
	'disney': 'Disney/Disney.list',
	'hbo': 'HBO/HBO.list',
	'amazon': 'Amazon/Amazon.list',
	'bahamut': 'Bahamut/Bahamut.list',
	'spotify': 'Spotify/Spotify.list',
	'steam': 'Steam/Steam.list',
	'epicgames': 'Epic/Epic.list',
	'ea': 'EA/EA.list',
	'ubisoft': 'Ubisoft/Ubisoft.list',
	'blizzard': 'Blizzard/Blizzard.list',
	'paypal': 'PayPal/PayPal.list',
	'stripe': 'Stripe/Stripe.list',
	'digitalocean': 'DigitalOcean/DigitalOcean.list',
	'heroku': 'Heroku/Heroku.list',
	'dropbox': 'Dropbox/Dropbox.list',
	'openai': 'OpenAI/OpenAI.list',
	'gemini': 'Gemini/Gemini.list',
	'crypto': 'Crypto/Crypto.list',
	'cryptocurrency': 'Cryptocurrency/Cryptocurrency.list'
};

const OUTBOUND_POLICY_ALIAS = {
	'Ad Block': 'AdBlock',
	'AI Services': 'AI Suite',
	'Bilibili': 'China Media',
	'Youtube': 'YouTube',
	'Apple': 'Apple',
	'Google': 'Google',
	'Github': 'Github',
	'Microsoft': 'Microsoft',
	'Telegram': 'Telegram',
	'Crypto': 'Crypto',
	'Discord': 'Discord',
	'PayPal': 'PayPal',
	'Speedtest': 'Speedtest',
	'Location:CN': 'Mainland',
	'Non-China': 'Outside',
	'Private': 'direct',
	'Netflix': 'Netflix',
	'Disney': 'Disney+',
	'Hulu': 'Global Media',
	'HBO': 'Max',
	'Amazon': 'Global Media',
	'Bahamut': 'Asian Media',
	'Spotify': 'Spotify',
	'Social Media': 'Social Media'
};

// Import COUNTRIES to maintain consistent ordering
import { COUNTRIES } from '../constants.js';

// 地区分组顺序（用于策略组成员排列）- 从 COUNTRIES 动态生成
const REGION_ORDER = Object.values(COUNTRIES).map(country => country.name);

const DEFAULT_UPDATE_INTERVAL = 43200;

const SECTION_ORDER = [
	'general',
	'dns',
	'policy',
	'server_local',
	'server_remote',
	'filter_remote',
	'filter_local',
	'rewrite_remote',
	'rewrite_local',
	'mitm'
];

function formatFlag(value, fallback = false) {
	if (typeof value === 'boolean') return value ? 'true' : 'false';
	if (value === undefined || value === null) return fallback ? 'true' : 'false';
	return `${value}`;
}

function formatValue(value) {
	if (value === undefined || value === null) return null;
	if (typeof value === 'boolean') return value ? 'true' : 'false';
	return `${value}`;
}

function normalizeList(list = []) {
	return list
		.map(entry => (typeof entry === 'string' ? entry.trim() : ''))
		.filter(entry => entry);
}

function extractTag(line) {
	if (typeof line !== 'string') return '';
	const match = line.match(/(?:^|,)\s*tag=([^,]+)/i);
	return match ? match[1].trim() : '';
}

function extractPolicyName(line) {
	if (typeof line !== 'string') return null;
	const trimmed = line.trim();
	if (!trimmed || trimmed.startsWith('#')) return null;
	const equalIndex = trimmed.indexOf('=');
	if (equalIndex === -1) return null;
	const afterEqual = trimmed.slice(equalIndex + 1).trim();
	if (!afterEqual) return null;
	const name = afterEqual.split(',')[0]?.trim();
	return name || null;
}

function extractImgUrl(line) {
	if (typeof line !== 'string') return null;
	const match = line.match(/img-url=([^,]+)/i);
	return match ? match[1].trim() : null;
}

function ensureRulePath(tag) {
	if (!tag) return null;
	const raw = `${tag}`.trim();
	if (!raw) return null;
	if (raw.includes('/')) {
		return raw.endsWith('.list') ? raw : `${raw}.list`;
	}
	const lower = raw.toLowerCase();
	return QUANX_RULE_TAG_MAP[lower] || null;
}

function updateTag(line, name) {
	if (typeof line !== 'string') return line;
	if (line.includes('tag=')) {
		return line.replace(/tag=([^,]+)(?=,|$)/i, `tag=${name}`);
	}
	return `${line}, tag=${name}`;
}

export class QuanxConfigBuilder extends BaseConfigBuilder {
	constructor(inputString, selectedRules, customRules, baseConfig, lang, keywordGroups = [], defaultExclude = [], includeCountries = [], kv = null, subscriptionCacheTtl = 300, subscriptionTimeout = 10000, subscriptionMaxRetries = 3) {
		const resolvedBaseConfig = baseConfig ?? QUANX_CONFIG;
		super(inputString, resolvedBaseConfig, lang, false, keywordGroups, defaultExclude, includeCountries, kv, subscriptionCacheTtl, subscriptionTimeout, subscriptionMaxRetries);
		this.selectedRules = selectedRules;
		this.customRules = customRules;
		this.keywordGroupNames = [];
	}

	addSelectors() {
		// QuanX output uses the template policy and rule sections directly.
		// Keyword groups will be added in formatConfig after ensurePolicyGroups
	}

	addKeywordGroupsToPolicySection() {
		const proxies = this.getProxies();
		const result = groupProxiesByKeyword(proxies, this.keywordGroups, {
			getName: proxy => this.getProxyName(proxy)
		});
		const keywordGroups = result.groups;
		this.filteredProxyNames = result.filteredProxyNames;

		// 获取现有策略组名称（避免重复）
		const existingPolicyNames = new Set();
		if (Array.isArray(this.config.policy)) {
			this.config.policy.forEach(line => {
				const name = extractPolicyName(line);
				if (name) existingPolicyNames.add(name.trim());
			});
		}

		// 按字母顺序排序分组
		const groups = Object.keys(keywordGroups).sort((a, b) => a.localeCompare(b));
		const keywordGroupNames = [];
		const keywordPolicyLines = [];

		groups.forEach(groupKey => {
			const { emoji, name, type, includeDirect, proxies: groupProxies } = keywordGroups[groupKey];
			if (!groupProxies || groupProxies.length === 0) {
				return;
			}

			const groupName = emoji ? `${emoji} ${name}` : name;

			// 如果策略组已存在，跳过
			if (existingPolicyNames.has(groupName.trim())) {
				return;
			}

			// 构建成员列表
			const members = includeDirect
				? [...groupProxies, 'direct']
				: groupProxies;

			// 根据类型创建策略组
			// type === 'urltest' 使用 available（自动选择最优）
			// type === 'select' 或其他使用 static（手动选择）
			const policyType = type === 'urltest' ? 'available' : 'static';
			let line = `${policyType}=${groupName},${members.join(',')}`;

			// TODO: 添加图标支持（可选）
			// 如果需要图标，可以添加 img-url 参数
			// if (iconUrl) {
			//     line += `,img-url=${iconUrl}`;
			// }

			keywordPolicyLines.push(line);
			keywordGroupNames.push(groupName);
			existingPolicyNames.add(groupName.trim());
		});

		// 将关键词分组添加到 policy 数组的末尾（在地区分组之前）
		if (keywordPolicyLines.length > 0) {
			if (!Array.isArray(this.config.policy)) {
				this.config.policy = [];
			}

			// 在现有策略组和地区分组之间插入关键词分组
			// 找到第一个 available 类型的策略组位置（地区分组）
			let insertIndex = this.config.policy.length;
			for (let i = 0; i < this.config.policy.length; i++) {
				const line = this.config.policy[i];
				if (typeof line === 'string' && line.startsWith('available=')) {
					insertIndex = i;
					break;
				}
			}

			// 在该位置插入关键词分组
			this.config.policy.splice(insertIndex, 0, ...keywordPolicyLines);
		}

		this.keywordGroupNames = keywordGroupNames;
	}

	getProxies() {
		return this.config.server_local || [];
	}

	getProxyName(proxy) {
		return extractTag(proxy);
	}

	convertProxy(proxy) {
		const tag = proxy.tag || proxy.name || 'Proxy';
		const fastOpen = formatFlag(proxy.tcp_fast_open ?? proxy.fast_open ?? false);
		const udpRelay = formatFlag(proxy.udp_relay ?? true);

		switch (proxy.type) {
			case 'shadowsocks': {
				let line = `shadowsocks=${proxy.server}:${proxy.server_port}, method=${proxy.method}, password=${proxy.password}`;
				line += `, fast-open=${fastOpen}, udp-relay=${udpRelay}, tag=${tag}`;
				return line;
			}
			case 'vmess': {
				if (proxy.transport?.type && proxy.transport.type !== 'ws') {
					return `# ${tag} - Unsupported VMess transport: ${proxy.transport.type}`;
				}
				let line = `vmess=${proxy.server}:${proxy.server_port}, method=${proxy.security || 'auto'}, password=${proxy.uuid}`;
				if (proxy.transport?.type === 'ws') {
					line += ', obfs=ws';
					if (proxy.transport.path) {
						line += `, obfs-path=${proxy.transport.path}`;
					}
					if (proxy.transport.headers?.host) {
						line += `, obfs-header=Host:${proxy.transport.headers.host}`;
					}
				}
				if (proxy.tls?.enabled) {
					line += ', tls=true';
					if (proxy.tls.server_name) {
						line += `, tls-host=${proxy.tls.server_name}`;
					}
				}
				line += `, fast-open=${fastOpen}, udp-relay=${udpRelay}, tag=${tag}`;
				return line;
			}
			case 'trojan': {
				if (proxy.transport?.type) {
					return `# ${tag} - Unsupported Trojan transport: ${proxy.transport.type}`;
				}
				let line = `trojan=${proxy.server}:${proxy.server_port}, password=${proxy.password}`;
				if (proxy.tls?.server_name) {
					line += `, sni=${proxy.tls.server_name}`;
				}
				line += `, fast-open=${fastOpen}, udp-relay=${udpRelay}, tag=${tag}`;
				return line;
			}
			default:
				return `# ${tag} - Unsupported proxy type: ${proxy.type}`;
		}
	}

	addProxyToConfig(proxy) {
		this.config.server_local = this.config.server_local || [];
		addProxyWithDedup(this.config.server_local, proxy, {
			getName: (item) => extractTag(item),
			setName: (value, name) => updateTag(value, name),
			isSame: (existing, incoming) => existing === incoming
		});
	}

	resolvePolicyName(outbound) {
		const resolved = OUTBOUND_POLICY_ALIAS[outbound] || outbound;
		return resolved && `${resolved}`.trim() ? resolved : 'Others';
	}

	resolvePolicyMembers(outbound, policyName, availableGroupNames = []) {
		// 按指定顺序排列地区分组
		const orderedRegions = REGION_ORDER.filter(region => availableGroupNames.includes(region));

		if (policyName === 'direct') return ['direct'];
		if (outbound === 'Private') return ['direct'];

		// AdBlock: reject, direct
		if (outbound === 'Ad Block' || policyName === 'AdBlock') {
			return ['reject', 'direct'];
		}

		// Outside: 地区分组, proxy, direct
		if (policyName === 'Outside') {
			return [...orderedRegions, 'proxy', 'direct'];
		}

		// Mainland: direct, Outside
		if (outbound === 'Location:CN' || policyName === 'Mainland') {
			return ['direct', 'Outside'];
		}

		// Apple: direct, Outside, Hong Kong, Japan, United States
		if (policyName === 'Apple') {
			const appleRegions = ['Hong Kong', 'Japan', 'United States'].filter(r => orderedRegions.includes(r));
			return ['direct', 'Outside', ...appleRegions];
		}

		// AI Suite: Outside, 地区特定顺序
		if (policyName === 'AI Suite') {
			const aiRegions = ['United States', 'Taiwan', 'Japan'].filter(r => orderedRegions.includes(r));
			return ['Outside', ...aiRegions];
		}

		// China Media: Mainland, Outside, direct
		if (policyName === 'China Media') {
			return ['Mainland', 'Outside', 'direct'];
		}

		// Asian Media: Outside, 地区..., direct
		if (policyName === 'Asian Media') {
			return ['Outside', ...orderedRegions, 'direct'];
		}

		// Global Media: Outside, 地区..., direct
		if (policyName === 'Global Media') {
			return ['Outside', ...orderedRegions, 'direct'];
		}

		// 流媒体服务: Global Media, 地区特定
		if (policyName === 'Netflix' || policyName === 'Disney+' || policyName === 'YouTube') {
			const mediaRegions = ['Singapore', 'Hong Kong', 'Taiwan', 'United States'].filter(r => orderedRegions.includes(r));
			return ['Global Media', ...mediaRegions];
		}

		// Max: Global Media, 地区特定
		if (policyName === 'Max') {
			const maxRegions = ['Singapore', 'Hong Kong', 'Taiwan'].filter(r => orderedRegions.includes(r));
			return ['Global Media', ...maxRegions];
		}

		// Spotify: Global Media, 地区特定
		if (policyName === 'Spotify') {
			const spotifyRegions = ['Singapore', 'Hong Kong', 'Taiwan', 'United States'].filter(r => orderedRegions.includes(r));
			return ['Global Media', ...spotifyRegions];
		}

		// Crypto 服务: Outside, direct
		if (policyName === 'Crypto') {
			const cryptoRegions = ['Singapore', 'Taiwan'].filter(r => orderedRegions.includes(r));
			return ['Outside', ...cryptoRegions, 'direct'];
		}

		// Telegram, Crypto, Discord, PayPal: Outside, direct
		if (['Telegram', 'Discord', 'PayPal'].includes(policyName)) {
			return ['Outside', 'direct'];
		}

		// Social Media: Outside, 地区..., direct
		if (policyName === 'Social Media') {
			return ['Outside', ...orderedRegions, 'direct'];
		}

		// Google: Outside, 地区...
		if (policyName === 'Google') {
			return ['Outside', ...orderedRegions, 'direct'];
		}

		// Github: Outside, 地区...
		if (policyName === 'Github') {
			return ['Outside', ...orderedRegions, 'direct'];
		}

		// Microsoft: direct, Outside
		if (policyName === 'Microsoft') {
			return ['direct', 'Outside'];
		}

		// Speedtest: direct, 地区...
		if (policyName === 'Speedtest') {
			return ['direct', ...orderedRegions];
		}

		// Others: Outside, direct
		if (policyName === 'Others') {
			return ['Outside', 'direct'];
		}

		// 默认: Outside, direct
		return ['Outside', 'direct'];
	}

	ensurePolicyGroups(rules) {
		const basePolicy = Array.isArray(this.config.policy) ? this.config.policy : [];
		const iconMap = new Map();
		basePolicy.forEach(line => {
			const name = extractPolicyName(line);
			const imgUrl = extractImgUrl(line);
			if (name && imgUrl) {
				iconMap.set(name, imgUrl);
			}
		});

		const requiredPolicies = new Set();
		rules.forEach(rule => {
			const policyName = this.resolvePolicyName(rule.outbound);
			if (policyName && policyName !== 'direct') {
				requiredPolicies.add(policyName);
			}
		});

		// 添加基础策略组（确保这些总是存在）
		['Outside', 'Mainland', 'Others', 'Global Media', 'Asian Media'].forEach(p => requiredPolicies.add(p));

		const { availableGroups, regionIconMap } = this.buildAvailableGroups(iconMap);
		const availableNames = availableGroups.map(item => item.name);

		const policyLines = [];

		// 添加策略分组 (static 类型) - 注释说明放在第一行
		policyLines.push('# China Media 为中国媒体，Global Media 为国际媒体，Outside 为境外链接，Mainland 为大陆链接，Others 为最终规则');

		// 按固定顺序添加策略组
		const policyOrder = [
			'AdBlock', 'Outside', 'Mainland', 'Apple', 'Google', 'Github', 'AI Suite',
			'China Media', 'Asian Media', 'Global Media',
			'Netflix', 'Disney+', 'YouTube', 'Max', 'Spotify',
			'Social Media', 'Telegram', 'Crypto', 'Discord', 'Microsoft', 'PayPal', 'Speedtest',
			'Others'
		];

		policyOrder.forEach(policyName => {
			if (!requiredPolicies.has(policyName)) return;

			const outbound = Object.entries(OUTBOUND_POLICY_ALIAS).find(([, alias]) => alias === policyName)?.[0];
			const members = this.resolvePolicyMembers(outbound, policyName, availableNames);
			let line = `static=${policyName},${members.join(',')}`;
			const icon = iconMap.get(policyName);
			if (icon) {
				line += `,img-url=${icon}`;
			}
			policyLines.push(line);
		});

		// 添加地区分组 (available 类型)
		availableGroups.forEach(item => {
			if (!item.members || item.members.length === 0) return;
			let line = `available=${item.name},${item.members.join(',')}`;
			const icon = regionIconMap.get(item.name);
			if (icon) {
				line += `,img-url=${icon}`;
			}
			policyLines.push(line);
		});

		this.config.policy = policyLines;
	}

	buildAvailableGroups(iconMap) {
		const proxies = this.getProxies();
		const grouped = groupProxiesByCountry(proxies, {
			getName: proxy => extractTag(proxy)
		});

		// 地区图标映射
		const regionIconMap = new Map([
			['Hong Kong', 'https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png'],
			['Singapore', 'https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png'],
			['Taiwan', 'https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png'],
			['United States', 'https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png'],
			['Japan', 'https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png'],
			['Korea', 'https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Korea.png'],
			['Other', 'https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Available.png']
		]);

		// 构建地区分组（按 REGION_ORDER 排序）
		const groupedByOrder = new Map();
		Object.values(grouped).forEach((countryInfo) => {
			const members = Array.from(new Set(countryInfo.proxies || []));
			if (members.length > 0) {
				groupedByOrder.set(countryInfo.name, {
					name: countryInfo.name,
					members
				});
			}
		});

		// 按照 REGION_ORDER 排序
		const availableGroups = [];
		REGION_ORDER.forEach(regionName => {
			if (groupedByOrder.has(regionName)) {
				availableGroups.push(groupedByOrder.get(regionName));
			}
		});

		// 添加其他地区（不在 REGION_ORDER 中的）
		groupedByOrder.forEach((group, name) => {
			if (!REGION_ORDER.includes(name)) {
				availableGroups.push(group);
			}
		});

		return { availableGroups, regionIconMap };
	}

	buildFilterRemote(rules) {
		const entries = [];
		const seen = new Set();
		const addEntry = (url, policyName, tag) => {
			const key = `${url}|${policyName}`;
			if (seen.has(key)) return;
			seen.add(key);
			entries.push(`${url}, tag=${tag}, force-policy=${policyName}, update-interval=${DEFAULT_UPDATE_INTERVAL}, enabled=true`);
		};

		rules.forEach(rule => {
			const policyName = this.resolvePolicyName(rule.outbound);
			normalizeList(rule.site_rules).forEach(site => {
				const rulePath = ensureRulePath(site);
				const paths = Array.isArray(rulePath) ? rulePath : (rulePath ? [rulePath] : []);
				paths.forEach((path) => {
					const url = `${QUANX_RULE_SET_BASE_URL}${path}`;
					addEntry(url, policyName, `site-${site}-${path.split('/')[0]}`);
				});
			});
			normalizeList(rule.ip_rules).forEach(ip => {
				const rulePath = ensureRulePath(ip);
				const paths = Array.isArray(rulePath) ? rulePath : (rulePath ? [rulePath] : []);
				paths.forEach((path) => {
					const url = `${QUANX_RULE_SET_BASE_URL}${path}`;
					addEntry(url, policyName, `ip-${ip}-${path.split('/')[0]}`);
				});
			});
		});

		return entries;
	}

	buildFilterLocal(rules) {
		const entries = [];
		const seen = new Set();
		const addEntry = (line) => {
			if (!line || seen.has(line)) return;
			seen.add(line);
			entries.push(line);
		};

		rules.forEach(rule => {
			const policyName = this.resolvePolicyName(rule.outbound);
			normalizeList(rule.domain_suffix).forEach(suffix => {
				addEntry(`host-suffix,${suffix},${policyName}`);
			});
			normalizeList(rule.domain_keyword).forEach(keyword => {
				addEntry(`host-keyword,${keyword},${policyName}`);
			});
			normalizeList(rule.ip_cidr).forEach(cidr => {
				addEntry(`ip-cidr,${cidr},${policyName}`);
			});
		});

		addEntry('final,Others');
		return entries;
	}

	formatConfig() {
		const rules = generateRules(this.selectedRules, this.customRules);
		this.ensurePolicyGroups(rules);

		// 在 ensurePolicyGroups 之后添加关键词分组
		// 这样可以确保关键词分组不会被覆盖
		if (this.keywordGroups && this.keywordGroups.length > 0) {
			this.addKeywordGroupsToPolicySection();
		}

		this.config.filter_remote = this.buildFilterRemote(rules);
		this.config.filter_local = this.buildFilterLocal(rules);

		const lines = [];
		SECTION_ORDER.forEach((sectionName) => {
			const section = this.config?.[sectionName];
			if (section === undefined || section === null) {
				return;
			}
			lines.push(`[${sectionName}]`);
			if (Array.isArray(section)) {
				section.forEach((line) => {
					if (line !== undefined && line !== null && `${line}`.trim() !== '') {
						lines.push(`${line}`);
					}
				});
			} else if (typeof section === 'object') {
				Object.entries(section).forEach(([key, value]) => {
					const formatted = formatValue(value);
					if (formatted !== null) {
						lines.push(`${key} = ${formatted}`);
					}
				});
			} else {
				lines.push(`${section}`);
			}
			lines.push('');
		});

		return lines.join('\n').trim();
	}
}
