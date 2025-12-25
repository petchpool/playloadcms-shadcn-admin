'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface FormFieldProps {
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox'
  placeholder?: string
  options?: { label: string; value: string }[]
  required?: boolean
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  options,
  required,
}: FormFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]?.message as string | undefined

  if (type === 'select') {
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? undefined}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }

  if (type === 'checkbox') {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox id={name} checked={field.value ?? false} onCheckedChange={field.onChange} />
            <Label htmlFor={name}>{label}</Label>
          </div>
        )}
      />
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => <Input {...field} id={name} type={type} placeholder={placeholder} />}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

