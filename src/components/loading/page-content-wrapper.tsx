import { Suspense } from 'react'
import { PageLoading } from './page-loading'

export type PageContentWrapperProps = {
  children: React.ReactNode
  fallback?: React.ReactNode
  loadingMessage?: string
}

/**
 * Wrapper component that adds Suspense boundary for page content only
 * This allows Header and Sidebar to render immediately while content streams in
 */
export function PageContentWrapper({
  children,
  fallback,
  loadingMessage = 'กำลังโหลดเนื้อหา...',
}: PageContentWrapperProps) {
  return (
    <Suspense fallback={fallback || <PageLoading message={loadingMessage} />}>
      {children}
    </Suspense>
  )
}

