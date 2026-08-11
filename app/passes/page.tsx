// app/passes/page.tsx — redirects to register page which now includes pass selection
import { redirect } from 'next/navigation'

export default function PassesPage() {
  redirect('/register')
}
