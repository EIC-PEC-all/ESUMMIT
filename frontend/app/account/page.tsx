import { redirect } from 'next/navigation'

interface AccountPageProps {
  searchParams?: Promise<{ callbackUrl?: string; [key: string]: string | string[] | undefined }>
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = await searchParams
  const target = typeof params?.callbackUrl === 'string' && params.callbackUrl ? params.callbackUrl : '/profile'
  redirect(target)
}
