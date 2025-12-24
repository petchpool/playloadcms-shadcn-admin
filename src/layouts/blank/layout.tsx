'use client'

import { cn } from '@/lib/utils'
import { Main } from '../core/main'

export type BlankLayoutProps = {
  className?: string
  children: React.ReactNode
}

export function BlankLayout({ className, children }: BlankLayoutProps) {
  return (
    <div className={cn('flex min-h-screen flex-col', className)}>
      <Main>{children}</Main>
    </div>
  )
}

