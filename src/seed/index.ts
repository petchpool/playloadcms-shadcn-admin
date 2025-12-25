import { seedLanguages } from './languages'
import { seedThemes } from './themes'
import { seedLayouts } from './layouts'
import { seedSites } from './sites'
import { seedPermissions } from './permissions'
import { seedRoles } from './roles'
import { seedUsers } from './users'
import { seedPagesWithBlocks } from './seed-pages-with-blocks'
import { seedNavigation } from './navigation'
import { seedNavigationCollection } from './navigation-collection'

export async function seed() {
  console.log('🚀 Starting database seeding...\n')

  await seedLanguages()
  await seedThemes() // Seed themes before sites (so sites can reference them)
  await seedNavigation() // Seed navigation before layouts (so layouts can reference them)
  await seedLayouts()
  await seedSites()

  // Seed RBAC system (Permissions -> Roles -> Users)
  console.log('\n🔐 Seeding RBAC System...\n')
  const permissions = await seedPermissions()
  const roles = await seedRoles(permissions)
  await seedUsers(roles)

  // Seed Pages with Block-based Architecture
  console.log('\n📄 Seeding Pages (Block-based)...\n')
  await seedPagesWithBlocks()

  // Seed Navigation Collection
  await seedNavigationCollection()

  console.log('\n🎉 Database seeding completed!')
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error seeding database:', error)
      process.exit(1)
    })
}
