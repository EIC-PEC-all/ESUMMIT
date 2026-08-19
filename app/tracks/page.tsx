// app/tracks/page.tsx — redirects to homepage event section
import { redirect } from 'next/navigation'

export default function TracksPage() {
  redirect('/#event-portfolio')
}
