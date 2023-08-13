import './globals.css'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

const roboto = Roboto({ weight: '400', subsets: ['latin'], display: 'swap', preload: true })

export const metadata: Metadata = {
  title: 'Notamark',
  description: 'Note taking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  )
}
