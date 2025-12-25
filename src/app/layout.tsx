import React, { Suspense } from 'react'

/**
 * Root Layout - Minimal wrapper for route groups
 * 
 * This is a minimal root layout that satisfies Next.js requirements.
 * The actual HTML structure is defined in child layouts:
 * - (frontend)/layout.tsx: Custom HTML with fonts and theme
 * - (payload)/layout.tsx: Payload's RootLayout with its own HTML
 * 
 * Note: We don't import globals.css here to avoid conflicts.
 * Each route group imports its own styles.
 * 
 * Cache Components Migration:
 * - Wrapped children with Suspense to support dynamic routes (Payload admin, frontend pages)
 * - This allows routes to use headers(), cookies(), and database calls without blocking
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Wrap with Suspense to support Cache Components mode
  // This allows Payload admin and frontend pages to access dynamic data
  return <Suspense fallback={null}>{children}</Suspense>
}

