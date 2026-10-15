import { redirect } from 'next/navigation'

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') {
      query.set(key, value)
    } else if (Array.isArray(value)) {
      value.forEach((v) => query.append(key, v))
    }
  }
  const qs = query.toString()
  redirect(`/register${qs ? `?${qs}` : ''}`)
}
