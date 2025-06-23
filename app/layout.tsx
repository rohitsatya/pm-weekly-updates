import type { Metadata } from 'next'
import './globals.css'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

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
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
