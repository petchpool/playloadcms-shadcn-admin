'use client'

import { cn } from '@/lib/utils'
import { LayoutSection } from '../core/layout-section'
import { HeaderSection } from '../core/header-section'
import { Main } from '../core/main'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export type SimpleLayoutProps = {
  className?: string
  children: React.ReactNode
  header?: {
    className?: string
  }
  content?: {
    compact?: boolean
  }
}

export function SimpleLayout({ className, children, header, content }: SimpleLayoutProps) {
  return (
    <LayoutSection
      headerSection={
        <HeaderSection
          className={header?.className}
          slotProps={{
            container: {
              maxWidth: false,
            },
          }}
          slots={{
            leftArea: <Logo />,
            rightArea: (
              <div className="flex items-center gap-2">
                <Link
                  href="/faqs"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Need help?
                </Link>
                <Button variant="ghost" size="sm">
                  Settings
                </Button>
              </div>
            ),
          }}
        />
      }
      className={className}
    >
      <Main>
        {content?.compact ? (
          <div className="mx-auto w-full max-w-md px-4 py-8">
            {children}
          </div>
        ) : (
          children
        )}
      </Main>
    </LayoutSection>
  )
}

