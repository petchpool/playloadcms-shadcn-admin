import { resolveSiteFromDomain } from '@/layouts/utils/site-resolver'
import { LayoutResolver } from '@/layouts/utils/layout-resolver'
import { parseHost } from '@/layouts/utils/parse-host'
import { headers } from 'next/headers'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
  params?: Promise<{ site?: string; slug?: string[] }>
}) {
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost'

  // Parse host to get subdomain and domain (supports port numbers)
  const { domain, subdomain } = parseHost(host)

  // Resolve site and layout from domain/subdomain
  const siteData = await resolveSiteFromDomain(domain, subdomain)

  if (!siteData) {
    return <div>Site not found</div>
  }

  return (
    <LayoutResolver
      layoutType={siteData.layoutType}
      siteId={siteData.site.id}
      layoutId={
        siteData.layout
          ? typeof siteData.layout === 'object'
            ? siteData.layout.id
            : siteData.layout
          : undefined
      }
    >
      {children}
    </LayoutResolver>
  )
}
