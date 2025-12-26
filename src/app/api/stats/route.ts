import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

// MIGRATED: Removed export const dynamic = 'force-dynamic' (incompatible with Cache Components)
// Route handlers are dynamic by default with Cache Components - no need to specify

/**
 * API Route: Fetch Count Statistics
 *
 * Usage:
 * GET /api/stats?collection=users&groupBy=status
 * GET /api/stats?collection=users&groupBy=status&values=active,inactive
 *
 * Response:
 * {
 *   "stats": {
 *     "active": 15,
 *     "inactive": 5,
 *     "pending": 3
 *   },
 *   "total": 23
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const collection = searchParams.get('collection')
    const groupBy = searchParams.get('groupBy')
    const valuesParam = searchParams.get('values')

    // Validation
    if (!collection) {
      return NextResponse.json({ error: 'Collection parameter is required' }, { status: 400 })
    }

    if (!groupBy) {
      return NextResponse.json({ error: 'groupBy parameter is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Parse specific values to count (optional)
    const specificValues = valuesParam ? valuesParam.split(',').map((v) => v.trim()) : null

    // Fetch all documents and group in memory
    // This approach works with all fields including virtual/computed fields
    // and avoids query errors for non-queryable fields
    const allDocs = await payload.find({
      collection: collection as any,
      limit: 0, // Get all documents
      depth: 0,
    })

    const stats: Record<string, number> = {}
    let total = 0

    // Group and count documents by the specified field
    const valueCount = new Map<string, number>()

    allDocs.docs.forEach((doc: any) => {
      // Handle nested fields (e.g., "seo.metaTitle")
      const fieldPath = groupBy.split('.')
      let value: any = doc

      for (const segment of fieldPath) {
        if (value && typeof value === 'object' && segment in value) {
          value = value[segment]
        } else {
          value = undefined
          break
        }
      }

      // Handle array values (e.g., roles array)
      if (Array.isArray(value)) {
        value.forEach((item) => {
          const key = String(item)
          valueCount.set(key, (valueCount.get(key) || 0) + 1)
        })
      } else if (value !== undefined && value !== null) {
        const key = String(value)
        valueCount.set(key, (valueCount.get(key) || 0) + 1)
      }
    })

    // Filter by specific values if provided
    if (specificValues && specificValues.length > 0) {
      specificValues.forEach((value) => {
        const count = valueCount.get(value) || 0
        stats[value] = count
        total += count
      })
    } else {
      // Include all values
      valueCount.forEach((count, value) => {
        stats[value] = count
        total += count
      })
    }

    return NextResponse.json({
      stats,
      total,
      collection,
      groupBy,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch statistics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
