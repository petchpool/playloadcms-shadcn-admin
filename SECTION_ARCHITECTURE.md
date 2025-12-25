# Section-based Architecture Implementation Guide

## 🎯 Overview

ระบบ Section-based Architecture ถูกออกแบบเพื่อแก้ปัญหาการซ้ำซ้อนของ Blocks และทำให้ระบบ scalable ขึ้น

## ✅ สิ่งที่ทำเสร็จแล้ว

### 1. Collections

#### ✅ **Sections Collection** (`src/collections/Sections.ts`)
- Reusable block compositions
- รองรับ 3 types: Global, Shared, Template
- Props Schema สำหรับ parameterization
- Slots สำหรับ content injection
- Version control และ tags
- Preview screenshots

### 2. Components

#### ✅ **Section Renderer** (`src/components/blocks/section-renderer.tsx`)
- `SectionRenderer`: Render section with props และ slots
- `SectionRefBlock`: Reference block component
- `processBlock()`: Props interpolation (รองรับ `${propName}`)
- `validateSectionProps()`: Runtime validation
- `getDefaultProps()`: Default values extraction

### 3. Utils

#### ✅ **Role Checking** (`src/utils/check-role.ts`)
- เพิ่ม `checkRole()` helper function

### 4. Configuration

#### ✅ **Payload Config** (`src/payload.config.ts`)
- เพิ่ม Sections collection
- Generate types เรียบร้อย

---

## 📋 สิ่งที่ต้องทำต่อ

### 1. **เพิ่ม SectionRef Block ใน Pages Collection**

ใน `src/collections/Pages.ts` เพิ่ม block type ใหม่:

```typescript
{
  slug: 'sectionRef',
  labels: {
    singular: 'Section Reference',
    plural: 'Section References',
  },
  fields: [
    {
      name: 'section',
      type: 'relationship',
      relationTo: 'sections',
      required: true,
      admin: {
        description: 'Section to reference',
      },
    },
    {
      name: 'props',
      type: 'json',
      admin: {
        description: 'Props to pass to the section (JSON object)',
      },
    },
    {
      name: 'slots',
      type: 'array',
      admin: {
        description: 'Fill section slots with custom content',
      },
      fields: [
        {
          name: 'slotName',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'blocks',
          blocks: [
            // Reuse existing blocks
          ],
        },
      ],
    },
  ],
}
```

**Location**: หลังจาก richText block (around line 180)

### 2. **อัปเดต Page Content Renderer**

ใน `src/components/blocks/page-content-renderer.tsx`:

```typescript
import { SectionRenderer } from './section-renderer'
import { getPayload } from 'payload'
import config from '@/payload.config'

// เพิ่ม case ใหม่:
case 'sectionRef': {
  const payload = await getPayload({ config })
  const section = await payload.findByID({
    collection: 'sections',
    id: block.section,
    depth: 1,
  })

  return (
    <SectionRenderer
      key={`${block.blockType}-${index}`}
      section={section}
      props={block.props}
      slots={block.slots?.reduce((acc, slot) => {
        acc[slot.slotName] = slot.content
        return acc
      }, {})}
    />
  )
}
```

### 3. **สร้าง Seed Data สำหรับ Sections**

สร้าง `src/seed/sections.ts`:

```typescript
import { getPayload } from 'payload'
import config from '../payload.config'

export async function seedSections() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding Sections...')

  const sections = [
    // 1. Global Header
    {
      name: 'Global Header',
      slug: 'global-header',
      type: 'global',
      category: 'header',
      description: 'Site-wide header with navigation',
      blocks: [
        {
          blockType: 'richText',
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  tag: 'h1',
                  children: [{ type: 'text', text: 'My Site' }],
                },
              ],
            },
          },
        },
      ],
      status: 'published',
    },

    // 2. Hero Section (with props)
    {
      name: 'Hero - Landing',
      slug: 'hero-landing',
      type: 'template',
      category: 'hero',
      description: 'Parameterized hero section for landing pages',
      blocks: [
        {
          blockType: 'heading',
          text: '${title}', // Will be replaced by props
          level: 'h1',
        },
        {
          blockType: 'richText',
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: '${description}' }],
                },
              ],
            },
          },
        },
        {
          blockType: 'slot',
          name: 'actions',
          label: 'Call-to-Action Buttons',
          required: false,
        },
      ],
      propsSchema: [
        {
          key: 'title',
          type: 'text',
          label: 'Hero Title',
          required: true,
          defaultValue: 'Welcome',
        },
        {
          key: 'description',
          type: 'text',
          label: 'Hero Description',
          required: true,
        },
        {
          key: 'theme',
          type: 'select',
          label: 'Theme',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ],
          defaultValue: 'light',
        },
      ],
      status: 'published',
    },

    // 3. Global Footer
    {
      name: 'Global Footer',
      slug: 'global-footer',
      type: 'global',
      category: 'footer',
      description: 'Site-wide footer',
      blocks: [
        {
          blockType: 'richText',
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: '© 2025 My Site. All rights reserved.' }],
                },
              ],
            },
          },
        },
      ],
      status: 'published',
    },
  ]

  for (const sectionData of sections) {
    const existing = await payload.find({
      collection: 'sections',
      where: { slug: { equals: sectionData.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'sections',
        id: existing.docs[0].id,
        data: sectionData,
      })
      console.log(`  ✅ Updated: ${sectionData.name}`)
    } else {
      await payload.create({
        collection: 'sections',
        data: sectionData,
      })
      console.log(`  ✅ Created: ${sectionData.name}`)
    }
  }

  console.log('✨ Sections seeding completed!')
}
```

เพิ่มใน `src/seed/index.ts`:

```typescript
import { seedSections } from './sections'

// ใน seed() function:
await seedSections()
```

### 4. **สร้าง Page ที่ใช้ Section References**

ใน `src/seed/seed-pages-localized.ts` เพิ่ม example:

```typescript
{
  titleEn: 'Home (Section-based)',
  titleTh: 'หน้าแรก (Section-based)',
  slug: 'home-sections',
  blocksEn: [
    // Global Header
    {
      blockType: 'sectionRef',
      section: '<id-of-global-header>',
    },
    // Parameterized Hero
    {
      blockType: 'sectionRef',
      section: '<id-of-hero-landing>',
      props: {
        title: 'Welcome to Our Site',
        description: 'The best platform for everything',
        theme: 'dark',
      },
      slots: [
        {
          slotName: 'actions',
          content: [
            {
              blockType: 'richText',
              content: createLexicalContent('Get Started | Learn More'),
            },
          ],
        },
      ],
    },
    // Global Footer
    {
      blockType: 'sectionRef',
      section: '<id-of-global-footer>',
    },
  ],
}
```

---

## 🧠 Mental Model

```
Page (Organism)
  └─ SectionRef (Reference)
       └─ Section (Molecule)
            ├─ Blocks (Atoms)
            ├─ Props (Parameters)
            └─ Slots (Injection Points)
```

### Flow

1. **Page** references **Section** by slug
2. **Section Renderer** fetches section data
3. Props are **interpolated** into blocks
4. Slots are **filled** with custom content
5. Blocks are **rendered** recursively

---

## 📊 Benefits

✅ **Reusability**: แก้ Section ครั้งเดียว → ทุก Page อัปเดต
✅ **Parameterization**: Section เดียว → หลาย Variant
✅ **Clean Pages**: Page สั้น อ่านง่าย
✅ **Type Safety**: Props validation at runtime
✅ **Separation of Concerns**: Content vs Structure

---

## 🔄 Migration Strategy

### Phase 1: Co-existence
- เก็บ blocks แบบเดิมไว้
- เพิ่ม sectionRef เป็น option ใหม่
- สร้าง Sections จาก blocks ที่ซ้ำบ่อย

### Phase 2: Gradual Migration
- แปลง blocks → sections ทีละหน้า
- ใช้ script migration helper

### Phase 3: Full Adoption
- Pages ใช้ sections เป็นหลัก
- Blocks ใช้สำหรับ local content เท่านั้น

---

## 🎯 Next Steps

1. ✅ เพิ่ม `sectionRef` block ใน Pages
2. ✅ อัปเดต `page-content-renderer.tsx`
3. ✅ สร้าง `src/seed/sections.ts`
4. ✅ สร้าง example pages ที่ใช้ sections
5. ⏳ ทดสอบระบบ
6. ⏳ สร้าง Admin UI helpers (Visual Section Picker)
7. ⏳ Document best practices

---

## 🛠️ Advanced Features (Future)

- **Section Versioning**: Track changes
- **A/B Testing**: Multiple section variants
- **Analytics**: Track section performance
- **Visual Composer**: Drag-and-drop sections
- **Section Marketplace**: Share/import sections
- **Migration CLI**: Auto-convert blocks → sections

---

## 📚 Resources

- Payload Docs: https://payloadcms.com/docs/blocks
- React Server Components: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- Content Architecture: https://www.nngroup.com/articles/content-modeling/

---

นี่ไม่ใช่แค่ CMS แล้ว
มันคือ **Content Architecture System** 🌟

