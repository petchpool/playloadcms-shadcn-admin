import { PageContentWrapper } from '@/components/loading/page-content-wrapper'
import { PageContent } from './_components/page-content'

/**
 * Page component with Suspense boundary for content streaming
 * Layout (Header + Sidebar) renders immediately without loading state
 * Only page content uses Suspense streaming
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
    <PageContentWrapper loadingMessage="กำลังโหลดเนื้อหา...">
      <PageContent slug={resolvedParams.slug} searchParams={resolvedSearchParams} />
    </PageContentWrapper>
  )
}
