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

    const stats: Record<string, number> = {}
    let total = 0

    if (specificValues && specificValues.length > 0) {
      // Count specific values only
      for (const value of specificValues) {
        const result = await payload.count({
          collection: collection as any,
          where: {
            [groupBy]: {
              equals: value,
            },
          },
        })
        stats[value] = result.totalDocs
        total += result.totalDocs
      }
    } else {
      // Count all unique values
      // First, get all unique values for the field
      const allDocs = await payload.find({
        collection: collection as any,
        limit: 0, // Get all documents
        depth: 0,
      })

      // Group and count
      const valueCount = new Map<string, number>()
      
      allDocs.docs.forEach((doc: any) => {
        const value = doc[groupBy]
        if (value !== undefined && value !== null) {
          const key = String(value)
          valueCount.set(key, (valueCount.get(key) || 0) + 1)
        }
      })

      // Convert Map to object
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
      { error: 'Failed to fetch statistics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}

