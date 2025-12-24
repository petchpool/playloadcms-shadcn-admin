import { getPayload } from 'payload'
import config from '../payload.config'

export async function seedLayouts() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding Layouts...')

  const layouts = [
    {
      name: 'Main Layout',
      slug: 'main-layout',
      description: 'Main layout with header, footer, and navigation',
      type: 'main',
      status: 'published',
    },
    {
      name: 'Blank Layout',
      slug: 'blank-layout',
      description: 'Blank layout without header and footer',
      type: 'blank',
      status: 'published',
    },
    {
      name: 'Simple Layout',
      slug: 'simple-layout',
      description: 'Simple layout with minimal header',
      type: 'simple',
      status: 'published',
    },
  ]

  for (const layoutData of layouts) {
    try {
      // Check if layout already exists
      const existing = await payload.find({
        collection: 'layouts',
        where: {
          slug: {
            equals: layoutData.slug,
          },
        },
        limit: 1,
        overrideAccess: true,
      })

      if (existing.docs.length > 0) {
        console.log(`  ⏭️  Layout "${layoutData.name}" (${layoutData.slug}) already exists, skipping...`)
        continue
      }

      // Create layout
      const layout = await payload.create({
        collection: 'layouts',
        data: layoutData,
        overrideAccess: true,
      })

      console.log(`  ✅ Created layout: ${layout.name} (${layout.slug})`)
    } catch (error) {
      console.error(`  ❌ Error creating layout "${layoutData.name}":`, error)
    }
  }

  console.log('✨ Layouts seeding completed!')
}

