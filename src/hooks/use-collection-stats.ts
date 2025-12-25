'use client'

import { useState, useEffect } from 'react'

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

  useEffect(() => {
    if (!enabled || !collection || !groupBy) {
      return
    }

    const fetchStats = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          collection,
          groupBy,
        })

        if (values && values.length > 0) {
          params.set('values', values.join(','))
        }

        const response = await fetch(`/api/stats?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.statusText}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [collection, groupBy, values, enabled])

  return { data, isLoading, error, refetch: () => {} }
}

