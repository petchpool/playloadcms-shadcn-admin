# BlocksTableSelection Component

## Overview

`BlocksTableSelection` is a specialized version of `BlocksTable` designed for selecting blocks/components with advanced selection features. It's perfect for analytics dashboards, bulk operations, and content management workflows.

## Features

- ✅ **Single or Multiple Selection Mode**
- ✅ **Max Selection Limit**
- ✅ **Selection Summary Display**
- ✅ **URL State Synchronization**
- ✅ **Advanced Filtering** (Status, Type, Category, Date Range)
- ✅ **Search Functionality**
- ✅ **Pagination Support**
- ✅ **External Data Context Support**
- ✅ **Customizable Selection Messages**

## Components

### 1. BlocksTableSelection (Client Component)

The core table component with selection capabilities.

### 2. BlocksTableSelectionBlock (Wrapper Component)

A higher-level wrapper that handles data fetching and can be used in Payload blocks.

## Usage Examples

### Example 1: Basic Multiple Selection

```tsx
'use client'

import { BlocksTableSelectionBlock } from '@/components/blocks'

export function MyComponent() {
  const handleSelectionChange = (ids: string[], data: any[]) => {
    console.log('Selected IDs:', ids)
    console.log('Selected Data:', data)
  }

  return (
    <BlocksTableSelectionBlock
      collection="components"
      columns={['name', 'type', 'status']}
      selectionMode="multiple"
      onSelectionChange={handleSelectionChange}
    />
  )
}
```

### Example 2: Single Selection with Max Limit

```tsx
<BlocksTableSelectionBlock
  collection="sections"
  columns={['name', 'type', 'category']}
  selectionMode="single" // Only one item can be selected
  onSelectionChange={(ids, data) => {
    console.log('Selected:', data[0])
  }}
/>
```

### Example 3: Multiple Selection with Max Limit

```tsx
<BlocksTableSelectionBlock
  collection="components"
  columns={['name', 'type', 'status']}
  selectionMode="multiple"
  maxSelection={10} // Maximum 10 items
  showSelectionSummary={true}
  selectionMessage={(count, max) => 
    `${count} of ${max} blocks selected for analysis`
  }
  onSelectionChange={(ids, data) => {
    console.log('Selected blocks:', data)
  }}
/>
```

### Example 4: With Status Tabs and Filters

```tsx
<BlocksTableSelectionBlock
  collection="components"
  columns={['name', 'type', 'category', 'status']}
  showStatusTabs={true}
  statusTabsField="status"
  statusTabsConfig={[
    { value: 'draft', label: 'Draft', variant: 'warning' },
    { value: 'published', label: 'Published', variant: 'success' },
  ]}
  selectionMode="multiple"
  maxSelection={5}
  onSelectionChange={handleSelection}
/>
```

### Example 5: With URL Synchronization

```tsx
<BlocksTableSelectionBlock
  collection="components"
  columns={['name', 'type', 'status']}
  selectionMode="multiple"
  syncUrl={true} // Enable URL sync
  urlGroup="analytics" // Group params under "analytics"
  onSelectionChange={handleSelection}
/>
```

URL will look like:
```
?analytics[page]=1&analytics[limit]=10&analytics[filters][type][]=block
```

### Example 6: Using External Data (with DataFetch context)

```tsx
import { DataProvider, BlocksTableSelectionBlock } from '@/components/blocks'

export function MyPage() {
  return (
    <DataProvider initialData={{}}>
      <DataFetchBlock
        dataKey="myComponents"
        endpoint="/api/table-data"
        params={{ collection: 'components' }}
      />
      
      <BlocksTableSelectionBlock
        useExternalData={true}
        dataKey="myComponents"
        columns={['name', 'type', 'status']}
        selectionMode="multiple"
        onSelectionChange={handleSelection}
      />
    </DataProvider>
  )
}
```

### Example 7: With Default Selected Items

```tsx
<BlocksTableSelectionBlock
  collection="components"
  columns={['name', 'type', 'status']}
  selectionMode="multiple"
  defaultSelectedIds={['id1', 'id2', 'id3']} // Pre-select items
  onSelectionChange={handleSelection}
/>
```

## Props Reference

### BlocksTableSelectionBlock Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Table title |
| `description` | `string` | - | Table description |
| `limit` | `number` | `10` | Items per page |
| `columns` | `string[]` | - | Column keys to display |
| `collection` | `string` | `'components'` | Collection slug to fetch from |
| `showStatusTabs` | `boolean` | `true` | Show status tabs header |
| `statusTabsField` | `string` | `'status'` | Field to use for status tabs |
| `statusTabsConfig` | `Array` | - | Custom status tabs configuration |
| `selectionMode` | `'single' \| 'multiple'` | `'multiple'` | Selection mode |
| `defaultSelectedIds` | `string[]` | `[]` | Initially selected item IDs |
| `onSelectionChange` | `(ids: string[], data: any[]) => void` | - | Callback when selection changes |
| `maxSelection` | `number` | - | Max number of items (multiple mode) |
| `showSelectionSummary` | `boolean` | `true` | Show selection summary |
| `selectionMessage` | `(count: number, max?: number) => string` | - | Custom selection message |
| `syncUrl` | `boolean` | `false` | Enable URL sync for table state |
| `urlGroup` | `string` | - | URL params namespace |
| `useExternalData` | `boolean` | `false` | Use external data from context |
| `dataKey` | `string` | - | Data key from DataFetch context |

## Complete Analytics Example

See `/src/app/dashboard/analytics/page.tsx` for a complete implementation example with:

- Multiple selection with max limit
- Selection summary card
- Stats cards
- Report generation buttons
- Usage instructions

## Selection Behavior

### Single Mode
- Only one item can be selected at a time
- Selecting a new item automatically deselects the previous one
- No "Select All" checkbox in header

### Multiple Mode
- Multiple items can be selected
- "Select All" checkbox in header
- Respects `maxSelection` limit if provided
- Selection state is maintained across pagination

### Max Selection
When `maxSelection` is set:
- Users cannot select more than the specified limit
- "Select All" respects the limit
- Visual feedback when limit is reached

## URL State Synchronization

When `syncUrl={true}`:
- Page, limit, filters, search, and tabs are synced to URL
- State is restored on page reload
- Multiple tables can use different `urlGroup` namespaces

Example URL:
```
?analytics[page]=2&analytics[limit]=25&analytics[filters][status][]=published
```

## Styling

The component uses:
- Tailwind CSS for styling
- shadcn/ui components
- Consistent with existing BlocksTable design
- Selected rows have `bg-muted/50` background

## TypeScript Support

All components are fully typed with TypeScript:

```tsx
import type { Block } from '@/components/blocks/blocks-table-selection'

const handleSelection = (ids: string[], data: Block[]) => {
  // data is properly typed
}
```

## Best Practices

1. **Always provide onSelectionChange callback** to handle selection
2. **Set appropriate maxSelection** for better UX
3. **Use urlGroup** when multiple tables on same page
4. **Provide custom selectionMessage** for clarity
5. **Consider using external data** for large datasets

## Troubleshooting

### Selection not working
- Ensure `onSelectionChange` callback is provided
- Check that data has `id` field

### Max selection not enforced
- Verify `maxSelection` prop is set
- Check `selectionMode` is `'multiple'`

### URL sync not working
- Ensure `syncUrl={true}`
- Verify Next.js router is available
- Check for URL conflicts (use different `urlGroup`)

## Related Components

- `BlocksTable` - Standard table without selection
- `BlocksTableBlock` - Standard table wrapper
- `DataFetchBlock` - For external data fetching
- `DataProvider` - Data context provider

## Migration from BlocksTable

To convert existing `BlocksTable` to selection mode:

```tsx
// Before
<BlocksTableBlock
  collection="components"
  columns={['name', 'type']}
/>

// After
<BlocksTableSelectionBlock
  collection="components"
  columns={['name', 'type']}
  selectionMode="multiple"
  onSelectionChange={(ids, data) => {
    // Handle selection
  }}
/>
```

## Future Enhancements

- [ ] Bulk actions on selected items
- [ ] Export selected data
- [ ] Save selection presets
- [ ] Keyboard shortcuts for selection
- [ ] Drag and drop selection

