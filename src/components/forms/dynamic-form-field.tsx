'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

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

interface DynamicFormFieldProps {
  field: FormField
}

export function DynamicFormField({ field }: DynamicFormFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const error = errors[field.name]?.message as string | undefined

  // Select field
  if (field.type === 'select') {
    return (
      <div className="space-y-2">
        <Label htmlFor={field.name}>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => (
            <Select
              onValueChange={controllerField.onChange}
              value={controllerField.value ?? undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {field.helperText && <p className="text-sm text-muted-foreground">{field.helperText}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }

  // Checkbox field
  if (field.type === 'checkbox') {
    return (
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField }) => (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.name}
                checked={controllerField.value ?? false}
                onCheckedChange={controllerField.onChange}
              />
              <Label htmlFor={field.name} className="font-normal">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {field.helperText && (
              <p className="text-sm text-muted-foreground pl-6">{field.helperText}</p>
            )}
            {error && <p className="text-sm text-red-500 pl-6">{error}</p>}
          </div>
        )}
      />
    )
  }

  // Textarea field
  if (field.type === 'textarea') {
    return (
      <div className="space-y-2">
        <Label htmlFor={field.name}>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => (
            <Textarea
              {...controllerField}
              id={field.name}
              placeholder={field.placeholder}
              minLength={field.minLength}
              maxLength={field.maxLength}
            />
          )}
        />
        {field.helperText && <p className="text-sm text-muted-foreground">{field.helperText}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }

  // Standard input fields (text, email, password, number, date, file)
  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField }) => (
          <Input
            {...controllerField}
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            minLength={field.minLength}
            maxLength={field.maxLength}
            pattern={field.pattern}
            onChange={(e) => {
              if (field.type === 'number') {
                controllerField.onChange(e.target.valueAsNumber)
              } else {
                controllerField.onChange(e.target.value)
              }
            }}
          />
        )}
      />
      {field.helperText && <p className="text-sm text-muted-foreground">{field.helperText}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
