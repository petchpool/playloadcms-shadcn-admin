import { PageLoading } from '@/components/loading/page-loading'

/**
 * Loading UI for page content only
 * 
 * This loading.tsx file:
 * - Shows loading state ONLY for page content (not layout)
 * - Layout (Header + Sidebar) remains visible and stable
 * - Works with template.tsx to prevent layout flicker
 * - Displays animated loading indicator during navigation
 */
export default function Loading() {
  return <PageLoading message="กำลังโหลดเนื้อหา..." />
}

