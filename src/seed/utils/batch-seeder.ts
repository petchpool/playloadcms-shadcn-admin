import type { Payload, CollectionSlug } from 'payload'

interface SeedOptions<T = any> {
  collection: CollectionSlug
  data: T[]
  uniqueField: string | ((item: T) => any) // Field to check for duplicates
  updateExisting?: boolean // Whether to update existing records
  batchSize?: number // Number of items to process in parallel
  transform?: (item: T, existing?: any) => any // Transform data before create/update
}

interface SeedResult<T = any> {
  created: T[]
  updated: T[]
  skipped: T[]
  errors: Array<{ item: any; error: any }>
}

/**
 * Batch seed collection with parallel operations
 */
export async function batchSeed<T = any>(
  payload: Payload,
  options: SeedOptions<T>,
): Promise<SeedResult<T>> {
  const {
    collection,
    data,
    uniqueField,
    updateExisting = false,
    batchSize = 10,
    transform,
  } = options

  const result: SeedResult<T> = {
    created: [],
    updated: [],
    skipped: [],
    errors: [],
  }

  if (data.length === 0) {
    return result
  }

  console.log(`\n📦 Batch seeding ${data.length} items for collection "${collection}"...`)

  try {
    // Step 1: Build WHERE clause to find all existing items in one query
    const whereField = typeof uniqueField === 'string' ? uniqueField : 'slug'
    const uniqueValues =
      typeof uniqueField === 'string'
        ? data.map((item: any) => item[uniqueField])
        : data.map((item) => uniqueField(item))

    // Find all existing items in one query
    const existingItems = await payload.find({
      collection,
      where: {
        [whereField]: {
          in: uniqueValues,
        },
      },
      limit: uniqueValues.length,
      overrideAccess: true,
    })

    // Create a Map for quick lookup
    const existingMap = new Map(
      existingItems.docs.map((doc: any) => [
        typeof uniqueField === 'string' ? doc[uniqueField] : uniqueField(doc),
        doc,
      ]),
    )

    console.log(
      `  📊 Found ${existingItems.docs.length} existing items, ${data.length - existingItems.docs.length} new items`,
    )

    // Step 2: Separate items into create/update/skip batches
    const toCreate: T[] = []
    const toUpdate: Array<{ id: string; data: T }> = []

    for (const item of data) {
      const uniqueValue =
        typeof uniqueField === 'string' ? (item as any)[uniqueField] : uniqueField(item)
      const existing = existingMap.get(uniqueValue)

      if (existing) {
        if (updateExisting) {
          const transformedData = transform ? transform(item, existing) : item
          toUpdate.push({ id: existing.id, data: transformedData })
        } else {
          result.skipped.push(existing)
        }
      } else {
        const transformedData = transform ? transform(item) : item
        toCreate.push(transformedData)
      }
    }

    // Step 3: Batch create operations (parallel with batchSize limit)
    if (toCreate.length > 0) {
      console.log(`  🚀 Creating ${toCreate.length} new items in batches of ${batchSize}...`)

      for (let i = 0; i < toCreate.length; i += batchSize) {
        const batch = toCreate.slice(i, i + batchSize)
        const batchResults = await Promise.allSettled(
          batch.map((itemData) =>
            payload.create({
              collection,
              data: itemData as any,
              overrideAccess: true,
            }),
          ),
        )

        // Process results
        for (let j = 0; j < batchResults.length; j++) {
          const batchResult = batchResults[j]
          if (batchResult.status === 'fulfilled') {
            result.created.push(batchResult.value as T)
          } else {
            result.errors.push({
              item: batch[j],
              error: batchResult.reason,
            })
            console.error(`  ❌ Error creating item:`, batchResult.reason)
          }
        }
      }

      console.log(`  ✅ Created ${result.created.length} items`)
    }

    // Step 4: Batch update operations (parallel with batchSize limit)
    if (toUpdate.length > 0) {
      console.log(`  🔄 Updating ${toUpdate.length} existing items in batches of ${batchSize}...`)

      for (let i = 0; i < toUpdate.length; i += batchSize) {
        const batch = toUpdate.slice(i, i + batchSize)
        const batchResults = await Promise.allSettled(
          batch.map(({ id, data: itemData }) =>
            payload.update({
              collection,
              id,
              data: itemData as any,
              overrideAccess: true,
            }),
          ),
        )

        // Process results
        for (let j = 0; j < batchResults.length; j++) {
          const batchResult = batchResults[j]
          if (batchResult.status === 'fulfilled') {
            result.updated.push(batchResult.value as T)
          } else {
            result.errors.push({
              item: batch[j],
              error: batchResult.reason,
            })
            console.error(`  ❌ Error updating item:`, batchResult.reason)
          }
        }
      }

      console.log(`  ✅ Updated ${result.updated.length} items`)
    }

    if (result.skipped.length > 0) {
      console.log(`  ⏭️  Skipped ${result.skipped.length} existing items`)
    }

    if (result.errors.length > 0) {
      console.log(`  ⚠️  ${result.errors.length} items failed`)
    }

    console.log(
      `  📊 Summary: ${result.created.length} created, ${result.updated.length} updated, ${result.skipped.length} skipped, ${result.errors.length} failed`,
    )
  } catch (error) {
    console.error(`  ❌ Batch seed error for collection "${collection}":`, error)
    throw error
  }

  return result
}

/**
 * Delete all items from a collection in batches
 */
export async function batchDelete(
  payload: Payload,
  collection: CollectionSlug,
  where?: any,
  batchSize: number = 50,
): Promise<number> {
  console.log(`\n🗑️  Batch deleting items from collection "${collection}"...`)

  try {
    // Find all items to delete
    const items = await payload.find({
      collection,
      where: where || {},
      limit: 10000, // Adjust based on expected max
      overrideAccess: true,
    })

    if (items.docs.length === 0) {
      console.log(`  ℹ️  No items to delete`)
      return 0
    }

    console.log(`  🗑️  Deleting ${items.docs.length} items in batches of ${batchSize}...`)

    let deletedCount = 0

    // Delete in batches
    for (let i = 0; i < items.docs.length; i += batchSize) {
      const batch = items.docs.slice(i, i + batchSize)
      const batchResults = await Promise.allSettled(
        batch.map((doc: any) =>
          payload.delete({
            collection,
            id: doc.id,
            overrideAccess: true,
          }),
        ),
      )

      // Count successful deletes
      const successCount = batchResults.filter((r) => r.status === 'fulfilled').length
      deletedCount += successCount
    }

    console.log(`  ✅ Deleted ${deletedCount} items`)
    return deletedCount
  } catch (error) {
    console.error(`  ❌ Batch delete error for collection "${collection}":`, error)
    throw error
  }
}

/**
 * Bulk find items by multiple unique values
 */
export async function bulkFind<T = any>(
  payload: Payload,
  collection: CollectionSlug,
  field: string,
  values: any[],
): Promise<Map<any, T>> {
  if (values.length === 0) {
    return new Map()
  }

  const items = await payload.find({
    collection,
    where: {
      [field]: {
        in: values,
      },
    },
    limit: values.length,
    overrideAccess: true,
  })

  return new Map(items.docs.map((doc: any) => [doc[field], doc as T]))
}
