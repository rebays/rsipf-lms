import type { Metadata } from 'next'
import { Public_Sans, Geist_Mono } from 'next/font/google'
import { NavBar } from '@/components/NavBar'
import './globals.css'

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RSIPF Learning Portal',
  description: 'Training portal for the Royal Solomon Islands Police Force',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${publicSans.variable} ${geistMono.variable}`}>
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  )
}
