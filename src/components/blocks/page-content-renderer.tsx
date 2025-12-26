import Image from 'next/image'
import { ComponentRenderer } from './component-renderer'
import { BlocksTableBlock } from './blocks-table-block'
import { RichTextRenderer } from './rich-text-renderer'
import { DataFetchBlock } from './data-fetch-block'
import { StatCardBlock } from './stat-card-block'
import { BlockRefRenderer } from './block-ref-renderer'
import { FormBlockRenderer } from './form-block-renderer'

export type PageContentRendererProps = {
  content?: any[] // Accept any block content array
  blocks?: any[] // Alternative prop name for compatibility
}

/**
 * Render page content blocks
 */
export function PageContentRenderer({ content, blocks }: PageContentRendererProps) {
  // Support both 'content' and 'blocks' prop names
  const items = content || blocks

  if (!items || !Array.isArray(items)) {
    return null
  }

  return (
    <div className="page-content space-y-8">
      {items.map((block, index) => {
        // Generate unique key: prefer block.id, fallback to blockType-index-hash
        const blockKey = block.id || `${block.blockType}-${index}-${JSON.stringify(block).slice(0, 50).replace(/[^a-zA-Z0-9]/g, '')}`
        
        switch (block.blockType) {
          case 'richText':
            return <RichTextRenderer key={blockKey} content={block.content} />

          case 'image':
            if (typeof block.image === 'object' && block.image?.url) {
              return (
                <figure key={blockKey} className="image-block">
                  <Image
                    src={block.image.url}
                    alt={block.alt || block.caption || ''}
                    width={block.image.width || 800}
                    height={block.image.height || 600}
                    className="rounded-lg"
                  />
                  {block.caption && (
                    <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              )
            }
            return null

          case 'gallery':
            if (block.images && Array.isArray(block.images)) {
              return (
                <div key={blockKey} className="gallery grid grid-cols-1 gap-4 md:grid-cols-3">
                  {block.images.map((item: any, itemIndex: number) => {
                    if (typeof item.image === 'object' && item.image?.url) {
                      return (
                        <figure key={itemIndex} className="gallery-item">
                          <Image
                            src={item.image.url}
                            alt={item.caption || ''}
                            width={item.image.width || 400}
                            height={item.image.height || 300}
                            className="rounded-lg"
                          />
                          {item.caption && (
                            <figcaption className="mt-1 text-center text-xs text-muted-foreground">
                              {item.caption}
                            </figcaption>
                          )}
                        </figure>
                      )
                    }
                    return null
                  })}
                </div>
              )
            }
            return null

          case 'video':
            return (
              <div key={blockKey} className="video-block">
                {block.videoUrl ? (
                  <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <iframe
                      src={block.videoUrl}
                      className="h-full w-full"
                      allowFullScreen
                      title={block.caption || 'Video'}
                    />
                  </div>
                ) : block.video && typeof block.video === 'object' && block.video?.url ? (
                  <video src={block.video.url} controls className="w-full rounded-lg">
                    {block.caption && <track kind="captions" label={block.caption} />}
                  </video>
                ) : null}
                {block.caption && (
                  <p className="mt-2 text-center text-sm text-muted-foreground">{block.caption}</p>
                )}
              </div>
            )

          case 'component':
            if (typeof block.component === 'object' && block.component) {
              return (
                <ComponentRenderer
                  key={blockKey}
                  component={block.component}
                  props={block.props || {}}
                />
              )
            }
            return null

          case 'code':
            return (
              <div key={blockKey} className="code-block">
                <pre className="rounded-lg bg-muted p-4 overflow-x-auto">
                  <code className={`language-${block.language || 'typescript'}`}>
                    {typeof block.code === 'string'
                      ? block.code
                      : JSON.stringify(block.code, null, 2)}
                  </code>
                </pre>
                {block.caption && (
                  <p className="mt-2 text-center text-sm text-muted-foreground">{block.caption}</p>
                )}
              </div>
            )

          case 'card':
            return (
              <div key={blockKey} className="card-block rounded-lg border bg-card p-6">
                {block.image && typeof block.image === 'object' && block.image?.url && (
                  <div className="mb-4">
                    <Image
                      src={block.image.url}
                      alt={block.title || ''}
                      width={block.image.width || 400}
                      height={block.image.height || 300}
                      className="rounded-lg w-full"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{block.title}</h3>
                {block.description && (
                  <p className="text-muted-foreground mb-4">{block.description}</p>
                )}
                {block.link && (
                  <a
                    href={block.link}
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    {block.linkText || 'Learn More'}
                  </a>
                )}
              </div>
            )

          case 'grid':
            if (!block.items || !Array.isArray(block.items) || block.items.length === 0) {
              return null
            }

            const columns = parseInt(String(block.columns || '3'), 10)
            const gapMap: Record<string, string> = {
              none: 'gap-0',
              sm: 'gap-2',
              md: 'gap-4',
              lg: 'gap-6',
            }
            const gapClass = gapMap[block.gap || 'md'] || 'gap-4'

            const gridColsMap: Record<number, string> = {
              1: 'grid-cols-1',
              2: 'grid-cols-1 md:grid-cols-2',
              3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
              4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
              6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
            }
            const gridColsClass =
              gridColsMap[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

            return (
              <div key={blockKey} className={`grid-block grid ${gridColsClass} ${gapClass}`}>
                {block.items.map((item: any, itemIndex: number) => (
                  <div key={itemIndex} className="grid-item">
                    {item.content && Array.isArray(item.content) && (
                      <PageContentRenderer content={item.content} />
                    )}
                  </div>
                ))}
              </div>
            )

          case 'table':
          case 'blocksTable': // Backward compatibility
            return (
              <BlocksTableBlock
                key={blockKey}
                title={block.title}
                description={block.description}
                limit={block.limit || 10}
                columns={block.columns}
                collection={block.collection || 'components'}
                searchFields={
                  block.searchFields
                    ? block.searchFields.map((sf: any) =>
                        typeof sf === 'object' && sf.field ? sf.field : sf,
                      )
                    : undefined
                }
                filterFields={block.filterFields}
                populate={{
                  depth: block.populate?.depth || 0,
                  fields: block.populate?.fields
                    ? block.populate.fields.map((f: any) =>
                        typeof f === 'object' && f.field ? f.field : f,
                      )
                    : undefined,
                }}
                select={block.select}
                defaultSort={block.defaultSort}
                showStatusTabs={block.showStatusTabs ?? true}
                statusTabsField={block.statusTabsField}
                statusTabsConfig={block.statusTabsConfig}
                showActions={block.showActions ?? true}
                defaultActions={block.defaultActions}
                syncUrl={block.syncUrl ?? false}
                urlGroup={block.urlGroup}
                useExternalData={block.useExternalData ?? false}
                dataKey={block.dataKey}
              />
            )

          case 'dataFetch':
            // Support both old single source and new multiple sources
            const hasSources = block.sources && Array.isArray(block.sources) && block.sources.length > 0
            const sources = hasSources
              ? block.sources.map((s: any) => ({
                  type: s.type || 'collection',
                  collection: s.collection,
                  global: s.global,
                  endpoint: s.endpoint,
                  dataKey: s.dataKey,
                  query: s.query
                    ? {
                        where: s.query.where,
                        sort: s.query.sort,
                        limit: s.query.limit,
                        depth: s.query.depth,
                        select: s.query.select,
                      }
                    : undefined,
                }))
              : block.source
                ? [
                    {
                      type: block.source.type || 'collection',
                      collection: block.source.collection,
                      global: block.source.global,
                      endpoint: block.source.endpoint,
                    },
                  ]
                : []

            return (
              <DataFetchBlock
                key={blockKey}
                dataKey={block.dataKey}
                sources={sources}
                mergeStrategy={block.mergeStrategy || 'union'}
                query={{
                  where: block.query?.where,
                  sort: block.query?.sort,
                  limit: block.query?.limit,
                  depth: block.query?.depth,
                }}
                transform={{
                  type: block.transform?.type || 'none',
                  field: block.transform?.field,
                }}
                refreshInterval={block.refreshInterval}
                fetchStats={block.fetchStats}
                statsConfig={block.statsConfig}
                children={block.children}
              />
            )

          case 'statCard':
            return (
              <StatCardBlock
                key={blockKey}
                title={block.title}
                description={block.description}
                icon={block.icon}
                staticValue={block.staticValue}
                format={block.format}
                trend={block.trend}
                variant={block.variant}
                size={block.size}
              />
            )

          case 'blockRef':
            if (typeof block.block === 'object' && block.block?.id) {
              return (
                <BlockRefRenderer
                  key={blockKey}
                  blockId={block.block.id}
                  props={block.props}
                  overrides={block.overrides}
                />
              )
            } else if (typeof block.block === 'string') {
              return (
                <BlockRefRenderer
                  key={blockKey}
                  blockId={block.block}
                  props={block.props}
                  overrides={block.overrides}
                />
              )
            }
            return (
              <div
                key={blockKey}
                className="rounded-md border border-yellow-500/50 bg-yellow-500/10 p-4 text-sm text-yellow-700 dark:text-yellow-400"
              >
                Block reference missing or invalid
              </div>
            )

          case 'spacer':
            const spacerHeightMap: Record<string, string> = {
              sm: 'h-4',
              md: 'h-8',
              lg: 'h-16',
              xl: 'h-24',
            }
            const spacerHeight = spacerHeightMap[block.height || 'md'] || 'h-8'
            return <div key={blockKey} className={`spacer-block ${spacerHeight}`} />

          case 'divider':
            const dividerSpacingMap: Record<string, string> = {
              sm: 'my-2',
              md: 'my-4',
              lg: 'my-8',
            }
            const dividerSpacing = dividerSpacingMap[block.spacing || 'md'] || 'my-4'
            const dividerStyleMap: Record<string, string> = {
              solid: 'border-solid',
              dashed: 'border-dashed',
              dotted: 'border-dotted',
            }
            const dividerStyle = dividerStyleMap[block.style || 'solid'] || 'border-solid'
            return (
              <hr
                key={blockKey}
                className={`divider-block border-t ${dividerStyle} ${dividerSpacing}`}
              />
            )

          case 'heading':
            const level = block.level || 'h2'
            const alignClass =
              block.align === 'center'
                ? 'text-center'
                : block.align === 'right'
                  ? 'text-right'
                  : 'text-left'

            // Render heading based on level
            if (level === 'h1') {
              return (
                <h1 key={blockKey} className={`heading-block ${alignClass}`}>
                  {block.text}
                </h1>
              )
            } else if (level === 'h3') {
              return (
                <h3 key={blockKey} className={`heading-block ${alignClass}`}>
                  {block.text}
                </h3>
              )
            } else if (level === 'h4') {
              return (
                <h4 key={blockKey} className={`heading-block ${alignClass}`}>
                  {block.text}
                </h4>
              )
            } else {
              return (
                <h2 key={blockKey} className={`heading-block ${alignClass}`}>
                  {block.text}
                </h2>
              )
            }

          case 'form':
            return <FormBlockRenderer key={blockKey} {...block} />

          default:
            return (
              <div
                key={blockKey}
                className="rounded-md border border-muted bg-muted/50 p-4 text-sm text-muted-foreground"
              >
                Unknown block type: {block.blockType}
              </div>
            )
        }
      })}
    </div>
  )
}
