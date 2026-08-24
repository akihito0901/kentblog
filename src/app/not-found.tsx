import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="category">404</p>
      <h1>記事が見つかりませんでした。</h1>
      <Link className="button" href="/">トップへ戻る</Link>
    </main>
  )
}
