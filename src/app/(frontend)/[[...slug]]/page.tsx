import { Suspense } from 'react'
import { PageContent } from './_components/page-content'
import { PageLoading } from '@/components/loading/page-loading'

/**
 * Page component with Suspense boundary for content streaming
 * 
 * Architecture:
 * - template.tsx: Prevents layout re-render on navigation (no flicker)
 * - loading.tsx: Shows loading state for content only (layout stays visible)
 * - Suspense: Provides fallback during async content loading
 * 
 * Layout (Header + Sidebar) renders immediately and stays stable
 * Only page content uses Suspense streaming with loading state
 */
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  return (
    <Suspense fallback={<PageLoading message="กำลังโหลดเนื้อหา..." />}>
      <PageContent slug={resolvedParams.slug} searchParams={resolvedSearchParams} />
    </Suspense>
  )
}
