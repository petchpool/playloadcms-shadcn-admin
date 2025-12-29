'use client'

import { createContext, useContext, type ReactNode } from 'react'

/**
 * Data structure for each fetched data source
 */
export type FetchedData = {
  /** Raw fetched data */
  data: any
  /** Loading state */
  loading: boolean
  /** Error message if any */
  error?: string
  /** Total document count (for collections) */
  count?: number
  /** Sum value (when transform is 'sum') */
  sum?: number
  /** Average value (when transform is 'average') */
  average?: number
  /** Document array */
  docs?: any[]
  /** Transformed value (for count/sum/average) */
  value?: number
  /** Raw response */
  raw?: any
  /** Stats data from useCollectionStats */
  stats?: any
  total?: number
  collection?: string
  groupBy?: string
}

/**
 * Data context value - key-value map of fetched data
 */
export type DataContextValue = {
  [key: string]: FetchedData
}

const DataContext = createContext<DataContextValue>({})

/**
 * Data Provider component
 */
export function DataProvider({
  value,
  children,
}: {
  value: DataContextValue
  children: ReactNode
}) {
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

/**
 * Hook to access all data in context
 */
export function useData(): DataContextValue {
  return useContext(DataContext)
}

/**
 * Hook to get specific data by key
 * @param key - The dataKey to look up
 * @returns FetchedData object or default loading state
 */
export function useDataByKey(key: string): FetchedData {
  const data = useData()
  return (
    data[key] || {
      data: null,
      loading: true,
      error: undefined,
    }
  )
}

/**
 * Helper to get nested value from object using dot notation path
 * @example getValueByPath({ user: { name: 'John' } }, 'user.name') => 'John'
 */
export function getValueByPath(obj: any, path: string): any {
  if (!path) return obj
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

/**
 * Transform types available for data fetching
 */
export type TransformType = 'none' | 'count' | 'sum' | 'average' | 'first' | 'last' | 'groupBy'

/**
 * Apply transform to fetched data
 */
export function applyTransform(data: any, transform: { type: TransformType; field?: string }): any {
  const docs = data?.docs || (Array.isArray(data) ? data : [])
  const totalDocs = data?.totalDocs

  switch (transform.type) {
    case 'count':
      return {
        value: totalDocs ?? docs.length,
        count: totalDocs ?? docs.length,
        docs,
      }

    case 'sum': {
      const sum = docs.reduce(
        (acc: number, doc: any) => acc + (Number(getValueByPath(doc, transform.field!)) || 0),
        0,
      )
      return { value: sum, sum, docs }
    }

    case 'average': {
      const sum = docs.reduce(
        (acc: number, doc: any) => acc + (Number(getValueByPath(doc, transform.field!)) || 0),
        0,
      )
      const avg = docs.length ? sum / docs.length : 0
      return { value: avg, average: avg, docs }
    }

    case 'first':
      return {
        value: docs[0] || null,
        data: docs[0] || null,
        docs,
      }

    case 'last':
      return {
        value: docs[docs.length - 1] || null,
        data: docs[docs.length - 1] || null,
        docs,
      }

    case 'groupBy': {
      const grouped = docs.reduce((acc: any, doc: any) => {
        const key = getValueByPath(doc, transform.field!) ?? 'undefined'
        acc[key] = acc[key] || []
        acc[key].push(doc)
        return acc
      }, {})
      return { value: grouped, grouped, docs }
    }

    case 'none':
    default:
      return {
        value: data,
        data,
        docs,
        count: totalDocs ?? docs.length,
      }
  }
}
