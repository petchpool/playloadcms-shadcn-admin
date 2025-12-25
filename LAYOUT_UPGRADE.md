# Layout System Upgrade - shadcn/ui Sidebar

## 🎉 สรุปการอัพเกรด

Layout ถูกปรับปรุงให้ใช้ **shadcn/ui Sidebar component** ตามมาตรฐาน shadcn/ui อย่างเป็นทางการ

### ✨ คุณสมบัติใหม่

1. **Collapsible Sidebar** - Sidebar ย่อเป็นไอคอนได้
2. **Breadcrumb Navigation** - แสดง breadcrumb ใน header
3. **Responsive Design** - ทำงานได้ดีทั้งบน desktop และ mobile
4. **Modern UI** - ใช้ component pattern จาก shadcn/ui
5. **Smooth Animations** - Animation ที่ลื่นไหลและสวยงาม

## 📦 Components ที่ติดตั้ง

```bash
pnpm dlx shadcn@latest add sidebar breadcrumb separator
```

Components ที่เพิ่มเข้ามา:
- `sidebar.tsx` - Main sidebar component
- `breadcrumb.tsx` - Breadcrumb navigation
- `separator.tsx` - Visual separator
- (และ dependencies อื่นๆ)

## 🏗️ โครงสร้างใหม่

### Before (เดิม)

```tsx
<LayoutSection>
  <HeaderSection>
    <Logo />
    <Nav />
  </HeaderSection>
  <Main>{children}</Main>
  <Footer />
</LayoutSection>
```

### After (ใหม่)

```tsx
<SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    <header>
      <SidebarTrigger />
      <Breadcrumb />
      <Nav />
    </header>
    <Main>{children}</Main>
    <Footer />
  </SidebarInset>
</SidebarProvider>
```

## 📝 การใช้งาน

### MainLayout

Layout หลักตอนนี้ใช้โครงสร้างใหม่:

```tsx
<SidebarProvider defaultOpen={!sidebar?.defaultCollapsed}>
  {sidebarEnabled && <AppSidebar data={sidebarNavData} />}
  <SidebarInset>
    {/* Header with Breadcrumb */}
    <header className="flex h-16 shrink-0 items-center gap-2">
      <SidebarTrigger />
      <Separator orientation="vertical" />
      <Breadcrumb>...</Breadcrumb>
      <Nav />
    </header>

    {/* Main Content */}
    <Main>{children}</Main>
    <Footer />
  </SidebarInset>
</SidebarProvider>
```

### AppSidebar

Sidebar ใหม่รองรับการย่อเป็นไอคอน:

```tsx
<Sidebar collapsible="icon">
  <SidebarHeader>
    {/* Logo + App Name */}
  </SidebarHeader>
  <SidebarContent>
    {/* Navigation Items */}
  </SidebarContent>
  <SidebarRail />
</Sidebar>
```

## 🎨 Features

### 1. Collapsible Sidebar

- **Desktop**: คลิก SidebarTrigger หรือกด `Cmd+B` (Mac) / `Ctrl+B` (Windows)
- **Icon Mode**: Sidebar ย่อเป็นไอคอนแต่ยังใช้งานได้
- **Persistent State**: จำสถานะการเปิด/ปิดผ่าน cookies

### 2. Submenu with Link

Submenu ตอนนี้รองรับการคลิกลิงค์:
- **คลิกที่ชื่อเมนู** → ไปยังหน้านั้น
- **คลิกที่ Chevron** → เปิด/ปิด submenu

### 3. Breadcrumb Navigation

Header มี breadcrumb แสดงเส้นทางปัจจุบัน:
- **Home** → หน้าแรก
- **Page Name** → หน้าปัจจุบัน

### 4. Smooth Animations

- Sidebar expand/collapse: 300ms ease-in-out
- Submenu open/close: 300ms ease-in-out
- Breadcrumb fade: 200ms

## 🎨 CSS Variables

Sidebar ใช้ CSS variables แยกต่างหาก:

```css
/* Light Mode */
:root {
  --sidebar: oklch(0.968 0.007 247.896);
  --sidebar-foreground: oklch(0.129 0.042 264.695);
  --sidebar-primary: oklch(0.129 0.042 264.695);
  --sidebar-primary-foreground: oklch(0.985 0.002 247.858);
  --sidebar-accent: oklch(0.929 0.013 255.508);
  --sidebar-accent-foreground: oklch(0.129 0.042 264.695);
  --sidebar-border: oklch(0.929 0.013 255.508);
  --sidebar-ring: oklch(0.129 0.042 264.695);
}

/* Dark Mode */
.dark {
  --sidebar: oklch(0.129 0.042 264.695);
  --sidebar-foreground: oklch(0.946 0.008 247.896);
  --sidebar-primary: oklch(0.647 0.2 256.783);
  --sidebar-primary-foreground: oklch(0.985 0.002 247.858);
  --sidebar-accent: oklch(0.217 0.041 264.376);
  --sidebar-accent-foreground: oklch(0.946 0.008 247.896);
  --sidebar-border: oklch(0.278 0.033 256.848);
  --sidebar-ring: oklch(0.442 0.017 257.281);
}
```

## 📊 Navigation Data Structure

```typescript
type SidebarMenuItemData = {
  title: string
  path?: string
  icon?: string
  caption?: string
  disabled?: boolean
  external?: boolean
  groupLabel?: string
  children?: SidebarMenuItemData[]
}
```

### ตัวอย่างการใช้งาน

```typescript
const navData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'Home',
  },
  {
    title: 'Products',
    path: '/products',
    icon: 'Package',
    children: [
      { title: 'All Products', path: '/products/all' },
      { title: 'Categories', path: '/products/categories' },
    ],
  },
  {
    groupLabel: 'Settings',
    title: 'Profile',
    path: '/settings/profile',
    icon: 'User',
  },
]
```

## 🔧 Customization

### ปรับความกว้าง Sidebar

```tsx
<SidebarProvider
  style={{
    '--sidebar-width': '20rem',
    '--sidebar-width-mobile': '20rem',
  }}
>
  <Sidebar />
</SidebarProvider>
```

### ปรับ Keyboard Shortcut

แก้ไขใน `src/components/ui/sidebar.tsx`:

```tsx
const SIDEBAR_KEYBOARD_SHORTCUT = "b" // Cmd+B / Ctrl+B
```

### ปรับ Cookie Name

```tsx
const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
```

## 🎯 Best Practices

1. **ใช้ SidebarProvider ที่ root level** - wrap layout ทั้งหมด
2. **ใช้ collapsible="icon"** - เพื่อ UX ที่ดีขึ้น
3. **Group menu items** - ใช้ `groupLabel` เพื่อจัดหมวดหมู่
4. **เพิ่ม icons** - ทำให้ navigation ชัดเจนขึ้น
5. **Test responsive** - ตรวจสอบทั้ง desktop และ mobile

## 🔄 Migration Guide

ถ้าคุณมี custom layout:

1. Import components ใหม่:
```tsx
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Breadcrumb, BreadcrumbList, ... } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
```

2. แปลง structure:
```tsx
// Old
<LayoutSection>
  <HeaderSection>...</HeaderSection>
  <Main>...</Main>
</LayoutSection>

// New
<SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    <header>...</header>
    <Main>...</Main>
  </SidebarInset>
</SidebarProvider>
```

3. เพิ่ม breadcrumb และ separator ใน header

## 📚 Resources

- [shadcn/ui Sidebar Documentation](https://ui.shadcn.com/docs/components/sidebar)
- [Blocks Library](https://ui.shadcn.com/blocks) - 30+ sidebar examples
- [Source Code](https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/new-york/ui/sidebar.tsx)

## ✅ Checklist

- [x] ติดตั้ง sidebar component
- [x] ติดตั้ง breadcrumb และ separator
- [x] อัพเดท MainLayout
- [x] อัพเดท AppSidebar ให้เป็น collapsible="icon"
- [x] เพิ่ม Breadcrumb navigation
- [x] ทดสอบ responsive design
- [x] ตรวจสอบ TypeScript errors
- [x] ตรวจสอบ linter errors

## 🎉 สำเร็จ!

Layout ถูกอัพเกรดเรียบร้อยแล้ว ตอนนี้คุณมี:
- ✨ Modern sidebar ที่ collapsible ได้
- 🗺️ Breadcrumb navigation
- 📱 Responsive design
- ⚡ Smooth animations
- 🎨 Beautiful UI

ลองรัน dev server และดูผลลัพธ์กันเลย! 🚀

