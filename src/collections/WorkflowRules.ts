import type { CollectionConfig } from 'payload'
import { checkRole } from '@/utils/check-role'

export const WorkflowRules: CollectionConfig = {
  slug: 'workflow-rules',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'event', 'priority', 'active', 'updatedAt'],
    group: 'Automation',
    description: 'Rules that trigger workflows based on events',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => checkRole(user, ['admin']),
    update: ({ req: { user } }) => checkRole(user, ['admin']),
    delete: ({ req: { user } }) => checkRole(user, ['admin']),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'event',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Event to listen for (e.g., "form.submit", "user.register", "custom.event")',
        placeholder: 'form.submit',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'sites',
      index: true,
    },
    {
      name: 'conditions',
      type: 'json',
      admin: {
        description: 'JSON Logic to determine if this rule applies to the event payload',
      },
    },
    {
      name: 'workflows',
      type: 'relationship',
      relationTo: 'workflows' as any,
      hasMany: true,
      required: true,
      admin: {
        description: 'Workflows to execute when this rule is matched',
      },
    },
    {
      name: 'priority',
      type: 'number',
      defaultValue: 10,
      admin: {
        description: 'Higher priority rules run first',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'stopOnMatch',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Stop processing subsequent rules if this rule matches',
      },
    },
  ],
}
