import { ReactNode } from 'react'

/**
 * Template component for dynamic routes
 * 
 * In Next.js 16, template.tsx ensures that:
 * - Layout components (Header, Sidebar) do NOT re-render on navigation
 * - Only page content re-renders, preventing layout flicker
 * - Animations and transitions work smoothly
 * 
 * This is different from layout.tsx:
 * - layout.tsx: Shared across routes, persists on navigation
 * - template.tsx: Re-renders children on navigation, but layout stays stable
 */
export default function Template({ children }: { children: ReactNode }) {
  return <>{children}</>
}

