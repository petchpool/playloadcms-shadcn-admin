import { seedLanguages } from './languages'
import { seedLayouts } from './layouts'
import { seedSites } from './sites'
import { seedPermissions } from './permissions'
import { seedRoles } from './roles'
import { seedUsers } from './users'
import { seedComponents } from './components'
import { seedPagesWithSections } from './seed-pages-with-sections'

export async function seed() {
  console.log('🚀 Starting database seeding...\n')

  await seedLanguages()
  await seedLayouts()
  await seedSites()

  // Seed RBAC system (Permissions -> Roles -> Users)
  console.log('\n🔐 Seeding RBAC System...\n')
  const permissions = await seedPermissions()
  const roles = await seedRoles(permissions)
  await seedUsers(roles)

  // Seed Components
  console.log('\n🧩 Seeding Components...\n')
  await seedComponents()

  // Seed Pages with Section-based Architecture
  console.log('\n📄 Seeding Pages (Section-based)...\n')
  await seedPagesWithSections()

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
