# วิธีการใช้งาน Layout System

## Quick Start

### 1. Seed Data

ก่อนใช้งาน ต้อง seed data ก่อน:

```bash
pnpm run seed
```

จะสร้าง:
- Languages (en, th)
- Layouts (main-layout, blank-layout, simple-layout)
- Sites (localhost, admin.localhost, lobby.localhost)
- Pages (Home, Dashboard, Lobby)

### 2. เริ่ม Development Server

```bash
pnpm dev
```

### 3. เข้าถึง Sites

- **Main Site**: http://localhost:3000
- **Dashboard Site**: http://admin.localhost:3000 (ต้องตั้งค่า hosts file)
- **Lobby Site**: http://lobby.localhost:3000 (ต้องตั้งค่า hosts file)

## การใช้งานใน Code

### วิธีที่ 1: Auto-resolve (แนะนำ)

ใช้ใน `app/(frontend)/[site]/[[...slug]]/layout.tsx`:

```tsx
import { resolveSiteFromDomain } from '@/layouts/utils/site-resolver'
import { LayoutResolver } from '@/layouts/utils/layout-resolver'
import { headers } from 'next/headers'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost'
  const [subdomain, ...domainParts] = host.split('.')
  const domain = domainParts.join('.') || 'localhost'

  const siteData = await resolveSiteFromDomain(domain, subdomain)

  if (!siteData) {
    return <div>Site not found</div>
  }

  return (
    <LayoutResolver
      layoutType={siteData.layoutType}
      siteId={siteData.site.id}
      layoutId={
        siteData.layout
          ? typeof siteData.layout === 'object'
            ? siteData.layout.id
            : siteData.layout
          : undefined
      }
    >
      {children}
    </LayoutResolver>
  )
}
```

### วิธีที่ 2: ใช้ Layout โดยตรง

```tsx
import { MainLayout } from '@/layouts'

export default function Page() {
  const navData = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
  ]

  return (
    <MainLayout data={{ nav: navData }}>
      <div>Page Content</div>
    </MainLayout>
  )
}
```

## ตัวอย่างการใช้งาน

### 1. สร้าง Page ใหม่

```tsx
// app/about/page.tsx
import { MainLayout } from '@/layouts'

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p>About page content...</p>
      </div>
    </MainLayout>
  )
}
```

### 2. สร้าง Page พร้อม Navigation

```tsx
// app/dashboard/page.tsx
import { MainLayout } from '@/layouts'

export default function DashboardPage() {
  const navData = [
    { title: 'Dashboard', path: '/dashboard' },
    { title: 'Settings', path: '/dashboard/settings' },
    { title: 'Profile', path: '/dashboard/profile' },
  ]

  return (
    <MainLayout data={{ nav: navData }}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p>Dashboard content...</p>
      </div>
    </MainLayout>
  )
}
```

### 3. ใช้ Blank Layout

```tsx
// app/lobby/page.tsx
import { BlankLayout } from '@/layouts'

export default function LobbyPage() {
  return (
    <BlankLayout>
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome to Lobby</h1>
          <p className="mt-4 text-muted-foreground">
            This is a blank layout page
          </p>
        </div>
      </div>
    </BlankLayout>
  )
}
```

### 4. ใช้ Simple Layout

```tsx
// app/login/page.tsx
import { SimpleLayout } from '@/layouts'

export default function LoginPage() {
  return (
    <SimpleLayout content={{ compact: true }}>
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-bold">Login</h1>
        <form className="mt-6">
          {/* Login form */}
        </form>
      </div>
    </SimpleLayout>
  )
}
```

## การตั้งค่า Hosts File (สำหรับ subdomain)

### macOS / Linux

```bash
sudo nano /etc/hosts
```

เพิ่มบรรทัด:

```
127.0.0.1 admin.localhost
127.0.0.1 lobby.localhost
```

### Windows

เปิด `C:\Windows\System32\drivers\etc\hosts` ด้วย Notepad (Run as Administrator)

เพิ่มบรรทัด:

```
127.0.0.1 admin.localhost
127.0.0.1 lobby.localhost
```

## การจัดการ Navigation ใน Payload CMS

1. เข้า Payload Admin: http://localhost:3000/admin
2. ไปที่ **Layouts** collection
3. แก้ไข layout ที่ต้องการ
4. เพิ่ม Navigation component ใน Components field
5. ตั้งค่า navigation items

## การสร้าง Site ใหม่

1. เข้า Payload Admin
2. ไปที่ **Sites** collection
3. สร้าง Site ใหม่:
   - Name: ชื่อ site
   - Domain: domain (เช่น `example.com`)
   - Default Layout: เลือก layout ที่ต้องการ
   - i18n: ตั้งค่าภาษาที่รองรับ

## การสร้าง Page ใหม่

1. เข้า Payload Admin
2. ไปที่ **Pages** collection
3. สร้าง Page ใหม่:
   - Title: ชื่อหน้า
   - Slug: URL path
   - Site: เลือก site ที่ต้องการ
   - Language: เลือกภาษา
   - Status: Published
   - Content: เพิ่ม content blocks

## Troubleshooting

### Site not found
- ตรวจสอบว่า site ถูก seed แล้ว: `pnpm run seed`
- ตรวจสอบ domain ใน request headers
- ตรวจสอบว่า site มี status = 'active'

### Layout not loading
- ตรวจสอบว่า layout ถูกสร้างใน Payload CMS
- ตรวจสอบว่า site มี defaultLayout ที่ถูกต้อง
- ตรวจสอบ console logs สำหรับ errors

### Navigation not showing
- ตรวจสอบว่า navigation data ถูกส่งไปยัง layout
- ตรวจสอบว่า layout components มี navigation block
- ตรวจสอบ navData structure

### Subdomain not working
- ตรวจสอบ hosts file
- ตรวจสอบว่า Next.js dev server รันอยู่
- ลอง restart dev server

## Best Practices

1. **ใช้ LayoutResolver** สำหรับ auto-resolve site และ layout
2. **สร้าง navigation data** จาก Payload layout components
3. **ใช้ TypeScript types** สำหรับ type safety
4. **Test ในหลาย devices** เพื่อตรวจสอบ responsive design
5. **ใช้ semantic HTML** สำหรับ accessibility

## API Reference

ดูเอกสารเพิ่มเติมที่: `src/layouts/README.md`

