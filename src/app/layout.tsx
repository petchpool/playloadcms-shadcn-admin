import React from 'react'

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
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Return children directly - child layouts will provide <html> and <body>
  return children
}

