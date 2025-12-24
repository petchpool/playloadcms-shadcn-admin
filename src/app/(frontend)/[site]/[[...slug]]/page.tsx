import { getPayload } from 'payload'
import config from '@/payload.config'
import { resolveSiteFromDomain } from '@/layouts/utils/site-resolver'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { PageContentRenderer } from '@/components/blocks/page-content-renderer'

export default async function Page({
  params,
}: {
  params: Promise<{ site?: string; slug?: string[] }>
}) {
  const resolvedParams = await params
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost'

  // Parse host to get subdomain and domain
  const hostParts = host.split('.')
  let subdomain: string | undefined
  let domain: string

  if (hostParts.length === 1) {
    domain = hostParts[0]
    subdomain = undefined
  } else if (hostParts.length === 2 && hostParts[1] === 'localhost') {
    subdomain = hostParts[0]
    domain = hostParts[1]
  } else if (hostParts.length >= 2) {
    if (hostParts.length === 2) {
      domain = hostParts.join('.')
      subdomain = undefined
    } else {
      subdomain = hostParts[0]
      domain = hostParts.slice(1).join('.')
    }
  } else {
    domain = 'localhost'
    subdomain = undefined
  }

  // Resolve site
  const siteData = await resolveSiteFromDomain(domain, subdomain)

  if (!siteData) {
    notFound()
  }

  const payload = await getPayload({ config })
  const slug = resolvedParams.slug?.join('/') || ''

  // Find page by slug (pages are shared across all sites)
  const pages = await payload.find({
    collection: 'pages',
    where: {
      and: [
        {
          slug: {
            equals: slug || 'home',
          },
        },
        {
          _status: {
            equals: 'published',
          },
        },
      ],
    },
    limit: 1,
    depth: 3, // Increase depth to load component relationships
  })

  console.log('resolvedParams', resolvedParams, 'pages', pages)

  if (pages.docs.length === 0) {
    // If no page found, show default content instead of 404
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">Welcome to {siteData.site.name}</h1>
        <p className="mt-4 text-muted-foreground">
          No page found for slug:{' '}
          <code className="px-2 py-1 bg-muted rounded">{slug || 'home'}</code>
        </p>
        <div className="mt-6 p-4 bg-muted rounded-md">
          <p className="text-sm font-semibold mb-2">Site Information:</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>Domain: {siteData.site.domain}</li>
            <li>Layout Type: {siteData.layoutType}</li>
            <li>Site ID: {siteData.site.id}</li>
          </ul>
        </div>
      </div>
    )
  }

  const page = pages.docs[0]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">{page.title}</h1>
      <div className="mt-6">
        {page.content && page.content.length > 0 ? (
          <PageContentRenderer content={page.content} />
        ) : (
          <p className="text-muted-foreground">No content available</p>
        )}
      </div>
    </div>
  )
}
