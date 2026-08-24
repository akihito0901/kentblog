import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {ArticleBody} from '@/components/ArticleBody'
import {Footer} from '@/components/Footer'
import {Header} from '@/components/Header'
import {InstagramCta} from '@/components/InstagramCta'
import {PostImage} from '@/components/PostImage'
import {fallbackPosts} from '@/sanity/fallback'
import {getPost, getSettings} from '@/sanity/queries'

export const revalidate = 60

type Props = {params: Promise<{slug: string}>}

export function generateStaticParams() {
  return fallbackPosts.map((post) => ({slug: post.slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date)).replaceAll('/', '.')
}

export default async function BlogPost({params}: Props) {
  const {slug} = await params
  const [post, settings] = await Promise.all([getPost(slug), getSettings()])
  if (!post) notFound()

  return (
    <>
      <Header siteTitle={settings.siteTitle} tagline={settings.tagline} />
      <main className="main-area" id="main-content">
        <div className="container">
          <p className="breadcrumb"><Link href="/">HOME</Link><span>/</span>{post.category.label}<span>/</span>{post.title}</p>
          <article className="article-page">
            <header className="article-header">
              <div className="post-meta">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span className="category">{post.category.label}</span>
              </div>
              <h1 className="article-title">{post.title}</h1>
              <p className="article-lead">{post.excerpt}</p>
            </header>

            <PostImage post={post} className="article-hero" priority />

            <div className="article-body">
              <ArticleBody value={post.body} />
              <section className="article-cta" aria-labelledby="cta-heading">
                <h2 id="cta-heading">犬との暮らしを、もっと楽しく。</h2>
                <p>副業、ドッグフード、DIYの新しい記事も読んでみてください。</p>
                <Link className="button" href="/">新着記事を見る</Link>
              </section>
              <InstagramCta instagram={settings.instagram} />
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}
