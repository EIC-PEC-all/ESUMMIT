// app/portfolio/page.tsx — redirects to homepage event section
import { redirect } from 'next/navigation'

export default function PortfolioPage() {
  redirect('/#event-portfolio')
}
