#!/usr/bin/env node
/**
 * Seed script runner
 * Usage:
 *   pnpm run seed              - Seed all collections
 *   pnpm run seed:languages    - Seed only languages
 *   pnpm run seed:layouts      - Seed only layouts
 *   pnpm run seed:pages        - Seed only pages (sites)
 *   pnpm run seed:permissions  - Seed only permissions
 *   pnpm run seed:roles        - Seed only roles (requires permissions)
 *   pnpm run seed:users        - Seed only users (requires roles)
 *   pnpm run seed:components   - Seed only components
 *   pnpm run seed:rbac         - Seed RBAC system (permissions -> roles -> users)
 */

import 'dotenv/config'
import { seed } from './index'
import { seedLanguages } from './languages'
import { seedLayouts } from './layouts'
import { seedSites } from './sites'
import { seedPermissions } from './permissions'
import { seedRoles } from './roles'
import { seedUsers } from './users'
import { seedWorkflows } from './workflows'
import { seedPagesLocalized } from './seed-pages-localized'

// Get collection name from command line argument or environment variable
const collection = process.argv[2] || process.env.SEED_COLLECTION

async function runSeed() {
  if (!collection) {
    // No collection specified, seed all
    console.log('🚀 Starting full database seeding...\n')
    await seed()
    return
  }

  console.log(`🌱 Seeding collection: ${collection}\n`)

  switch (collection.toLowerCase()) {
    case 'languages':
    case 'lang':
      await seedLanguages()
      break

    case 'layouts':
    case 'layout':
      await seedLayouts()
      break

    case 'pages':
    case 'sites':
    case 'page':
    case 'site':
      await seedSites()
      await seedPagesLocalized()
      break

    case 'permissions':
    case 'permission':
      await seedPermissions()
      break

    case 'roles':
    case 'role':
      console.log('⚠️  Note: Roles require permissions. Seeding permissions first...\n')
      const permissions = await seedPermissions()
      await seedRoles(permissions)
      break

    case 'users':
    case 'user':
      console.log('⚠️  Note: Users require roles. Seeding RBAC system first...\n')
      const perms = await seedPermissions()
      const roles = await seedRoles(perms)
      await seedUsers(roles)
      break

    case 'rbac':
      console.log('🔐 Seeding RBAC System (Permissions -> Roles -> Users)...\n')
      const permsForRbac = await seedPermissions()
      const rolesForRbac = await seedRoles(permsForRbac)
      await seedUsers(rolesForRbac)
      break

    case 'workflows':
    case 'automation':
      await seedWorkflows()
      break

    default:
      console.error(`❌ Unknown collection: ${collection}`)
      console.log('\nAvailable collections:')
      console.log('  - languages')
      console.log('  - layouts')
      console.log('  - pages (or sites)')
      console.log('  - permissions')
      console.log('  - roles')
      console.log('  - users')
      console.log('  - rbac (permissions + roles + users)')
      process.exit(1)
  }

  console.log(`\n✅ Seeding ${collection} completed successfully!`)
}

runSeed()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  })
