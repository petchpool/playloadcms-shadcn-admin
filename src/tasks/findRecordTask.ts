import { TaskConfig } from 'payload'

export const findRecordTask: any = {
  slug: 'findRecordTask',
  inputSchema: [
    { name: 'collection', type: 'text', required: true },
    { name: 'query', type: 'json', required: true },
  ],
  handler: async ({ input, req }: { input: any; req: any }) => {
    const result = await req.payload.find({
      collection: input.collection as any,
      where: input.query,
      limit: 1,
    })
    return {
      output: {
        doc: result.docs[0] || null,
        found: result.totalDocs > 0,
      },
    }
  },
}
