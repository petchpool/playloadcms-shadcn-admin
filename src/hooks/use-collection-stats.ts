'use client'

import { useState, useEffect, useMemo, useRef } from 'react'

export type CollectionStats = {
  stats: Record<string, number>
  total: number
  collection: string
  groupBy: string
}

export type UseCollectionStatsOptions = {
  collection: string
  groupBy: string
  values?: string[]
  enabled?: boolean
}

export function useCollectionStats({
  collection,
  groupBy,
  values,
  enabled = true,
}: UseCollectionStatsOptions) {
  const [data, setData] = useState<CollectionStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Normalize values array to prevent unnecessary re-fetches
  // Use sorted string comparison to detect actual changes
  const valuesKey = useMemo(() => {
    if (!values || values.length === 0) return ''
    return [...values].sort().join(',')
  }, [values])

  useEffect(() => {
    if (!enabled || !collection || !groupBy) {
      return
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new AbortController for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    const fetchStats = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          collection,
          groupBy,
        })

        if (valuesKey) {
          params.set('values', valuesKey)
        }

        const response = await fetch(`/api/stats?${params.toString()}`, {
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.statusText}`)
        }

        const result = await response.json()

        // Only update state if request wasn't aborted
        if (!abortController.signal.aborted) {
          setData(result)
        }
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        // Only update loading state if request wasn't aborted
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchStats()

    // Cleanup: abort request on unmount or dependency change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [collection, groupBy, valuesKey, enabled])

  return { data, isLoading, error, refetch: () => {} }
}
