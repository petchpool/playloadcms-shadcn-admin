import { getPayload } from 'payload'
import config from '../payload.config'

const languages = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    countryCode: 'US',
    flag: '🇺🇸',
    rtl: false,
    dateFormat: 'MM/DD/YYYY',
    numberFormat: {
      code: 'en-US',
      currency: 'USD',
    },
    status: 'active',
    order: 1,
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    countryCode: 'TH',
    flag: '🇹🇭',
    rtl: false,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      code: 'th-TH',
      currency: 'THB',
    },
    status: 'active',
    order: 2,
  },
]

export async function seedLanguages() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding Languages...')

  for (const languageData of languages) {
    try {
      // Check if language already exists
      const existing = await payload.find({
        collection: 'languages',
        where: {
          code: {
            equals: languageData.code,
          },
        },
        limit: 1,
        overrideAccess: true, // Bypass access control for seed script
      })

      if (existing.docs.length > 0) {
        console.log(`  ⏭️  Language "${languageData.name}" (${languageData.code}) already exists, skipping...`)
        continue
      }

      // Create language
      const language = await payload.create({
        collection: 'languages',
        data: languageData,
        overrideAccess: true, // Bypass access control for seed script
      })

      console.log(`  ✅ Created language: ${language.name} (${language.code})`)
    } catch (error) {
      console.error(`  ❌ Error creating language "${languageData.name}":`, error)
    }
  }

  console.log('✨ Languages seeding completed!')
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedLanguages()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error seeding languages:', error)
      process.exit(1)
    })
}

