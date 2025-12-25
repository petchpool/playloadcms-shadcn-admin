import React from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payload CMS + shadcn/ui',
  description: 'A powerful CMS with shadcn/ui components',
}

export default async function FrontendLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <main>{children}</main>
    </ThemeProvider>
  )
}
