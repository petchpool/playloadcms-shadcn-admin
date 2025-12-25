import { atom } from 'jotai'

export type ViewType = 'page' | 'dialog' | 'sidebar-left' | 'sidebar-right'
export type ViewMode = 'overlay' | 'push'

export interface ViewConfig {
  id: string
  type: ViewType
  mode?: ViewMode // For sidebar: 'overlay' | 'push'
  component: React.ComponentType<any>
  props?: Record<string, any>
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  isOpen?: boolean // Track open state for smooth animations
}

// Stack of open views (allows multiple concurrent views)
export const viewStackAtom = atom<ViewConfig[]>([])

// Actions
export const openViewAtom = atom(
  null,
  (get, set, config: Omit<ViewConfig, 'id' | 'isOpen'>) => {
    const id = Math.random().toString(36).substring(7)
    const views = get(viewStackAtom)
    set(viewStackAtom, [...views, { ...config, id, isOpen: true }])
    return id
  },
)

export const closeViewAtom = atom(null, (get, set, id: string) => {
  const views = get(viewStackAtom)
  // First set isOpen to false to trigger closing animation
  const updatedViews = views.map((v) => (v.id === id ? { ...v, isOpen: false } : v))
  set(viewStackAtom, updatedViews)

  // After animation duration, remove from stack
  setTimeout(() => {
    const currentViews = get(viewStackAtom)
    set(
      viewStackAtom,
      currentViews.filter((v) => v.id !== id),
    )
  }, 300) // Match animation duration
})

export const closeAllViewsAtom = atom(null, (get, set) => {
  const views = get(viewStackAtom)
  // Set all to closing
  const closingViews = views.map((v) => ({ ...v, isOpen: false }))
  set(viewStackAtom, closingViews)

  // Clear after animation
  setTimeout(() => {
    set(viewStackAtom, [])
  }, 300)
})

