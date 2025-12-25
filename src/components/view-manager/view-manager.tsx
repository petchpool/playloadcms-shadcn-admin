'use client'

import { useAtomValue } from 'jotai'
import { viewStackAtom } from '@/store/view-atoms'
import { ViewRenderer } from './view-renderer'

export function ViewManager() {
  const views = useAtomValue(viewStackAtom)

  return (
    <>
      {views.map((view) => (
        <ViewRenderer key={view.id} config={view} />
      ))}
    </>
  )
}

