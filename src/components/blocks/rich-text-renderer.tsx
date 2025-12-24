'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Lexical node types
type LexicalNode = {
  type: string
  version?: number
  children?: LexicalNode[]
  text?: string
  format?: number
  style?: string
  direction?: 'ltr' | 'rtl' | null
  indent?: number
  // Text formatting
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  subscript?: boolean
  superscript?: boolean
  // Link
  url?: string
  newTab?: boolean
  rel?: string
  // List
  tag?: string
  listType?: 'bullet' | 'number' | 'check'
  value?: number
  checked?: boolean
  // Heading
  // Image
  src?: string
  altText?: string
  width?: number
  height?: number
  // Quote
  // Code
  language?: string
  // Table
  rows?: LexicalNode[]
  cells?: LexicalNode[]
  headerState?: number
  colSpan?: number
  rowSpan?: number
  backgroundColor?: string
}

type LexicalContent = {
  root: LexicalNode
}

type RichTextRendererProps = {
  content: LexicalContent | any
  className?: string
}

// Text format flags (bitwise)
const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16
const IS_SUBSCRIPT = 32
const IS_SUPERSCRIPT = 64

/**
 * Render Lexical rich text content
 */
export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  if (!content) return null

  // Handle both root-wrapped and direct content
  const rootNode = content.root || content

  if (!rootNode || !rootNode.children) {
    return null
  }

  return (
    <div className={cn('rich-text prose prose-sm max-w-none dark:prose-invert', className)}>
      {rootNode.children.map((node: LexicalNode, index: number) => (
        <RenderNode key={index} node={node} />
      ))}
    </div>
  )
}

/**
 * Render a single Lexical node
 */
function RenderNode({ node }: { node: LexicalNode }): React.ReactNode {
  if (!node) return null

  switch (node.type) {
    case 'paragraph':
      return (
        <p className="mb-4 last:mb-0">
          {node.children?.map((child, index) => (
            <RenderNode key={index} node={child} />
          ))}
        </p>
      )

    case 'heading':
      return <RenderHeading node={node} />

    case 'text':
      return <RenderText node={node} />

    case 'link':
    case 'autolink':
      return <RenderLink node={node} />

    case 'list':
      return <RenderList node={node} />

    case 'listitem':
      return <RenderListItem node={node} />

    case 'quote':
      return (
        <blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic my-4">
          {node.children?.map((child, index) => (
            <RenderNode key={index} node={child} />
          ))}
        </blockquote>
      )

    case 'code':
      return (
        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code className={node.language ? `language-${node.language}` : ''}>
            {node.children?.map((child, index) => (
              <RenderNode key={index} node={child} />
            ))}
          </code>
        </pre>
      )

    case 'code-highlight':
      return <span className="text-primary">{node.text}</span>

    case 'horizontalrule':
      return <hr className="my-6 border-border" />

    case 'image':
    case 'upload':
      return <RenderImage node={node} />

    case 'table':
      return <RenderTable node={node} />

    case 'tablerow':
      return (
        <tr>
          {node.children?.map((child, index) => (
            <RenderNode key={index} node={child} />
          ))}
        </tr>
      )

    case 'tablecell':
      const CellTag = node.headerState ? 'th' : 'td'
      return (
        <CellTag
          colSpan={node.colSpan}
          rowSpan={node.rowSpan}
          style={{ backgroundColor: node.backgroundColor }}
          className="border border-border px-3 py-2"
        >
          {node.children?.map((child, index) => (
            <RenderNode key={index} node={child} />
          ))}
        </CellTag>
      )

    case 'linebreak':
      return <br />

    case 'tab':
      return <span className="inline-block w-8" />

    default:
      // For unknown types, try to render children
      if (node.children && node.children.length > 0) {
        return (
          <>
            {node.children.map((child, index) => (
              <RenderNode key={index} node={child} />
            ))}
          </>
        )
      }
      // If it has text, render it
      if (node.text) {
        return <>{node.text}</>
      }
      return null
  }
}

/**
 * Render heading node
 */
function RenderHeading({ node }: { node: LexicalNode }) {
  const tag = node.tag || 'h2'
  const children = node.children?.map((child, index) => (
    <RenderNode key={index} node={child} />
  ))

  const headingClasses: Record<string, string> = {
    h1: 'text-4xl font-bold mt-8 mb-4',
    h2: 'text-3xl font-bold mt-6 mb-3',
    h3: 'text-2xl font-semibold mt-5 mb-2',
    h4: 'text-xl font-semibold mt-4 mb-2',
    h5: 'text-lg font-medium mt-3 mb-2',
    h6: 'text-base font-medium mt-3 mb-2',
  }

  switch (tag) {
    case 'h1':
      return <h1 className={headingClasses.h1}>{children}</h1>
    case 'h2':
      return <h2 className={headingClasses.h2}>{children}</h2>
    case 'h3':
      return <h3 className={headingClasses.h3}>{children}</h3>
    case 'h4':
      return <h4 className={headingClasses.h4}>{children}</h4>
    case 'h5':
      return <h5 className={headingClasses.h5}>{children}</h5>
    case 'h6':
      return <h6 className={headingClasses.h6}>{children}</h6>
    default:
      return <h2 className={headingClasses.h2}>{children}</h2>
  }
}

/**
 * Render text node with formatting
 */
function RenderText({ node }: { node: LexicalNode }) {
  if (!node.text) return null

  let text: React.ReactNode = node.text
  const format = node.format || 0

  // Apply text formatting based on format flags
  if (format & IS_BOLD) {
    text = <strong>{text}</strong>
  }
  if (format & IS_ITALIC) {
    text = <em>{text}</em>
  }
  if (format & IS_UNDERLINE) {
    text = <u>{text}</u>
  }
  if (format & IS_STRIKETHROUGH) {
    text = <s>{text}</s>
  }
  if (format & IS_CODE) {
    text = (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{text}</code>
    )
  }
  if (format & IS_SUBSCRIPT) {
    text = <sub>{text}</sub>
  }
  if (format & IS_SUPERSCRIPT) {
    text = <sup>{text}</sup>
  }

  return <>{text}</>
}

/**
 * Render link node
 */
function RenderLink({ node }: { node: LexicalNode }) {
  const url = node.url || '#'
  const isExternal = url.startsWith('http') || url.startsWith('//')
  const target = node.newTab ? '_blank' : undefined
  const rel = node.newTab ? 'noopener noreferrer' : node.rel

  const children = node.children?.map((child, index) => (
    <RenderNode key={index} node={child} />
  ))

  if (isExternal) {
    return (
      <a
        href={url}
        target={target}
        rel={rel}
        className="text-primary underline hover:text-primary/80"
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={url} className="text-primary underline hover:text-primary/80">
      {children}
    </Link>
  )
}

/**
 * Render list node
 */
function RenderList({ node }: { node: LexicalNode }) {
  const listType = node.listType || 'bullet'
  const children = node.children?.map((child, index) => (
    <RenderNode key={index} node={child} />
  ))

  if (listType === 'number') {
    return <ol className="list-decimal list-inside my-4 space-y-1">{children}</ol>
  }

  if (listType === 'check') {
    return <ul className="list-none my-4 space-y-1">{children}</ul>
  }

  return <ul className="list-disc list-inside my-4 space-y-1">{children}</ul>
}

/**
 * Render list item node
 */
function RenderListItem({ node }: { node: LexicalNode }) {
  const isChecklist = node.checked !== undefined

  if (isChecklist) {
    return (
      <li className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={node.checked}
          readOnly
          className="mt-1.5 h-4 w-4 rounded border-border"
        />
        <span className={node.checked ? 'line-through text-muted-foreground' : ''}>
          {node.children?.map((child, index) => (
            <RenderNode key={index} node={child} />
          ))}
        </span>
      </li>
    )
  }

  return (
    <li>
      {node.children?.map((child, index) => (
        <RenderNode key={index} node={child} />
      ))}
    </li>
  )
}

/**
 * Render image node
 */
function RenderImage({ node }: { node: LexicalNode }) {
  // Handle upload type (Payload media)
  const src = node.src || (node as any).value?.url
  const alt = node.altText || (node as any).value?.alt || ''
  const width = node.width || (node as any).value?.width || 800
  const height = node.height || (node as any).value?.height || 600

  if (!src) return null

  return (
    <figure className="my-6">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="rounded-lg max-w-full h-auto"
      />
      {alt && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2">
          {alt}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * Render table node
 */
function RenderTable({ node }: { node: LexicalNode }) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse border border-border">
        <tbody>
          {node.children?.map((child, index) => (
            <RenderNode key={index} node={child} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RichTextRenderer

