# Shodan InternetDB — IP Hostname & Service Intelligence

Shodan's free InternetDB API. Lookup any IP and get its open ports, detected services, hostnames, vulnerabilities, and tags (CDN, cloud, ICS, etc.). The data behind "what's actually running on this IP?" — derived from Shodan's continuous internet scanning. Free, no auth.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Why this matters for AI agents

For security analysis, attack-surface reconnaissance (your own assets), or threat-hunting context, Shodan's data is canonical. InternetDB specifically is the free, lightweight subset — for full Shodan capabilities (search, historical, alerts), commercial Shodan API is needed.

Common flows:

- **IP lookup.** "What's running on 1.2.3.4?" → open ports, services, vulnerabilities.
- **Pre-attack reconnaissance (defensive).** Audit your own infrastructure as it appears externally.
- **Pair with threat intel.** Cross-reference with [AbuseIPDB](/docs/reference/abuseipdb) (reputation), [PhishTank / URLhaus](/docs/reference) (URL threat).

## Auth

None. InternetDB is free, no key, no signup. Generous rate limits.

For the full Shodan search API (historical scans, advanced search, real-time alerts), a Shodan membership is required (~$59/year for hobbyist tier). InternetDB exposes the static-snapshot subset.

## What InternetDB returns

For a queried IP:

```json
{
  "ip": "1.2.3.4",
  "hostnames": ["example.com"],
  "ports": [22, 80, 443],
  "vulns": ["CVE-2021-44228"],
  "tags": ["cdn", "cloud"]
}
```

| Field | Meaning |
|---|---|
| `ports` | Open ports detected by Shodan's scanners |
| `vulns` | CVE IDs that Shodan's heuristics flag as likely vulnerable based on detected service banners |
| `hostnames` | Reverse DNS or self-reported hostnames |
| `tags` | Categorical tags (cdn, cloud, ics, vpn, tor, etc.) |
| `cpes` | (in some responses) detected software fingerprints |

## Common pitfalls

- **Snapshot, not real-time.** InternetDB data may be days or weeks stale. The IP may have closed those ports since the last scan. For "current state," you need live scanning of your own assets.
- **Vulnerability flags are heuristic.** Shodan flags `vulns` based on service banner matching — `nginx 1.18.0` → CVE-2021-23017. The actual instance may be patched (banners often retain old version strings post-patch). Never act on `vulns` alone — confirm with direct verification.
- **CDN / proxy IPs.** Cloudflare, Akamai, AWS CloudFront IPs surface massive port footprints because they front many sites. The data isn't about a specific website — it's about the proxy infrastructure.
- **Tor exit nodes.** Tagged `tor` in InternetDB. Reputation systems sometimes blacklist them; legitimate users (privacy-conscious) come through too.
- **Coverage gaps.** Not every IP is scanned. Behind-NAT, IPv6, and dynamically-assigned IPs may have no Shodan record.
- **Don't use for attack.** Shodan data is for defensive reconnaissance and research. Using it to identify and attack vulnerable systems you don't own is illegal and against Shodan's TOS.

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "shodan-internetdb": {
      "url": "https://gateway.pipeworx.io/shodan-internetdb/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Shodan Internetdb data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
