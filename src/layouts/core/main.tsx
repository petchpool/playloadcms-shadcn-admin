'use client'

import { cn } from '@/lib/utils'
import { layoutClasses } from '../classes'

export type MainProps = {
  className?: string
  children: React.ReactNode
}

export function Main({ className, children }: MainProps) {
  return (
    <main
      className={cn(
        layoutClasses.main,
        'flex flex-1 flex-col',
        className,
      )}
    >
      {children}
    </main>
  )
}

