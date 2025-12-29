import { TaskConfig } from 'payload'

export const apiCallTask: any = {
  slug: 'apiCallTask',
  inputSchema: [
    { name: 'url', type: 'text', required: true },
    { name: 'method', type: 'text', required: true },
    { name: 'headers', type: 'json' },
    { name: 'body', type: 'json' },
    { name: 'outputKey', type: 'text' },
  ],
  handler: async ({ input, req }: { input: any; req: any }) => {
    console.log(`[Job: apiCall] Calling ${input.url}`)
    const headersObj: Record<string, string> = {}
    if (Array.isArray(input.headers)) {
      input.headers.forEach((h: any) => {
        if (h.key) headersObj[h.key] = h.value
      })
    }
    const response = await fetch(input.url, {
      method: input.method,
      headers: headersObj,
      body: input.body ? JSON.stringify(input.body) : undefined,
    })
    return { output: { status: response.status } }
  },
}

export const notificationTask: any = {
  slug: 'notificationTask',
  inputSchema: [
    { name: 'channel', type: 'text', required: true },
    { name: 'recipient', type: 'text', required: true },
    { name: 'content', type: 'text', required: true },
  ],
  handler: async ({ input }: { input: any }) => {
    console.log(`[Job: Notification] ${input.channel} to ${input.recipient}`)
    return { output: { success: true } }
  },
}

export const updateRecordTask: any = {
  slug: 'updateRecordTask',
  inputSchema: [
    { name: 'collection', type: 'text', required: true },
    { name: 'id', type: 'text', required: true },
    { name: 'data', type: 'json', required: true },
  ],
  handler: async ({ input, req }: { input: any; req: any }) => {
    console.log(`[Job: updateRecord] ${input.collection}:${input.id}`)
    const result = await req.payload.update({
      collection: input.collection as any,
      id: input.id,
      data: input.data,
    })
    return { output: { result } }
  },
}
