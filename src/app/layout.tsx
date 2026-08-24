import type {Metadata} from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'kent blog｜大型犬と暮らす、フリーランス父の記録',
    template: '%s｜kent blog',
  },
  description: '大型犬と暮らすフリーランス父のブログ。副業、ドッグフード、犬と快適に暮らすDIYを実体験ベースで発信します。',
}

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="ja" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
