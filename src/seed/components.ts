import { getPayload } from 'payload'
import config from '../payload.config'

const baseComponents = [
  {
    name: 'Hero Section',
    slug: 'hero-section',
    type: 'section',
    category: 'content',
    description: 'Hero section with title, subtitle, and CTA button',
    code: JSON.stringify({
      component: 'HeroSection',
      props: {
        title: '',
        subtitle: '',
        ctaText: 'Get Started',
        ctaLink: '/',
      },
    }),
    props: {
      title: {
        type: 'string',
        required: true,
        description: 'Hero title',
      },
      subtitle: {
        type: 'string',
        description: 'Hero subtitle',
      },
      ctaText: {
        type: 'string',
        default: 'Get Started',
        description: 'CTA button text',
      },
      ctaLink: {
        type: 'string',
        default: '/',
        description: 'CTA button link',
      },
    },
    status: 'published',
  },
  {
    name: 'Feature Grid',
    slug: 'feature-grid',
    type: 'section',
    category: 'content',
    description: 'Grid of feature items with icons, titles, and descriptions',
    code: JSON.stringify({
      component: 'FeatureGrid',
      props: {
        features: [],
      },
    }),
    props: {
      features: {
        type: 'array',
        items: {
          icon: 'string',
          title: 'string',
          description: 'string',
        },
        description: 'Array of feature items',
      },
    },
    status: 'published',
  },
  {
    name: 'CTA Banner',
    slug: 'cta-banner',
    type: 'section',
    category: 'content',
    description: 'Call-to-action banner with text and button',
    code: JSON.stringify({
      component: 'CTABanner',
      props: {
        title: '',
        description: '',
        ctaText: 'Learn More',
        ctaLink: '/',
      },
    }),
    props: {
      title: {
        type: 'string',
        required: true,
        description: 'Banner title',
      },
      description: {
        type: 'string',
        description: 'Banner description',
      },
      ctaText: {
        type: 'string',
        default: 'Learn More',
        description: 'CTA button text',
      },
      ctaLink: {
        type: 'string',
        default: '/',
        description: 'CTA button link',
      },
    },
    status: 'published',
  },
  {
    name: 'Testimonial Carousel',
    slug: 'testimonial-carousel',
    type: 'section',
    category: 'content',
    description: 'Carousel of customer testimonials',
    code: JSON.stringify({
      component: 'TestimonialCarousel',
      props: {
        testimonials: [],
      },
    }),
    props: {
      testimonials: {
        type: 'array',
        items: {
          name: 'string',
          role: 'string',
          content: 'string',
          avatar: 'string',
        },
        description: 'Array of testimonials',
      },
    },
    status: 'published',
  },
  {
    name: 'Contact Form',
    slug: 'contact-form',
    type: 'section',
    category: 'form',
    description: 'Contact form with name, email, and message fields',
    code: JSON.stringify({
      component: 'ContactForm',
      props: {
        title: 'Contact Us',
        submitText: 'Send Message',
      },
    }),
    props: {
      title: {
        type: 'string',
        default: 'Contact Us',
        description: 'Form title',
      },
      submitText: {
        type: 'string',
        default: 'Send Message',
        description: 'Submit button text',
      },
    },
    status: 'published',
  },
  {
    name: 'Newsletter Signup',
    slug: 'newsletter-signup',
    type: 'widget',
    category: 'form',
    description: 'Newsletter signup form',
    code: JSON.stringify({
      component: 'NewsletterSignup',
      props: {
        title: 'Subscribe to our newsletter',
        placeholder: 'Enter your email',
      },
    }),
    props: {
      title: {
        type: 'string',
        default: 'Subscribe to our newsletter',
        description: 'Form title',
      },
      placeholder: {
        type: 'string',
        default: 'Enter your email',
        description: 'Email input placeholder',
      },
    },
    status: 'published',
  },
  {
    name: 'Breadcrumb Navigation',
    slug: 'breadcrumb-navigation',
    type: 'widget',
    category: 'navigation',
    description: 'Breadcrumb navigation component',
    code: JSON.stringify({
      component: 'Breadcrumb',
      props: {
        items: [],
      },
    }),
    props: {
      items: {
        type: 'array',
        items: {
          label: 'string',
          path: 'string',
        },
        description: 'Breadcrumb items',
      },
    },
    status: 'published',
  },
  {
    name: 'Social Media Links',
    slug: 'social-media-links',
    type: 'widget',
    category: 'navigation',
    description: 'Social media links component',
    code: JSON.stringify({
      component: 'SocialMediaLinks',
      props: {
        links: [],
      },
    }),
    props: {
      links: {
        type: 'array',
        items: {
          platform: 'string',
          url: 'string',
          icon: 'string',
        },
        description: 'Social media links',
      },
    },
    status: 'published',
  },
  {
    name: 'Image Gallery',
    slug: 'image-gallery',
    type: 'block',
    category: 'media',
    description: 'Image gallery with lightbox',
    code: JSON.stringify({
      component: 'ImageGallery',
      props: {
        images: [],
        columns: 3,
      },
    }),
    props: {
      images: {
        type: 'array',
        items: {
          image: 'string',
          caption: 'string',
        },
        description: 'Gallery images',
      },
      columns: {
        type: 'number',
        default: 3,
        description: 'Number of columns',
      },
    },
    status: 'published',
  },
  {
    name: 'Video Player',
    slug: 'video-player',
    type: 'block',
    category: 'media',
    description: 'Video player component',
    code: JSON.stringify({
      component: 'VideoPlayer',
      props: {
        videoUrl: '',
        autoplay: false,
      },
    }),
    props: {
      videoUrl: {
        type: 'string',
        required: true,
        description: 'Video URL (YouTube, Vimeo, or direct link)',
      },
      autoplay: {
        type: 'boolean',
        default: false,
        description: 'Autoplay video',
      },
    },
    status: 'published',
  },
  {
    name: 'Stats Counter',
    slug: 'stats-counter',
    type: 'section',
    category: 'content',
    description: 'Statistics counter section',
    code: JSON.stringify({
      component: 'StatsCounter',
      props: {
        stats: [],
      },
    }),
    props: {
      stats: {
        type: 'array',
        items: {
          value: 'string',
          label: 'string',
          icon: 'string',
        },
        description: 'Statistics items',
      },
    },
    status: 'published',
  },
  {
    name: 'Pricing Table',
    slug: 'pricing-table',
    type: 'section',
    category: 'content',
    description: 'Pricing table component',
    code: JSON.stringify({
      component: 'PricingTable',
      props: {
        plans: [],
      },
    }),
    props: {
      plans: {
        type: 'array',
        items: {
          name: 'string',
          price: 'string',
          features: 'array',
          ctaText: 'string',
          ctaLink: 'string',
        },
        description: 'Pricing plans',
      },
    },
    status: 'published',
  },
]

export async function seedComponents() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding Components...')

  const createdComponents: any[] = []

  for (const componentData of baseComponents) {
    try {
      // Check if component already exists
      const existing = await payload.find({
        collection: 'components',
        where: {
          slug: {
            equals: componentData.slug,
          },
        },
        limit: 1,
        overrideAccess: true,
      })

      if (existing.docs.length > 0) {
        console.log(`  ⏭️  Component "${componentData.name}" already exists, skipping...`)
        createdComponents.push(existing.docs[0])
        continue
      }

      // Create component
      const component = await payload.create({
        collection: 'components',
        data: componentData,
        overrideAccess: true,
      })

      createdComponents.push(component)
      console.log(
        `  ✅ Created component: ${component.name} (${component.slug}) - ${component.type}/${component.category}`,
      )
    } catch (error) {
      console.error(`  ❌ Error creating component "${componentData.name}":`, error)
    }
  }

  console.log(`✨ Created ${createdComponents.length} components`)
  console.log('✨ Components seeding completed!')

  return createdComponents
}

