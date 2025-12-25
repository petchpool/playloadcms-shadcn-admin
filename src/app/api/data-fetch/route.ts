import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Generic data fetch API endpoint
 * Supports fetching from collections, globals, or custom endpoints
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Source type: 'collection' | 'global'
    const sourceType = searchParams.get('sourceType') || 'collection'

    // Collection name or global slug
    const source = searchParams.get('source') || 'users'

    // Query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '0') // 0 = no limit
    const depth = parseInt(searchParams.get('depth') || '0')
    const sort = searchParams.get('sort') || '-createdAt'

    // Where clause (JSON string)
    const whereParam = searchParams.get('where')
    const where = whereParam ? JSON.parse(whereParam) : undefined

    // Select fields (comma-separated)
    const selectParam = searchParams.get('select')
    const select = selectParam
      ? selectParam.split(',').reduce(
          (acc, field) => {
            acc[field.trim()] = true
            return acc
          },
          {} as Record<string, boolean>,
        )
      : undefined

    const payload = await getPayload({ config })

    // Valid collections
    const validCollections = [
      'users',
      'media',
      'languages',
      'sites',
      'layouts',
      'pages',
      'blocks',
      'themes',
      'permissions',
      'roles',
    ]

    // Valid globals
    const validGlobals = ['settings']

    if (sourceType === 'collection') {
      if (!validCollections.includes(source)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid collection: ${source}`,
          },
          { status: 400 },
        )
      }

      // Fetch collection data
      const result = await payload.find({
        collection: source as any,
        where,
        limit: limit || 10000, // High limit if not specified
        page,
        sort,
        depth,
        select,
        overrideAccess: true,
      })

      return NextResponse.json({
        success: true,
        data: result.docs,
        docs: result.docs,
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
        limit: result.limit,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      })
    } else if (sourceType === 'global') {
      if (!validGlobals.includes(source)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid global: ${source}`,
          },
          { status: 400 },
        )
      }

      // Fetch global data
      const result = await payload.findGlobal({
        slug: source as any,
        depth,
      })

      return NextResponse.json({
        success: true,
        data: result,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: `Invalid source type: ${sourceType}`,
      },
      { status: 400 },
    )
  } catch (error: any) {
    console.error('Error fetching data:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch data',
      },
      { status: 500 },
    )
  }
}

/**
 * POST endpoint for batch fetching multiple data sources
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { queries } = body as {
      queries: Array<{
        key: string
        sourceType: 'collection' | 'global'
        source: string
        where?: Record<string, any>
        sort?: string
        limit?: number
        depth?: number
        select?: string[]
      }>
    }

    if (!queries || !Array.isArray(queries)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body. Expected { queries: [...] }',
        },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    // Group queries by source to optimize fetching
    const groupedQueries = queries.reduce(
      (acc, query) => {
        const key = `${query.sourceType}:${query.source}`
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(query)
        return acc
      },
      {} as Record<string, typeof queries>,
    )

    const results: Record<string, any> = {}

    // Fetch each group
    await Promise.all(
      Object.entries(groupedQueries).map(async ([groupKey, groupQueries]) => {
        const [sourceType, source] = groupKey.split(':')

        if (sourceType === 'collection') {
          // For collection queries, we might be able to optimize
          // by fetching once and filtering/transforming client-side
          // But for simplicity, we'll fetch per query for now

          await Promise.all(
            groupQueries.map(async (query) => {
              const result = await payload.find({
                collection: source as any,
                where: query.where,
                limit: query.limit || 10000,
                sort: query.sort || '-createdAt',
                depth: query.depth || 0,
                select: query.select?.reduce(
                  (acc, field) => {
                    acc[field] = true
                    return acc
                  },
                  {} as Record<string, boolean>,
                ),
                overrideAccess: true,
              })

              results[query.key] = {
                success: true,
                data: result.docs,
                docs: result.docs,
                totalDocs: result.totalDocs,
              }
            }),
          )
        } else if (sourceType === 'global') {
          await Promise.all(
            groupQueries.map(async (query) => {
              const result = await payload.findGlobal({
                slug: source as any,
                depth: query.depth || 0,
              })

              results[query.key] = {
                success: true,
                data: result,
              }
            }),
          )
        }
      }),
    )

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error: any) {
    console.error('Error batch fetching data:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to batch fetch data',
      },
      { status: 500 },
    )
  }
}
