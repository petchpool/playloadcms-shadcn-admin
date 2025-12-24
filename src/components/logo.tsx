'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export type LogoProps = {
  className?: string
  href?: string
}

export function Logo({ className, href = '/' }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 font-semibold',
        className,
      )}
    >
      <span>Logo</span>
    </Link>
  )
}

