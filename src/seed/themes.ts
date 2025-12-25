import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { batchSeed } from './utils/batch-seeder'

/**
 * Seed Themes
 * 
 * Pre-configured theme options for sites
 */
export async function seedThemes() {
  const payload = await getPayload({ config })

  console.log('🎨 Seeding Themes...')

  const themes = [
    {
      name: 'Dark Professional',
      slug: 'dark-professional',
      description: 'Professional dark theme with blue accents',
      mode: 'dark' as const,
      primaryColor: '#3b82f6',
      primaryForeground: '#ffffff',
      secondaryColor: '#6366f1',
      secondaryForeground: '#ffffff',
      backgroundColor: '#0a0a0a',
      foregroundColor: '#fafafa',
      mutedColor: '#27272a',
      mutedForeground: '#a1a1aa',
      borderColor: '#27272a',
      inputColor: '#18181b',
      ringColor: '#3b82f6',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      infoColor: '#3b82f6',
      fontFamily: {
        sans: 'Inter, system-ui, sans-serif',
        serif: 'Georgia, serif',
        mono: 'Menlo, Monaco, monospace',
      },
      fontSize: {
        base: '16px',
        scale: '1.25' as const,
      },
      spacing: {
        unit: '4' as const,
        containerMaxWidth: '1280px',
        contentMaxWidth: '768px',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
      },
      shadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      },
      status: 'active' as const,
      isDefault: true,
    },
    {
      name: 'Light Minimal',
      slug: 'light-minimal',
      description: 'Clean light theme with minimal design',
      mode: 'light' as const,
      primaryColor: '#18181b',
      primaryForeground: '#fafafa',
      secondaryColor: '#71717a',
      secondaryForeground: '#fafafa',
      backgroundColor: '#ffffff',
      foregroundColor: '#0a0a0a',
      mutedColor: '#f4f4f5',
      mutedForeground: '#71717a',
      borderColor: '#e4e4e7',
      inputColor: '#ffffff',
      ringColor: '#18181b',
      successColor: '#22c55e',
      warningColor: '#eab308',
      errorColor: '#ef4444',
      infoColor: '#3b82f6',
      fontFamily: {
        sans: 'Inter, system-ui, sans-serif',
        serif: 'Georgia, serif',
        mono: 'Menlo, Monaco, monospace',
      },
      fontSize: {
        base: '16px',
        scale: '1.25' as const,
      },
      spacing: {
        unit: '8' as const,
        containerMaxWidth: '1200px',
        contentMaxWidth: '720px',
      },
      borderRadius: {
        sm: '0.125rem',
        md: '0.25rem',
        lg: '0.5rem',
      },
      shadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 2px 4px -1px rgb(0 0 0 / 0.1)',
        lg: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
      status: 'active' as const,
      isDefault: false,
    },
    {
      name: 'Purple Dream',
      slug: 'purple-dream',
      description: 'Vibrant purple theme for creative projects',
      mode: 'dark' as const,
      primaryColor: '#a855f7',
      primaryForeground: '#ffffff',
      secondaryColor: '#c084fc',
      secondaryForeground: '#ffffff',
      backgroundColor: '#0f0a1a',
      foregroundColor: '#fafafa',
      mutedColor: '#1e1433',
      mutedForeground: '#a78bfa',
      borderColor: '#2e1f47',
      inputColor: '#1a0f2e',
      ringColor: '#a855f7',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      infoColor: '#a855f7',
      fontFamily: {
        sans: 'Inter, system-ui, sans-serif',
        serif: 'Georgia, serif',
        mono: 'Menlo, Monaco, monospace',
      },
      fontSize: {
        base: '16px',
        scale: '1.333' as const,
      },
      spacing: {
        unit: '4' as const,
        containerMaxWidth: '1280px',
        contentMaxWidth: '768px',
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1.5rem',
      },
      shadow: {
        sm: '0 1px 2px 0 rgb(168 85 247 / 0.05)',
        md: '0 4px 6px -1px rgb(168 85 247 / 0.1)',
        lg: '0 10px 15px -3px rgb(168 85 247 / 0.1)',
      },
      status: 'active' as const,
      isDefault: false,
    },
  ]

  // Batch seed themes
  const result = await batchSeed(payload, {
    collection: 'themes',
    data: themes,
    uniqueField: 'slug',
    updateExisting: true,
    batchSize: 10,
  })

  console.log('✨ Themes seeding completed!')

  return [...result.created, ...result.updated, ...result.skipped]
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`
if (isMainModule) {
  seedThemes()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error seeding themes:', error)
      process.exit(1)
    })
}

