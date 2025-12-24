import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const collection = searchParams.get('collection') || 'components'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const searchFields = searchParams.get('searchFields') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const depth = parseInt(searchParams.get('depth') || '0')
    const selectFields = searchParams.get('select') || '' // Fields to select (comma-separated)
    const populateFields = searchParams.get('populate') || '' // Fields to populate (comma-separated)
    
    // Parse filters from query params (format: filter[fieldName]=value)
    const filters: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      if (key.startsWith('filter[') && key.endsWith(']')) {
        const fieldName = key.slice(7, -1) // Extract field name from filter[fieldName]
        filters[fieldName] = value
      }
    })

    const payload = await getPayload({ config })

    // Validate collection exists
    const validCollections = [
      'users',
      'media',
      'languages',
      'sites',
      'layouts',
      'pages',
      'components',
      'permissions',
      'roles',
    ]

    if (!validCollections.includes(collection)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid collection: ${collection}`,
        },
        { status: 400 },
      )
    }

    // Build where clause
    const where: any = {
      and: [],
    }

    // Search filter
    if (search) {
      const searchFieldsArray = searchFields
        ? searchFields.split(',').map((f) => f.trim())
        : []

      // Default search fields based on collection
      const defaultSearchFields: Record<string, string[]> = {
        components: ['name', 'slug', 'description'],
        pages: ['title', 'slug'],
        layouts: ['name', 'slug', 'description'],
        sites: ['name', 'domain'],
        users: ['email', 'firstName', 'lastName'],
        media: ['alt', 'filename'],
        languages: ['name', 'code', 'nativeName'],
        permissions: ['name', 'slug', 'description'],
        roles: ['name', 'slug', 'description'],
      }

      const fieldsToSearch =
        searchFieldsArray.length > 0
          ? searchFieldsArray
          : defaultSearchFields[collection] || ['name', 'slug']

      if (fieldsToSearch.length > 0) {
        where.and.push({
          or: fieldsToSearch.map((field) => ({
            [field]: {
              contains: search,
            },
          })),
        })
      }
    }

    // Dynamic filters
    Object.entries(filters).forEach(([fieldName, value]) => {
      if (value && value !== 'all') {
        where.and.push({
          [fieldName]: {
            equals: value,
          },
        })
      }
    })

    // Handle _status for pages collection (draft/published)
    if (collection === 'pages' && !filters._status) {
      where.and.push({
        _status: {
          equals: 'published',
        },
      })
    }

    // If no filters, remove and array
    if (where.and.length === 0) {
      delete where.and
    }

    // Build sort
    const sort = `${sortOrder === 'desc' ? '-' : ''}${sortBy}`

    // Build select object if specified
    let select: Record<string, boolean> | undefined
    if (selectFields) {
      select = {}
      selectFields.split(',').forEach((field) => {
        const trimmedField = field.trim()
        if (trimmedField) {
          select![trimmedField] = true
        }
      })
    }

    // Build populate object if specified
    let populateConfig: Record<string, any> | undefined
    if (populateFields) {
      populateConfig = {}
      populateFields.split(',').forEach((field) => {
        const trimmedField = field.trim()
        if (trimmedField) {
          // Support nested populate: "author.avatar" becomes { author: { avatar: true } }
          const parts = trimmedField.split('.')
          let current = populateConfig!
          parts.forEach((part, index) => {
            if (index === parts.length - 1) {
              current[part] = true
            } else {
              current[part] = current[part] || {}
              current = current[part]
            }
          })
        }
      })
    }

    // Fetch data
    const result = await payload.find({
      collection: collection as any,
      where: Object.keys(where).length > 0 ? where : undefined,
      limit,
      page,
      sort,
      depth: populateConfig ? Math.max(depth, 1) : depth, // Ensure depth >= 1 if populating
      select,
      overrideAccess: true, // Override access control for API endpoint
    })

    console.log(`API Table Data - Collection: ${collection}, Found: ${result.totalDocs} items`)
    console.log(`API Table Data - Page: ${result.page} of ${result.totalPages}`)

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
    console.error('Error fetching table data:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch table data',
      },
      { status: 500 },
    )
  }
}

