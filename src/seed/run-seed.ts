#!/usr/bin/env node
/**
 * Seed script runner
 * Usage: pnpm run seed
 */

import 'dotenv/config'
import { seed } from './index'

seed()
  .then(() => {
    console.log('\n✅ Seeding completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  })

