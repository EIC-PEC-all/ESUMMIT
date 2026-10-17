import { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/siteConfig'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/profile/', '/account/'],
      },
      {
        userAgent: [
          'GPTBot',
          'PerplexityBot',
          'ClaudeBot',
          'Google-Extended',
          'Amazonbot',
          'CCBot',
        ],
        allow: [
          '/',
          '/passes',
          '/events',
          '/speakers',
          '/timeline',
          '/about',
          '/sponsors',
          '/llms.txt',
          '/llms-full.txt',
        ],
        disallow: ['/api/', '/_next/', '/profile/', '/account/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
