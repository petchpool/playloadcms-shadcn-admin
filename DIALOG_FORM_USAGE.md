# Dialog & Form System Usage Guide

ระบบ Dialog และ Form ที่ยืดหยุ่น รองรับการแสดงผลแบบ Dialog, Page และ Sidebar (Left/Right) พร้อม State Management ด้วย Jotai

## 🎯 Features

- ✅ **Multiple View Types**: Dialog, Full Page, Sidebar (Left/Right)
- ✅ **Atom State Management**: ใช้ Jotai สำหรับจัดการ state
- ✅ **Multiple Concurrent Views**: เปิดหลาย views พร้อมกันได้ (stack-based)
- ✅ **React Hook Form Integration**: พร้อม Zod validation
- ✅ **Loading States**: Spinner และ Skeleton components
- ✅ **Framer Motion Animations**: smooth transitions
- ✅ **Toast Notifications**: ด้วย Sonner
- ✅ **Server Component Compatible**: รองรับ Cache Components

## 📦 Installed Dependencies

```json
{
  "jotai": "^2.16.0",
  "react-hook-form": "^7.69.0",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^4.2.1",
  "framer-motion": "^12.23.26",
  "sonner": "^2.0.7"
}
```

## 🚀 Quick Start

### 1. เปิด Dialog

```tsx
'use client'

import { useView } from '@/hooks/use-view'
import { UserForm } from '@/components/forms/user-form'
import { Button } from '@/components/ui/button'

export function MyPage() {
  const { openView } = useView()

  const handleCreateUser = () => {
    openView({
      type: 'dialog',
      component: UserForm,
      title: 'Create New User',
      description: 'Fill in the form below',
      size: 'md', // sm | md | lg | xl | full
      props: { mode: 'create' },
    })
  }

  return <Button onClick={handleCreateUser}>Create User</Button>
}
```

### 2. เปิด Right Sidebar

```tsx
openView({
  type: 'sidebar-right',
  component: UserForm,
  title: 'Edit User',
  mode: 'overlay', // overlay | push
  props: {
    mode: 'edit',
    initialData: user,
  },
})
```

### 3. เปิด Left Sidebar

```tsx
openView({
  type: 'sidebar-left',
  component: FilterPanel,
  title: 'Filters',
  mode: 'push', // เลื่อนเนื้อหาหลักไปด้านข้าง
})
```

### 4. เปิดแบบ Full Page

```tsx
openView({
  type: 'page',
  component: WizardForm,
  props: { step: 1 },
})
```

## 📝 สร้าง Form Component

### Basic Form

```tsx
'use client'

import { z } from 'zod'
import { Form } from '@/components/forms/form'
import { FormField } from '@/components/forms/form-field'
import { useView } from '@/hooks/use-view'
import { toast } from 'sonner'

const schema = z.object({
  firstName: z.string().min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร'),
  lastName: z.string().min(2, 'นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร'),
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  role: z.enum(['admin', 'editor', 'user']),
})

type FormData = z.infer<typeof schema>

interface MyFormProps {
  viewId: string
  initialData?: Partial<FormData>
  mode?: 'create' | 'edit'
}

export function MyForm({ viewId, initialData, mode = 'create' }: MyFormProps) {
  const { closeView } = useView()

  const handleSubmit = async (data: FormData) => {
    try {
      // API Call
      const response = await fetch('/api/users', {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success('บันทึกสำเร็จ')
      closeView(viewId)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'เกิดข้อผิดพลาด')
    }
  }

  return (
    <Form
      schema={schema}
      defaultValues={initialData}
      onSubmit={handleSubmit}
      onCancel={() => closeView(viewId)}
      submitLabel={mode === 'create' ? 'สร้าง' : 'อัปเดต'}
      cancelLabel="ยกเลิก"
    >
      {() => (
        <>
          <FormField name="firstName" label="ชื่อ" required />
          <FormField name="lastName" label="นามสกุล" required />
          <FormField name="email" label="อีเมล" type="email" required />
          <FormField
            name="role"
            label="บทบาท"
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
```

### Form with Server Component Wrapper

```tsx
// app/users/[id]/edit/page.tsx
import { ServerFormWrapper } from '@/components/forms/server-form-wrapper'
import { UserForm } from '@/components/forms/user-form'

export default function EditUserPage({ params }: { params: { id: string } }) {
  return <ServerFormWrapper userId={params.id} FormComponent={UserForm} />
}
```

## 🎨 Form Field Types

```tsx
// Text Input
<FormField name="username" label="Username" type="text" required />

// Email Input
<FormField name="email" label="Email" type="email" required />

// Password Input
<FormField name="password" label="Password" type="password" required />

// Number Input
<FormField name="age" label="Age" type="number" />

// Select Dropdown
<FormField
  name="country"
  label="Country"
  type="select"
  options={[
    { label: 'Thailand', value: 'th' },
    { label: 'USA', value: 'us' },
  ]}
  required
/>

// Checkbox
<FormField name="acceptTerms" label="Accept Terms" type="checkbox" />
```

## 🔄 Loading States

### Spinner

```tsx
import { Spinner } from '@/components/ui/spinner'

<Spinner size="sm" /> // sm | md | lg
<Spinner size="md" className="my-8" />
```

### Skeleton

```tsx
import { FormSkeleton } from '@/components/forms/form-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

// Form Skeleton
<FormSkeleton fields={4} />

// Custom Skeleton
<Skeleton className="h-10 w-full" />
```

## 🎊 Toast Notifications

```tsx
import { toast } from 'sonner'

// Success
toast.success('บันทึกสำเร็จ')

// Error
toast.error('เกิดข้อผิดพลาด')

// Info
toast.info('กำลังประมวลผล...')

// Warning
toast.warning('โปรดตรวจสอบข้อมูล')

// Promise
toast.promise(saveData(), {
  loading: 'กำลังบันทึก...',
  success: 'บันทึกสำเร็จ',
  error: 'เกิดข้อผิดพลาด',
})
```

## 🎯 Advanced Usage

### ปิด View ทั้งหมด

```tsx
const { closeAllViews } = useView()

closeAllViews()
```

### ปิด View เฉพาะ

```tsx
const { closeView } = useView()

closeView('view-id')
```

### Custom View Configuration

```tsx
openView({
  type: 'dialog',
  component: MyComponent,
  title: 'Custom Dialog',
  description: 'Description here',
  size: 'lg',
  closeOnClickOutside: true,
  closeOnEscape: true,
  showCloseButton: true,
  props: {
    // Custom props for your component
    userId: '123',
    onSuccess: () => console.log('Success'),
  },
})
```

## 📂 File Structure

```
src/
├── store/
│   └── view-atoms.ts              # Jotai atoms for view state
├── components/
│   ├── view-manager/
│   │   ├── view-manager.tsx       # Main view manager
│   │   └── view-renderer.tsx      # Individual view renderer
│   ├── forms/
│   │   ├── form.tsx               # Generic form wrapper
│   │   ├── form-field.tsx         # Reusable form fields
│   │   ├── form-skeleton.tsx      # Loading skeleton
│   │   ├── user-form.tsx          # Example: User CRUD form
│   │   └── server-form-wrapper.tsx # Server component wrapper
│   ├── providers/
│   │   └── toast-provider.tsx     # Toast notifications
│   └── ui/
│       ├── dialog.tsx             # Dialog component (enhanced)
│       ├── sheet.tsx              # Sidebar component (enhanced)
│       └── spinner.tsx            # Loading spinner
└── hooks/
    └── use-view.ts                # Custom hook for views
```

## 🎨 Dialog Sizes

```tsx
size="sm"   // max-w-sm (24rem)
size="md"   // max-w-lg (32rem)
size="lg"   // max-w-2xl (42rem)
size="xl"   // max-w-4xl (56rem)
size="full" // max-w-[calc(100vw-4rem)]
```

## 🎯 Sidebar Modes

```tsx
mode="overlay" // ทับเนื้อหา มี backdrop
mode="push"    // เลื่อนเนื้อหาหลักไปด้านข้าง
```

## 🔥 Best Practices

1. **ใช้ Zod Schema สำหรับ Validation** - type-safe และ reusable
2. **ใส่ viewId ใน Form Props** - สำหรับปิด view หลัง submit
3. **ใช้ toast สำหรับ Feedback** - UX ที่ดี
4. **ใช้ Server Component Wrapper** - สำหรับ data fetching
5. **ใช้ FormSkeleton** - แสดงระหว่าง loading
6. **ใช้ mode="push" สำหรับ Sidebar** - เมื่อต้องการให้เห็นเนื้อหาหลัก

## 🎓 Examples in Codebase

- **User Form**: `src/components/forms/user-form.tsx`
- **Form Fields**: `src/components/forms/form-field.tsx`
- **View Manager**: `src/components/view-manager/view-manager.tsx`
- **Atoms**: `src/store/view-atoms.ts`

## 🐛 Troubleshooting

### Type Errors in Form Component

หากเจอ type errors ใน Form component ที่เกี่ยวกับ `zodResolver` หรือ `FormProvider`:
- ระบบมี `@ts-expect-error` comments อยู่แล้วเพื่อ suppress errors
- เป็น compatibility issue ระหว่าง Zod v4 และ React Hook Form
- Form ทำงานได้ปกติ แม้จะมี type errors

### View ไม่เปิด

ตรวจสอบว่า:
1. `ViewManager` และ `ToastProvider` อยู่ใน layout แล้ว
2. Component ที่เรียก `useView()` เป็น Client Component (`'use client'`)
3. Import paths ถูกต้อง

### Toast ไม่แสดง

ตรวจสอบว่า `ToastProvider` อยู่ใน layout (`src/app/(frontend)/layout.tsx`)

---

**Happy Coding! 🎉**

สำหรับคำถามหรือปัญหา ดูตัวอย่างได้ที่ `src/components/forms/user-form.tsx`

