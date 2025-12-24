import Image from 'next/image'
import { ComponentRenderer } from './component-renderer'

export type PageContentRendererProps = {
  content: any[] // Accept any block content array
}

/**
 * Render page content blocks
 */
export function PageContentRenderer({ content }: PageContentRendererProps) {
  if (!content || !Array.isArray(content)) {
    return null
  }

  return (
    <div className="page-content space-y-8">
      {content.map((block, index) => {
        switch (block.blockType) {
          case 'richText':
            return (
              <div
                key={index}
                className="rich-text prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(block.content),
                }}
              />
            )

          case 'image':
            if (typeof block.image === 'object' && block.image?.url) {
              return (
                <figure key={index} className="image-block">
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
                <div key={index} className="gallery grid grid-cols-1 gap-4 md:grid-cols-3">
                  {block.images.map((item, itemIndex) => {
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
              <div key={index} className="video-block">
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
                  key={index}
                  component={block.component}
                  props={block.props || {}}
                />
              )
            }
            return null

          case 'code':
            return (
              <div key={index} className="code-block">
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
              <div key={index} className="card-block rounded-lg border bg-card p-6">
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
            const gridColsClass = gridColsMap[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

            return (
              <div key={index} className={`grid-block grid ${gridColsClass} ${gapClass}`}>
                {block.items.map((item: any, itemIndex: number) => (
                  <div key={itemIndex} className="grid-item">
                    {item.content && Array.isArray(item.content) && (
                      <PageContentRenderer content={item.content} />
                    )}
                  </div>
                ))}
              </div>
            )

          default:
            return (
              <div
                key={index}
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
