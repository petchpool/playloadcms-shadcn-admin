import { getPayload } from 'payload'
import config from '@payload-config'
import { PageContentRenderer } from './page-content-renderer'

/**
 * Section Reference Renderer (Async Server Component)
 * 
 * Fetches section data from PayloadCMS and renders it
 */

export type SectionRefRendererProps = {
  sectionId: string
  props?: Record<string, any>
  overrides?: {
    cssClass?: string
    backgroundColor?: string
    spacing?: string
  }
}

export async function SectionRefRenderer({
  sectionId,
  props = {},
  overrides = {},
}: SectionRefRendererProps) {
  try {
    // Fetch section data
    const payload = await getPayload({ config })
    const section = await payload.findByID({
      collection: 'sections',
      id: sectionId,
      depth: 0,
    })

    if (!section || !section.blocks) {
      return (
        <div className="rounded-md border border-yellow-500/50 bg-yellow-500/10 p-4 text-sm text-yellow-700 dark:text-yellow-400">
          Section not found: {sectionId}
        </div>
      )
    }

    // Apply overrides to wrapper
    const backgroundColorMap: Record<string, string> = {
      default: '',
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      muted: 'bg-muted',
    }
    const bgClass = backgroundColorMap[overrides.backgroundColor || 'default'] || ''

    const spacingMap: Record<string, string> = {
      none: 'py-0',
      sm: 'py-2',
      md: 'py-4',
      lg: 'py-8',
    }
    const spacingClass = spacingMap[overrides.spacing || 'md'] || 'py-4'

    const wrapperClass = [
      'section-ref',
      bgClass,
      spacingClass,
      overrides.cssClass,
    ]
      .filter(Boolean)
      .join(' ')

    // Process blocks with props injection
    const processedBlocks = section.blocks.map((block: any) => {
      return processBlockWithProps(block, props)
    })

    return (
      <div className={wrapperClass} data-section-id={sectionId} data-section-slug={section.slug}>
        <PageContentRenderer content={processedBlocks} />
      </div>
    )
  } catch (error) {
    console.error('Error rendering section:', error)
    return (
      <div className="rounded-md border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400">
        Error loading section: {sectionId}
      </div>
    )
  }
}

/**
 * Process a block to inject props
 * Supports simple template syntax: ${propName} or {{propName}}
 */
function processBlockWithProps(block: any, props: Record<string, any>): any {
  if (!block || !props || Object.keys(props).length === 0) return block

  // Clone block to avoid mutation
  const processed = JSON.parse(JSON.stringify(block))

  // Recursively process all string values
  function processValue(value: any): any {
    if (typeof value === 'string') {
      return interpolateProps(value, props)
    }

    if (Array.isArray(value)) {
      return value.map(processValue)
    }

    if (typeof value === 'object' && value !== null) {
      const processedObj: any = {}
      for (const key in value) {
        processedObj[key] = processValue(value[key])
      }
      return processedObj
    }

    return value
  }

  return processValue(processed)
}

/**
 * Interpolate props into a string template
 * Supports: ${propName} or {{propName}}
 */
function interpolateProps(template: string, props: Record<string, any>): string {
  return template.replace(/\$\{(\w+)\}|\{\{(\w+)\}\}/g, (match, p1, p2) => {
    const propName = p1 || p2
    return propName in props ? String(props[propName]) : match
  })
}

