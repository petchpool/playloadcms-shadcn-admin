'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useView } from '@/hooks/use-view'
import { DynamicFormField } from './dynamic-form-field'
import { processEvent } from '@/app/actions/workflow-engine'

interface FormField {
  name: string
  label: string
  type: string
  placeholder?: string
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  options?: Array<{ label: string; value: string }>
  defaultValue?: string
  helperText?: string
}

interface FormConfig {
  formId: string
  title: string
  description?: string
  fields: FormField[]
  submission?: {
    type: 'event' | 'api'
    eventName?: string
    submitEndpoint?: string
    submitMethod?: 'POST' | 'PUT' | 'PATCH'
  }
  // Legacy support
  submitEndpoint?: string
  submitMethod?: 'POST' | 'PUT' | 'PATCH'

  submitLabel?: string
  cancelLabel?: string
  successMessage?: string
  errorMessage?: string
  redirectUrl?: string
  enableAutosave?: boolean
  customCss?: string
}

interface DynamicFormProps {
  viewId: string
  formConfig: FormConfig
}

// Build Zod schema from field configuration
function buildZodSchema(fields: FormField[]): z.ZodObject<any> {
  const shape: any = {}

  fields.forEach((field) => {
    let fieldSchema: any

    switch (field.type) {
      case 'email':
        fieldSchema = z.string().email('Invalid email address')
        break
      case 'number':
        fieldSchema = z.number()
        if (field.min !== undefined) fieldSchema = fieldSchema.min(field.min)
        if (field.max !== undefined) fieldSchema = fieldSchema.max(field.max)
        break
      case 'checkbox':
        fieldSchema = z.boolean()
        break
      case 'date':
        fieldSchema = z.string() // Will be converted to date
        break
      default:
        // text, password, textarea, select, file
        fieldSchema = z.string()
        if (field.minLength) {
          fieldSchema = fieldSchema.min(
            field.minLength,
            `Minimum ${field.minLength} characters required`,
          )
        }
        if (field.maxLength) {
          fieldSchema = fieldSchema.max(
            field.maxLength,
            `Maximum ${field.maxLength} characters allowed`,
          )
        }
        if (field.pattern) {
          fieldSchema = fieldSchema.regex(new RegExp(field.pattern), 'Invalid format')
        }
    }

    if (field.required) {
      if (field.type === 'checkbox') {
        fieldSchema = fieldSchema.refine((val: boolean) => val === true, {
          message: 'This field is required',
        })
      }
    } else {
      fieldSchema = fieldSchema.optional()
    }

    shape[field.name] = fieldSchema
  })

  return z.object(shape)
}

// Build default values from field configuration
function buildDefaultValues(fields: FormField[]): Record<string, any> {
  const defaults: Record<string, any> = {}

  fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      if (field.type === 'number') {
        defaults[field.name] = Number(field.defaultValue)
      } else if (field.type === 'checkbox') {
        defaults[field.name] = field.defaultValue === 'true'
      } else {
        defaults[field.name] = field.defaultValue
      }
    } else if (field.type === 'checkbox') {
      defaults[field.name] = false
    } else if (field.type === 'number') {
      defaults[field.name] = 0
    } else {
      defaults[field.name] = ''
    }
  })

  return defaults
}

export function DynamicForm({ viewId, formConfig }: DynamicFormProps) {
  const { closeView } = useView()
  const router = useRouter()

  // Build schema and default values
  const schema = useMemo(() => buildZodSchema(formConfig.fields), [formConfig.fields])
  const defaultValues = useMemo(() => buildDefaultValues(formConfig.fields), [formConfig.fields])

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  // Autosave functionality
  useEffect(() => {
    if (!formConfig.enableAutosave) return

    const subscription = form.watch((data) => {
      try {
        localStorage.setItem(`form_${formConfig.formId}`, JSON.stringify(data))
      } catch (error) {
        console.error('Failed to autosave form data:', error)
      }
    })

    // Load saved data on mount
    try {
      const saved = localStorage.getItem(`form_${formConfig.formId}`)
      if (saved) {
        const data = JSON.parse(saved)
        form.reset(data)
      }
    } catch (error) {
      console.error('Failed to load saved form data:', error)
    }

    return () => subscription.unsubscribe()
  }, [formConfig.formId, formConfig.enableAutosave, form])

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      let responseData

      if (formConfig.submission?.type === 'event') {
        // Workflow Engine Submission
        if (!formConfig.submission.eventName) throw new Error('Event name is missing configuration')

        await processEvent(formConfig.submission.eventName, data, {
          formId: formConfig.formId,
          // tenantId: ... (Needs to be passed via props or context)
        })
      } else {
        // Legacy/Direct API Submission
        // Fallback for flat structure or nested 'api' type
        const endpoint = formConfig.submission?.submitEndpoint || formConfig.submitEndpoint
        const method = formConfig.submission?.submitMethod || formConfig.submitMethod || 'POST'

        if (!endpoint) throw new Error('Submit endpoint is missing')

        const response = await fetch(endpoint, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const error = await response.json().catch(() => ({}))
          throw new Error(error.message || 'Failed to submit form')
        }
      }

      // Success
      toast.success(formConfig.successMessage || 'Form submitted successfully!')

      // Clear autosaved data
      if (formConfig.enableAutosave) {
        localStorage.removeItem(`form_${formConfig.formId}`)
      }

      // Close view
      closeView(viewId)

      // Redirect if specified
      if (formConfig.redirectUrl) {
        router.push(formConfig.redirectUrl)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : formConfig.errorMessage || 'An error occurred. Please try again.',
      )
    }
  })

  return (
    <FormProvider {...form}>
      <motion.form
        onSubmit={handleSubmit}
        className={`space-y-6 ${formConfig.customCss || ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {formConfig.fields.map((field) => (
          <DynamicFormField key={field.name} field={field} />
        ))}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => closeView(viewId)}
            disabled={form.formState.isSubmitting}
          >
            {formConfig.cancelLabel || 'Cancel'}
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {formConfig.submitLabel || 'Submit'}
          </Button>
        </div>
      </motion.form>
    </FormProvider>
  )
}
