// app/schedule/page.tsx — redirects to homepage event section
import { redirect } from 'next/navigation'

export default function SchedulePage() {
  redirect('/#event-portfolio')
}
