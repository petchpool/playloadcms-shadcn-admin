import type { CollectionConfig } from 'payload'
import { hasAdminRoleSync } from '@/utils/check-role'

export const Languages: CollectionConfig = {
  slug: 'languages',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['code', 'name', 'nativeName', 'countryCode', 'status', 'order'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => {
      if (!user) return false
      return hasAdminRoleSync(user)
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return hasAdminRoleSync(user)
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return hasAdminRoleSync(user)
    },
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'ISO 639-1 language code (e.g., en, th, zh)',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Language name in English (e.g., English, Thai)',
      },
    },
    {
      name: 'nativeName',
      type: 'text',
      admin: {
        description: 'Native language name (e.g., English, ไทย)',
      },
    },
    {
      name: 'countryCode',
      type: 'text',
      admin: {
        description: 'ISO 3166-1 alpha-2 country code (e.g., US, TH)',
      },
    },
    {
      name: 'flag',
      type: 'text',
      admin: {
        description: 'Flag emoji or icon identifier',
      },
    },
    {
      name: 'rtl',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Right-to-left language (e.g., Arabic, Hebrew)',
      },
    },
    {
      name: 'dateFormat',
      type: 'text',
      admin: {
        description: 'Date format (e.g., MM/DD/YYYY, DD/MM/YYYY)',
      },
    },
    {
      name: 'numberFormat',
      type: 'group',
      fields: [
        {
          name: 'code',
          type: 'text',
          admin: {
            description: 'Locale code for number formatting (e.g., en-US, th-TH)',
          },
        },
        {
          name: 'currency',
          type: 'text',
          admin: {
            description: 'Currency code (e.g., USD, THB)',
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
      ],
      defaultValue: 'active',
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Display order for language selector',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        // Validate language code format (ISO 639-1: 2 letters)
        if (data.code && !/^[a-z]{2}$/i.test(data.code)) {
          throw new Error('Language code must be a valid ISO 639-1 code (2 letters)')
        }
        return data
      },
    ],
  },
  timestamps: true,
}
