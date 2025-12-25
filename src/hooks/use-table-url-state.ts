'use client'

import { useCallback, useMemo, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import qs from 'qs'

export interface TableUrlState {
  /** Current page number */
  page?: number
  /** Items per page */
  limit?: number
  /** Sort field */
  sortBy?: string
  /** Sort order */
  sortOrder?: 'asc' | 'desc'
  /** Global search query */
  search?: string
  /** Active status tab */
  statusTab?: string
  /** Multi-select filters (e.g., { status: ['active', 'inactive'], type: ['block'] }) */
  filters?: Record<string, string[]>
  /** Date range filter */
  dateRange?: {
    from?: string
    to?: string
  }
  /** Column visibility state (e.g., { name: true, status: false }) */
  columnVisibility?: Record<string, boolean>
}

export interface UseTableUrlStateOptions {
  /** Default values */
  defaults?: Partial<TableUrlState>
  /** Whether to sync with URL (default: true) */
  syncUrl?: boolean
  /** Debounce delay for URL updates in ms (default: 300) */
  debounceMs?: number
  /**
   * Group/namespace for this table's URL params.
   * Use this when you have multiple tables on the same page.
   *
   * @example
   * // Single table (no group)
   * // URL: ?page=1&limit=10&filters[status][]=active
   *
   * // Multiple tables with groups
   * // Table 1: group="users"
   * // Table 2: group="orders"
   * // URL: ?users[page]=1&users[filters][status][]=active&orders[page]=2&orders[limit]=25
   */
  group?: string
}

export interface UseTableUrlStateReturn {
  /** Current state from URL */
  state: TableUrlState
  /** Set entire state */
  setState: (state: Partial<TableUrlState>) => void
  /** Update specific fields (debounced) */
  updateState: (updates: Partial<TableUrlState>) => void
  /** Update specific fields immediately (no debounce) */
  updateStateImmediate: (updates: Partial<TableUrlState>) => void
  /** Reset to defaults */
  resetState: () => void
  /** Get URL string for current state */
  getUrl: () => string
  /** Parse URL search params to state */
  parseUrl: (search: string) => TableUrlState
  /** The group name being used */
  group: string | undefined
}

/**
 * Hook to sync table state with browser URL query string
 * Supports multiple tables on the same page using the `group` option.
 *
 * @example Single table (default)
 * ```tsx
 * const { state, updateState } = useTableUrlState({
 *   defaults: { page: 1, limit: 10 }
 * })
 * // URL: ?page=2&filters[status][]=active
 * ```
 *
 * @example Multiple tables with groups
 * ```tsx
 * // Users table
 * const usersTable = useTableUrlState({
 *   group: 'users',
 *   defaults: { page: 1, limit: 10 }
 * })
 *
 * // Orders table
 * const ordersTable = useTableUrlState({
 *   group: 'orders',
 *   defaults: { page: 1, limit: 25 }
 * })
 *
 * // URL: ?users[page]=2&users[filters][status][]=active&orders[page]=1&orders[limit]=25
 * ```
 */
export function useTableUrlState(options: UseTableUrlStateOptions = {}): UseTableUrlStateReturn {
  const { defaults = {}, syncUrl = true, debounceMs = 300, group } = options

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Parse URL search params to state (for this table's group only)
  const parseUrl = useCallback(
    (search: string): TableUrlState => {
      if (!search) return { ...defaults }

      const parsed = qs.parse(search, {
        ignoreQueryPrefix: true,
      }) as Record<string, any>

      // If group is specified, get the nested object for this group
      const tableParams = group ? (parsed[group] as Record<string, any>) || {} : parsed

      // Helper to parse number values
      const parseNumber = (val: any): number | undefined => {
        if (val === undefined || val === null) return undefined
        const num = Number(val)
        return isNaN(num) ? undefined : num
      }

      // Helper to parse string array
      const parseStringArray = (val: any): string[] | undefined => {
        if (!val) return undefined
        if (Array.isArray(val)) return val.map(String)
        return [String(val)]
      }

      const state: TableUrlState = {}

      // Parse simple values
      const page = parseNumber(tableParams.page)
      if (page !== undefined) state.page = page

      const limit = parseNumber(tableParams.limit)
      if (limit !== undefined) state.limit = limit

      if (tableParams.sortBy) {
        state.sortBy = String(tableParams.sortBy)
      }
      if (tableParams.sortOrder) {
        state.sortOrder = tableParams.sortOrder as 'asc' | 'desc'
      }
      if (tableParams.search) {
        state.search = String(tableParams.search)
      }
      if (tableParams.statusTab) {
        state.statusTab = String(tableParams.statusTab)
      }

      // Parse filters
      if (tableParams.filters && typeof tableParams.filters === 'object') {
        const filters: Record<string, string[]> = {}
        const filtersObj = tableParams.filters as Record<string, any>
        Object.entries(filtersObj).forEach(([key, val]) => {
          const arr = parseStringArray(val)
          if (arr) filters[key] = arr
        })
        if (Object.keys(filters).length > 0) {
          state.filters = filters
        }
      }

      // Parse date range
      if (tableParams.dateRange && typeof tableParams.dateRange === 'object') {
        const dr = tableParams.dateRange as { from?: string; to?: string }
        state.dateRange = {
          from: dr.from ? String(dr.from) : undefined,
          to: dr.to ? String(dr.to) : undefined,
        }
      }

      // Parse column visibility
      if (tableParams.cols && typeof tableParams.cols === 'object') {
        const visibility: Record<string, boolean> = {}
        const visObj = tableParams.cols as Record<string, any>
        Object.entries(visObj).forEach(([key, val]) => {
          visibility[key] = val === 'true' || val === true || val === '1'
        })
        if (Object.keys(visibility).length > 0) {
          state.columnVisibility = visibility
        }
      }

      return { ...defaults, ...state }
    },
    [defaults, group],
  )

  // Get current state from URL
  const state = useMemo(() => {
    return parseUrl(searchParams.toString())
  }, [searchParams, parseUrl])

  // Convert state to params object (without group wrapper)
  const stateToParams = useCallback(
    (newState: TableUrlState): Record<string, any> => {
      const params: Record<string, any> = {}

      // Only include non-default values
      if (newState.page && newState.page !== defaults.page && newState.page !== 1) {
        params.page = newState.page
      }
      if (newState.limit && newState.limit !== defaults.limit) {
        params.limit = newState.limit
      }
      if (newState.sortBy && newState.sortBy !== defaults.sortBy) {
        params.sortBy = newState.sortBy
      }
      if (newState.sortOrder && newState.sortOrder !== defaults.sortOrder) {
        params.sortOrder = newState.sortOrder
      }
      if (newState.search) {
        params.search = newState.search
      }
      if (newState.statusTab && newState.statusTab !== 'all') {
        params.statusTab = newState.statusTab
      }

      // Filters - only include if there are selected values
      if (newState.filters) {
        const activeFilters: Record<string, string[]> = {}
        Object.entries(newState.filters).forEach(([key, values]) => {
          if (values && values.length > 0) {
            activeFilters[key] = values
          }
        })
        if (Object.keys(activeFilters).length > 0) {
          params.filters = activeFilters
        }
      }

      // Date range
      if (newState.dateRange?.from || newState.dateRange?.to) {
        params.dateRange = {
          ...(newState.dateRange.from && { from: newState.dateRange.from }),
          ...(newState.dateRange.to && { to: newState.dateRange.to }),
        }
      }

      // Column visibility - only include hidden columns (false values)
      if (newState.columnVisibility) {
        const hiddenCols: Record<string, boolean> = {}
        Object.entries(newState.columnVisibility).forEach(([key, visible]) => {
          if (!visible) {
            hiddenCols[key] = false
          }
        })
        if (Object.keys(hiddenCols).length > 0) {
          params.cols = hiddenCols
        }
      }

      return params
    },
    [defaults],
  )

  // Merge this table's state with other tables' states and convert to URL string
  const stateToUrl = useCallback(
    (newState: TableUrlState, currentSearch: string): string => {
      // Parse current URL to preserve other tables' params
      const currentParams = qs.parse(currentSearch, {
        ignoreQueryPrefix: true,
      }) as Record<string, any>

      // Get this table's params
      const tableParams = stateToParams(newState)

      let finalParams: Record<string, any>

      if (group) {
        // With group: merge under the group key, preserve other groups
        if (Object.keys(tableParams).length > 0) {
          finalParams = { ...currentParams, [group]: tableParams }
        } else {
          // Remove this group's params if empty
          const { [group]: _, ...rest } = currentParams
          finalParams = rest
        }
      } else {
        // Without group: merge at root level, but be careful not to overwrite other groups
        // Extract all grouped params (objects that look like table state groups)
        const groupedParams: Record<string, any> = {}
        const nonGroupedKeys = ['page', 'limit', 'sortBy', 'sortOrder', 'search', 'statusTab', 'filters', 'dateRange', 'cols']

        Object.entries(currentParams).forEach(([key, value]) => {
          if (!nonGroupedKeys.includes(key) && typeof value === 'object' && value !== null) {
            // This might be another table's group
            groupedParams[key] = value
          }
        })

        finalParams = { ...groupedParams, ...tableParams }
      }

      return qs.stringify(finalParams, {
        arrayFormat: 'brackets',
        encode: false,
        skipNulls: true,
      })
    },
    [group, stateToParams],
  )

  // Get full URL for current state
  const getUrl = useCallback(() => {
    const queryString = stateToUrl(state, searchParams.toString())
    return queryString ? `${pathname}?${queryString}` : pathname
  }, [state, stateToUrl, pathname, searchParams])

  // Update URL with new state
  const updateUrl = useCallback(
    (newState: TableUrlState) => {
      if (!syncUrl) return

      const queryString = stateToUrl(newState, searchParams.toString())
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname

      // Use replace to avoid creating history entries for every change
      router.replace(newUrl, { scroll: false })
    },
    [syncUrl, stateToUrl, pathname, router, searchParams],
  )

  // Debounced URL update
  const debouncedUpdateUrl = useCallback(
    (newState: TableUrlState) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        updateUrl(newState)
      }, debounceMs)
    },
    [updateUrl, debounceMs],
  )

  // Set entire state
  const setState = useCallback(
    (newState: Partial<TableUrlState>) => {
      const mergedState = { ...defaults, ...newState }
      debouncedUpdateUrl(mergedState)
    },
    [defaults, debouncedUpdateUrl],
  )

  // Update specific fields (debounced)
  const updateState = useCallback(
    (updates: Partial<TableUrlState>) => {
      const mergedState = { ...state, ...updates }

      // Special handling for filters - merge instead of replace
      if (updates.filters) {
        mergedState.filters = {
          ...state.filters,
          ...updates.filters,
        }
      }

      debouncedUpdateUrl(mergedState)
    },
    [state, debouncedUpdateUrl],
  )

  // Update specific fields immediately (no debounce)
  const updateStateImmediate = useCallback(
    (updates: Partial<TableUrlState>) => {
      const mergedState = { ...state, ...updates }

      // Special handling for filters - merge instead of replace
      if (updates.filters) {
        mergedState.filters = {
          ...state.filters,
          ...updates.filters,
        }
      }

      // Update URL immediately without debounce
      updateUrl(mergedState)
    },
    [state, updateUrl],
  )

  // Reset to defaults (only for this table's group)
  const resetState = useCallback(() => {
    if (!syncUrl) return

    if (group) {
      // Remove only this group's params
      const currentParams = qs.parse(searchParams.toString(), {
        ignoreQueryPrefix: true,
      }) as Record<string, any>

      const { [group]: _, ...rest } = currentParams
      const newQueryString = qs.stringify(rest, {
        arrayFormat: 'brackets',
        encode: false,
        skipNulls: true,
      })

      const newUrl = newQueryString ? `${pathname}?${newQueryString}` : pathname
      router.replace(newUrl, { scroll: false })
    } else {
      // Without group, clear all table-related params
      router.replace(pathname, { scroll: false })
    }
  }, [syncUrl, group, router, pathname, searchParams])

  return {
    state,
    setState,
    updateState,
    updateStateImmediate,
    resetState,
    getUrl,
    parseUrl,
    group,
  }
}

/**
 * Helper to convert Set to array for URL state
 */
export function setToArray(set: Set<string>): string[] {
  return Array.from(set)
}

/**
 * Helper to convert array to Set for component state
 */
export function arrayToSet(arr: string[] | undefined): Set<string> {
  return new Set(arr || [])
}

/**
 * Helper to format date for URL
 */
export function formatDateForUrl(date: Date | undefined): string | undefined {
  if (!date) return undefined
  return date.toISOString()
}

/**
 * Helper to parse date from URL
 */
export function parseDateFromUrl(dateStr: string | undefined): Date | undefined {
  if (!dateStr) return undefined
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? undefined : date
}
