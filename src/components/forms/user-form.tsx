'use client'

import { z } from 'zod'
import { Form } from './form'
import { FormField } from './form-field'
import { useView } from '@/hooks/use-view'
import { toast } from 'sonner'

const userSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'editor', 'user']),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  viewId: string
  initialData?: Partial<UserFormData>
  mode?: 'create' | 'edit'
}

export function UserForm({ viewId, initialData, mode = 'create' }: UserFormProps) {
  const { closeView } = useView()

  const handleSubmit = async (data: UserFormData) => {
    try {
      // Option 1: Server Action
      // await createUserAction(data)

      // Option 2: API Route
      const response = await fetch('/api/users', {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to save user')

      toast.success(`User ${mode === 'create' ? 'created' : 'updated'} successfully`)
      closeView(viewId)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  return (
    <Form
      schema={userSchema}
      defaultValues={initialData}
      onSubmit={handleSubmit}
      onCancel={() => closeView(viewId)}
      submitLabel={mode === 'create' ? 'Create User' : 'Update User'}
    >
      {() => (
        <>
          <FormField name="firstName" label="First Name" required />
          <FormField name="lastName" label="Last Name" required />
          <FormField name="email" label="Email" type="email" required />
          <FormField
            name="role"
            label="Role"
            type="select"
            options={[
              { label: 'Admin', value: 'admin' },
              { label: 'Editor', value: 'editor' },
              { label: 'User', value: 'user' },
            ]}
            required
          />
        </>
      )}
    </Form>
  )
}
