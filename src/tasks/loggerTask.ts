import { TaskConfig } from 'payload'

export const loggerTask: any = {
  slug: 'loggerTask',
  inputSchema: [{ name: 'message', type: 'text', required: true }],
  handler: async ({ input }: { input: any }) => {
    console.log(`[Job: Logger] ${input.message}`)
    return {
      output: {
        success: true,
      },
    }
  },
}
