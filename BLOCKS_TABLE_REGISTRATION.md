# Blocks Table Registration

## สรุป

เพิ่ม `blocksTable` block เข้าสู่ระบบแล้ว ตาม Section-first Architecture ของโปรเจค

## การเปลี่ยนแปลง

### 1. ลงทะเบียน Block ใน Sections Collection

**ไฟล์:** `src/collections/Sections.ts`

เพิ่ม `blocksTable` block เข้าไปใน `blocks` array ของ Sections collection:

```typescript
{
  slug: 'blocksTable',
  labels: {
    singular: 'Data Table',
    plural: 'Data Tables',
  },
  fields: [
    // Configuration fields...
  ],
}
```

### 2. Fields ที่รองรับ

Block นี้รองรับ configuration fields ต่อไปนี้:

- **title** (text): หัวข้อตาราง
- **description** (textarea): คำอธิบายตาราง
- **collection** (select): Collection ที่จะดึงข้อมูล (components, sections, pages, layouts, users, media, roles, permissions)
- **columns** (json): การกำหนดค่าคอลัมน์ (JSON array)
- **limit** (number): จำนวนรายการต่อหน้า (default: 10)
- **searchFields** (array): ฟิลด์ที่ใช้ในการค้นหา
- **filterFields** (json): การกำหนดค่าตัวกรอง
- **populate** (group): การตั้งค่า relationship population
  - depth (number): ความลึกในการ populate
  - fields (array): ฟิลด์ที่จะ populate
- **select** (text): ฟิลด์ที่จะเลือก (comma-separated)
- **defaultSort** (group): การเรียงลำดับเริ่มต้น
  - field (text): ฟิลด์ที่จะเรียง
  - order (select): asc หรือ desc
- **showStatusTabs** (checkbox): แสดง status filter tabs
- **statusTabsField** (text): ฟิลด์ที่ใช้สำหรับ status tabs
- **statusTabsConfig** (json): การกำหนดค่า status tabs
- **showActions** (checkbox): แสดงปุ่ม actions
- **defaultActions** (json): การกำหนดค่า default actions
- **syncUrl** (checkbox): ซิงค์สถานะตารางกับ URL
- **urlGroup** (text): Group/namespace สำหรับ URL params
- **useExternalData** (checkbox): ใช้ข้อมูลจาก DataFetch context
- **dataKey** (text): Data key จาก DataFetch context

### 3. อัปเดต PageContentRenderer

**ไฟล์:** `src/components/blocks/page-content-renderer.tsx`

อัปเดต case `blocksTable` ให้รองรับ fields ทั้งหมดที่เพิ่มเข้ามา:

```typescript
case 'blocksTable':
  return (
    <BlocksTableBlock
      key={index}
      title={block.title}
      description={block.description}
      limit={block.limit || 10}
      columns={block.columns}
      collection={block.collection || 'components'}
      searchFields={...}
      filterFields={block.filterFields}
      populate={{...}}
      select={block.select}
      defaultSort={block.defaultSort}
      showStatusTabs={block.showStatusTabs ?? true}
      statusTabsField={block.statusTabsField}
      statusTabsConfig={block.statusTabsConfig}
      showActions={block.showActions ?? true}
      defaultActions={block.defaultActions}
      syncUrl={block.syncUrl ?? false}
      urlGroup={block.urlGroup}
      useExternalData={block.useExternalData ?? false}
      dataKey={block.dataKey}
    />
  )
```

### 4. แก้ไข TypeScript Errors

แก้ไขปัญหา TypeScript ใน `PageContentRenderer`:

- เพิ่ม `blocks` prop เป็น alternative prop name
- แก้ไข heading rendering เพื่อหลีกเลี่ยง JSX type errors

## วิธีใช้งาน

### 1. สร้าง Section ใหม่

1. ไปที่ Payload Admin → Sections
2. สร้าง Section ใหม่
3. เพิ่ม block ประเภท "Data Table"
4. กำหนดค่าตามต้องการ
5. บันทึก Section

### 2. ใช้ Section ใน Page

1. ไปที่ Payload Admin → Pages
2. เลือก Page ที่ต้องการแก้ไข
3. เพิ่ม "Section Reference" block
4. เลือก Section ที่สร้างไว้
5. (Optional) ส่ง props เพิ่มเติม
6. บันทึก Page

## ตัวอย่าง Configuration

### ตัวอย่าง 1: ตารางแสดง Components

```json
{
  "title": "Components List",
  "description": "All available components",
  "collection": "components",
  "limit": 10,
  "searchFields": ["name", "slug"],
  "showStatusTabs": true,
  "statusTabsField": "status"
}
```

### ตัวอย่าง 2: ตารางแสดง Users พร้อม Filters

```json
{
  "title": "Users",
  "collection": "users",
  "limit": 25,
  "searchFields": ["email", "name"],
  "filterFields": [
    {
      "field": "status",
      "label": "Status",
      "type": "select",
      "options": [
        { "label": "Active", "value": "active" },
        { "label": "Inactive", "value": "inactive" }
      ]
    }
  ],
  "defaultSort": {
    "field": "createdAt",
    "order": "desc"
  }
}
```

### ตัวอย่าง 3: ใช้กับ DataFetch Context

```json
{
  "title": "Recent Posts",
  "useExternalData": true,
  "dataKey": "recentPosts",
  "showStatusTabs": false
}
```

## Architecture

ตาม Section-first Architecture:

- **Blocks Table** เป็น complex block → อยู่ใน **Sections** collection
- **Pages** reference Sections ผ่าน `sectionRef` block
- การแก้ไข block configuration ทำที่ Section → มีผลกับทุก Page ที่ใช้ Section นั้น
- สามารถส่ง props override ผ่าน `sectionRef` block ได้

## การ Generate Types

หลังจากแก้ไข schema ให้รัน:

```bash
pnpm generate:types
```

## การตรวจสอบ TypeScript

```bash
pnpm tsc --noEmit
```

## เอกสารเพิ่มเติม

- [SECTION_ARCHITECTURE.md](./SECTION_ARCHITECTURE.md) - Section-first Architecture
- [LAYOUT_SECTION_MIGRATION.md](./LAYOUT_SECTION_MIGRATION.md) - Layout & Section Migration Guide
- [COMPONENTS_USAGE.md](./COMPONENTS_USAGE.md) - Components Usage Guide

## สถานะ

✅ **เสร็จสมบูรณ์**

- [x] ลงทะเบียน block ใน Sections collection
- [x] อัปเดต PageContentRenderer
- [x] แก้ไข TypeScript errors
- [x] Generate types
- [x] สร้างเอกสาร

