import type { Metadata } from 'next'
import { Fraunces, Spline_Sans } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '600', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const splineSans = Spline_Sans({
  subsets: ['latin'],
  variable: '--font-spline-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vocabulario — English Conversatorio',
  description: 'Shared vocabulary log for the B1→C1 English study group.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${splineSans.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
