import { getPayload } from 'payload'
import config from '../payload.config'
import { batchSeed } from './utils/batch-seeder'

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
    status: 'active' as const,
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
    status: 'active' as const,
    order: 2,
  },
]

export async function seedLanguages() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding Languages...')

  await batchSeed(payload, {
    collection: 'languages',
    data: languages,
    uniqueField: 'code',
    batchSize: 10,
  })

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
