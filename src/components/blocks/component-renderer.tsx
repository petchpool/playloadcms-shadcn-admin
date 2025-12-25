// Component type for rendering components from Components collection
type Component = {
  id?: string | null
  name?: string | null
  slug?: string | null
  description?: string | null
  category?: string | null
  type?: string | null
  status?: 'draft' | 'published' | null
  code?: string | Record<string, any> | null
  props?: Record<string, any> | null
  [key: string]: any
}

export type ComponentRendererProps = {
  component: Component | string
  props?: Record<string, any>
  fallback?: React.ReactNode
}

/**
 * Render a component from Components collection
 * Accepts component data directly (should be fetched server-side)
 */
export function ComponentRenderer({ component, props = {}, fallback }: ComponentRendererProps) {
  // If component is a string (ID), we can't render it here
  // Component should be fetched server-side and passed as object
  if (typeof component === 'string') {
    return (
      fallback || (
        <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          Component ID provided but component data not loaded. Please fetch component server-side.
        </div>
      )
    )
  }

  if (!component) {
    return (
      fallback || (
        <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          Component not found
        </div>
      )
    )
  }

  if (component.status !== 'published') {
    return (
      fallback || (
        <div className="rounded-md border border-warning bg-warning/10 p-4 text-sm text-warning">
          Component is not published
        </div>
      )
    )
  }

  // Merge component props with provided props
  const componentProps =
    typeof component.props === 'object' && component.props !== null ? component.props : {}
  const mergedProps = {
    ...componentProps,
    ...props,
  }

  // For now, render component info
  // In production, you would dynamically import and render the component code
  // or use a component registry to map component slugs to React components
  return (
    <div className="component-wrapper" data-component-slug={component.slug}>
      <div className="rounded-md border bg-muted/50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Component:</span>
          <span className="text-sm font-medium">{component.name}</span>
          {component.category && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {component.category}
            </span>
          )}
          {component.type && (
            <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-secondary-foreground">
              {component.type}
            </span>
          )}
        </div>
        {component.description && (
          <p className="mb-2 text-sm text-muted-foreground">{component.description}</p>
        )}
        {component.code && (
          <div className="mt-2 rounded border bg-background p-2">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">Code:</p>
            <pre className="text-xs overflow-auto max-h-40">
              {typeof component.code === 'string'
                ? component.code
                : JSON.stringify(component.code, null, 2)}
            </pre>
          </div>
        )}
        {Object.keys(mergedProps).length > 0 && (
          <div className="mt-2">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">Props:</p>
            <pre className="rounded border bg-background p-2 text-xs overflow-auto max-h-40">
              {JSON.stringify(mergedProps, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
