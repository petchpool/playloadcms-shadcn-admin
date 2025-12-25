'use client'

import { useSetAtom } from 'jotai'
import { openViewAtom, closeViewAtom, closeAllViewsAtom, type ViewConfig } from '@/store/view-atoms'

export function useView() {
  const openView = useSetAtom(openViewAtom)
  const closeView = useSetAtom(closeViewAtom)
  const closeAllViews = useSetAtom(closeAllViewsAtom)

  return {
    openView: (config: Omit<ViewConfig, 'id'>) => openView(config),
    closeView,
    closeAllViews,
  }
}

