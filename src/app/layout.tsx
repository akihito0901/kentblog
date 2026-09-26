import type {Metadata} from 'next'
import {SITE_DESCRIPTION, SITE_NAME, SITE_URL} from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: 'kent blog｜大型犬と暮らす、フリーランス父の記録',
    template: '%s｜kent blog',
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    locale: 'ja_JP',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="ja" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
