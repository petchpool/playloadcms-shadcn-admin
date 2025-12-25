import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Seed pages with localized content (single page with multiple locales)
 * Includes comprehensive examples of all block types
 */
export async function seedPagesLocalized() {
  const payload = await getPayload({ config })

  console.log('\n📄 Seeding Pages (Localized)...')
  console.log('🌱 Seeding Pages (Localized)...')

  // Delete all existing pages first to avoid conflicts
  console.log('  🗑️  Deleting existing pages...')
  const allPages = await payload.find({
    collection: 'pages',
    limit: 1000,
    locale: 'all',
    overrideAccess: true,
  })

  for (const page of allPages.docs) {
    await payload.delete({
      collection: 'pages',
      id: page.id,
      overrideAccess: true,
    })
  }
  console.log(`  ✅ Deleted ${allPages.docs.length} existing pages`)

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
          source: {
            type: 'collection',
            collection: 'users',
          },
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
              source: {
                type: 'collection',
                collection: 'pages',
              },
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
                  source: {
                    type: 'collection',
                    collection: 'components',
                  },
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
          source: {
            type: 'collection',
            collection: 'users',
          },
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
              source: {
                type: 'collection',
                collection: 'pages',
              },
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
                  source: {
                    type: 'collection',
                    collection: 'components',
                  },
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
          source: {
            type: 'collection',
            collection: 'users',
          },
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
          source: {
            type: 'collection',
            collection: 'components',
          },
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
          source: {
            type: 'collection',
            collection: 'users',
          },
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
          source: {
            type: 'collection',
            collection: 'components',
          },
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
          content: createLexicalContent('# Analytics Dashboard\n\nDetailed metrics and insights'),
        },
        // Comprehensive Stats Grid
        {
          blockType: 'dataFetch',
          dataKey: 'pagesCount',
          source: {
            type: 'collection',
            collection: 'pages',
          },
          query: {
            limit: 0,
          },
          transform: {
            type: 'count',
          },
          children: [
            {
              blockType: 'dataFetch',
              dataKey: 'layoutsCount',
              source: {
                type: 'collection',
                collection: 'layouts',
              },
              query: {
                limit: 0,
              },
              transform: {
                type: 'count',
              },
              children: [
                {
                  blockType: 'dataFetch',
                  dataKey: 'rolesCount',
                  source: {
                    type: 'collection',
                    collection: 'roles',
                  },
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
                              title: 'Total Pages',
                              icon: 'file',
                              dataKey: 'pagesCount',
                              valueField: 'value',
                              variant: 'default',
                              size: 'md',
                            },
                          ],
                        },
                        {
                          content: [
                            {
                              blockType: 'statCard',
                              title: 'Layouts',
                              icon: 'layout',
                              dataKey: 'layoutsCount',
                              valueField: 'value',
                              variant: 'gradient',
                              size: 'md',
                            },
                          ],
                        },
                        {
                          content: [
                            {
                              blockType: 'statCard',
                              title: 'User Roles',
                              icon: 'shield',
                              dataKey: 'rolesCount',
                              valueField: 'value',
                              variant: 'outline',
                              size: 'md',
                            },
                          ],
                        },
                        {
                          content: [
                            {
                              blockType: 'statCard',
                              title: 'Uptime',
                              icon: 'activity',
                              staticValue: '99.9%',
                              trend: { value: 0.1, label: 'this month' },
                              variant: 'default',
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
          content: createLexicalContent('## Detailed Metrics\n\nPerformance and usage statistics'),
        },
        {
          blockType: 'grid',
          columns: '2',
          gap: 'lg',
          items: [
            {
              content: [
                {
                  blockType: 'statCard',
                  title: 'Page Views',
                  icon: 'eye',
                  staticValue: '1,234,567',
                  trend: { value: 23.1, label: 'vs last month' },
                  variant: 'gradient',
                  size: 'lg',
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'statCard',
                  title: 'Avg. Session Duration',
                  icon: 'clock',
                  staticValue: '4m 32s',
                  trend: { value: 12.5, label: 'this week' },
                  variant: 'default',
                  size: 'lg',
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
            '# แดชบอร์ดการวิเคราะห์\n\nเมตริกและข้อมูลเชิงลึกโดยละเอียด',
          ),
        },
        {
          blockType: 'dataFetch',
          dataKey: 'pagesCount',
          source: {
            type: 'collection',
            collection: 'pages',
          },
          query: {
            limit: 0,
          },
          transform: {
            type: 'count',
          },
          children: [
            {
              blockType: 'dataFetch',
              dataKey: 'layoutsCount',
              source: {
                type: 'collection',
                collection: 'layouts',
              },
              query: {
                limit: 0,
              },
              transform: {
                type: 'count',
              },
              children: [
                {
                  blockType: 'dataFetch',
                  dataKey: 'rolesCount',
                  source: {
                    type: 'collection',
                    collection: 'roles',
                  },
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
                              title: 'เพจทั้งหมด',
                              icon: 'file',
                              dataKey: 'pagesCount',
                              valueField: 'value',
                              variant: 'default',
                              size: 'md',
                            },
                          ],
                        },
                        {
                          content: [
                            {
                              blockType: 'statCard',
                              title: 'เลย์เอาท์',
                              icon: 'layout',
                              dataKey: 'layoutsCount',
                              valueField: 'value',
                              variant: 'gradient',
                              size: 'md',
                            },
                          ],
                        },
                        {
                          content: [
                            {
                              blockType: 'statCard',
                              title: 'บทบาทผู้ใช้',
                              icon: 'shield',
                              dataKey: 'rolesCount',
                              valueField: 'value',
                              variant: 'outline',
                              size: 'md',
                            },
                          ],
                        },
                        {
                          content: [
                            {
                              blockType: 'statCard',
                              title: 'เวลาทำงาน',
                              icon: 'activity',
                              staticValue: '99.9%',
                              trend: { value: 0.1, label: 'เดือนนี้' },
                              variant: 'default',
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
          content: createLexicalContent('## เมตริกโดยละเอียด\n\nสถิติประสิทธิภาพและการใช้งาน'),
        },
        {
          blockType: 'grid',
          columns: '2',
          gap: 'lg',
          items: [
            {
              content: [
                {
                  blockType: 'statCard',
                  title: 'จำนวนผู้เข้าชม',
                  icon: 'eye',
                  staticValue: '1,234,567',
                  trend: { value: 23.1, label: 'เทียบกับเดือนที่แล้ว' },
                  variant: 'gradient',
                  size: 'lg',
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'statCard',
                  title: 'ระยะเวลาเซสชันเฉลี่ย',
                  icon: 'clock',
                  staticValue: '4 นาที 32 วินาที',
                  trend: { value: 12.5, label: 'สัปดาห์นี้' },
                  variant: 'default',
                  size: 'lg',
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

        console.log(`  ✅ Updated: ${pageData.titleEn} / ${pageData.titleTh}`)
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
