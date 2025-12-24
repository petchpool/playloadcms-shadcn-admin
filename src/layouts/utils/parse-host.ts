/**
 * Parse host string to extract domain and subdomain
 * Supports hosts with or without port numbers
 *
 * Examples:
 * - localhost -> domain: localhost, subdomain: undefined
 * - localhost:3000 -> domain: localhost, subdomain: undefined
 * - admin.localhost -> domain: localhost, subdomain: admin
 * - admin.localhost:3000 -> domain: localhost, subdomain: admin
 * - example.com -> domain: example.com, subdomain: undefined
 * - example.com:8080 -> domain: example.com, subdomain: undefined
 * - admin.example.com -> domain: example.com, subdomain: admin
 * - admin.example.com:8080 -> domain: example.com, subdomain: admin
 */
export function parseHost(host: string): { domain: string; subdomain?: string } {
  // Remove port if present (e.g., localhost:3000 -> localhost)
  const hostWithoutPort = host.split(':')[0]

  const hostParts = hostWithoutPort.split('.')
  let subdomain: string | undefined
  let domain: string

  if (hostParts.length === 1) {
    // localhost or example
    domain = hostParts[0]
    subdomain = undefined
  } else if (hostParts.length === 2 && hostParts[1] === 'localhost') {
    // admin.localhost
    subdomain = hostParts[0]
    domain = hostParts[1]
  } else if (hostParts.length >= 2) {
    // example.com or admin.example.com
    if (hostParts.length === 2) {
      // example.com
      domain = hostParts.join('.')
      subdomain = undefined
    } else {
      // admin.example.com or www.example.com
      subdomain = hostParts[0]
      domain = hostParts.slice(1).join('.')
    }
  } else {
    // Fallback
    domain = 'localhost'
    subdomain = undefined
  }

  return { domain, subdomain }
}
