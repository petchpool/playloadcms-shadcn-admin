# Components Collection Usage Guide

## Overview

Components collection เป็นระบบสำหรับสร้างและจัดการ reusable UI components ที่สามารถใช้ใน Layouts และ Pages ได้

## การใช้งาน Components Collection

### 1. สร้าง Component ใน Payload Admin

1. เข้า Payload Admin: `http://localhost:3000/admin`
2. ไปที่ **Components** collection
3. สร้าง Component ใหม่:
   - **Name**: ชื่อ component (e.g., "Hero Section", "CTA Button")
   - **Slug**: URL-friendly identifier (e.g., "hero-section")
   - **Type**: เลือก type (block, section, widget)
   - **Category**: เลือก category (content, media, form, navigation, layout, other)
   - **Description**: อธิบาย component
   - **Code**: Component code หรือ configuration JSON
   - **Props**: Component props schema (JSON)
   - **Status**: Published (ต้องเป็น published ถึงจะใช้งานได้)

### 2. ใช้ Component ใน Pages

ใน Pages collection, เมื่อสร้างหรือแก้ไข Page:

1. เพิ่ม Content Block
2. เลือก Block Type: **Component**
3. เลือก Component จาก dropdown
4. ตั้งค่า Props (optional) - จะ override component default props
5. Save

### 3. ใช้ Component ใน Layouts

ใน Layouts collection, เมื่อสร้างหรือแก้ไข Layout:

1. เพิ่ม Component Block
2. เลือก Component จาก dropdown
3. ตั้งค่า Props (optional)
4. Enable/Disable component
5. Save

## Component Types

### Block
ใช้สำหรับ content blocks ที่ใช้ใน Pages

### Section
ใช้สำหรับ layout sections ที่ใช้ใน Layouts

### Widget
ใช้สำหรับ reusable widgets (e.g., sidebar widgets, footer widgets)

## Component Categories

- **Content**: Content-related components (text, headings, etc.)
- **Media**: Media components (images, videos, galleries)
- **Form**: Form components (contact forms, newsletter signup)
- **Navigation**: Navigation components (menus, breadcrumbs)
- **Layout**: Layout components (containers, grids)
- **Other**: Other components

## Component Renderer

Components จะถูก render โดย `ComponentRenderer` component ซึ่ง:

1. ตรวจสอบว่า component เป็น published หรือไม่
2. Merge component props กับ provided props
3. Render component info (ในอนาคตจะ render actual component code)

## ตัวอย่างการใช้งาน

### สร้าง Hero Section Component

```json
{
  "name": "Hero Section",
  "slug": "hero-section",
  "type": "section",
  "category": "content",
  "description": "Hero section with title, subtitle, and CTA button",
  "code": "{\"component\": \"HeroSection\", \"props\": {\"title\": \"\", \"subtitle\": \"\", \"ctaText\": \"Get Started\", \"ctaLink\": \"/\"}}",
  "props": {
    "title": "string",
    "subtitle": "string",
    "ctaText": "string",
    "ctaLink": "string"
  },
  "status": "published"
}
```

### ใช้ใน Page

1. สร้าง Page
2. เพิ่ม Content Block → Component
3. เลือก "Hero Section"
4. ตั้งค่า Props:
   ```json
   {
     "title": "Welcome to Our Site",
     "subtitle": "This is a hero section",
     "ctaText": "Learn More",
     "ctaLink": "/about"
   }
   ```

## Future Enhancements

1. **Dynamic Component Loading**: Load และ render component code dynamically
2. **Component Registry**: Map component slugs to React components
3. **Component Preview**: Preview component ใน admin panel
4. **Component Versioning**: Track component versions
5. **Component Dependencies**: Manage component dependencies

## Troubleshooting

### Component ไม่แสดง
- ตรวจสอบว่า component status เป็น "published"
- ตรวจสอบว่า component ถูกเลือกใน Page/Layout
- ตรวจสอบ depth ใน query (ควรเป็น 3 สำหรับ component relationships)

### Component Props ไม่ทำงาน
- ตรวจสอบว่า props format ถูกต้อง (JSON)
- ตรวจสอบว่า component props schema ถูกต้อง

### Component ไม่ถูก load
- ตรวจสอบว่า depth ใน payload.find() เพียงพอ (depth: 3)
- ตรวจสอบว่า component relationship ถูก populate แล้ว

