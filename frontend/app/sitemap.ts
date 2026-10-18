import { MetadataRoute } from 'next'
import { SITE_URL, absoluteUrl } from '@/lib/siteConfig'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: absoluteUrl('/passes'),
      lastModified,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: absoluteUrl('/events'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/speakers'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: absoluteUrl('/timeline'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/about'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: absoluteUrl('/sponsors'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
