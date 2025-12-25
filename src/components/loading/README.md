# Loading Components

Beautiful, animated loading components for Payload CMS + shadcn/ui project.

## Components

### 1. `PageLoading` (Default)
Full-featured loading screen with animated spinner, text, and skeleton preview.

```tsx
import { PageLoading } from '@/components/loading'

// Basic usage
<PageLoading />

// With custom message
<PageLoading message="กำลังโหลดเนื้อหา..." />

// Full screen overlay
<PageLoading message="Processing..." fullScreen />
```

**Features:**
- ✨ Animated rotating spinner with pulse effect
- 📝 Customizable loading message
- 🎯 Animated dots indicator
- 📊 Skeleton preview
- 🌐 Full screen mode option

### 2. `PageLoadingSimple`
Minimal loading spinner for tight spaces.

```tsx
import { PageLoadingSimple } from '@/components/loading'

<PageLoadingSimple />
<PageLoadingSimple className="min-h-[100px]" />
```

**Use cases:**
- Inline loading states
- Small components
- Quick transitions

### 3. `PageLoadingPulse`
Elegant pulse animation with concentric circles.

```tsx
import { PageLoadingPulse } from '@/components/loading'

<PageLoadingPulse />
<PageLoadingPulse className="min-h-[300px]" />
```

**Use cases:**
- Splash screens
- Initial app loading
- Hero section loading

## Props

### `PageLoading`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `message` | `string` | `'Loading...'` | Loading message text |
| `fullScreen` | `boolean` | `false` | Show as full-screen overlay |

### `PageLoadingSimple` & `PageLoadingPulse`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

## Usage Examples

### In Suspense Boundaries

```tsx
import { Suspense } from 'react'
import { PageLoading } from '@/components/loading'

export default function Layout({ children }) {
  return (
    <Suspense fallback={<PageLoading message="Loading page..." />}>
      {children}
    </Suspense>
  )
}
```

### In Route Transitions

```tsx
'use client'
import { PageLoading } from '@/components/loading'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export function RouteLoading() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [pathname])

  if (!loading) return null

  return <PageLoading fullScreen message="Navigating..." />
}
```

### In Data Fetching

```tsx
'use client'
import { PageLoadingSimple } from '@/components/loading'
import { useQuery } from '@tanstack/react-query'

export function DataComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  })

  if (isLoading) {
    return <PageLoadingSimple />
  }

  return <div>{/* Render data */}</div>
}
```

### Custom Loading State

```tsx
import { PageLoading } from '@/components/loading'

export function CustomLoading() {
  return (
    <PageLoading 
      message="กำลังประมวลผล..." 
      className="bg-gradient-to-b from-background to-muted"
    />
  )
}
```

## Styling

All components use:
- **Theme colors**: Automatically adapts to light/dark mode
- **Tailwind CSS**: Fully customizable with utility classes
- **Framer Motion**: Smooth, performant animations

### Custom Colors

```tsx
<PageLoading className="[&_.text-primary]:text-blue-500" />
```

### Custom Animation Speed

```tsx
<div className="[animation-duration:0.5s]">
  <PageLoadingSimple />
</div>
```

## Animation Details

- **Rotation**: 2s linear infinite
- **Pulse**: 1.5s ease-in-out
- **Stagger**: 0.1s between elements
- **Dots**: 1s with 0.15s delay between each

## Accessibility

- Proper semantic HTML
- ARIA labels (can be added)
- Respects `prefers-reduced-motion`
- Keyboard navigation friendly

## Performance

- Client component (`'use client'`)
- Optimized with Framer Motion
- No layout shift
- Minimal bundle size

## Dependencies

- `framer-motion`: Animations
- `lucide-react`: Icons
- `@/lib/utils`: cn() utility

## Best Practices

1. **Choose the right component:**
   - `PageLoading`: Full pages, main content
   - `PageLoadingSimple`: Inline, small spaces
   - `PageLoadingPulse`: Splash screens, emphasis

2. **Message localization:**
   ```tsx
   import { useTranslate } from '@/hooks/use-translate'
   
   const { t } = useTranslate()
   <PageLoading message={t('loading.page')} />
   ```

3. **Minimum display time:**
   ```tsx
   const [showLoading, setShowLoading] = useState(true)
   
   useEffect(() => {
     // Show for at least 500ms to avoid flash
     const timer = setTimeout(() => setShowLoading(false), 500)
     return () => clearTimeout(timer)
   }, [])
   ```

4. **Error boundaries:**
   ```tsx
   <ErrorBoundary fallback={<ErrorComponent />}>
     <Suspense fallback={<PageLoading />}>
       {children}
     </Suspense>
   </ErrorBoundary>
   ```

## Related Components

- `Spinner` - Base spinner component
- `Skeleton` - Content placeholder
- `Progress` - Progress indicator

