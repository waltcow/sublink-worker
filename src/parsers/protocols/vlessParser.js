import {
  parseServerInfo,
  parseUrlParams,
  createTlsConfig,
  createTransportConfig,
  parseBool,
} from "../../utils.js";

export function parseVless(url) {
  const { addressPart, params, name } = parseUrlParams(url);
  const [uuid, serverInfo] = addressPart.split("@");
  const { host, port } = parseServerInfo(serverInfo);

  const tls = createTlsConfig(params);
  if (tls.reality) {
    tls.utls = {
      enabled: true,
      fingerprint: "chrome",
    };
  }
  const transport =
    params.type !== "tcp" ? createTransportConfig(params) : undefined;

  // Parse UDP setting - primarily used for Clash output
  const udp = params.udp !== undefined ? parseBool(params.udp) : undefined;

  return {
    type: "vless",
    tag: name,
    server: host,
    server_port: port,
    uuid: decodeURIComponent(uuid),
    tcp_fast_open: false,
    tls,
    transport,
    network: "tcp",
    flow: params.flow ?? undefined,
    // Include udp if explicitly specified - will be used for Clash output
    ...(udp !== undefined ? { udp } : {}),
  };
}
