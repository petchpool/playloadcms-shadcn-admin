import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, value, ...props }, ref) => {
    // Handle controlled inputs: convert null to empty string to avoid React warning
    // For uncontrolled inputs (value is undefined), don't set value prop at all
    const textareaProps =
      value !== undefined ? { value: value === null ? '' : value, ...props } : props

    return (
      <textarea
        data-slot="textarea"
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className,
        )}
        ref={ref}
        {...textareaProps}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
