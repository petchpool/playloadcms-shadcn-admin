'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon, X } from 'lucide-react'
import { type DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface DataTableDateRangeFilterProps {
  title?: string
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  /** Enable time selection (default: false for date only) */
  showTime?: boolean
  /** Date format for display (default: 'LLL dd, y' or 'LLL dd, y HH:mm' if showTime) */
  dateFormat?: string
  /** Placeholder text */
  placeholder?: string
  /** Align popover (default: 'start') */
  align?: 'start' | 'center' | 'end'
  className?: string
}

export function DataTableDateRangeFilter({
  title = 'Date',
  dateRange,
  onDateRangeChange,
  showTime = false,
  dateFormat,
  placeholder = 'Pick a date range',
  align = 'start',
  className,
}: DataTableDateRangeFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [fromTime, setFromTime] = React.useState('00:00')
  const [toTime, setToTime] = React.useState('23:59')

  // Sync time inputs with dateRange
  React.useEffect(() => {
    if (dateRange?.from && showTime) {
      const hours = dateRange.from.getHours().toString().padStart(2, '0')
      const minutes = dateRange.from.getMinutes().toString().padStart(2, '0')
      setFromTime(`${hours}:${minutes}`)
    }
    if (dateRange?.to && showTime) {
      const hours = dateRange.to.getHours().toString().padStart(2, '0')
      const minutes = dateRange.to.getMinutes().toString().padStart(2, '0')
      setToTime(`${hours}:${minutes}`)
    }
  }, [dateRange, showTime])

  const displayFormat = dateFormat || (showTime ? 'LLL dd, y HH:mm' : 'LLL dd, y')

  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range) {
      onDateRangeChange(undefined)
      return
    }

    let newFrom = range.from
    let newTo = range.to

    if (showTime && newFrom) {
      const [hours, minutes] = fromTime.split(':').map(Number)
      newFrom = new Date(newFrom)
      newFrom.setHours(hours, minutes, 0, 0)
    }

    if (showTime && newTo) {
      const [hours, minutes] = toTime.split(':').map(Number)
      newTo = new Date(newTo)
      newTo.setHours(hours, minutes, 59, 999)
    }

    onDateRangeChange({ from: newFrom, to: newTo })
  }

  const handleFromTimeChange = (time: string) => {
    setFromTime(time)
    if (dateRange?.from) {
      const [hours, minutes] = time.split(':').map(Number)
      const newFrom = new Date(dateRange.from)
      newFrom.setHours(hours, minutes, 0, 0)
      onDateRangeChange({ ...dateRange, from: newFrom })
    }
  }

  const handleToTimeChange = (time: string) => {
    setToTime(time)
    if (dateRange?.to) {
      const [hours, minutes] = time.split(':').map(Number)
      const newTo = new Date(dateRange.to)
      newTo.setHours(hours, minutes, 59, 999)
      onDateRangeChange({ ...dateRange, to: newTo })
    }
  }

  const clearDateRange = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDateRangeChange(undefined)
    setFromTime('00:00')
    setToTime('23:59')
  }

  const hasValue = dateRange?.from || dateRange?.to

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn(
              'h-8 justify-start border-dashed text-left font-normal',
              !hasValue && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {hasValue ? (
              <>
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, displayFormat)} - {format(dateRange.to, displayFormat)}
                    </>
                  ) : (
                    format(dateRange.from, displayFormat)
                  )
                ) : (
                  placeholder
                )}
                <X
                  className="ml-2 h-4 w-4 opacity-50 hover:opacity-100"
                  onClick={clearDateRange}
                />
              </>
            ) : (
              <span>{title}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <div className="p-3 pb-0">
            <div className="text-sm font-medium">{title}</div>
            <div className="text-xs text-muted-foreground">
              {showTime ? 'Select date and time range' : 'Select date range'}
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
          {showTime && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4 p-3">
                <div className="space-y-2">
                  <Label htmlFor="from-time" className="text-xs">
                    From Time
                  </Label>
                  <Input
                    id="from-time"
                    type="time"
                    value={fromTime}
                    onChange={(e) => handleFromTimeChange(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to-time" className="text-xs">
                    To Time
                  </Label>
                  <Input
                    id="to-time"
                    type="time"
                    value={toTime}
                    onChange={(e) => handleToTimeChange(e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
            </>
          )}
          <Separator />
          <div className="flex items-center justify-between p-3">
            <Button variant="ghost" size="sm" onClick={() => onDateRangeChange(undefined)}>
              Clear
            </Button>
            <Button size="sm" onClick={() => setIsOpen(false)}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Preset date ranges for quick selection
export type DatePreset = {
  label: string
  getValue: () => DateRange
}

export const defaultDatePresets: DatePreset[] = [
  {
    label: 'Today',
    getValue: () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)
      return { from: today, to: endOfDay }
    },
  },
  {
    label: 'Yesterday',
    getValue: () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)
      const endOfYesterday = new Date(yesterday)
      endOfYesterday.setHours(23, 59, 59, 999)
      return { from: yesterday, to: endOfYesterday }
    },
  },
  {
    label: 'Last 7 days',
    getValue: () => {
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      const start = new Date()
      start.setDate(start.getDate() - 6)
      start.setHours(0, 0, 0, 0)
      return { from: start, to: end }
    },
  },
  {
    label: 'Last 30 days',
    getValue: () => {
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      const start = new Date()
      start.setDate(start.getDate() - 29)
      start.setHours(0, 0, 0, 0)
      return { from: start, to: end }
    },
  },
  {
    label: 'This month',
    getValue: () => {
      const start = new Date()
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      return { from: start, to: end }
    },
  },
  {
    label: 'Last month',
    getValue: () => {
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      const end = new Date(start)
      end.setMonth(end.getMonth() + 1)
      end.setDate(0)
      end.setHours(23, 59, 59, 999)
      return { from: start, to: end }
    },
  },
]

interface DataTableDateRangeFilterWithPresetsProps extends DataTableDateRangeFilterProps {
  presets?: DatePreset[]
}

export function DataTableDateRangeFilterWithPresets({
  title = 'Date',
  dateRange,
  onDateRangeChange,
  showTime = false,
  dateFormat,
  placeholder = 'Pick a date range',
  align = 'start',
  presets = defaultDatePresets,
  className,
}: DataTableDateRangeFilterWithPresetsProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [fromTime, setFromTime] = React.useState('00:00')
  const [toTime, setToTime] = React.useState('23:59')

  // Sync time inputs with dateRange
  React.useEffect(() => {
    if (dateRange?.from && showTime) {
      const hours = dateRange.from.getHours().toString().padStart(2, '0')
      const minutes = dateRange.from.getMinutes().toString().padStart(2, '0')
      setFromTime(`${hours}:${minutes}`)
    }
    if (dateRange?.to && showTime) {
      const hours = dateRange.to.getHours().toString().padStart(2, '0')
      const minutes = dateRange.to.getMinutes().toString().padStart(2, '0')
      setToTime(`${hours}:${minutes}`)
    }
  }, [dateRange, showTime])

  const displayFormat = dateFormat || (showTime ? 'LLL dd, y HH:mm' : 'LLL dd, y')

  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range) {
      onDateRangeChange(undefined)
      return
    }

    let newFrom = range.from
    let newTo = range.to

    if (showTime && newFrom) {
      const [hours, minutes] = fromTime.split(':').map(Number)
      newFrom = new Date(newFrom)
      newFrom.setHours(hours, minutes, 0, 0)
    }

    if (showTime && newTo) {
      const [hours, minutes] = toTime.split(':').map(Number)
      newTo = new Date(newTo)
      newTo.setHours(hours, minutes, 59, 999)
    }

    onDateRangeChange({ from: newFrom, to: newTo })
  }

  const handleFromTimeChange = (time: string) => {
    setFromTime(time)
    if (dateRange?.from) {
      const [hours, minutes] = time.split(':').map(Number)
      const newFrom = new Date(dateRange.from)
      newFrom.setHours(hours, minutes, 0, 0)
      onDateRangeChange({ ...dateRange, from: newFrom })
    }
  }

  const handleToTimeChange = (time: string) => {
    setToTime(time)
    if (dateRange?.to) {
      const [hours, minutes] = time.split(':').map(Number)
      const newTo = new Date(dateRange.to)
      newTo.setHours(hours, minutes, 59, 999)
      onDateRangeChange({ ...dateRange, to: newTo })
    }
  }

  const clearDateRange = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDateRangeChange(undefined)
    setFromTime('00:00')
    setToTime('23:59')
  }

  const handlePresetClick = (preset: DatePreset) => {
    const range = preset.getValue()
    if (showTime) {
      setFromTime(
        `${range.from!.getHours().toString().padStart(2, '0')}:${range.from!.getMinutes().toString().padStart(2, '0')}`,
      )
      setToTime(
        `${range.to!.getHours().toString().padStart(2, '0')}:${range.to!.getMinutes().toString().padStart(2, '0')}`,
      )
    }
    onDateRangeChange(range)
  }

  const hasValue = dateRange?.from || dateRange?.to

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn(
              'h-8 justify-start border-dashed text-left font-normal',
              !hasValue && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {hasValue ? (
              <>
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, displayFormat)} - {format(dateRange.to, displayFormat)}
                    </>
                  ) : (
                    format(dateRange.from, displayFormat)
                  )
                ) : (
                  placeholder
                )}
                <X
                  className="ml-2 h-4 w-4 opacity-50 hover:opacity-100"
                  onClick={clearDateRange}
                />
              </>
            ) : (
              <span>{title}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <div className="flex">
            {/* Presets sidebar */}
            <div className="flex flex-col border-r p-2">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Presets</div>
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className="justify-start text-xs"
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            {/* Calendar */}
            <div>
              <div className="p-3 pb-0">
                <div className="text-sm font-medium">{title}</div>
                <div className="text-xs text-muted-foreground">
                  {showTime ? 'Select date and time range' : 'Select date range'}
                </div>
              </div>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateSelect}
                numberOfMonths={2}
              />
              {showTime && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 p-3">
                    <div className="space-y-2">
                      <Label htmlFor="from-time-preset" className="text-xs">
                        From Time
                      </Label>
                      <Input
                        id="from-time-preset"
                        type="time"
                        value={fromTime}
                        onChange={(e) => handleFromTimeChange(e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="to-time-preset" className="text-xs">
                        To Time
                      </Label>
                      <Input
                        id="to-time-preset"
                        type="time"
                        value={toTime}
                        onChange={(e) => handleToTimeChange(e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex items-center justify-between p-3">
                <Button variant="ghost" size="sm" onClick={() => onDateRangeChange(undefined)}>
                  Clear
                </Button>
                <Button size="sm" onClick={() => setIsOpen(false)}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

