import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://esummit.pec.ac.in'

  // Add more dynamic routes here if you add pages to the /app directory
  const routes = [
    '',
    '/passes',
    '/portfolio',
    '/register',
    '/schedule',
    '/speakers',
    '/sponsors',
    '/tracks',
    '/faq'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
}
