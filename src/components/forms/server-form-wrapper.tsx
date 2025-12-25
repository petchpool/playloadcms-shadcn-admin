import { Suspense } from 'react'
import { FormSkeleton } from './form-skeleton'

async function ServerFormData({ userId, FormComponent }: any) {
  // Fetch data on server
  const user = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/users/${userId}`).then(
    (r) => r.json(),
  )

  return <FormComponent initialData={user} />
}

export function ServerFormWrapper({ userId, FormComponent }: any) {
  return (
    <Suspense fallback={<FormSkeleton fields={4} />}>
      <ServerFormData userId={userId} FormComponent={FormComponent} />
    </Suspense>
  )
}

