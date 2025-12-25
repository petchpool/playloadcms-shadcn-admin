import React from 'react'
import { Inter, IBM_Plex_Sans_Thai } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import type { Metadata } from 'next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['thai'],
  variable: '--font-ibm-plex-thai',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Payload CMS + shadcn/ui',
  description: 'A powerful CMS with shadcn/ui components',
}

export default async function FrontendLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexSansThai.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storageKey = 'ui-theme';
                const theme = localStorage.getItem(storageKey) || 'dark';
                const root = document.documentElement;
                root.classList.remove('light', 'dark');
                if (theme === 'system') {
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  root.classList.add(systemTheme);
                } else {
                  root.classList.add(theme);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
