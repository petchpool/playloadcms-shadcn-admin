'use client'

import { cn } from '@/lib/utils'
import { layoutClasses } from '../classes'
import { useScrollOffsetTop } from '@/hooks/use-scroll-offset-top'

export type HeaderSectionProps = {
  className?: string
  disableOffset?: boolean
  disableElevation?: boolean
  slots?: {
    leftArea?: React.ReactNode
    rightArea?: React.ReactNode
    topArea?: React.ReactNode
    centerArea?: React.ReactNode
    bottomArea?: React.ReactNode
  }
  slotProps?: {
    container?: {
      className?: string
      maxWidth?: boolean
    }
  }
}

export function HeaderSection({
  className,
  slots,
  slotProps,
  disableOffset,
  disableElevation,
}: HeaderSectionProps) {
  const { offsetTop } = useScrollOffsetTop()

  return (
    <header
      className={cn(
        layoutClasses.header,
        'sticky top-0 z-[1100] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        offsetTop && !disableOffset && 'bg-background/80 shadow-sm',
        className,
      )}
    >
      {slots?.topArea}

      <div
        className={cn(
          'flex h-16 items-center md:h-18',
          'transition-all duration-200',
          slotProps?.container?.maxWidth === false
            ? 'px-4'
            : 'container mx-auto px-4',
        )}
      >
        {slots?.leftArea}

        <div className="flex flex-1 justify-center">
          {slots?.centerArea}
        </div>

        {slots?.rightArea}
      </div>

      {slots?.bottomArea}

      {!disableElevation && offsetTop && (
        <span className="absolute bottom-0 left-0 right-0 m-auto h-6 w-[calc(100%-48px)] rounded-full opacity-48 shadow-lg" />
      )}
    </header>
  )
}

