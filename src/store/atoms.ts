import { atom } from 'jotai'

// --- UI State Atoms ---

// Active step in a multi-step workflow or wizard
export const activeStepAtom = atom<number>(1)

// Loading state for global actions
export const isLoadingAtom = atom<boolean>(false)

// UI Feedback atom (can be used to show transient messages across blocks)
export const uiFeedbackAtom = atom<{
  type: 'success' | 'error' | 'info'
  message: string
} | null>(null)

// --- Cross-Block Communication Atoms ---

// Shared Data Atom
// Use this to pass data between loose coupled blocks.
// e.g., A "User List" block sets this, and a "User Details" block reads it.
export const selectedEntityAtom = atom<{
  type: string // e.g., 'user', 'order'
  id: string
  data: any
} | null>(null)

// --- Multi-Tenant Context Atoms ---

// Tenant Context
// This should be hydrated from the server-side layout or page wrapper.
export const tenantContextAtom = atom<{
  id: string
  name: string
  theme?: any
  features?: string[]
} | null>(null)
