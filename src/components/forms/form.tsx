'use client'

import { ReactNode } from 'react'
import { useForm, FormProvider, UseFormReturn, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface FormProps<T extends FieldValues> {
  schema: z.ZodType<T>
  defaultValues?: Partial<T>
  onSubmit: (data: T) => Promise<void> | void
  children: (form: UseFormReturn<T>) => ReactNode
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  isLoading?: boolean
}

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
  isLoading = false,
}: FormProps<T>) {
  const form = useForm<T>({
    // @ts-expect-error - zodResolver type compatibility issue with Zod v4
    resolver: zodResolver(schema),
    // @ts-expect-error - defaultValues type compatibility
    defaultValues,
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    // @ts-expect-error - data type compatibility
    await onSubmit(data)
  })

  return (
    <FormProvider {...form}>
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* @ts-expect-error - form type compatibility */}
        {children(form)}

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={form.formState.isSubmitting || isLoading}
            >
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" disabled={form.formState.isSubmitting || isLoading}>
            {(form.formState.isSubmitting || isLoading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {submitLabel}
          </Button>
        </div>
      </motion.form>
    </FormProvider>
  )
}

