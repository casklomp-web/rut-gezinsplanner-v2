import './globals.css'
import type { Metadata } from 'next'
import { DM_Sans, Instrument_Serif } from 'next/font/google'
import { cn } from '@/lib/utils'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rut - Gezinsplanner',
  description: 'Slimme maaltijdplanning voor je gezin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={cn(
        dmSans.variable,
        instrumentSerif.variable,
        'font-sans antialiased'
      )}>
        {children}
      </body>
    </html>
  )
}