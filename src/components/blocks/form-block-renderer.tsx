'use client'

import { Button } from '@/components/ui/button'
import { useView } from '@/hooks/use-view'
import { DynamicForm } from '@/components/forms/dynamic-form'

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

interface FormBlockConfig {
  formId: string
  title: string
  description?: string
  viewType: 'dialog' | 'page' | 'sidebar-left' | 'sidebar-right'
  viewSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  viewMode?: 'overlay' | 'push'
  triggerLabel: string
  triggerVariant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive'
  triggerSize?: 'sm' | 'default' | 'lg'
  fields: FormField[]
  submitEndpoint: string
  submitMethod: 'POST' | 'PUT' | 'PATCH'
  submitLabel?: string
  cancelLabel?: string
  successMessage?: string
  errorMessage?: string
  redirectUrl?: string
  showProgressIndicator?: boolean
  enableAutosave?: boolean
  customCss?: string
}

export function FormBlockRenderer(config: FormBlockConfig) {
  const { openView } = useView()

  const handleOpenForm = () => {
    openView({
      type: config.viewType,
      component: DynamicForm,
      title: config.title,
      description: config.description,
      size: config.viewSize,
      mode: config.viewMode,
      props: {
        formConfig: config,
      },
    })
  }

  // Map variant names to match Button component
  const getButtonVariant = () => {
    switch (config.triggerVariant) {
      case 'primary':
        return 'default'
      case 'secondary':
        return 'secondary'
      case 'destructive':
        return 'destructive'
      default:
        return config.triggerVariant || 'default'
    }
  }

  return (
    <div className={config.customCss || ''}>
      <Button
        onClick={handleOpenForm}
        variant={getButtonVariant() as any}
        size={config.triggerSize || 'default'}
      >
        {config.triggerLabel}
      </Button>
    </div>
  )
}

