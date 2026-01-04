import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import yaml from 'js-yaml';

// Mock the httpSubscriptionFetcher module
vi.mock('../src/parsers/subscription/httpSubscriptionFetcher.js', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        fetchSubscriptionWithFormat: vi.fn()
    };
});

// Import after mocking
import { fetchSubscriptionWithFormat } from '../src/parsers/subscription/httpSubscriptionFetcher.js';
import { ClashConfigBuilder } from '../src/builders/ClashConfigBuilder.js';

// Mock Clash subscription content
const mockClashYaml = `
proxies:
  - name: HK-Node
    type: ss
    server: hk.example.com
    port: 443
    cipher: aes-128-gcm
    password: test123
  - name: JP-Node
    type: ss
    server: jp.example.com
    port: 443
    cipher: aes-128-gcm
    password: test456
`;



describe('Auto Proxy Providers Detection', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Clash Builder', () => {
        it('should use Clash URL as proxy-provider when format is Clash YAML and enableProviders is true', async () => {
            // Mock fetchSubscriptionWithFormat to return Clash format
            fetchSubscriptionWithFormat.mockResolvedValue({
                content: mockClashYaml,
                format: 'clash',
                url: 'https://example.com/clash-sub?token=xxx'
            });

            const builder = new ClashConfigBuilder(
                'https://example.com/clash-sub?token=xxx',
                [], // selectedRules
                [], // customRules
                null, // baseConfig
                'zh-CN', // lang
                false, // groupByCountry
                false, // enableClashUI
                null, // externalController
                null, // externalUiDownloadUrl
                [], // keywordGroups
                true // enableProviders - explicitly enable
            );
            const yamlText = await builder.build();
            const config = yaml.load(yamlText);

            // Should have proxy-providers
            expect(config['proxy-providers']).toBeDefined();
            expect(Object.keys(config['proxy-providers'])).toHaveLength(1);
            expect(config['proxy-providers'].provider1).toBeDefined();
            expect(config['proxy-providers'].provider1.url).toBe('https://example.com/clash-sub?token=xxx');
            expect(config['proxy-providers'].provider1.type).toBe('http');

            // proxy-groups should have 'use' field
            const nodeSelect = config['proxy-groups'].find(g => g.name === '🚀 节点选择');
            expect(nodeSelect.use).toContain('provider1');
        });

        it('should parse Clash URL and list all proxies by default (enableProviders=false)', async () => {
            // Mock fetchSubscriptionWithFormat to return Clash format
            fetchSubscriptionWithFormat.mockResolvedValue({
                content: mockClashYaml,
                format: 'clash',
                url: 'https://example.com/clash-sub'
            });

            const builder = new ClashConfigBuilder(
                'https://example.com/clash-sub',
                [],
                [],
                null,
                'zh-CN'
                // enableProviders defaults to false
            );
            const yamlText = await builder.build();
            const config = yaml.load(yamlText);

            // Should NOT have proxy-providers (default behavior)
            const hasProviders = config['proxy-providers'] && Object.keys(config['proxy-providers']).length > 0;
            expect(hasProviders).toBeFalsy();

            // Should have parsed proxies listed in config
            expect(config.proxies).toBeDefined();
            expect(config.proxies.length).toBeGreaterThan(0);
        });


    });



    describe('Multiple URLs', () => {
        it('should handle multiple Clash URLs as multiple providers', async () => {
            let callCount = 0;
            fetchSubscriptionWithFormat.mockImplementation((url) => {
                callCount++;
                return Promise.resolve({
                    content: mockClashYaml,
                    format: 'clash',
                    url: url
                });
            });

            const builder = new ClashConfigBuilder(
                'https://example.com/sub1\nhttps://example.com/sub2',
                [],
                [],
                null,
                'zh-CN',
                false, // groupByCountry
                false, // enableClashUI
                null,  // externalController
                null,  // externalUiDownloadUrl
                [],    // keywordGroups
                true   // enableProviders - must enable to use providers
            );
            const yamlText = await builder.build();
            const config = yaml.load(yamlText);

            // Should have two proxy-providers
            expect(config['proxy-providers']).toBeDefined();
            expect(Object.keys(config['proxy-providers'])).toHaveLength(2);
            expect(config['proxy-providers'].provider1).toBeDefined();
            expect(config['proxy-providers'].provider2).toBeDefined();
        });
    });
});
