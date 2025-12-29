'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

type WorkflowContext = {
  tenantId?: string
  formId?: string
  [key: string]: any
}

/**
 * processEvent - Entry point for the workflow engine.
 * It matches events against WorkflowRules and queues Jobs in the background.
 */
export async function processEvent(event: string, payload: any, context: WorkflowContext = {}) {
  console.log(`[WorkflowEngine] Processing event: ${event}`, { payload, context })

  try {
    const payloadClient = await getPayload({ config })

    // 1. Find Matching Rules
    const rulesQuery = await payloadClient.find({
      collection: 'workflow-rules' as any,
      where: {
        and: [{ event: { equals: event } }, { active: { equals: true } }],
      },
      sort: '-priority',
    })

    console.log(`[WorkflowEngine] Found ${rulesQuery.totalDocs} matching rules`)

    // 2. Execute Rules (Queue Jobs using Payload Native Job Queue)
    for (const rule of rulesQuery.docs) {
      if ((rule as any).workflows && Array.isArray((rule as any).workflows)) {
        for (const workflowRef of (rule as any).workflows) {
          const workflowId = typeof workflowRef === 'string' ? workflowRef : (workflowRef as any).id

          if (workflowId) {
            console.log(`[WorkflowEngine] Queuing background job for Workflow: ${workflowId}`)

            // Native Payload Jobs Queue
            await (payloadClient as any).jobs.queue({
              task: 'workflowExecutor',
              input: {
                workflowId,
                data: {
                  ...payload,
                  _context: context, // Pass extra context if needed
                },
              },
            })
          }
        }
      }

      if ((rule as any).stopOnMatch) {
        console.log(`[WorkflowEngine] Rule ${rule.id} requested stopOnMatch.`)
        break
      }
    }

    return { success: true, message: 'Event successfully queued' }
  } catch (error) {
    console.error('[WorkflowEngine] Error processing event:', error)
    return { success: false, error: 'Internal processing error' }
  }
}
