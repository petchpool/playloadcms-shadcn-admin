'use client'

import * as React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import * as Icons from 'lucide-react'

// Utility: Parse template string
// Example: "{firstName} {lastName}" + { firstName: "John", lastName: "Doe" } => "John Doe"
export function parseTemplate(template: string, data: any): string {
  return template.replace(/\{(\w+(?:\.\w+)*)\}/g, (match, path) => {
    const value = getNestedValue(data, path)
    return value != null ? String(value) : ''
  })
}

// Utility: Get nested value from object
// Example: getNestedValue({ user: { email: "test@test.com" } }, "user.email") => "test@test.com"
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// Utility: Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Badge Renderer
export function renderBadge(config: any, rowData: any) {
  // Support both direct config and nested config object
  const actualConfig = config.config || config

  const field = actualConfig.field || config.field || 'status'
  const value = getNestedValue(rowData, field)

  if (!value) return <span className="text-muted-foreground">-</span>

  // Determine variant
  let variant = actualConfig.variant || config.variant || 'default'

  // Use colorMap if provided
  const colorMap = actualConfig.colorMap || config.colorMap
  if (colorMap && colorMap[value]) {
    variant = colorMap[value]
  }

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    error: 'bg-red-100 text-red-800 hover:bg-red-200',
    info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  }

  return (
    <Badge variant="outline" className={cn(variantClasses[variant as keyof typeof variantClasses])}>
      {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
    </Badge>
  )
}

// Avatar Renderer
export function renderAvatar(config: any, rowData: any) {
  // Support both direct config and nested config object
  const actualConfig = config.config || config

  const imageField = actualConfig.imageField || config.imageField || 'avatar'
  const nameField = actualConfig.nameField || config.nameField || 'name'
  const size = actualConfig.size || config.size || 'md'

  const imageUrl = getNestedValue(rowData, imageField)
  const name = getNestedValue(rowData, nameField)

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  return (
    <Avatar className={sizeClasses[size as keyof typeof sizeClasses]}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name || 'User'} />}
      <AvatarFallback>{getInitials(name || '?')}</AvatarFallback>
    </Avatar>
  )
}

// Link Renderer
export function renderLink(config: any, rowData: any) {
  // Support both direct config and nested config object
  const actualConfig = config.config || config

  const textField = actualConfig.textField || config.textField || 'name'
  const urlField = actualConfig.urlField || config.urlField
  const urlPattern = actualConfig.urlPattern || config.urlPattern
  const external = actualConfig.external || config.external || false

  const text = getNestedValue(rowData, textField)

  // Determine URL
  let url = ''
  if (urlField) {
    url = getNestedValue(rowData, urlField)
  } else if (urlPattern) {
    url = parseTemplate(urlPattern, rowData)
  }

  if (!url) {
    return <span>{text}</span>
  }

  if (external) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        {text}
      </a>
    )
  }

  return (
    <Link href={url} className="text-primary hover:underline">
      {text}
    </Link>
  )
}

// Icon Renderer
export function renderIcon(config: any, rowData: any) {
  // Support both direct config and nested config object
  const actualConfig = config.config || config

  const iconField = actualConfig.iconField || config.iconField
  const iconMap = actualConfig.iconMap || config.iconMap || {}
  const textField = actualConfig.textField || config.textField

  let iconName = 'Circle'

  if (iconField) {
    const fieldValue = getNestedValue(rowData, iconField)
    iconName = iconMap[fieldValue] || fieldValue || 'Circle'
  }

  // Get icon component from lucide-react
  const IconComponent = (Icons as any)[iconName] || Icons.Circle

  const text = textField ? getNestedValue(rowData, textField) : null

  return (
    <div className="flex items-center gap-2">
      <IconComponent className="h-4 w-4 text-muted-foreground" />
      {text && <span>{text}</span>}
    </div>
  )
}

// Text Renderer
export function renderText(config: any, rowData: any) {
  // Support both direct config and nested config object
  const actualConfig = config.config || config

  const field = actualConfig.field || config.field
  const template = actualConfig.template || config.template
  const className = actualConfig.className || config.className
  const truncate = actualConfig.truncate || config.truncate

  let text = ''

  if (template) {
    text = parseTemplate(template, rowData)
  } else if (field) {
    const value = getNestedValue(rowData, field)
    text = value != null ? String(value) : ''
  }

  if (!text) {
    return <span className="text-muted-foreground">-</span>
  }

  if (truncate && text.length > truncate) {
    text = text.slice(0, truncate) + '...'
  }

  return <span className={className}>{text}</span>
}

// Image Renderer
export function renderImage(config: any, rowData: any) {
  // Support both direct config and nested config object
  const actualConfig = config.config || config

  const urlField = actualConfig.urlField || config.urlField || 'url'
  const altField = actualConfig.altField || config.altField || 'alt'
  const width = actualConfig.width || config.width || 48
  const height = actualConfig.height || config.height || 48
  const rounded = actualConfig.rounded !== false && config.rounded !== false

  const url = getNestedValue(rowData, urlField)
  const alt = getNestedValue(rowData, altField) || 'Image'

  if (!url) return <span className="text-muted-foreground">-</span>

  return (
    <img
      src={url}
      alt={alt}
      width={width}
      height={height}
      className={cn('object-cover', rounded && 'rounded')}
    />
  )
}

// Group Renderer
export function renderGroup(config: any, rowData: any) {
  // Support both direct config and nested config object
  const actualConfig = config.config || config

  const direction = actualConfig.direction || config.direction || 'horizontal'
  const gap = actualConfig.gap || config.gap || 'sm'
  const items = actualConfig.items || config.items || []

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-4',
  }

  const directionClasses = {
    horizontal: 'flex-row items-center',
    vertical: 'flex-col items-start',
  }

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction as keyof typeof directionClasses],
        gapClasses[gap as keyof typeof gapClasses],
      )}
    >
      {items.map((item: any, index: number) => (
        <div key={index}>{renderBlock(item, rowData)}</div>
      ))}
    </div>
  )
}

// Main Block Renderer
export function renderBlock(block: any, rowData: any): React.ReactNode {
  // Support both blockType and type properties
  const blockType = block.blockType || block.type

  switch (blockType) {
    case 'badge':
      return renderBadge(block, rowData)
    case 'avatar':
      return renderAvatar(block, rowData)
    case 'link':
      return renderLink(block, rowData)
    case 'icon':
      return renderIcon(block, rowData)
    case 'text':
      return renderText(block, rowData)
    case 'image':
      return renderImage(block, rowData)
    case 'group':
      return renderGroup(block, rowData)
    default:
      return null
  }
}

// Cell Renderer for Custom Columns
export function renderCustomCell(columnConfig: any, rowData: any): React.ReactNode {
  // If column has accessor template, use it
  if (columnConfig.accessor) {
    const value = parseTemplate(columnConfig.accessor, rowData)
    return <span>{value}</span>
  }

  // If column has blocks, render them
  if (columnConfig.blocks && columnConfig.blocks.length > 0) {
    // If single block, render directly
    if (columnConfig.blocks.length === 1) {
      return renderBlock(columnConfig.blocks[0], rowData)
    }

    // If multiple blocks, render as vertical group
    return (
      <div className="flex flex-col gap-1">
        {columnConfig.blocks.map((block: any, index: number) => (
          <div key={index}>{renderBlock(block, rowData)}</div>
        ))}
      </div>
    )
  }

  // Fallback: try to get value from key
  const key = columnConfig.key || columnConfig.id
  const value = getNestedValue(rowData, key)

  if (value == null) return <span className="text-muted-foreground">-</span>

  return <span>{String(value)}</span>
}
