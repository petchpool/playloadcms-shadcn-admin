'use client'

import * as React from 'react'
import { type Table } from '@tanstack/react-table'
import { Settings2, Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  /** Custom column labels */
  columnLabels?: Record<string, string>
}

export function DataTableViewOptions<TData>({
  table,
  columnLabels = {},
}: DataTableViewOptionsProps<TData>) {
  // Default column labels
  const defaultLabels: Record<string, string> = {
    select: 'Select',
    name: 'Name',
    type: 'Type',
    category: 'Category',
    status: 'Status',
    description: 'Description',
    createdAt: 'Created',
    updatedAt: 'Updated',
    email: 'Email',
    title: 'Title',
    slug: 'Slug',
    ...columnLabels,
  }

  const getColumnLabel = (columnId: string) => {
    return defaultLabels[columnId] || columnId.charAt(0).toUpperCase() + columnId.slice(1)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <Settings2 className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {getColumnLabel(column.id)}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

