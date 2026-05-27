import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/onboarding', '/contact/inquiries'],
    },
    sitemap: 'https://devlinkhub.in/sitemap.xml',
  }
}
