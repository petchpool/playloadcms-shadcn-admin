'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export type NavDesktopProps = {
  data?: any[]
  className?: string
}

export function NavDesktop({ data = [], className }: NavDesktopProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex items-center gap-6', className)}>
      {data.map((item) => {
        const isActive = pathname === item.path

        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              'text-sm font-medium transition-colors hover:text-foreground',
              isActive ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}

