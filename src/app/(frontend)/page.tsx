import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="flex flex-col justify-between items-center h-screen p-[45px] max-w-[1024px] mx-auto overflow-hidden max-[400px]:p-6">
      <div className="flex flex-col items-center justify-center flex-grow">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>
        {!user && (
          <h1 className="my-10 text-6xl leading-[70px] font-bold max-[1024px]:my-6 max-[1024px]:text-[42px] max-[1024px]:leading-[42px] max-[768px]:text-[38px] max-[768px]:leading-[38px] max-[400px]:text-[32px] max-[400px]:leading-8 text-center">
            Welcome to your new project.
          </h1>
        )}
        {user && (
          <h1 className="my-10 text-6xl leading-[70px] font-bold max-[1024px]:my-6 max-[1024px]:text-[42px] max-[1024px]:leading-[42px] max-[768px]:text-[38px] max-[768px]:leading-[38px] max-[400px]:text-[32px] max-[400px]:leading-8 text-center">
            Welcome back, {user.email}
          </h1>
        )}
        <div className="flex items-center gap-3">
          <a
            className="text-black bg-white border border-black no-underline px-2 py-1 rounded"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </a>
          <a
            className="text-white bg-black border border-white no-underline px-2 py-1 rounded"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </a>
        </div>
      </div>
      <div className="flex items-center gap-2 max-[1024px]:flex-col max-[1024px]:gap-1.5">
        <p className="my-0 max-[1024px]:my-0">Update this page by editing</p>
        <a className="no-underline px-2 bg-[rgb(60,60,60)] rounded" href={fileURL}>
          <code>app/(frontend)/page.tsx</code>
        </a>
      </div>
    </div>
  )
}
