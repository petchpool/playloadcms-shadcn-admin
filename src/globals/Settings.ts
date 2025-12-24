import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => {
      return user?.roles?.includes('admin') ?? false
    },
  },
  fields: [
    // Site Settings
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Site',
          description: 'General site settings',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              label: 'Site Name',
              required: true,
              defaultValue: 'My Site',
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'Site Description',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon',
            },
            {
              name: 'contactEmail',
              type: 'email',
              label: 'Contact Email',
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Social Links',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Twitter/X', value: 'twitter' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'GitHub', value: 'github' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: 'URL',
                },
              ],
            },
          ],
        },
        {
          label: 'Table',
          description: 'Default table display settings',
          fields: [
            {
              name: 'tableSettings',
              type: 'group',
              label: 'Table Settings',
              fields: [
                {
                  name: 'defaultPageSize',
                  type: 'select',
                  label: 'Default Page Size',
                  defaultValue: '10',
                  options: [
                    { label: '5 rows', value: '5' },
                    { label: '10 rows', value: '10' },
                    { label: '20 rows', value: '20' },
                    { label: '50 rows', value: '50' },
                    { label: '100 rows', value: '100' },
                  ],
                },
                {
                  name: 'pageSizeOptions',
                  type: 'text',
                  label: 'Page Size Options',
                  defaultValue: '5,10,20,50,100',
                  admin: {
                    description: 'Comma-separated values (e.g., 5,10,20,50,100)',
                  },
                },
                {
                  name: 'showStatusTabs',
                  type: 'checkbox',
                  label: 'Show Status Tabs',
                  defaultValue: true,
                  admin: {
                    description: 'Show status tabs above the table by default',
                  },
                },
                {
                  name: 'showFilters',
                  type: 'checkbox',
                  label: 'Show Filters',
                  defaultValue: true,
                  admin: {
                    description: 'Show filter controls in the toolbar',
                  },
                },
                {
                  name: 'showSearch',
                  type: 'checkbox',
                  label: 'Show Search',
                  defaultValue: true,
                  admin: {
                    description: 'Show global search input',
                  },
                },
                {
                  name: 'showColumnVisibility',
                  type: 'checkbox',
                  label: 'Show Column Visibility',
                  defaultValue: true,
                  admin: {
                    description: 'Allow users to toggle column visibility',
                  },
                },
                {
                  name: 'enableUrlSync',
                  type: 'checkbox',
                  label: 'Enable URL Sync',
                  defaultValue: true,
                  admin: {
                    description: 'Sync table state with browser URL',
                  },
                },
                {
                  name: 'dateFormat',
                  type: 'select',
                  label: 'Date Format',
                  defaultValue: 'PP',
                  options: [
                    { label: 'Short (Jan 1, 2024)', value: 'PP' },
                    { label: 'Medium (January 1, 2024)', value: 'PPP' },
                    { label: 'Long (Monday, January 1, 2024)', value: 'PPPP' },
                    { label: 'ISO (2024-01-01)', value: 'yyyy-MM-dd' },
                    { label: 'DD/MM/YYYY', value: 'dd/MM/yyyy' },
                    { label: 'MM/DD/YYYY', value: 'MM/dd/yyyy' },
                  ],
                },
                {
                  name: 'dateTimeFormat',
                  type: 'select',
                  label: 'Date Time Format',
                  defaultValue: 'PPp',
                  options: [
                    { label: 'Short (Jan 1, 2024, 12:00 PM)', value: 'PPp' },
                    { label: 'Medium (January 1, 2024 at 12:00 PM)', value: 'PPPp' },
                    { label: 'ISO (2024-01-01T12:00:00)', value: "yyyy-MM-dd'T'HH:mm:ss" },
                    { label: 'DD/MM/YYYY HH:mm', value: 'dd/MM/yyyy HH:mm' },
                    { label: 'MM/DD/YYYY hh:mm a', value: 'MM/dd/yyyy hh:mm a' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Theme',
          description: 'Theme and appearance settings',
          fields: [
            {
              name: 'themeSettings',
              type: 'group',
              label: 'Theme Settings',
              fields: [
                {
                  name: 'defaultTheme',
                  type: 'select',
                  label: 'Default Theme',
                  defaultValue: 'system',
                  options: [
                    { label: 'Light', value: 'light' },
                    { label: 'Dark', value: 'dark' },
                    { label: 'System', value: 'system' },
                  ],
                },
                {
                  name: 'primaryColor',
                  type: 'text',
                  label: 'Primary Color',
                  defaultValue: '#0f172a',
                  admin: {
                    description: 'Primary brand color (hex format)',
                  },
                },
                {
                  name: 'accentColor',
                  type: 'text',
                  label: 'Accent Color',
                  defaultValue: '#3b82f6',
                  admin: {
                    description: 'Accent color for highlights (hex format)',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'API',
          description: 'API and integration settings',
          fields: [
            {
              name: 'apiSettings',
              type: 'group',
              label: 'API Settings',
              fields: [
                {
                  name: 'enableApi',
                  type: 'checkbox',
                  label: 'Enable Public API',
                  defaultValue: false,
                  admin: {
                    description: 'Allow public access to API endpoints',
                  },
                },
                {
                  name: 'rateLimitRequests',
                  type: 'number',
                  label: 'Rate Limit (requests per minute)',
                  defaultValue: 100,
                  min: 1,
                  max: 10000,
                },
                {
                  name: 'enableCors',
                  type: 'checkbox',
                  label: 'Enable CORS',
                  defaultValue: false,
                },
                {
                  name: 'allowedOrigins',
                  type: 'array',
                  label: 'Allowed Origins',
                  admin: {
                    condition: (data) => data?.apiSettings?.enableCors === true,
                  },
                  fields: [
                    {
                      name: 'origin',
                      type: 'text',
                      required: true,
                      label: 'Origin URL',
                      admin: {
                        placeholder: 'https://example.com',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Email',
          description: 'Email configuration',
          fields: [
            {
              name: 'emailSettings',
              type: 'group',
              label: 'Email Settings',
              fields: [
                {
                  name: 'fromName',
                  type: 'text',
                  label: 'From Name',
                  defaultValue: 'My Site',
                },
                {
                  name: 'fromEmail',
                  type: 'email',
                  label: 'From Email',
                },
                {
                  name: 'replyToEmail',
                  type: 'email',
                  label: 'Reply-To Email',
                },
                {
                  name: 'emailFooter',
                  type: 'richText',
                  label: 'Email Footer',
                  admin: {
                    description: 'Footer content for all outgoing emails',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

