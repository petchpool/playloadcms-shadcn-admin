'use client'

import { cn } from '@/lib/utils'
import { layoutClasses } from '../classes'

export type LayoutSectionProps = {
  className?: string
  children?: React.ReactNode
  footerSection?: React.ReactNode
  headerSection?: React.ReactNode
  sidebarSection?: React.ReactNode
}

export function LayoutSection({
  className,
  children,
  footerSection,
  headerSection,
  sidebarSection,
}: LayoutSectionProps) {
  return (
    <div
      id="root__layout"
      className={cn(
        layoutClasses.root,
        'flex min-h-screen flex-col',
        className,
      )}
    >
      {sidebarSection ? (
        <>
          {sidebarSection}
          <div className={cn(layoutClasses.hasSidebar, 'flex flex-1 flex-col')}>
            {headerSection}
            {children}
            {footerSection}
          </div>
        </>
      ) : (
        <>
          {headerSection}
          {children}
          {footerSection}
        </>
      )}
    </div>
  )
}

