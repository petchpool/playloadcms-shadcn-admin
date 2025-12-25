# Layout & Page Section-based Architecture Migration

## ✅ สรุปการเปลี่ยนแปลง (Completed)

การแก้ไขนี้เปลี่ยนระบบ Layouts และ Pages จากการใช้ blocks โดยตรง เป็นการใช้ **Section-based Architecture** แทน ทำให้ระบบมีความยืดหยุ่น ใช้ซ้ำได้ง่าย และบำรุงรักษาได้ดีขึ้น

---

## 📦 Collections ที่แก้ไข

### 1. **Layouts Collection** (`src/collections/Layouts.ts`)

#### Before (Old Structure)
```typescript
components: [
  { blockType: 'header', enabled: true, config: {...} },
  { blockType: 'footer', enabled: true, config: {...} },
  { blockType: 'sidebar', enabled: true, menu: {...} },
  { blockType: 'navigation', enabled: true, items: [...] },
  { blockType: 'component', component: relationshipToComponents, props: {...} },
]
```

**ปัญหา:**
- ❌ Blocks แต่ละตัวมี configuration ที่ซับซ้อนฝังอยู่ใน Layout
- ❌ ไม่สามารถใช้ซ้ำได้ (แก้ Header ต้องแก้ทุก Layout)
- ❌ Layout document ใหญ่และซับซ้อน
- ❌ ไม่มีการจัดการแบบ centralized

#### After (New Structure)
```typescript
components: [
  {
    blockType: 'sectionRef',
    section: relationshipToSections, // อ้างอิงไปยัง Sections collection
    enabled: true,
    position: 'header',
    props: { sticky: true, transparent: false },
  },
  {
    blockType: 'componentRef',
    component: relationshipToComponents,
    enabled: true,
    position: 'sidebar',
    props: {...},
  },
]
```

**Block Types ใหม่:**
1. **`sectionRef`** (Primary Method)
   - อ้างอิงไปยัง Sections collection
   - ส่ง `props` เพื่อ customize behavior
   - กำหนด `position` (header, footer, sidebar, before, content, after)

2. **`componentRef`** (Legacy Support)
   - อ้างอิงไปยัง Components collection
   - เก็บไว้เพื่อความ backward-compatible

**ข้อดี:**
- ✅ Reusable: แก้ section ครั้งเดียว → ทุก layout อัปเดต
- ✅ Maintainable: Layout document สั้น อ่านง่าย
- ✅ Flexible: ส่ง props ไปยัง sections ได้
- ✅ Organized: กำหนด position ชัดเจน

---

### 2. **Pages Collection** (`src/collections/Pages.ts`)

✅ **Already migrated** - ใช้ section-based architecture แล้วตั้งแต่ก่อนหน้า

**Current Structure:**
```typescript
content: [
  {
    blockType: 'sectionRef',
    section: relationshipToSections,
    props: {...},
    slots: [...],
    overrides: {...},
  },
  { blockType: 'richText', content: {...} },
  { blockType: 'heading', text: '...', level: 'h2' },
  { blockType: 'grid', columns: '2', items: [...] },
  { blockType: 'image', image: {...}, alt: '...' },
  { blockType: 'spacer', height: 'md' },
  { blockType: 'divider', style: 'solid' },
]
```

**Block Types (7 types only):**
- `sectionRef`: อ้างอิง reusable sections
- `richText`, `heading`, `grid`: Local content
- `image`, `spacer`, `divider`: Visual elements

**Philosophy:**
- Pages = Composition of Sections + Minimal local content
- Complex blocks → Move to Sections
- Pages should be short and readable

---

### 3. **Sections Collection** (`src/collections/Sections.ts`)

✅ **Already exists** - Collection สำหรับ reusable section compositions

**Key Fields:**
- `name`: Section name
- `slug`: Unique identifier
- `type`: `global` | `shared` | `template`
- `category`: `header` | `footer` | `hero` | `content` | etc.
- `blocks`: Array of blocks (all block types available)
- `propsSchema`: JSON schema for parameters
- `slots`: Slot definitions for injection points
- `tags`: Array of `{ tag: 'value' }` for organization
- `status`: `draft` | `published` | `archived`

---

## 🌱 Seed System Updates

### **`src/seed/layouts.ts`**

#### New Seed Flow:
1. **Create Layout Sections** (Global type)
   - `main-header` (category: header)
   - `main-footer` (category: footer)
   - `main-sidebar` (category: other)
   - `simple-header` (category: header)

2. **Create Layouts** (reference sections)
   - **Main Layout**: references header, sidebar, footer
   - **Simple Layout**: references simple-header, footer
   - **Blank Layout**: no components

#### Key Changes:
```typescript
// ❌ Old: Direct blocks
components: [
  { blockType: 'header', enabled: true, config: {...} }
]

// ✅ New: Section references
components: [
  {
    blockType: 'sectionRef',
    section: sectionId, // ID from created section
    enabled: true,
    position: 'header',
    props: { sticky: true, transparent: false },
  }
]
```

#### Fixed Issues:
1. ✅ Fixed `tags` format: `['layout']` → `[{ tag: 'layout' }]`
2. ✅ Fixed field names: `label` → `name`
3. ✅ Fixed type case: `'Global'` → `'global'`
4. ✅ Added required fields: `category`, `status`
5. ✅ Fixed log messages: `sectionData.label` → `sectionData.name`

---

## 🏗️ Architecture Layers

```
┌─────────────────────────────────────────┐
│           Application Layer              │
│  (Next.js Pages, Components)             │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│         Composition Layer                │
│  Pages & Layouts (Reference Sections)    │
│  - sectionRef blocks                     │
│  - Minimal local content                 │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│         Reusable Components Layer        │
│  Sections Collection                     │
│  - Global: Site-wide (header, footer)    │
│  - Shared: Reusable (hero, pricing)      │
│  - Template: Parameterized with props    │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│         Atomic Blocks Layer              │
│  All Block Types                         │
│  - richText, heading, dataFetch, etc.    │
└─────────────────────────────────────────┘
```

---

## 📊 Benefits Comparison

| Aspect | Before | After |
|--------|--------|-------|
| **Reusability** | ❌ None | ✅ Sections reusable across pages/layouts |
| **Maintenance** | ❌ Edit each page/layout | ✅ Edit section once |
| **Organization** | ❌ Blocks scattered | ✅ Centralized in Sections |
| **Flexibility** | ❌ Static blocks | ✅ Parameterized with props |
| **Document Size** | ❌ Large (many nested blocks) | ✅ Small (references only) |
| **Database Tables** | ❌ Many (_2, _3, _4...) | ✅ Fewer (centralized) |
| **Scalability** | ❌ Hard to scale | ✅ Easy to scale |

---

## 🚀 Usage Examples

### 1. Create a Layout Section (Admin Panel)

**Navigate to:** Admin Panel → Sections → Create

**Fields:**
```
Name: Main Header
Slug: main-header
Type: Global
Category: header
Status: published
Tags: [{ tag: 'layout' }, { tag: 'header' }]

Blocks:
  - [Add any blocks you want: richText, heading, navigation, etc.]
```

### 2. Create a Layout (Admin Panel)

**Navigate to:** Admin Panel → Layouts → Create

**Fields:**
```
Name: My Custom Layout
Slug: my-custom-layout
Type: main

Components:
  Block 1:
    Type: Section Reference
    Section: main-header (select from dropdown)
    Position: header
    Props: { "sticky": true, "variant": "dark" }
    Enabled: ✓
  
  Block 2:
    Type: Section Reference
    Section: main-footer
    Position: footer
    Props: { "showCopyright": true }
    Enabled: ✓
```

### 3. Use Layout in Site

**Navigate to:** Admin Panel → Sites → Edit Site

**Fields:**
```
Default Layout: my-custom-layout (select from dropdown)
```

---

## 🔄 Migration Path (For Existing Data)

If you have existing Layouts with old block structure:

1. **Create Sections** for each layout component type
   ```typescript
   // Example: Create "standard-header" section
   {
     name: 'Standard Header',
     slug: 'standard-header',
     type: 'global',
     category: 'header',
     blocks: [
       // Copy your existing header config here
     ],
   }
   ```

2. **Update Layouts** to use `sectionRef`
   ```typescript
   // Before
   components: [
     { blockType: 'header', config: {...} }
   ]
   
   // After
   components: [
     {
       blockType: 'sectionRef',
       section: 'standard-header', // section ID
       position: 'header',
       props: {...}, // move config here
     }
   ]
   ```

3. **Re-seed** or manually update in Admin Panel

---

## 📝 Next Steps

### For Developers:
1. ✅ **Layouts & Pages** migrated to section-based
2. ✅ **Seed system** updated
3. ✅ **Types** regenerated
4. 🎨 **Create more sections** in Admin Panel
5. 🔄 **Migrate existing layouts** (if any)

### For Content Editors:
1. **Create Sections** for reusable components
   - Headers (variations: sticky, transparent, minimal)
   - Footers (variations: full, minimal, social)
   - Sidebars (variations: dashboard, docs, admin)
2. **Use Sections** in Layouts and Pages
3. **Customize** with props when needed

---

## 🎯 Key Takeaways

1. **Layouts & Pages** now use **Section References** instead of direct blocks
2. **Sections Collection** is the single source of truth for reusable components
3. **Props** allow customization without duplication
4. **Position** field organizes where components render
5. **Database is cleaner** with centralized content
6. **Maintenance is easier** - edit once, update everywhere

---

## 🐛 Troubleshooting

### Issue: Section not found in Layout
**Solution:** Ensure section is created and `status: 'published'`

### Issue: Props not working
**Solution:** Check section's `propsSchema` field and ensure props are valid JSON

### Issue: Old blocks still showing
**Solution:** Re-seed database or manually update layouts in Admin Panel

### Issue: "undefined" in seed logs
**Solution:** ✅ Fixed - ensure using `sectionData.name` not `sectionData.label`

---

## 📚 Related Documentation

- `SECTION_ARCHITECTURE.md` - Detailed section-based architecture explanation
- `IMPLEMENTATION_STATUS.md` - Implementation status tracking
- `.cursor/rules/security-critical.mdc` - PayloadCMS security patterns
- `src/collections/Sections.ts` - Sections collection definition
- `src/collections/Layouts.ts` - Layouts collection definition
- `src/collections/Pages.ts` - Pages collection definition

---

**Migration Date:** December 25, 2024
**Status:** ✅ Completed
**Database:** ✅ Seeded with new structure

