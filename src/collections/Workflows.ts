import type { CollectionConfig } from 'payload'
import { checkRole } from '@/utils/check-role'

export const Workflows: CollectionConfig = {
  slug: 'workflows',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'updatedAt'],
    group: 'Automation',
    description: 'Define automation workflows composed of sequential steps',
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
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Draft', value: 'draft' },
      ],
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'sites',
      index: true,
      admin: {
        description: 'Tenant this workflow belongs to',
      },
    },
    {
      name: 'steps',
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: [
        // 1. External Integrations
        {
          slug: 'apiCall',
          labels: {
            singular: 'API Call / Webhook',
            plural: 'API Calls',
          },
          fields: [
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'Endpoint URL',
            },
            {
              name: 'method',
              type: 'select',
              defaultValue: 'POST',
              options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
              required: true,
            },
            {
              name: 'headers',
              type: 'array',
              fields: [
                {
                  name: 'key',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
              ],
              admin: {
                initCollapsed: true,
              },
            },
            {
              name: 'body',
              type: 'json',
              admin: {
                description: 'JSON body. Supports templating (e.g. {{trigger.data.email}})',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'timeout',
                  type: 'number',
                  defaultValue: 5000,
                  admin: {
                    description: 'Timeout in ms',
                    width: '50%',
                  },
                },
                {
                  name: 'retries',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    description: 'Number of retries on failure',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'outputKey',
              type: 'text',
              admin: {
                description: 'Save response to context under this key (e.g., "apiResponse")',
                placeholder: 'apiResponse',
              },
            },
          ],
        },

        // 2. Logic & Flow Control
        {
          slug: 'condition',
          labels: {
            singular: 'Condition (Logic)',
            plural: 'Conditions',
          },
          fields: [
            {
              name: 'logicType',
              type: 'select',
              defaultValue: 'simple',
              options: [
                { label: 'Simple Comparison', value: 'simple' },
                { label: 'JSON Logic (Advanced)', value: 'jsonLogic' },
              ],
            },
            // Simple Mode
            {
              name: 'simpleCondition',
              type: 'group',
              admin: {
                condition: (_, siblingData) => siblingData?.logicType === 'simple',
                hideGutter: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'field',
                      type: 'text',
                      required: true,
                      label: 'Field/Path',
                      admin: { placeholder: 'data.total' },
                    },
                    {
                      name: 'operator',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Equals (==)', value: 'equals' },
                        { label: 'Not Equals (!=)', value: 'notEquals' },
                        { label: 'Greater Than (>)', value: 'gt' },
                        { label: 'Less Than (<)', value: 'lt' },
                        { label: 'Contains', value: 'contains' },
                        { label: 'Exists', value: 'exists' },
                      ],
                    },
                    { name: 'value', type: 'text', label: 'Value to compare' },
                  ],
                },
              ],
            },
            // Advanced Mode
            {
              name: 'jsonLogic',
              type: 'json',
              admin: {
                condition: (_, siblingData) => siblingData?.logicType === 'jsonLogic',
                description: 'Standard JSON Logic rule',
              },
            },
            {
              name: 'actionIfFalse',
              type: 'select',
              defaultValue: 'continue',
              options: [
                { label: 'Continue (Do nothing)', value: 'continue' },
                { label: 'Stop Workflow', value: 'stop' },
                { label: 'Throw Error', value: 'error' },
              ],
              admin: {
                description: 'What to do if the condition is NOT met?',
              },
            },
          ],
        },
        {
          slug: 'delay',
          labels: {
            singular: 'Delay / Wait',
            plural: 'Delays',
          },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'duration', type: 'number', required: true, min: 1 },
                {
                  name: 'unit',
                  type: 'select',
                  defaultValue: 'seconds',
                  options: [
                    { label: 'Seconds', value: 'seconds' },
                    { label: 'Minutes', value: 'minutes' },
                    { label: 'Hours', value: 'hours' },
                    { label: 'Days', value: 'days' },
                  ],
                },
              ],
            },
          ],
        },

        // 3. Database Operations (CRUD)
        {
          slug: 'createRecord',
          labels: {
            singular: 'Create Record',
            plural: 'Create Records',
          },
          fields: [
            {
              name: 'collection',
              type: 'text',
              required: true,
              admin: {
                description: 'Collection slug (e.g. "users", "leads")',
                placeholder: 'leads',
              },
            },
            {
              name: 'data',
              type: 'json',
              required: true,
              admin: { description: 'Data to insert. Supports templating.' },
            },
            {
              name: 'outputKey',
              type: 'text',
              admin: { description: 'Save created record to context key' },
            },
          ],
        },
        {
          slug: 'updateRecord',
          labels: {
            singular: 'Update Record',
            plural: 'Update Records',
          },
          fields: [
            {
              name: 'collection',
              type: 'text',
              required: true,
            },
            {
              name: 'recordId',
              type: 'text',
              required: true,
              admin: { description: 'ID of record to update (supports templating)' },
            },
            {
              name: 'data',
              type: 'json',
              required: true,
            },
          ],
        },
        {
          slug: 'findRecord',
          labels: {
            singular: 'Find Record',
            plural: 'Find Records',
          },
          fields: [
            {
              name: 'collection',
              type: 'text',
              required: true,
            },
            {
              name: 'query',
              type: 'json',
              required: true,
              admin: { description: 'Payload "where" query (JSON)' },
            },
            {
              name: 'outputKey',
              type: 'text',
              required: true,
              admin: { description: 'Key to save the found document(s)' },
            },
          ],
        },
        {
          slug: 'deleteRecord',
          labels: {
            singular: 'Delete Record',
            plural: 'Delete Records',
          },
          fields: [
            {
              name: 'collection',
              type: 'text',
              required: true,
            },
            {
              name: 'recordId',
              type: 'text',
              required: true,
              admin: { description: 'ID of record to delete (supports templating)' },
            },
          ],
        },

        // 4. Data Transformation
        {
          slug: 'transform',
          labels: {
            singular: 'Transform Data',
            plural: 'Transform Data',
          },
          fields: [
            {
              name: 'operation',
              type: 'select',
              defaultValue: 'map',
              options: [
                { label: 'Map / Pick Fields', value: 'map' },
                { label: 'JSONata Query', value: 'jsonata' },
              ],
            },
            {
              name: 'mapping',
              type: 'json',
              admin: {
                condition: (_, siblingData) => siblingData?.operation === 'map',
                description: 'Validation/Transformation Map',
              },
            },
            {
              name: 'expression',
              type: 'textarea',
              admin: {
                condition: (_, siblingData) => siblingData?.operation === 'jsonata',
                description: 'JSONata expression',
              },
            },
            {
              name: 'outputKey',
              type: 'text',
              required: true,
            },
          ],
        },

        // 5. Composability
        {
          slug: 'subWorkflow',
          labels: {
            singular: 'Execute Workflow',
            plural: 'Execute Workflows',
          },
          fields: [
            {
              name: 'workflow',
              type: 'relationship',
              relationTo: 'workflows',
              required: true,
            },
            {
              name: 'passContext',
              type: 'checkbox',
              defaultValue: true,
              label: 'Pass current context to sub-workflow',
            },
            {
              name: 'waitForCompletion',
              type: 'checkbox',
              defaultValue: true,
              label: 'Wait for completion before proceeding',
            },
          ],
        },

        // 6. Notifications
        {
          slug: 'notification',
          labels: {
            singular: 'Notification',
            plural: 'Notifications',
          },
          fields: [
            {
              name: 'channel',
              type: 'select',
              defaultValue: 'email',
              options: [
                { label: 'Email', value: 'email' },
                { label: 'Internal Notification', value: 'internal' },
                { label: 'Slack / Discord', value: 'chat' },
              ],
            },
            {
              name: 'recipient',
              type: 'text',
              required: true,
              admin: { description: 'Email address, User ID, or Channel ID' },
            },
            {
              name: 'subject',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.channel === 'email',
              },
            },
            {
              name: 'content',
              type: 'textarea',
              required: true,
              admin: { description: 'Message content (supports templating)' },
            },
          ],
        },
      ],
    },
  ],
}
