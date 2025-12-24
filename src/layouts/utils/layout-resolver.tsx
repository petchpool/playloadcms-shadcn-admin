import { getPayload } from 'payload'
import config from '@/payload.config'
import { MainLayout } from '../main/layout'
import { SimpleLayout } from '../simple/layout'
import { BlankLayout } from '../blank/layout'

export type LayoutType = 'main' | 'simple' | 'blank' | 'auth'

export type LayoutResolverProps = {
  layoutType: LayoutType
  children: React.ReactNode
  siteId?: string
  layoutId?: string
}

/**
 * Resolve and render the appropriate layout based on layout type
 */
export async function LayoutResolver({
  layoutType,
  children,
  siteId,
  layoutId,
}: LayoutResolverProps) {
  let layoutData = null
  let navData = []

  // Fetch layout data from Payload if layoutId is provided
  if (layoutId) {
    try {
      const payload = await getPayload({ config })
      const layout = await payload.findByID({
        collection: 'layouts',
        id: layoutId,
        depth: 2,
      })

      if (layout) {
        layoutData = layout
        // Extract navigation data from layout components
        if (layout.components) {
          navData = extractNavData(layout.components)
        }
      }
    } catch (error) {
      console.error('Error fetching layout:', error)
    }
  }

  // Fetch site data if siteId is provided
  if (siteId) {
    try {
      const payload = await getPayload({ config })
      const site = await payload.findByID({
        collection: 'sites',
        id: siteId,
        depth: 1,
      })

      if (site?.defaultLayout && typeof site.defaultLayout === 'object') {
        layoutData = site.defaultLayout
        if (layoutData.components) {
          navData = extractNavData(layoutData.components)
        }
      }
    } catch (error) {
      console.error('Error fetching site:', error)
    }
  }

  // Render appropriate layout based on type
  switch (layoutType) {
    case 'main':
      return (
        <MainLayout
          data={{ nav: navData, sidebarNav: navData }}
          sidebar={{ enabled: true }}
        >
          {children}
        </MainLayout>
      )
    case 'simple':
      return <SimpleLayout>{children}</SimpleLayout>
    case 'blank':
      return <BlankLayout>{children}</BlankLayout>
    default:
      return (
        <MainLayout
          data={{ nav: navData, sidebarNav: navData }}
          sidebar={{ enabled: true }}
        >
          {children}
        </MainLayout>
      )
  }
}

/**
 * Extract navigation data from layout components
 */
function extractNavData(components: any[]): any[] {
  const navData: any[] = []

  // Find navigation component in layout components
  const navComponent = components.find(
    (comp) => comp.blockType === 'navigation' || comp.type === 'navigation',
  )

  if (navComponent?.items) {
    return navComponent.items.map((item: any) => ({
      title: item.label || item.title,
      path: item.path || item.href,
      icon: item.icon,
    }))
  }

  return navData
}

