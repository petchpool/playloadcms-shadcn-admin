import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'

export type SiteResolverResult = {
  site: any
  layout: any
  layoutType: 'main' | 'simple' | 'blank' | 'auth'
}

/**
 * Resolve site and layout from domain/subdomain
 * 
 * Uses React.cache() to prevent re-fetching on navigation
 * This ensures layout data is cached per request, preventing flicker
 */
export const resolveSiteFromDomain = cache(
  async (domain: string, subdomain?: string): Promise<SiteResolverResult | null> => {
  try {
    const payload = await getPayload({ config })

    // Build search domain
    // If subdomain exists and is not 'localhost', search for subdomain.domain
    // Otherwise search for domain directly
    let searchDomain = domain

    if (subdomain && subdomain !== 'localhost' && subdomain !== 'www') {
      searchDomain = `${subdomain}.${domain}`
    }

    // Try to find site by domain
    const sites = await payload.find({
      collection: 'sites',
      where: {
        domain: {
          equals: searchDomain,
        },
      },
      limit: 1,
      depth: 2,
    })

    if (sites.docs.length === 0) {
      // Fallback to default site (localhost)
      const defaultSite = await payload.find({
        collection: 'sites',
        where: {
          domain: {
            equals: 'localhost',
          },
        },
        limit: 1,
        depth: 2,
      })

      if (defaultSite.docs.length === 0) {
        return null
      }

      const site = defaultSite.docs[0]
      const layout = site.defaultLayout
        ? typeof site.defaultLayout === 'object'
          ? site.defaultLayout
          : await payload.findByID({
              collection: 'layouts',
              id: site.defaultLayout as string,
              depth: 2,
            })
        : null

      return {
        site,
        layout,
        layoutType: getLayoutType(layout),
      }
    }

    const site = sites.docs[0]
    const layout = site.defaultLayout
      ? typeof site.defaultLayout === 'object'
        ? site.defaultLayout
        : await payload.findByID({
            collection: 'layouts',
            id: site.defaultLayout as string,
            depth: 2,
          })
      : null

    return {
      site,
      layout,
      layoutType: getLayoutType(layout),
    }
  } catch (error) {
    console.error('Error resolving site:', error)
    return null
  }
  },
)

/**
 * Get layout type from layout object
 */
function getLayoutType(layout: any): 'main' | 'simple' | 'blank' | 'auth' {
  if (!layout) {
    return 'main' // Default to main layout
  }

  const type = layout.type || layout.slug

  switch (type) {
    case 'main':
      return 'main'
    case 'simple':
      return 'simple'
    case 'blank':
      return 'blank'
    case 'auth':
      return 'auth'
    default:
      return 'main'
  }
}
