// app/faq/page.tsx — redirects to homepage FAQ section
import { redirect } from 'next/navigation'

export default function FAQPage() {
  redirect('/#faq')
}
