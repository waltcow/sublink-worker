import { describe, it, expect } from 'vitest';
import yaml from 'js-yaml';
import { ClashConfigBuilder } from '../src/builders/ClashConfigBuilder.js';
import { parseClashYaml } from '../src/parsers/subscription/subscriptionContentParser.js';

describe('Unified Proxy-Groups Override', () => {
    describe('Parser Level - proxy-groups extraction', () => {
        it('parseClashYaml should preserve proxy-groups in config override', () => {
            const clashConfig = `
proxies:
  - name: HK-Node
    type: ss
    server: hk.example.com
    port: 443
    cipher: aes-128-gcm
    password: test
proxy-groups:
  - name: 自定义选择
    type: select
    proxies:
      - DIRECT
      - REJECT
      - HK-Node
  - name: 自动测速
    type: url-test
    proxies:
      - HK-Node
    url: http://www.gstatic.com/generate_204
    interval: 300
`;
            const result = parseClashYaml(clashConfig);

            expect(result).not.toBeNull();
            expect(result.type).toBe('yamlConfig');
            expect(result.proxies).toHaveLength(1);
            expect(result.config).toBeDefined();
            expect(result.config['proxy-groups']).toBeDefined();
            expect(result.config['proxy-groups']).toHaveLength(2);

            const selectGroup = result.config['proxy-groups'].find(g => g.name === '自定义选择');
            expect(selectGroup).toBeDefined();
            expect(selectGroup.type).toBe('select');
            expect(selectGroup.proxies).toContain('HK-Node');
        });
    });

    describe('Builder Level - proxy-groups override applied', () => {
        const clashInput = `
proxies:
  - name: HK-Node
    type: ss
    server: hk.example.com
    port: 443
    cipher: aes-128-gcm
    password: test
proxy-groups:
  - name: 自定义选择
    type: select
    proxies:
      - DIRECT
      - REJECT
      - HK-Node
`;

        it('ClashConfigBuilder should preserve custom proxy-group from Clash input', async () => {
            const builder = new ClashConfigBuilder(clashInput, 'minimal', [], null, 'zh-CN');
            const yamlText = await builder.build();
            const built = yaml.load(yamlText);

            const customGroup = (built['proxy-groups'] || []).find(g => g && g.name === '自定义选择');
            expect(customGroup).toBeDefined();
            expect(customGroup.type).toBe('select');
            expect(customGroup.proxies).toContain('HK-Node');
        });
    });
});
