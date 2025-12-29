import { TaskConfig } from 'payload'

export const workflowExecutor: any = {
  slug: 'workflowExecutor',
  inputSchema: [
    { name: 'workflowId', type: 'text', required: true },
    { name: 'data', type: 'json' },
  ],
  handler: async ({ input, req }: { input: any; req: any }) => {
    const { workflowId, data: initialData } = input
    const { payload } = req

    console.log(`[Job: Workflow] Starting execution for workflow: ${workflowId}`)

    const workflow = await payload.findByID({
      collection: 'workflows' as any,
      id: workflowId,
    })

    if (!workflow || workflow['status'] !== 'active') {
      return { output: { error: 'Workflow not found' } }
    }

    let context = { ...initialData }

    // Enhanced Template Resolver (Recursive)
    const resolveTemplates = (val: any): any => {
      if (typeof val === 'string') {
        // If it's exactly a template string like "{{user}}", return the actual object/value
        if (
          val.startsWith('{{') &&
          val.endsWith('}}') &&
          !val.substring(2, val.length - 2).includes('}}')
        ) {
          const path = val.slice(2, -2).trim()
          const result = path.split('.').reduce((obj: any, key: string) => obj?.[key], context)
          if (result !== undefined) return result
        }

        return val.replace(/\{\{(.+?)\}\}/g, (_, path) => {
          const result = path.split('.').reduce((obj: any, key: string) => obj?.[key], context)
          return result !== undefined ? result : `{{${path}}}`
        })
      }
      if (Array.isArray(val)) {
        return val.map(resolveTemplates)
      }
      if (val !== null && typeof val === 'object') {
        const res: any = {}
        for (const key in val) {
          res[key] = resolveTemplates(val[key])
        }
        return res
      }
      return val
    }

    for (const step of workflow['steps'] as any[]) {
      try {
        console.log(`[Job: Workflow] Step: ${step.blockType}`)

        switch (step.blockType) {
          case 'apiCall': {
            const headers: Record<string, string> = {}
            if (Array.isArray(step.headers)) {
              step.headers.forEach((h: any) => {
                if (h.key) headers[h.key] = resolveTemplates(h.value)
              })
            }
            const apiRes = await fetch(resolveTemplates(step.url), {
              method: step.method,
              headers,
              body: step.body
                ? JSON.stringify(resolveTemplates(step.body))
                : step.method !== 'GET'
                  ? JSON.stringify(context)
                  : undefined,
            })
            const apiData = await apiRes.json()
            if (step.outputKey) context[step.outputKey] = apiData
            break
          }

          case 'notification':
            console.log(
              `[Job: Notification] ${step.channel} to ${resolveTemplates(step.recipient)}: ${resolveTemplates(step.content)}`,
            )
            break

          case 'createRecord': {
            let recordData = resolveTemplates(step.data)
            if (recordData?.__template__) {
              recordData = recordData.__template__
            }

            const created = await payload.create({
              collection: resolveTemplates(step.collection) as any,
              data: recordData,
            })
            if (step.outputKey) context[step.outputKey] = created
            break
          }

          case 'updateRecord': {
            let recordData = resolveTemplates(step.data)
            if (recordData?.__template__) {
              recordData = recordData.__template__
            }

            await payload.update({
              collection: resolveTemplates(step.collection) as any,
              id: resolveTemplates(step.recordId),
              data: recordData,
            })
            break
          }

          case 'findRecord': {
            const result = await payload.find({
              collection: resolveTemplates(step.collection) as any,
              where: resolveTemplates(step.query),
              limit: 1,
            })
            if (step.outputKey) {
              context[step.outputKey] = result.docs[0] || null
            }
            break
          }

          case 'deleteRecord':
            await payload.delete({
              collection: resolveTemplates(step.collection) as any,
              id: resolveTemplates(step.recordId),
            })
            break

          case 'condition': {
            const fieldVal = resolveTemplates(`{{${step.simpleCondition?.field}}}`)
            const target = resolveTemplates(step.simpleCondition?.value)
            let isMatch = false

            const op = step.simpleCondition?.operator
            if (op === 'equals') isMatch = fieldVal == target
            if (op === 'notEquals') isMatch = fieldVal != target
            if (op === 'gt') isMatch = Number(fieldVal) > Number(target)
            if (op === 'lt') isMatch = Number(fieldVal) < Number(target)
            if (op === 'contains') isMatch = String(fieldVal).includes(String(target))
            if (op === 'exists') isMatch = fieldVal !== undefined && fieldVal !== null

            if (!isMatch && step.actionIfFalse === 'stop') {
              console.log(
                `[Job: Workflow] Condition failed (${fieldVal} ${op} ${target}), stopping.`,
              )
              return { output: { status: 'stopped', context } }
            }
            break
          }

          case 'delay': {
            const duration = Number(step.duration) || 1
            const unitMs =
              step.unit === 'minutes'
                ? 60000
                : step.unit === 'hours'
                  ? 3600000
                  : step.unit === 'days'
                    ? 86400000
                    : 1000
            const ms = duration * unitMs
            console.log(`[Job: Workflow] Delaying for ${ms}ms...`)
            await new Promise((r) => setTimeout(r, ms))
            break
          }

          case 'transform': {
            if (step.operation === 'map') {
              const result = resolveTemplates(step.mapping)
              if (step.outputKey) context[step.outputKey] = result
            }
            // JSONata could be added here if needed
            break
          }
        }
      } catch (err) {
        console.error(`[Job: Workflow] Step error in ${step.blockType}:`, err)
        throw err
      }
    }

    return { output: { status: 'completed', context } }
  },
}
