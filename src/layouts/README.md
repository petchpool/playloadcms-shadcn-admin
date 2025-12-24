# Layout System Documentation

ระบบ Layout สำหรับ Front-end ที่ใช้ shadcn/ui components และเชื่อมต่อกับ Payload CMS

## โครงสร้าง

```
layouts/
├── core/              # Core layout components
├── main/              # Main layout (header + footer + nav)
├── simple/            # Simple layout (minimal header)
├── blank/             # Blank layout (no header/footer)
├── components/        # Shared components
└── utils/             # Utilities & resolvers
```

## Layout Types

### 1. Main Layout
Layout พร้อม header, footer, และ navigation (desktop/mobile)

```tsx
import { MainLayout } from '@/layouts'

<MainLayout data={{ nav: navData }}>
  {children}
</MainLayout>
```

### 2. Simple Layout
Layout แบบเรียบง่าย พร้อม header ขั้นต่ำ

```tsx
import { SimpleLayout } from '@/layouts'

<SimpleLayout content={{ compact: true }}>
  {children}
</SimpleLayout>
```

### 3. Blank Layout
Layout แบบ blank ไม่มี header/footer

```tsx
import { BlankLayout } from '@/layouts'

<BlankLayout>
  {children}
</BlankLayout>
```

## การใช้งาน

### วิธีที่ 1: ใช้ LayoutResolver (แนะนำ)

LayoutResolver จะ resolve site และ layout อัตโนมัติจาก domain/subdomain

```tsx
// app/(frontend)/[site]/[[...slug]]/layout.tsx
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

  // Resolve site และ layout จาก domain/subdomain
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
// app/page.tsx หรือ page component
import { MainLayout } from '@/layouts'

export default function HomePage() {
  const navData = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' },
  ]

  return (
    <MainLayout data={{ nav: navData }}>
      <div className="container mx-auto px-4 py-8">
        <h1>Welcome to Home Page</h1>
      </div>
    </MainLayout>
  )
}
```

### วิธีที่ 3: ใช้ Layout กับ Payload Data

```tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import { MainLayout } from '@/layouts'

export default async function Page() {
  const payload = await getPayload({ config })
  
  // ดึง site data
  const site = await payload.findByID({
    collection: 'sites',
    id: 'site-id',
    depth: 2,
  })

  // ดึง layout data
  const layout = site.defaultLayout
    ? typeof site.defaultLayout === 'object'
      ? site.defaultLayout
      : await payload.findByID({
          collection: 'layouts',
          id: site.defaultLayout,
          depth: 2,
        })
    : null

  // Extract navigation data
  const navData = layout?.components
    ? extractNavFromComponents(layout.components)
    : []

  return (
    <MainLayout data={{ nav: navData }}>
      <div>Page Content</div>
    </MainLayout>
  )
}
```

## Navigation Data Structure

Navigation data ควรมีโครงสร้างดังนี้:

```typescript
type NavItem = {
  title: string      // ชื่อเมนู
  path: string       // URL path
  icon?: string      // Icon name (optional)
}

const navData: NavItem[] = [
  { title: 'Home', path: '/' },
  { title: 'About', path: '/about' },
  { title: 'Contact', path: '/contact' },
]
```

## Customization

### Custom Header

```tsx
<MainLayout
  header={{
    className: 'custom-header-class',
  }}
  data={{ nav: navData }}
>
  {children}
</MainLayout>
```

### Custom Footer

```tsx
import { Footer } from '@/layouts/main/footer'

<Footer variant="home" className="custom-footer-class" />
```

### Compact Content (Simple Layout)

```tsx
<SimpleLayout content={{ compact: true }}>
  <div>Compact content (max-width: 448px)</div>
</SimpleLayout>
```

## Site Resolution

ระบบจะ resolve site จาก domain/subdomain อัตโนมัติ:

- `localhost` → Main Site (main layout)
- `admin.localhost` → Dashboard Site (main layout)
- `lobby.localhost` → Lobby Site (blank layout)

## Layout Components ใน Payload

Layout components ใน Payload จะถูก extract เป็น navigation data อัตโนมัติ:

```typescript
// Layout components structure ใน Payload
{
  blockType: 'navigation',
  items: [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'About', path: '/about', icon: 'info' },
  ]
}
```

## Examples

### Example 1: Basic Page

```tsx
// app/about/page.tsx
import { MainLayout } from '@/layouts'

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="mt-4">About page content...</p>
      </div>
    </MainLayout>
  )
}
```

### Example 2: Page with Navigation

```tsx
// app/dashboard/page.tsx
import { MainLayout } from '@/layouts'

export default function DashboardPage() {
  const navData = [
    { title: 'Dashboard', path: '/dashboard' },
    { title: 'Settings', path: '/dashboard/settings' },
  ]

  return (
    <MainLayout data={{ nav: navData }}>
      <div className="container mx-auto px-4 py-8">
        <h1>Dashboard</h1>
      </div>
    </MainLayout>
  )
}
```

### Example 3: Blank Layout Page

```tsx
// app/lobby/page.tsx
import { BlankLayout } from '@/layouts'

export default function LobbyPage() {
  return (
    <BlankLayout>
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome to Lobby</h1>
        </div>
      </div>
    </BlankLayout>
  )
}
```

## Components

### Logo Component

```tsx
import { Logo } from '@/components/logo'

<Logo href="/" className="custom-class" />
```

### Menu Button

```tsx
import { MenuButton } from '@/layouts/components/menu-button'

<MenuButton onClick={() => setOpen(true)} />
```

## Hooks

### useScrollOffsetTop

```tsx
import { useScrollOffsetTop } from '@/hooks/use-scroll-offset-top'

function Component() {
  const { offsetTop } = useScrollOffsetTop(100)
  
  return (
    <div className={offsetTop ? 'scrolled' : ''}>
      Content
    </div>
  )
}
```

### useBoolean

```tsx
import { useBoolean } from '@/hooks/use-boolean'

function Component() {
  const { value, setTrue, setFalse, toggle } = useBoolean(false)
  
  return (
    <button onClick={toggle}>
      {value ? 'Open' : 'Close'}
    </button>
  )
}
```

## Styling

Layout system ใช้ Tailwind CSS และ shadcn/ui components:

- Header: `sticky top-0 z-[1100] border-b bg-background/95 backdrop-blur`
- Footer: `border-t bg-background`
- Navigation: Responsive (mobile/desktop)

## Troubleshooting

### Site not found
- ตรวจสอบว่า site ถูก seed แล้ว (`pnpm run seed`)
- ตรวจสอบ domain/subdomain ใน request headers

### Layout not loading
- ตรวจสอบว่า layout ถูกสร้างใน Payload CMS
- ตรวจสอบว่า site มี defaultLayout ที่ถูกต้อง

### Navigation not showing
- ตรวจสอบว่า navigation data ถูกส่งไปยัง layout
- ตรวจสอบว่า layout components มี navigation block

