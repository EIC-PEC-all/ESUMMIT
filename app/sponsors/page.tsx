// app/sponsors/page.tsx — redirects to homepage sponsors section
import { redirect } from 'next/navigation'

export default function SponsorsPage() {
  redirect('/#sponsors')
}
