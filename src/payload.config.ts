import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Languages } from './collections/Languages'
import { Sites } from './collections/Sites'
import { Layouts } from './collections/Layouts'
import { Pages } from './collections/Pages'
import { Blocks } from './collections/Blocks'
import { Themes } from './collections/Themes'
import { Permissions } from './collections/Permissions'
import { Roles } from './collections/Roles'
import { Navigation } from './collections/Navigation'
import { Workflows } from './collections/Workflows'
import { WorkflowRules } from './collections/WorkflowRules'

import { Settings } from './globals'
import { apiCallTask, notificationTask, updateRecordTask } from './tasks/workflowSteps'
import { workflowExecutor } from './tasks/workflowExecutor'
import { loggerTask } from './tasks/loggerTask'
import { findRecordTask } from './tasks/findRecordTask'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Languages,
    Sites,
    Layouts,
    Pages,
    Blocks,
    Navigation,
    Themes,
    Permissions,
    Roles,
    Workflows,
    WorkflowRules,
  ],
  globals: [Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    idType: 'uuid',
  }),
  sharp,
  plugins: [],
  localization: {
    locales: ['en', 'th'],
    defaultLocale: 'en',
    fallback: true,
  },
  jobs: {
    autoRun: [],
    tasks: [
      apiCallTask as any,
      notificationTask as any,
      updateRecordTask as any,
      workflowExecutor as any,
      loggerTask as any,
      findRecordTask as any,
    ],
  },
})
