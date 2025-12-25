import type { Block } from '@/payload-types'
import { PageContentRenderer } from './page-content-renderer'

type BlockRendererProps = {
  block: Block
  props?: Record<string, any>
  slots?: Record<string, any[]>
}

/**
 * Block Renderer
 * 
 * Resolves and renders a Block with:
 * - Props injection (parameterized blocks)
 * - Slot filling (custom content insertion)
 * - Recursive block rendering
 * 
 * This is the core of the Block-based Architecture
 */
export async function BlockRenderer({ block, props = {}, slots = {} }: BlockRendererProps) {
  if (!block || !block.blocks) {
    return null
  }

  // Process blocks: inject props and fill slots
  const processedBlocks = block.blocks.map((childBlock: any) => {
    // If childBlock is a slot, replace with slot content
    if (childBlock.blockType === 'slot') {
      const slotName = childBlock.name
      const slotContent = slots[slotName]

      // Return slot content if provided
      if (slotContent && Array.isArray(slotContent)) {
        return slotContent
      }

      // Return default content if no slot content provided
      if (childBlock.defaultBlocks) {
        return childBlock.defaultBlocks
      }

      // Return null if slot is empty and no default
      return null
    }

    // Process other block types
    // If childBlock has prop placeholders, inject values
    return processBlock(childBlock, props)
  })

  // Flatten processed blocks (slots can return arrays)
  const flattenedBlocks = processedBlocks.flat().filter(Boolean)

  // Render blocks using existing PageContentRenderer
  return (
    <div data-block={block.slug} className="block-content">
      {flattenedBlocks.map((childBlock: any, index: number) => (
        <PageContentRenderer key={`${childBlock.blockType}-${index}`} blocks={[childBlock]} />
      ))}
    </div>
  )
}

/**
 * Process a block to inject props
 * Supports simple template syntax: ${propName}
 */
function processBlock(block: any, props: Record<string, any>): any {
  if (!block) return block

  // Clone block to avoid mutation
  const processed = { ...block }

  // Process each field in the block
  Object.keys(processed).forEach((key) => {
    const value = processed[key]

    // Process string fields for template interpolation
    if (typeof value === 'string') {
      processed[key] = interpolateProps(value, props)
    }

    // Recursively process nested objects
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      processed[key] = processBlock(value, props)
    }

    // Process arrays
    if (Array.isArray(value)) {
      processed[key] = value.map((item) => {
        if (typeof item === 'object' && item !== null) {
          return processBlock(item, props)
        }
        if (typeof item === 'string') {
          return interpolateProps(item, props)
        }
        return item
      })
    }
  })

  return processed
}

/**
 * Interpolate props into a string template
 * Supports: ${propName} or {propName}
 */
function interpolateProps(template: string, props: Record<string, any>): string {
  return template.replace(/\$\{(\w+)\}|\{(\w+)\}/g, (match, p1, p2) => {
    const propName = p1 || p2
    return propName in props ? String(props[propName]) : match
  })
}

/**
 * Block Reference Block Component
 * Used when a page references a block
 */
type BlockRefBlockProps = {
  blockSlug: string
  props?: Record<string, any>
  slots?: Record<string, any[]>
}

export async function BlockRefBlock({ blockSlug, props, slots }: BlockRefBlockProps) {
  // In a real implementation, fetch the block from Payload
  // For now, this is a placeholder that should be called from server component

  return (
    <div data-block-ref={blockSlug} className="block-ref">
      <p className="text-muted-foreground text-sm">
        Block: {blockSlug}
        {props && Object.keys(props).length > 0 && ` (with ${Object.keys(props).length} props)`}
        {slots && Object.keys(slots).length > 0 && ` (with ${Object.keys(slots).length} slots)`}
      </p>
    </div>
  )
}

/**
 * Helper to validate block props against schema
 */
export function validateBlockProps(
  block: Block,
  props: Record<string, any>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!block.propsSchema || block.propsSchema.length === 0) {
    return { valid: true, errors }
  }

  // Check required props
  block.propsSchema.forEach((propDef: any) => {
    if (propDef.required && !(propDef.key in props)) {
      errors.push(`Missing required prop: ${propDef.key}`)
    }

    // Type validation (basic)
    if (propDef.key in props) {
      const value = props[propDef.key]
      const expectedType = propDef.type

      if (expectedType === 'number' && typeof value !== 'number') {
        errors.push(`Prop ${propDef.key} should be a number`)
      }
      if (expectedType === 'boolean' && typeof value !== 'boolean') {
        errors.push(`Prop ${propDef.key} should be a boolean`)
      }
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Helper to get default props from schema
 */
export function getDefaultProps(block: Block): Record<string, any> {
  if (!block.propsSchema || block.propsSchema.length === 0) {
    return {}
  }

  const defaults: Record<string, any> = {}

  block.propsSchema.forEach((propDef: any) => {
    if (propDef.defaultValue !== undefined) {
      defaults[propDef.key] = propDef.defaultValue
    }
  })

  return defaults
}

