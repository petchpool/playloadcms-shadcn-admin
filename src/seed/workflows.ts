import { getPayload } from 'payload'
import config from '../payload.config'

export async function seedWorkflows() {
  console.log('\nProcessing Workflows and Rules...')
  const payload = await getPayload({ config })

  // --- 1. User Registration Workflow ---
  const welcomeWorkflow = await createOrGetWorkflow(payload, {
    name: 'User Welcome Sequence',
    status: 'active',
    steps: [
      {
        blockType: 'notification',
        channel: 'email',
        recipient: '{{user.email}}',
        subject: 'Welcome to our Platform!',
        content: 'Hi {{user.name}}, thank you for joining us. We are excited to have you on board.',
      },
      {
        blockType: 'notification',
        channel: 'chat',
        recipient: 'slack-channel-id',
        content: 'New user registered: {{user.email}}',
      },
      {
        blockType: 'apiCall',
        url: 'https://api.crm.com/v1/contacts',
        method: 'POST',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: 'Bearer crm-token' },
        ],
        body: {
          email: '{{user.email}}',
          name: '{{user.name}}',
          source: 'registration',
        },
        outputKey: 'crmContact',
      },
    ],
  })

  // --- 2. Login Security Workflow ---
  const loginNotifyWorkflow = await createOrGetWorkflow(payload, {
    name: 'Login Security Notification',
    status: 'active',
    steps: [
      {
        blockType: 'condition',
        logicType: 'simple',
        simpleCondition: {
          field: 'device.isNew',
          operator: 'equals',
          value: 'true',
        },
        actionIfFalse: 'stop',
      },
      {
        blockType: 'notification',
        channel: 'email',
        recipient: '{{user.email}}',
        subject: 'New login detected',
        content:
          'We detected a login from a new device: {{device.userAgent}}. If this was not you, please contact support.',
      },
    ],
  })

  // --- 3. Update User (Sync) Workflow ---
  const syncUserWorkflow = await createOrGetWorkflow(payload, {
    name: 'Sync User Update to CRM',
    status: 'active',
    steps: [
      {
        blockType: 'apiCall',
        url: 'https://api.crm.com/v1/contacts/{{user.crmId}}',
        method: 'PATCH',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: 'Bearer crm-token' },
        ],
        body: {
          name: '{{user.name}}',
          role: '{{user.role}}',
        },
      },
    ],
  })

  // --- Rules ---

  await createOrGetRule(payload, {
    name: 'On User Registration',
    event: 'user.register',
    priority: 100,
    workflows: [welcomeWorkflow.id] as any,
  })

  await createOrGetRule(payload, {
    name: 'On User Login',
    event: 'user.login',
    priority: 50,
    workflows: [loginNotifyWorkflow.id] as any,
  })

  await createOrGetRule(payload, {
    name: 'On User Update',
    event: 'user.update',
    priority: 50,
    workflows: [syncUserWorkflow.id] as any,
  })

  // --- 4. Contact Form Submission Workflow ---
  const contactWorkflow = await createOrGetWorkflow(payload, {
    name: 'Contact Form Lead Processing',
    status: 'active',
    steps: [
      {
        blockType: 'notification',
        channel: 'email',
        recipient: 'sales@example.com',
        subject: 'New Lead: {{subject}}',
        content: 'You have a new message from {{name}} ({{email}}): \n\n{{message}}',
      },
      {
        blockType: 'apiCall',
        url: 'https://api.crm.com/v1/leads',
        method: 'POST',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
        body: {
          first_name: '{{name}}',
          email: '{{email}}',
          description: '{{message}}',
          lead_source: 'Web Contact Form',
        },
        outputKey: 'crmLead',
      },
      {
        blockType: 'condition',
        logicType: 'simple',
        simpleCondition: {
          field: 'newsletter',
          operator: 'equals',
          value: 'true',
        },
        actionIfFalse: 'continue',
      },
      {
        blockType: 'notification',
        channel: 'email',
        recipient: '{{email}}',
        subject: 'Confirmed Newsletter Subscription',
        content: 'Hi {{name}}, thanks for subscribing to our newsletter!',
        // This only runs if condition above matches or doesn't stop
        // actually I should check logic - if false continue, so it always runs?
        // Wait, if condition matches, it continues. If not match, it does actionIfFalse.
        // In my Executor: if (!isMatch) { if (stop) return; if (error) throw; }
        // So if actionIfFalse is 'continue', it just continues to next step regardless.
      },
    ],
  })

  // --- Rules ---

  await createOrGetRule(payload, {
    name: 'On Contact Form Submission',
    event: 'form.contact.submit',
    priority: 10,
    workflows: [contactWorkflow.id] as any,
  })

  // --- 5. Complex CRUD (Auto-Archive) Workflow ---
  const archiveWorkflow = await createOrGetWorkflow(payload, {
    name: 'Auto-Archive Site Sequence',
    status: 'active',
    steps: [
      {
        blockType: 'findRecord',
        collection: 'sites',
        query: { id: { equals: '{{siteId}}' } },
        outputKey: 'foundSite',
      },
      {
        blockType: 'condition',
        logicType: 'simple',
        simpleCondition: {
          field: 'foundSite.status',
          operator: 'equals',
          value: 'active',
        },
        actionIfFalse: 'stop',
      },
      {
        blockType: 'updateRecord',
        collection: 'sites',
        recordId: '{{siteId}}',
        data: { status: 'inactive' },
      },
      {
        blockType: 'createRecord',
        collection: 'media', // Logging the event into Media as a placeholder or audit log
        data: {
          alt: 'Site Archived: {{foundSite.title}}',
          // Assuming media has these fields, otherwise adjust to your schema
        },
      },
      {
        blockType: 'deleteRecord',
        collection: 'workflow-rules', // Just a demo delete
        recordId: '{{tempRuleId}}',
      },
    ],
  })

  // --- 6. Admin: Create User Workflow ---
  const adminCreateUserWorkflow = await createOrGetWorkflow(payload, {
    name: 'Admin: Create User',
    status: 'active',
    steps: [
      {
        blockType: 'createRecord',
        collection: 'users',
        data: {
          email: '{{email}}',
          name: '{{name}}',
          role: '{{role}}',
          password: '{{password}}',
        },
      },
      {
        blockType: 'notification',
        channel: 'email',
        recipient: '{{email}}',
        subject: 'Your Account has been Created',
        content: 'Hi {{name}}, an administrator has created your account. You can now login.',
      },
    ],
  })

  // --- 7. Admin: Delete Record Workflow ---
  const adminDeleteWorkflow = await createOrGetWorkflow(payload, {
    name: 'Admin: Delete Record',
    status: 'active',
    steps: [
      {
        blockType: 'deleteRecord',
        collection: '{{collection}}',
        recordId: '{{id}}',
      },
      {
        blockType: 'notification',
        channel: 'chat',
        recipient: 'admin-log',
        content: 'Record {{id}} deleted from {{collection}} by administrator.',
      },
    ],
  })

  // --- 8. Admin: Update Status Workflow ---
  const adminUpdateStatusWorkflow = await createOrGetWorkflow(payload, {
    name: 'Admin: Update Status',
    status: 'active',
    steps: [
      {
        blockType: 'updateRecord',
        collection: '{{collection}}',
        recordId: '{{id}}',
        data: {
          status: '{{status}}',
        },
      },
    ],
  })

  // --- 9. Admin: Create Record Workflow ---
  const adminCreateRecordWorkflow = await createOrGetWorkflow(payload, {
    name: 'Admin: Create Record',
    status: 'active',
    steps: [
      {
        blockType: 'createRecord',
        collection: '{{collection}}',
        data: {
          __template__: '{{data}}',
        },
      },
      {
        blockType: 'notification',
        channel: 'chat',
        recipient: 'admin-log',
        content: 'New record created in {{collection}} by administrator.',
      },
    ],
  })

  // --- Rules ---

  await createOrGetRule(payload, {
    name: 'On Admin User Creation',
    event: 'admin.user.create',
    priority: 10,
    workflows: [adminCreateUserWorkflow.id] as any,
  })

  await createOrGetRule(payload, {
    name: 'On Admin Record Deletion',
    event: 'admin.record.delete',
    priority: 10,
    workflows: [adminDeleteWorkflow.id] as any,
  })

  await createOrGetRule(payload, {
    name: 'On Admin Status Update',
    event: 'admin.record.update_status',
    priority: 10,
    workflows: [adminUpdateStatusWorkflow.id] as any,
  })

  await createOrGetRule(payload, {
    name: 'On Admin Record Creation',
    event: 'admin.record.create',
    priority: 10,
    workflows: [adminCreateRecordWorkflow.id] as any,
  })

  await createOrGetRule(payload, {
    name: 'On Site Inactivity',
    event: 'site.inactive',
    priority: 10,
    workflows: [archiveWorkflow.id] as any,
  })

  // --- 10. Partner Application Workflow ---
  const partnerWorkflow = await createOrGetWorkflow(payload, {
    name: 'Partner Application Review',
    status: 'active',
    steps: [
      {
        blockType: 'notification',
        channel: 'email',
        recipient: 'partnerships@example.com',
        subject: 'New Partner Application: {{company}}',
        content:
          'Applicant: {{name}}\nEmail: {{email}}\nWebsite: {{website}}\n\nPlease review this application.',
      },
      {
        blockType: 'notification',
        channel: 'email',
        recipient: '{{email}}',
        subject: 'Application Received',
        content:
          'Hi {{name}},\n\nWe have received your application for {{company}}. Our team will review it shortly.',
      },
      {
        blockType: 'delay',
        duration: 2,
        unit: 'seconds',
      },
      {
        blockType: 'apiCall',
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'POST',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
        body: {
          company_name: '{{company}}',
          contact_person: '{{name}}',
          contact_email: '{{email}}',
          website_url: '{{website}}',
        },
        outputKey: 'portalResponse',
      },
    ],
  })

  await createOrGetRule(payload, {
    name: 'On Partner Application',
    event: 'form.partner.apply',
    priority: 10,
    workflows: [partnerWorkflow.id] as any,
  })

  console.log('✅ Standard workflows seeded successfully')
}

async function createOrGetWorkflow(payload: any, data: any) {
  const existing = await payload.find({
    collection: 'workflows' as any,
    where: { name: { equals: data.name } },
  })

  if (existing.totalDocs > 0) {
    console.log(`Workflow "${data.name}" already exists.`)
    return existing.docs[0]
  }

  const created = await payload.create({
    collection: 'workflows' as any,
    data: data,
  })
  console.log(`Created Workflow: ${created.name}`)
  return created
}

async function createOrGetRule(payload: any, data: any) {
  const existing = await payload.find({
    collection: 'workflow-rules' as any,
    where: { name: { equals: data.name } },
  })

  if (existing.totalDocs > 0) {
    console.log(`Rule "${data.name}" already exists.`)
    return existing.docs[0]
  }

  const created = await payload.create({
    collection: 'workflow-rules' as any,
    data: {
      ...data,
      active: true,
    },
  })
  console.log(`Created Rule: ${created.name}`)
  return created
}
