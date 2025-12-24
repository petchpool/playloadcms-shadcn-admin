import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const payload = await getPayload({ config })

    // Build where clause
    const where: any = {
      and: [],
    }

    // Search filter
    if (search) {
      where.and.push({
        or: [
          {
            name: {
              contains: search,
            },
          },
          {
            slug: {
              contains: search,
            },
          },
          {
            description: {
              contains: search,
            },
          },
        ],
      })
    }

    // Type filter
    if (type) {
      where.and.push({
        type: {
          equals: type,
        },
      })
    }

    // Category filter
    if (category) {
      where.and.push({
        category: {
          equals: category,
        },
      })
    }

    // Status filter
    if (status) {
      where.and.push({
        status: {
          equals: status,
        },
      })
    }

    // If no filters, remove and array
    if (where.and.length === 0) {
      delete where.and
    }

    // Build sort
    const sort = `${sortOrder === 'desc' ? '-' : ''}${sortBy}`

    // Fetch components (override access control for API endpoint)
    const result = await payload.find({
      collection: 'components',
      where: Object.keys(where).length > 0 ? where : undefined,
      limit,
      page,
      sort,
      depth: 0,
      overrideAccess: true, // Override access control for API endpoint
    })

    console.log('API Blocks - Found:', result.totalDocs, 'components')
    console.log('API Blocks - Page:', result.page, 'of', result.totalPages)

    return NextResponse.json({
      success: true,
      data: result.docs,
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    })
  } catch (error: any) {
    console.error('Error fetching blocks:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch blocks',
      },
      { status: 500 },
    )
  }
}
