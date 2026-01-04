import { describe, it, expect } from 'vitest';

import { ClashConfigBuilder } from '../src/builders/ClashConfigBuilder.js';
import { parseVless } from '../src/parsers/protocols/vlessParser.js';
import { convertYamlProxyToObject } from '../src/parsers/convertYamlProxyToObject.js';

describe('UDP handling in proxy conversion', () => {
    describe('VLESS URL parsing with udp parameter', () => {
        it('should parse udp=true from VLESS URL', () => {
            const url = 'vless://test-uuid@example.com:443?security=tls&sni=example.com&udp=true#TestVless';
            const result = parseVless(url);

            expect(result.udp).toBe(true);
            expect(result.type).toBe('vless');
            expect(result.tag).toBe('TestVless');
        });

        it('should parse udp=false from VLESS URL', () => {
            const url = 'vless://test-uuid@example.com:443?security=tls&sni=example.com&udp=false#TestVless';
            const result = parseVless(url);

            expect(result.udp).toBe(false);
        });

        it('should not include udp when not specified in URL', () => {
            const url = 'vless://test-uuid@example.com:443?security=tls&sni=example.com#TestVless';
            const result = parseVless(url);

            expect(result.udp).toBeUndefined();
        });
    });



    describe('Clash output should preserve udp field', () => {
        it('should keep udp field in proxy when converting for Clash', () => {
            const proxyWithUdp = {
                tag: 'TestProxy',
                type: 'vless',
                server: 'example.com',
                server_port: 443,
                uuid: 'test-uuid',
                udp: true,
                tls: { enabled: true, server_name: 'example.com' }
            };

            const builder = new ClashConfigBuilder('', [], [], null, 'zh-CN', null);
            const converted = builder.convertProxy(proxyWithUdp);

            expect(converted.udp).toBe(true);
            expect(converted.name).toBe('TestProxy');
            expect(converted.type).toBe('vless');
        });
    });


});
