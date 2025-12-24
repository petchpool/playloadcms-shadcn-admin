'use client'

import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export type FooterProps = {
  variant?: 'default' | 'home'
  className?: string
}

export function Footer({ variant = 'default', className }: FooterProps) {
  if (variant === 'home') {
    return (
      <footer
        className={cn(
          'relative bg-background py-5 text-center',
          className,
        )}
      >
        <div className="container mx-auto px-4">
          <Logo />
          <p className="mt-2 text-sm text-muted-foreground">
            © All rights reserved.
          </p>
        </div>
      </footer>
    )
  }

  return (
    <footer
      className={cn(
        'relative border-t bg-background',
        className,
      )}
    >
      <Separator />
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              The starting point for your next project with Payload CMS and shadcn/ui.
            </p>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h3 className="mb-4 text-sm font-semibold">Minimal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-muted-foreground hover:text-foreground">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Terms and condition
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          © All rights reserved.
        </div>
      </div>
    </footer>
  )
}

