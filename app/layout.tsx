import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Weekly Pod Updates',
  description: 'Created with v0 and cursor',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
