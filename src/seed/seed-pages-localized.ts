import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Seed pages with localized content (single page with multiple locales)
 * Includes comprehensive examples of all block types
 */
export async function seedPagesLocalized() {
  const payload = await getPayload({ config })

  console.log('\n📄 Seeding Pages (Localized)...')
  console.log('🌱 Upserting pages with localized content...')

  // Helper function to create Lexical content
  const createLexicalContent = (text: string) => {
    const lines = text.split('\n')
    const children: any[] = []

    for (const line of lines) {
      if (line.startsWith('# ')) {
        children.push({
          type: 'heading',
          tag: 'h1',
          children: [{ type: 'text', text: line.substring(2) }],
        })
      } else if (line.startsWith('## ')) {
        children.push({
          type: 'heading',
          tag: 'h2',
          children: [{ type: 'text', text: line.substring(3) }],
        })
      } else if (line.startsWith('### ')) {
        children.push({
          type: 'heading',
          tag: 'h3',
          children: [{ type: 'text', text: line.substring(4) }],
        })
      } else if (line.trim()) {
        children.push({
          type: 'paragraph',
          children: [{ type: 'text', text: line }],
        })
      }
    }

    return {
      root: {
        type: 'root',
        children: children.length > 0 ? children : [{ type: 'paragraph', children: [] }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    }
  }

  // Page data with both EN and TH content
  const pagesData = [
    // ========================================
    // 1. HOME PAGE
    // ========================================
    {
      titleEn: 'Home',
      titleTh: 'หน้าแรก',
      slug: 'home',
      order: 1,
      blocksEn: [
        {
          blockType: 'richText',
          content: createLexicalContent(
            '# Welcome to PayloadCMS + shadcn/ui\n\nA powerful, flexible content management system with beautiful UI components.',
          ),
        },
        // Hero Stats with DataFetch
        {
          blockType: 'dataFetch',
          dataKey: 'totalUsers',
          sources: [
            {
              type: 'collection',
              collection: 'users',
            },
          ],
          query: {
            limit: 0,
          },
          transform: {
            type: 'count',
          },
          children: [
            {
              blockType: 'dataFetch',
              dataKey: 'totalPages',
              sources: [
                {
                  type: 'collection',
                  collection: 'pages',
                },
              ],
              query: {
                limit: 0,
              },
              transform: {
                type: 'count',
              },
              children: [
                {
                  blockType: 'dataFetch',
                  dataKey: 'totalComponents',
                  sources: [
                    {
                      type: 'collection',
                      collection: 'components',
                    },
                  ],
                  query: {
                    limit: 0,
                  },
                  transform: {
                    type: 'count',
                  },
                  children: [
                    {
                      blockType: 'grid',
                      columns: '3',
                      gap: 'lg',
                      items: [
                        {
                          content: [
                            {
                              blockType: 'statCard',
                              title: 'Total Users',
                              description: 'Registered users in the system',
                              icon: 'users',
                              dataKey: 'totalUsers',
                              valueField: 'value',
                              format: { suffix: ' users' },
                              variant: 'default',
                              size: 'md',
                            },
                          ],
                        },
                        {
                          content: [
                            {
                              blockType: 'statCard',
                              title: 'Total Pages',
                              description: 'Content pages created',
                              icon: 'file',
                              dataKey: 'totalPages',
                              valueField: 'value',
                              format: { suffix: ' pages' },
                              variant: 'gradient',
                              size: 'md',
                            },
                          ],
                        },
                        {
                          content: [
                            {
                              blockType: 'statCard',
                              title: 'Components',
                              description: 'Reusable components',
                              icon: 'box',
                              dataKey: 'totalComponents',
                              valueField: 'value',
                              format: { suffix: ' items' },
                              variant: 'outline',
                              size: 'md',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          blockType: 'richText',
          content: createLexicalContent(
            '## Key Features\n\nPowerful blocks system, Role-based access control, Multi-language support, Custom components',
          ),
        },
      ],
      blocksTh: [
        {
          blockType: 'richText',
          content: createLexicalContent(
            '# ยินดีต้อนรับสู่ PayloadCMS + shadcn/ui\n\nระบบจัดการเนื้อหาที่ทรงพลังและยืดหยุ่นพร้อม UI components ที่สวยงาม',
          ),
        },
        {
          blockType: 'dataFetch',
          dataKey: 'totalUsers',
          sources: [
            {
              type: 'collection',
              collection: 'users',
            },
          ],
          query: {
            limit: 0,
          },
          transform: {
            type: 'count',
          },
          children: [
            {
              blockType: 'dataFetch',
              dataKey: 'totalPages',
              sources: [
                {
                  type: 'collection',
                  collection: 'pages',
                },
              ],
              query: {
                limit: 0,
              },
              transform: {
                type: 'count',
              },
              children: [
                {
                  blockType: 'dataFetch',
                  dataKey: 'totalComponents',
                  sources: [
                    {
                      type: 'collection',
                      collection: 'components',
                    },
                  ],
                  query: {
                    limit: 0,
                  },
                  transform: {
                    type: 'count',
                  },
                  children: [
                    {
                      blockType: 'grid',
                      columns: '3',
                      gap: 'lg',
                      items: [
                        {
                          content: [
                            {
                              blockType: 'statCard',
                              title: 'ผู้ใช้ทั้งหมด',
                              description: 'ผู้ใช้ที่ลงทะเบียนในระบบ',
                              icon: 'users',
                              dataKey: 'totalUsers',
                              valueField: 'value',
                              format: { suffix: ' คน' },
                              variant: 'default',
                              size: 'md',
                            },
                          ],
                        },
                        {
                          content: [
                            {
                              blockType: 'statCard',
                              title: 'เพจทั้งหมด',
                              description: 'หน้าเนื้อหาที่สร้างแล้ว',
                              icon: 'file',
                              dataKey: 'totalPages',
                              valueField: 'value',
                              format: { suffix: ' หน้า' },
                              variant: 'gradient',
                              size: 'md',
                            },
                          ],
                        },
                        {
                          content: [
                            {
                              blockType: 'statCard',
                              title: 'คอมโพเนนต์',
                              description: 'คอมโพเนนต์ที่ใช้ซ้ำได้',
                              icon: 'box',
                              dataKey: 'totalComponents',
                              valueField: 'value',
                              format: { suffix: ' รายการ' },
                              variant: 'outline',
                              size: 'md',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          blockType: 'richText',
          content: createLexicalContent(
            '## คุณสมบัติหลัก\n\nระบบ blocks ที่ทรงพลัง, ระบบควบคุมสิทธิ์แบบ role-based, รองรับหลายภาษา, คอมโพเนนต์ที่กำหนดเองได้',
          ),
        },
      ],
    },

    // ========================================
    // 2. DASHBOARD PAGE
    // ========================================
    {
      titleEn: 'Dashboard',
      titleTh: 'แดชบอร์ด',
      slug: 'dashboard',
      order: 2,
      blocksEn: [
        {
          blockType: 'richText',
          content: createLexicalContent('# Dashboard\n\nSystem overview and statistics'),
        },
        // Top Stats Row
        {
          blockType: 'dataFetch',
          dataKey: 'activeUsers',
          sources: [
            {
              type: 'collection',
              collection: 'users',
            },
          ],
          query: {
            limit: 0,
          },
          transform: {
            type: 'count',
          },
          children: [
            {
              blockType: 'grid',
              columns: '4',
              gap: 'md',
              items: [
                {
                  content: [
                    {
                      blockType: 'statCard',
                      title: 'Active Users',
                      icon: 'users',
                      dataKey: 'activeUsers',
                      valueField: 'value',
                      format: { suffix: ' users' },
                      trend: { value: 12.5, label: 'vs last month' },
                      variant: 'default',
                      size: 'lg',
                    },
                  ],
                },
                {
                  content: [
                    {
                      blockType: 'statCard',
                      title: 'Revenue',
                      icon: 'dollar',
                      staticValue: '$45,231',
                      trend: { value: 8.2, label: 'this month' },
                      variant: 'gradient',
                      size: 'lg',
                    },
                  ],
                },
                {
                  content: [
                    {
                      blockType: 'statCard',
                      title: 'Active Sessions',
                      icon: 'activity',
                      staticValue: '2,350',
                      trend: { value: -4.3, label: 'vs yesterday' },
                      variant: 'outline',
                      size: 'lg',
                    },
                  ],
                },
                {
                  content: [
                    {
                      blockType: 'statCard',
                      title: 'Conversion Rate',
                      icon: 'activity',
                      staticValue: '3.24%',
                      trend: { value: 1.3, label: 'this week' },
                      variant: 'default',
                      size: 'lg',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          blockType: 'richText',
          content: createLexicalContent(
            '## Recent Components\n\nComponents available in the system',
          ),
        },
        // Components Table
        {
          blockType: 'dataFetch',
          dataKey: 'componentsList',
          sources: [
            {
              type: 'collection',
              collection: 'components',
            },
          ],
          query: {
            limit: 10,
            sort: '-createdAt',
          },
          transform: {
            type: 'none',
          },
          children: [
            {
              blockType: 'blocksTable',
              title: 'Components List',
              collection: 'components',
              useExternalData: true,
              dataKey: 'componentsList',
              columns: [
                { key: 'name', label: 'Name', sortable: true },
                { key: 'slug', label: 'Slug', sortable: true },
                { key: 'category', label: 'Category', sortable: true },
                { key: 'status', label: 'Status', sortable: true },
                { key: 'createdAt', label: 'Created', sortable: true },
              ],
            },
          ],
        },
        {
          blockType: 'richText',
          content: createLexicalContent('## All Users\n\nUser management and overview'),
        },
        // Users Table (without external data)
        {
          blockType: 'blocksTable',
          title: 'Users List',
          collection: 'users',
          limit: 10,
          columns: [
            { key: 'email', label: 'Email', sortable: true },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'createdAt', label: 'Created', sortable: true },
          ],
          filterFields: [],
          searchFields: [{ field: 'email' }, { field: 'name' }],
        },
      ],
      blocksTh: [
        {
          blockType: 'richText',
          content: createLexicalContent('# แดชบอร์ด\n\nภาพรวมระบบและสถิติ'),
        },
        {
          blockType: 'dataFetch',
          dataKey: 'activeUsers',
          sources: [
            {
              type: 'collection',
              collection: 'users',
            },
          ],
          query: {
            limit: 0,
          },
          transform: {
            type: 'count',
          },
          children: [
            {
              blockType: 'grid',
              columns: '4',
              gap: 'md',
              items: [
                {
                  content: [
                    {
                      blockType: 'statCard',
                      title: 'ผู้ใช้ที่ใช้งาน',
                      icon: 'users',
                      dataKey: 'activeUsers',
                      valueField: 'value',
                      format: { suffix: ' คน' },
                      trend: { value: 12.5, label: 'เทียบกับเดือนที่แล้ว' },
                      variant: 'default',
                      size: 'lg',
                    },
                  ],
                },
                {
                  content: [
                    {
                      blockType: 'statCard',
                      title: 'รายได้',
                      icon: 'dollar',
                      staticValue: '$45,231',
                      trend: { value: 8.2, label: 'เดือนนี้' },
                      variant: 'gradient',
                      size: 'lg',
                    },
                  ],
                },
                {
                  content: [
                    {
                      blockType: 'statCard',
                      title: 'เซสชันที่ใช้งาน',
                      icon: 'activity',
                      staticValue: '2,350',
                      trend: { value: -4.3, label: 'เทียบกับเมื่อวาน' },
                      variant: 'outline',
                      size: 'lg',
                    },
                  ],
                },
                {
                  content: [
                    {
                      blockType: 'statCard',
                      title: 'อัตราการแปลง',
                      icon: 'activity',
                      staticValue: '3.24%',
                      trend: { value: 1.3, label: 'สัปดาห์นี้' },
                      variant: 'default',
                      size: 'lg',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          blockType: 'richText',
          content: createLexicalContent('## คอมโพเนนต์ล่าสุด\n\nคอมโพเนนต์ที่มีในระบบ'),
        },
        {
          blockType: 'dataFetch',
          dataKey: 'componentsList',
          sources: [
            {
              type: 'collection',
              collection: 'components',
            },
          ],
          query: {
            limit: 10,
            sort: '-createdAt',
          },
          transform: {
            type: 'none',
          },
          children: [
            {
              blockType: 'blocksTable',
              title: 'รายการคอมโพเนนต์',
              collection: 'components',
              useExternalData: true,
              dataKey: 'componentsList',
              columns: [
                { key: 'name', label: 'ชื่อ', sortable: true },
                { key: 'slug', label: 'Slug', sortable: true },
                { key: 'category', label: 'หมวดหมู่', sortable: true },
                { key: 'status', label: 'สถานะ', sortable: true },
                { key: 'createdAt', label: 'สร้างเมื่อ', sortable: true },
              ],
            },
          ],
        },
        {
          blockType: 'richText',
          content: createLexicalContent('## ผู้ใช้ทั้งหมด\n\nการจัดการและภาพรวมผู้ใช้'),
        },
        {
          blockType: 'blocksTable',
          title: 'รายการผู้ใช้',
          collection: 'users',
          limit: 10,
          columns: [
            { key: 'email', label: 'อีเมล', sortable: true },
            { key: 'name', label: 'ชื่อ', sortable: true },
            { key: 'createdAt', label: 'สร้างเมื่อ', sortable: true },
          ],
          filterFields: [],
          searchFields: [{ field: 'email' }, { field: 'name' }],
        },
      ],
    },

    // ========================================
    // 3. ABOUT PAGE
    // ========================================
    {
      titleEn: 'About',
      titleTh: 'เกี่ยวกับเรา',
      slug: 'about',
      order: 3,
      blocksEn: [
        {
          blockType: 'richText',
          content: createLexicalContent(
            '# About Us\n\n## Our Mission\n\nTo provide the best content management system with modern UI components.\n\n## Our Vision\n\nEmpowering developers to build beautiful, functional applications faster.',
          ),
        },
        {
          blockType: 'grid',
          columns: '2',
          gap: 'lg',
          items: [
            {
              content: [
                {
                  blockType: 'richText',
                  content: createLexicalContent(
                    '### Feature 1\n\nPowerful and flexible blocks system',
                  ),
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'richText',
                  content: createLexicalContent('### Feature 2\n\nRole-based access control'),
                },
              ],
            },
          ],
        },
      ],
      blocksTh: [
        {
          blockType: 'richText',
          content: createLexicalContent(
            '# เกี่ยวกับเรา\n\n## พันธกิจของเรา\n\nมอบระบบจัดการเนื้อหาที่ดีที่สุดพร้อม UI components ที่ทันสมัย\n\n## วิสัยทัศน์ของเรา\n\nเสริมพลังให้นักพัฒนาสร้างแอปพลิเคชันที่สวยงามและใช้งานได้จริงได้เร็วขึ้น',
          ),
        },
        {
          blockType: 'grid',
          columns: '2',
          gap: 'lg',
          items: [
            {
              content: [
                {
                  blockType: 'richText',
                  content: createLexicalContent(
                    '### คุณสมบัติ 1\n\nระบบ blocks ที่ทรงพลังและยืดหยุ่น',
                  ),
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'richText',
                  content: createLexicalContent(
                    '### คุณสมบัติ 2\n\nระบบควบคุมสิทธิ์แบบ role-based',
                  ),
                },
              ],
            },
          ],
        },
      ],
    },

    // ========================================
    // 4. CONTACT PAGE
    // ========================================
    {
      titleEn: 'Contact',
      titleTh: 'ติดต่อเรา',
      slug: 'contact',
      order: 4,
      blocksEn: [
        {
          blockType: 'richText',
          content: createLexicalContent(
            '# Contact Us\n\nGet in touch with our team\n\n## Office Hours\n\nMonday - Friday: 9:00 AM - 5:00 PM\nSaturday - Sunday: Closed',
          ),
        },
        {
          blockType: 'grid',
          columns: '3',
          gap: 'md',
          items: [
            {
              content: [
                {
                  blockType: 'statCard',
                  title: 'Email',
                  icon: 'mail',
                  staticValue: 'hello@example.com',
                  variant: 'outline',
                  size: 'sm',
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'statCard',
                  title: 'Phone',
                  icon: 'phone',
                  staticValue: '+66 2 123 4567',
                  variant: 'outline',
                  size: 'sm',
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'statCard',
                  title: 'Location',
                  icon: 'map',
                  staticValue: 'Bangkok, Thailand',
                  variant: 'outline',
                  size: 'sm',
                },
              ],
            },
          ],
        },
      ],
      blocksTh: [
        {
          blockType: 'richText',
          content: createLexicalContent(
            '# ติดต่อเรา\n\nติดต่อทีมของเรา\n\n## เวลาทำการ\n\nจันทร์ - ศุกร์: 9:00 - 17:00 น.\nเสาร์ - อาทิตย์: ปิดทำการ',
          ),
        },
        {
          blockType: 'grid',
          columns: '3',
          gap: 'md',
          items: [
            {
              content: [
                {
                  blockType: 'statCard',
                  title: 'อีเมล',
                  icon: 'mail',
                  staticValue: 'hello@example.com',
                  variant: 'outline',
                  size: 'sm',
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'statCard',
                  title: 'โทรศัพท์',
                  icon: 'phone',
                  staticValue: '+66 2 123 4567',
                  variant: 'outline',
                  size: 'sm',
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'statCard',
                  title: 'ที่ตั้ง',
                  icon: 'map',
                  staticValue: 'กรุงเทพฯ ประเทศไทย',
                  variant: 'outline',
                  size: 'sm',
                },
              ],
            },
          ],
        },
      ],
    },

    // ========================================
    // 5. ANALYTICS PAGE
    // ========================================
    {
      titleEn: 'Analytics',
      titleTh: 'การวิเคราะห์',
      slug: 'analytics',
      order: 5,
      blocksEn: [
        {
          blockType: 'richText',
          content: createLexicalContent(
            '# System Analytics\n\nPerformance metrics and system health.',
          ),
        },
      ],
      blocksTh: [
        {
          blockType: 'richText',
          content: createLexicalContent('# การวิเคราะห์ระบบ\n\nสถิติประสิทธิภาพและสุขภาพของระบบ'),
        },
      ],
    },
    // ========================================
    // 6. ADMIN USERS MANAGEMENT
    // ========================================
    {
      titleEn: 'Users Management',
      titleTh: 'จัดการผู้ใช้งาน',
      slug: 'admin/users',
      order: 6,
      blocksEn: [
        {
          blockType: 'grid',
          columns: '2',
          items: [
            {
              content: [
                {
                  blockType: 'richText',
                  content: createLexicalContent(
                    '# Users Management\nView and manage all system users.',
                  ),
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'form',
                  formId: 'create-user-form',
                  title: 'Add New User',
                  triggerLabel: 'Create User',
                  triggerVariant: 'primary',
                  submission: {
                    type: 'event',
                    eventName: 'admin.user.create',
                  },
                  fields: [
                    { name: 'name', label: 'Full Name', type: 'text', required: true },
                    { name: 'email', label: 'Email', type: 'email', required: true },
                    { name: 'password', label: 'Initial Password', type: 'text', required: true },
                    {
                      name: 'role',
                      label: 'Role',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Admin', value: 'admin' },
                        { label: 'Editor', value: 'editor' },
                        { label: 'Viewer', value: 'viewer' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          blockType: 'blocksTable',
          title: 'All Users',
          collection: 'users',
          limit: 10,
          columns: [
            {
              key: 'avatar',
              label: 'User',
              type: 'custom',
              blocks: [{ blockType: 'avatar', nameField: 'name', imageField: 'imageUrl' }],
            },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            { key: 'createdAt', label: 'Joined', type: 'date', sortable: true },
          ],
        },
      ],
      blocksTh: [
        {
          blockType: 'grid',
          columns: '2',
          items: [
            {
              content: [
                {
                  blockType: 'richText',
                  content: createLexicalContent(
                    '# จัดการผู้ใช้งาน\nดูและจัดการผู้ใช้ทั้งหมดในระบบ',
                  ),
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'form',
                  formId: 'create-user-form-th',
                  title: 'เพิ่มผู้ใช้งานใหม่',
                  triggerLabel: 'สร้างผู้ใช้งาน',
                  triggerVariant: 'primary',
                  submission: {
                    type: 'event',
                    eventName: 'admin.user.create',
                  },
                  fields: [
                    { name: 'name', label: 'ชื่อ-นามสกุล', type: 'text', required: true },
                    { name: 'email', label: 'อีเมล', type: 'email', required: true },
                    { name: 'password', label: 'รหัสผ่านเริ่มต้น', type: 'text', required: true },
                    {
                      name: 'role',
                      label: 'บทบาท',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'ผู้ดูแลระบบ', value: 'admin' },
                        { label: 'บรรณาธิการ', value: 'editor' },
                        { label: 'ผู้เข้าชม', value: 'viewer' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          blockType: 'blocksTable',
          title: 'ผู้ใช้ทั้งหมด',
          collection: 'users',
          limit: 10,
          columns: [
            {
              key: 'avatar',
              label: 'ผู้ใช้งาน',
              type: 'custom',
              blocks: [{ blockType: 'avatar', nameField: 'name', imageField: 'imageUrl' }],
            },
            { key: 'name', label: 'ชื่อ', sortable: true },
            { key: 'email', label: 'อีเมล', sortable: true },
            { key: 'createdAt', label: 'วันที่เข้าร่วม', type: 'date', sortable: true },
          ],
        },
      ],
    },
    // ========================================
    // 7. ADMIN BLOCKS MANAGEMENT
    // ========================================
    {
      titleEn: 'Blocks Management',
      titleTh: 'จัดการบล็อก',
      slug: 'admin/blocks',
      order: 7,
      blocksEn: [
        {
          blockType: 'grid',
          columns: '2',
          items: [
            {
              content: [
                {
                  blockType: 'richText',
                  content: createLexicalContent(
                    '# Blocks Management\nManage reusable UI blocks and templates.',
                  ),
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'form',
                  formId: 'create-block-form',
                  title: 'Create Shared Block',
                  triggerLabel: 'New Block',
                  triggerVariant: 'primary',
                  submission: {
                    type: 'event',
                    eventName: 'admin.record.create',
                  },
                  fields: [
                    { name: 'data.name', label: 'Block Name', type: 'text', required: true },
                    { name: 'data.slug', label: 'Slug', type: 'text', required: true },
                    {
                      name: 'collection',
                      label: 'Collection',
                      type: 'hidden',
                      defaultValue: 'blocks',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          blockType: 'blocksTable',
          title: 'UI Blocks',
          collection: 'blocks',
          limit: 10,
          columns: [
            { key: 'name', label: 'Block Name', sortable: true },
            { key: 'type', label: 'Type', type: 'badge' },
            { key: 'category', label: 'Category', type: 'badge' },
            { key: 'status', label: 'Status', type: 'badge' },
          ],
        },
      ],
      blocksTh: [
        {
          blockType: 'grid',
          columns: '2',
          items: [
            {
              content: [
                {
                  blockType: 'richText',
                  content: createLexicalContent(
                    '# จัดการบล็อก\nจัดการ UI blocks และเทมเพลตที่ใช้ซ้ำได้',
                  ),
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'form',
                  formId: 'create-block-form-th',
                  title: 'สร้างบล็อกใหม่',
                  triggerLabel: 'สร้างบล็อก',
                  triggerVariant: 'primary',
                  submission: {
                    type: 'event',
                    eventName: 'admin.record.create',
                  },
                  fields: [
                    { name: 'data.name', label: 'ชื่อบล็อก', type: 'text', required: true },
                    { name: 'data.slug', label: 'สลัก (Slug)', type: 'text', required: true },
                    {
                      name: 'collection',
                      label: 'Collection',
                      type: 'hidden',
                      defaultValue: 'blocks',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          blockType: 'blocksTable',
          title: 'รายการบล็อก',
          collection: 'blocks',
          limit: 10,
          columns: [
            { key: 'name', label: 'ชื่อบล็อก', sortable: true },
            { key: 'type', label: 'ประเภท', type: 'badge' },
            { key: 'category', label: 'หมวดหมู่', type: 'badge' },
          ],
        },
      ],
    },
    // ========================================
    // 8. ADMIN WORKFLOWS MANAGEMENT
    // ========================================
    {
      titleEn: 'Workflows Management',
      titleTh: 'จัดการเวิร์กโฟลว์',
      slug: 'admin/workflows',
      order: 8,
      blocksEn: [
        {
          blockType: 'grid',
          columns: '2',
          items: [
            {
              content: [
                {
                  blockType: 'richText',
                  content: createLexicalContent(
                    '# Workflows & Automation\nMonitor and manage automated processes.',
                  ),
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'form',
                  formId: 'create-rule-form',
                  title: 'Add Automation Rule',
                  triggerLabel: 'New Rule',
                  triggerVariant: 'primary',
                  submission: {
                    type: 'event',
                    eventName: 'admin.record.create',
                  },
                  fields: [
                    { name: 'data.name', label: 'Rule Name', type: 'text', required: true },
                    {
                      name: 'data.event',
                      label: 'Event Trigger',
                      type: 'text',
                      required: true,
                      placeholder: 'user.login',
                    },
                    { name: 'data.priority', label: 'Priority', type: 'number', defaultValue: 10 },
                    {
                      name: 'collection',
                      label: 'Collection',
                      type: 'hidden',
                      defaultValue: 'workflow-rules',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          blockType: 'blocksTable',
          title: 'Active Workflows',
          collection: 'workflows',
          limit: 10,
          columns: [
            { key: 'name', label: 'Workflow Name', sortable: true },
            { key: 'status', label: 'Status', type: 'badge' },
            { key: 'updatedAt', label: 'Last Updated', type: 'date' },
          ],
        },
        {
          blockType: 'richText',
          content: createLexicalContent('## Automation Rules'),
        },
        {
          blockType: 'blocksTable',
          title: 'Trigger Rules',
          collection: 'workflow-rules',
          limit: 10,
          columns: [
            { key: 'name', label: 'Rule Name', sortable: true },
            { key: 'event', label: 'Event Trigger', type: 'badge' },
            { key: 'active', label: 'Active', type: 'boolean' },
          ],
        },
      ],
      blocksTh: [
        {
          blockType: 'grid',
          columns: '2',
          items: [
            {
              content: [
                {
                  blockType: 'richText',
                  content: createLexicalContent(
                    '# จัดการเวิร์กโฟลว์และระบบอัตโนมัติ\nตรวจสอบและจัดการกระบวนการอัตโนมัติ',
                  ),
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'form',
                  formId: 'create-rule-form-th',
                  title: 'เพิ่มกฎอัตโนมัติ',
                  triggerLabel: 'กฎใหม่',
                  triggerVariant: 'primary',
                  submission: {
                    type: 'event',
                    eventName: 'admin.record.create',
                  },
                  fields: [
                    { name: 'data.name', label: 'ชื่อกฎ', type: 'text', required: true },
                    {
                      name: 'data.event',
                      label: 'อีเวนต์ที่กระตุ้น',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'collection',
                      label: 'Collection',
                      type: 'hidden',
                      defaultValue: 'workflow-rules',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          blockType: 'blocksTable',
          title: 'เวิร์กโฟลว์ที่ใช้งาน',
          collection: 'workflows',
          limit: 10,
          columns: [
            { key: 'name', label: 'ชื่อเวิร์กโฟลว์', sortable: true },
            { key: 'status', label: 'สถานะ', type: 'badge' },
          ],
        },
        {
          blockType: 'blocksTable',
          title: 'กฎการประมวลผล',
          collection: 'workflow-rules',
          limit: 10,
          columns: [
            { key: 'name', label: 'ชื่อกฎ', sortable: true },
            { key: 'event', label: 'อีเวนต์', type: 'badge' },
          ],
        },
      ],
    },
    // ========================================
    // 9. REGISTER PAGE
    // ========================================
    {
      titleEn: 'Register',
      titleTh: 'สมัครสมาชิก',
      slug: 'register',
      order: 9,
      blocksEn: [
        {
          blockType: 'grid',
          columns: '2',
          items: [
            {
              content: [
                {
                  blockType: 'richText',
                  content: createLexicalContent(
                    '# Join Our Community\nCreate an account to access premium features and personalized content.',
                  ),
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'form',
                  formId: 'public-register-form',
                  title: 'Create Account',
                  triggerLabel: 'Register Now',
                  triggerVariant: 'primary',
                  submission: {
                    type: 'event',
                    eventName: 'user.register',
                  },
                  fields: [
                    { name: 'name', label: 'Full Name', type: 'text', required: true },
                    { name: 'email', label: 'Email Address', type: 'email', required: true },
                    { name: 'password', label: 'Password', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
      blocksTh: [
        {
          blockType: 'grid',
          columns: '2',
          items: [
            {
              content: [
                {
                  blockType: 'richText',
                  content: createLexicalContent(
                    '# เข้าร่วมกับเรา\nสร้างบัญชีเพื่อเข้าถึงฟีเจอร์ระดับพรีเมียมและเนื้อหาสำหรับคุณโดยเฉพาะ',
                  ),
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'form',
                  formId: 'public-register-form-th',
                  title: 'สร้างบัญชีผู้ใช้',
                  triggerLabel: 'สมัครสมาชิก',
                  triggerVariant: 'primary',
                  submission: {
                    type: 'event',
                    eventName: 'user.register',
                  },
                  fields: [
                    { name: 'name', label: 'ชื่อ-นามสกุล', type: 'text', required: true },
                    { name: 'email', label: 'ที่อยู่อีเมล', type: 'email', required: true },
                    { name: 'password', label: 'รหัสผ่าน', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    // ========================================
    // 10. PROFILE PAGE
    // ========================================
    {
      titleEn: 'My Profile',
      titleTh: 'โปรไฟล์ของฉัน',
      slug: 'profile',
      order: 10,
      blocksEn: [
        {
          blockType: 'richText',
          content: createLexicalContent(
            '# My Profile\nManage your personal information and preferences.',
          ),
        },
        {
          blockType: 'statCard',
          title: 'Member Status',
          staticValue: 'Premium Member',
          variant: 'gradient',
        },
      ],
      blocksTh: [
        {
          blockType: 'richText',
          content: createLexicalContent('# โปรไฟล์ของฉัน\nจัดการข้อมูลส่วนตัวและความชอบของคุณ'),
        },
        {
          blockType: 'statCard',
          title: 'สถานะสมาชิก',
          staticValue: 'สมาชิกพรีเมียม',
          variant: 'gradient',
        },
      ],
    },
    // ========================================
    // 11. PARTNER APPLICATION PAGE
    // ========================================
    {
      titleEn: 'Partner Program',
      titleTh: 'โปรแกรมพาร์ทเนอร์',
      slug: 'partner',
      order: 11,
      blocksEn: [
        {
          blockType: 'grid',
          columns: '2',
          items: [
            {
              content: [
                {
                  blockType: 'richText',
                  content: createLexicalContent(
                    '# Become a Partner\nJoin our ecosystem and grow your business with us.',
                  ),
                },
                {
                  blockType: 'statCard',
                  title: 'Partner Benefits',
                  staticValue: 'Earn up to 20%',
                  variant: 'default',
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'form',
                  formId: 'partner-appl-form',
                  title: 'Application Form',
                  triggerLabel: 'Submit Application',
                  triggerVariant: 'primary',
                  submission: {
                    type: 'event',
                    eventName: 'form.partner.apply',
                  },
                  fields: [
                    { name: 'company', label: 'Company Name', type: 'text', required: true },
                    {
                      name: 'website',
                      label: 'Website URL',
                      type: 'text',
                      required: true,
                      placeholder: 'https://',
                    },
                    { name: 'name', label: 'Contact Person', type: 'text', required: true },
                    { name: 'email', label: 'Business Email', type: 'email', required: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
      blocksTh: [
        {
          blockType: 'grid',
          columns: '2',
          items: [
            {
              content: [
                {
                  blockType: 'richText',
                  content: createLexicalContent(
                    '# ร่วมเป็นพาร์ทเนอร์กับเรา\nเข้าร่วมอีโคซิสเต็มของเราและเติบโตไปด้วยกัน',
                  ),
                },
                {
                  blockType: 'statCard',
                  title: 'สิทธิประโยชน์',
                  staticValue: 'รับรายได้สูงสุด 20%',
                  variant: 'default',
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'form',
                  formId: 'partner-appl-form-th',
                  title: 'แบบฟอร์มใบสมัคร',
                  triggerLabel: 'ส่งใบสมัคร',
                  triggerVariant: 'primary',
                  submission: {
                    type: 'event',
                    eventName: 'form.partner.apply',
                  },
                  fields: [
                    { name: 'company', label: 'ชื่อบริษัท', type: 'text', required: true },
                    {
                      name: 'website',
                      label: 'เว็บไซต์',
                      type: 'text',
                      required: true,
                      placeholder: 'https://',
                    },
                    { name: 'name', label: 'ชื่อผู้ติดต่อ', type: 'text', required: true },
                    { name: 'email', label: 'อีเมลธุรกิจ', type: 'email', required: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]

  // Create/update pages
  for (const pageData of pagesData) {
    try {
      // Check if page exists
      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: pageData.slug } },
        limit: 1,
        locale: 'all',
        overrideAccess: true,
      })

      const contentBlocksEn = (pageData as any).blocksEn || []
      const contentBlocksTh = (pageData as any).blocksTh || []

      if (existing.docs.length > 0) {
        const page = existing.docs[0]

        // Update EN (slug is localized, so send it)
        await payload.update({
          collection: 'pages',
          id: page.id,
          locale: 'en',
          data: {
            title: pageData.titleEn,
            slug: pageData.slug,
            content: contentBlocksEn,
            pageStatus: 'published',
            seo: {
              metaTitle: pageData.titleEn,
              metaDescription: `${pageData.titleEn} page`,
            },
            order: pageData.order,
            publishedAt: new Date().toISOString(),
          },
          overrideAccess: true,
          draft: false,
        })

        // Update TH (slug is localized, so send it)
        await payload.update({
          collection: 'pages',
          id: page.id,
          locale: 'th',
          data: {
            title: pageData.titleTh,
            slug: pageData.slug,
            content: contentBlocksTh,
            seo: {
              metaTitle: pageData.titleTh,
              metaDescription: `${pageData.titleTh} page`,
            },
          },
          overrideAccess: true,
          draft: false,
        })

        console.log(`  🔄 Updated: ${pageData.titleEn} / ${pageData.titleTh}`)
      } else {
        // Create with EN
        const page = await payload.create({
          collection: 'pages',
          locale: 'en',
          data: {
            title: pageData.titleEn,
            slug: pageData.slug,
            pageStatus: 'published',
            content: contentBlocksEn,
            seo: {
              metaTitle: pageData.titleEn,
              metaDescription: `${pageData.titleEn} page`,
            },
            publishedAt: new Date().toISOString(),
            order: pageData.order,
          },
          overrideAccess: true,
        })

        // Update with TH (slug is localized, so send it)
        await payload.update({
          collection: 'pages',
          id: page.id,
          locale: 'th',
          data: {
            title: pageData.titleTh,
            slug: pageData.slug,
            content: contentBlocksTh,
            seo: {
              metaTitle: pageData.titleTh,
              metaDescription: `${pageData.titleTh} page`,
            },
          },
          overrideAccess: true,
          draft: false,
        })

        console.log(`  ✅ Created: ${pageData.titleEn} / ${pageData.titleTh}`)
      }
    } catch (error) {
      console.error(`  ❌ Error creating/updating page "${pageData.slug}":`, error)
    }
  }

  console.log('✨ Pages seeding (localized) completed!')
}
