# Suspense Streaming Architecture

## Overview

This document describes the Suspense streaming architecture implemented for the frontend application, which allows Header and Sidebar to render immediately (Partial content) while page content streams in progressively.

## Architecture Principles

1. **Partial Content Rendering**: Layout components (Header, Sidebar) render immediately without waiting for data
2. **Suspended Content Streaming**: Page content uses React Suspense for progressive streaming
3. **Optimal User Experience**: Users see the navigation and structure instantly while content loads in the background

## Implementation Structure

### 1. Root Layout (No Suspense Boundary)

**File**: `src/app/(frontend)/layout.tsx`

```typescript
export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <main>
            {/* No Suspense here - allows layout to render immediately */}
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Key Points**:
- ❌ No Suspense boundary at root level
- ✅ Layout parts (Header/Sidebar) render immediately
- ✅ Children can be partially rendered

### 2. Site Layout (Async Operations for Layout Data)

**File**: `src/app/(frontend)/[[...slug]]/layout.tsx`

```typescript
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Fetch layout configuration (Header, Sidebar, Footer)
  const siteData = await resolveSiteFromDomain(domain, subdomain)
  
  return (
    <LayoutResolver layoutType={siteData.layoutType}>
      {children}
    </LayoutResolver>
  )
}
```

**Key Points**:
- ✅ Async operations fetch layout configuration
- ✅ Layout renders immediately after data is available
- ✅ Does not block content streaming

### 3. Page Component (Suspense Wrapper)

**File**: `src/app/(frontend)/[[...slug]]/page.tsx`

```typescript
export default async function Page({ params, searchParams }) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  return (
    <PageContentWrapper loadingMessage="กำลังโหลดเนื้อหา...">
      <PageContent slug={resolvedParams.slug} searchParams={resolvedSearchParams} />
    </PageContentWrapper>
  )
}
```

**Key Points**:
- ✅ Suspense boundary wraps only page content
- ✅ Layout is not affected by content loading state
- ✅ Progressive streaming for page content

### 4. Page Content Wrapper (Suspense Boundary)

**File**: `src/components/loading/page-content-wrapper.tsx`

```typescript
export function PageContentWrapper({ children, loadingMessage }) {
  return (
    <Suspense fallback={<PageLoading message={loadingMessage} />}>
      {children}
    </Suspense>
  )
}
```

**Key Points**:
- ✅ Reusable Suspense wrapper
- ✅ Customizable loading fallback
- ✅ Can be used across different pages

### 5. Page Content Component (Async Data Fetching)

**File**: `src/app/(frontend)/[[...slug]]/_components/page-content.tsx`

```typescript
export async function PageContent({ slug, searchParams }) {
  // Fetch page data (this can stream progressively)
  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug || 'home' } },
    depth: 3,
    locale: detectedLocale,
  })
  
  return (
    <div className="container">
      <h1>{page.title}</h1>
      <PageContentRenderer content={page.content} />
    </div>
  )
}
```

**Key Points**:
- ✅ Async component for data fetching
- ✅ Streams data progressively
- ✅ Isolated from layout rendering

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│ Root Layout (Instant)                               │
│ - Theme Provider                                    │
│ - Global State                                      │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ Site Layout (Async - Layout Data)                   │
│ - Resolve Site from Domain                          │
│ - Fetch Layout Configuration                        │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ Layout Resolver (Instant after layout data)         │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Main Layout                                     │ │
│ │ ┌──────────────┐  ┌──────────────┐             │ │
│ │ │   Header     │  │   Sidebar    │             │ │
│ │ │  (Instant)   │  │  (Instant)   │             │ │
│ │ └──────────────┘  └──────────────┘             │ │
│ │                                                 │ │
│ │ ┌─────────────────────────────────────────────┐ │ │
│ │ │ Content Area                                │ │ │
│ │ │ ┌─────────────────────────────────────────┐ │ │ │
│ │ │ │ Suspense Boundary                       │ │ │ │
│ │ │ │ ┌─────────────────────────────────────┐ │ │ │ │
│ │ │ │ │ PageContent (Streaming)             │ │ │ │ │
│ │ │ │ │ - Fetch page data                   │ │ │ │ │
│ │ │ │ │ - Render blocks                     │ │ │ │ │
│ │ │ │ └─────────────────────────────────────┘ │ │ │ │
│ │ │ └─────────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────┘ │ │
│ │                                                 │ │
│ │ ┌──────────────────────────────────────────────┐ │ │
│ │ │   Footer                                     │ │ │
│ │ │  (Instant)                                   │ │ │
│ │ └──────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## Rendering Timeline

```
Time →

0ms     ├─ Root Layout Renders
        │
10ms    ├─ Site Layout Starts (async fetch layout config)
        │
50ms    ├─ Layout Data Available
        ├─ Header Renders ✓
        ├─ Sidebar Renders ✓
        ├─ Footer Renders ✓
        │
        ├─ Page Content Shows Loading State
        │
100ms   ├─ Page Data Starts Fetching
        │
200ms   ├─ Page Data Available
        ├─ Content Streams In ✓
        │
250ms   └─ Page Fully Rendered ✓
```

## Benefits

### 1. **Immediate Navigation Feedback**
- Users see Header and Sidebar instantly
- No blank screen while waiting for content
- Better perceived performance

### 2. **Progressive Content Loading**
- Content streams in as soon as available
- Users can start reading early content while rest loads
- Optimal for large pages with multiple sections

### 3. **Better User Experience**
- Clear loading indicators for content only
- Navigation remains accessible during loading
- Reduced layout shift (layout is stable)

### 4. **SEO Friendly**
- Layout structure is available immediately
- Content streams progressively
- Search engines can crawl navigation immediately

## Usage Examples

### Basic Page with Streaming Content

```typescript
// src/app/(frontend)/blog/[slug]/page.tsx
import { PageContentWrapper } from '@/components/loading/page-content-wrapper'
import { BlogContent } from './_components/blog-content'

export default async function BlogPage({ params }) {
  const { slug } = await params

  return (
    <PageContentWrapper loadingMessage="กำลังโหลดบทความ...">
      <BlogContent slug={slug} />
    </PageContentWrapper>
  )
}
```

### Custom Loading Fallback

```typescript
import { PageContentWrapper } from '@/components/loading/page-content-wrapper'
import { CustomSkeleton } from '@/components/loading/custom-skeleton'
import { Content } from './_components/content'

export default async function Page() {
  return (
    <PageContentWrapper fallback={<CustomSkeleton />}>
      <Content />
    </PageContentWrapper>
  )
}
```

### Multiple Suspense Boundaries

```typescript
import { Suspense } from 'react'
import { PageLoading } from '@/components/loading'
import { Header } from './_components/header'
import { MainContent } from './_components/main-content'
import { Sidebar } from './_components/sidebar'

export default function Page() {
  return (
    <div className="grid grid-cols-[1fr_300px] gap-4">
      {/* Main content with primary suspense */}
      <Suspense fallback={<PageLoading message="กำลังโหลดเนื้อหา..." />}>
        <MainContent />
      </Suspense>

      {/* Sidebar with separate suspense */}
      <Suspense fallback={<div>Loading sidebar...</div>}>
        <Sidebar />
      </Suspense>
    </div>
  )
}
```

## Best Practices

### ✅ Do

1. **Wrap async components in Suspense**
   ```typescript
   <Suspense fallback={<Loading />}>
     <AsyncComponent />
   </Suspense>
   ```

2. **Use meaningful loading messages**
   ```typescript
   <PageContentWrapper loadingMessage="กำลังโหลดบทความ..." />
   ```

3. **Place Suspense at the content level**
   - Keep layout outside Suspense
   - Wrap only content that needs streaming

4. **Provide visual feedback**
   - Use loading spinners
   - Show skeleton screens
   - Display progress indicators

### ❌ Don't

1. **Don't wrap entire layout in Suspense**
   ```typescript
   // ❌ Bad - Entire layout waits
   <Suspense>
     <Header />
     <Sidebar />
     <Content />
   </Suspense>
   ```

2. **Don't use too many Suspense boundaries**
   - Avoid suspense for every small component
   - Group related content under single boundary

3. **Don't forget loading states**
   - Always provide fallback UI
   - Make loading states visually clear

4. **Don't block navigation**
   - Keep navigation outside Suspense
   - Ensure users can navigate while content loads

## Migration from Previous Architecture

### Before (Single Suspense at Root)

```typescript
// Root layout
export default function Layout({ children }) {
  return (
    <Suspense fallback={<PageLoading />}>
      {children}
    </Suspense>
  )
}

// Page (all waits together)
export default async function Page() {
  const layout = await fetchLayout()
  const content = await fetchContent()
  
  return (
    <>
      <Header layout={layout} />
      <Sidebar layout={layout} />
      <Content data={content} />
    </>
  )
}
```

### After (Partial + Streaming)

```typescript
// Root layout (no Suspense)
export default function Layout({ children }) {
  return <>{children}</>
}

// Layout fetches its own data
export default async function SiteLayout({ children }) {
  const layout = await fetchLayout()
  
  return (
    <MainLayout layout={layout}>
      {children}
    </MainLayout>
  )
}

// Page wraps content only
export default async function Page() {
  return (
    <PageContentWrapper>
      <PageContent />
    </PageContentWrapper>
  )
}

// Content component
async function PageContent() {
  const content = await fetchContent()
  return <Content data={content} />
}
```

## Performance Considerations

### Time to First Byte (TTFB)
- **Layout**: Fast (minimal data fetching)
- **Content**: May vary (depends on content complexity)

### First Contentful Paint (FCP)
- ✅ Improved: Layout renders immediately
- 🎯 Target: < 100ms for layout, < 500ms for content

### Largest Contentful Paint (LCP)
- ✅ Improved: Content streams progressively
- 🎯 Target: < 2.5s

### Cumulative Layout Shift (CLS)
- ✅ Excellent: Layout is stable from the start
- 🎯 Target: < 0.1

## Troubleshooting

### Issue: Layout waits for content

**Solution**: Move Suspense boundary inside layout, not wrapping it

```typescript
// ❌ Wrong
<Suspense>
  <Layout>
    <Content />
  </Layout>
</Suspense>

// ✅ Correct
<Layout>
  <Suspense>
    <Content />
  </Suspense>
</Layout>
```

### Issue: Content doesn't stream

**Solution**: Ensure content component is async and wrapped in Suspense

```typescript
// ✅ Correct
<Suspense fallback={<Loading />}>
  <AsyncContentComponent />
</Suspense>
```

### Issue: Loading state not showing

**Solution**: Check that component is actually async and doing data fetching

```typescript
// ❌ This won't show loading (no async work)
function Content() {
  return <div>Static content</div>
}

// ✅ This will show loading (async work)
async function Content() {
  const data = await fetch('/api/content')
  return <div>{data}</div>
}
```

## Related Files

- `src/app/(frontend)/layout.tsx` - Root layout without Suspense
- `src/app/(frontend)/[[...slug]]/layout.tsx` - Site layout with async layout data
- `src/app/(frontend)/[[...slug]]/page.tsx` - Page with Suspense wrapper
- `src/app/(frontend)/[[...slug]]/_components/page-content.tsx` - Async content component
- `src/components/loading/page-content-wrapper.tsx` - Reusable Suspense wrapper
- `src/components/loading/page-loading.tsx` - Loading UI components
- `src/layouts/main/layout.tsx` - Main layout component
- `src/layouts/utils/layout-resolver.tsx` - Layout resolver with data fetching

## References

- [Next.js Suspense Documentation](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Streaming SSR](https://nextjs.org/docs/app/building-your-application/rendering/server-components#streaming)

