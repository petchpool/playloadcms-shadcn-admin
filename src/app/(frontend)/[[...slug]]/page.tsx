import { getPayload } from 'payload'
import config from '@/payload.config'
import { resolveSiteFromDomain } from '@/layouts/utils/site-resolver'
import { parseHost } from '@/layouts/utils/parse-host'
import { headers } from 'next/headers'
import { PageContentRenderer } from '@/components/blocks/page-content-renderer'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  // Skip static files
  const staticFiles = ['favicon.ico', 'robots.txt', 'sitemap.xml', '_next', 'api']
  if (resolvedParams.slug?.[0] && staticFiles.includes(resolvedParams.slug[0])) {
    return null // Let Next.js handle static files
  }

  const headersList = await headers()
  const host = headersList.get('host') || 'localhost'

  // Parse host to get subdomain and domain (supports port numbers)
  const { domain, subdomain } = parseHost(host)

  console.log('domain', domain, 'subdomain', subdomain)

  // Resolve site from domain (not from route parameter)
  const siteData = await resolveSiteFromDomain(domain, subdomain)

  console.log('siteData', siteData)

  if (!siteData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">Site not found</h1>
        <p className="mt-4 text-muted-foreground">
          Domain: {domain} | Subdomain: {subdomain || 'none'}
        </p>
      </div>
    )
  }

  const payload = await getPayload({ config })
  const slug = resolvedParams.slug?.join('/') || ''
  console.log('slug', slug)

  // Detect locale from:
  // 1. URL query parameter (?locale=th)
  // 2. Accept-Language header
  // 3. Default to 'en'
  const supportedLocales = ['en', 'th']
  const queryLocale =
    typeof resolvedSearchParams.locale === 'string' ? resolvedSearchParams.locale : undefined
  const headerLocale = headersList.get('accept-language')?.split(',')[0]?.split('-')[0]
  const detectedLocale =
    (queryLocale && supportedLocales.includes(queryLocale)
      ? queryLocale
      : headerLocale && supportedLocales.includes(headerLocale)
        ? headerLocale
        : 'en') || 'en'

  console.log('Detected locale:', detectedLocale, {
    queryLocale,
    headerLocale,
  })

  // Find page by slug (pages are shared across all sites)
  // Use locale parameter to get localized content
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
    locale: detectedLocale as 'en' | 'th', // Specify locale for localized content
    fallbackLocale: 'en', // Fallback to English if content not found
  })

  console.log('pages', pages)

  if (pages.docs.length === 0) {
    // If no page found, show default content
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
            <li>Locale: {detectedLocale}</li>
          </ul>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Try switching language:</p>
          <div className="flex gap-2">
            <a
              href={`?locale=en`}
              className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              English
            </a>
            <a
              href={`?locale=th`}
              className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              ไทย
            </a>
          </div>
        </div>
      </div>
    )
  }

  const page = pages.docs[0]

  console.log('Page content:', JSON.stringify(page.content, null, 2))
  console.log('Page content length:', page.content?.length || 0)
  console.log(
    'Page content blocks:',
    page.content?.map((b: any) => b.blockType),
  )

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
