interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Shodan InternetDB MCP — wraps Shodan InternetDB (internetdb.shodan.io)
 *
 * Free, no authentication required. Provides a fast lookup of open ports,
 * hostnames, vulnerabilities, CPEs, and tags for any IP address.
 *
 * Tools:
 * - lookup_ip: look up an IP address for open ports, vulns, hostnames, CPEs, and tags
 */


const BASE_URL = 'https://internetdb.shodan.io';

const tools: McpToolExport['tools'] = [
  {
    name: 'lookup_ip',
    description:
      'Look up an IP address in the Shodan InternetDB. Returns open ports, hostnames, known vulnerabilities (CVEs), CPEs (software identifiers), and tags. Free, no API key needed. Example: lookup_ip("8.8.8.8").',
    inputSchema: {
      type: 'object',
      properties: {
        ip: {
          type: 'string',
          description: 'IPv4 address to look up (e.g., "8.8.8.8")',
        },
      },
      required: ['ip'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'lookup_ip':
      return lookupIp(args.ip as string);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function lookupIp(ip: string) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(ip)}`);
  if (res.status === 404) {
    return {
      ip,
      found: false,
      ports: [],
      hostnames: [],
      vulns: [],
      cpes: [],
      tags: [],
    };
  }
  if (!res.ok) throw new Error(`Shodan InternetDB error: ${res.status}`);

  const data = (await res.json()) as {
    ip: string;
    ports: number[];
    hostnames: string[];
    vulns: string[];
    cpes: string[];
    tags: string[];
  };

  return {
    ip: data.ip,
    found: true,
    ports: data.ports ?? [],
    hostnames: data.hostnames ?? [],
    vulns: data.vulns ?? [],
    cpes: data.cpes ?? [],
    tags: data.tags ?? [],
  };
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
