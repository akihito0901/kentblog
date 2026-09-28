import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {ArticleBody} from '@/components/ArticleBody'
import {Footer} from '@/components/Footer'
import {Header} from '@/components/Header'
import {InstagramCta} from '@/components/InstagramCta'
import {PostImage} from '@/components/PostImage'
import {fallbackPosts} from '@/sanity/fallback'
import {urlFor} from '@/sanity/image'
import {getPost, getPosts, getSettings} from '@/sanity/queries'
import type {Post} from '@/sanity/types'

export const revalidate = 60

type Props = {params: Promise<{slug: string}>}

export function generateStaticParams() {
  return fallbackPosts.map((post) => ({slug: post.slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const post = await getPost(slug)
  if (!post) return {}
  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt
  const canonicalPath = `/blog/${post.slug}`
  const socialImage = post.mainImage?.asset?._ref
    ? urlFor(post.mainImage)
        .width(1200)
        .height(630)
        .fit('crop')
        .format('jpg')
        .quality(82)
        .url()
    : post.fallbackImage
  return {
    title,
    description,
    alternates: {canonical: canonicalPath},
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonicalPath,
      publishedTime: post.publishedAt,
      images: socialImage ? [{url: socialImage, width: 1200, height: 630, alt: post.title}] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date)).replaceAll('/', '.')
}

const recommendedPostSlugs = [
  'large-dog-food-guide',
  'big-dog-home-diy',
  'siberian-husky-care-guide',
  'large-dog-pros-cons',
]

const recommendedPostImages: Record<string, string> = {
  'large-dog-food-guide': '/images/featured-dogfood.svg',
  'big-dog-home-diy': '/images/featured-diy.svg',
}

function getRecommendedPosts(posts: Post[], currentSlug: string) {
  const prioritized = recommendedPostSlugs
    .map((recommendedSlug) => posts.find((item) => item.slug === recommendedSlug))
    .filter((item): item is Post => Boolean(item))
  const remaining = posts.filter(
    (item) => !recommendedPostSlugs.includes(item.slug),
  )

  return [...prioritized, ...remaining]
    .filter((item, index, items) => (
      item.slug !== currentSlug
      && items.findIndex((candidate) => candidate.slug === item.slug) === index
    ))
    .slice(0, 2)
}

export default async function BlogPost({params}: Props) {
  const {slug} = await params
  const [post, settings, posts] = await Promise.all([
    getPost(slug),
    getSettings(),
    getPosts(),
  ])
  if (!post) notFound()
  const recommendedPosts = getRecommendedPosts(posts, post.slug)

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
              {recommendedPosts.length > 0 && (
                <section className="recommended-posts" aria-labelledby="recommended-heading">
                  <div className="recommended-posts-header">
                    <p className="recommended-posts-kicker">RECOMMENDED</p>
                    <h2 id="recommended-heading">おすすめ記事</h2>
                  </div>
                  <div className="recommended-post-grid">
                    {recommendedPosts.map((item) => (
                      <Link className="recommended-post-card" href={`/blog/${item.slug}`} key={item._id}>
                        <PostImage
                          post={{
                            ...item,
                            fallbackImage: recommendedPostImages[item.slug] || item.fallbackImage,
                          }}
                          className="recommended-post-image"
                        />
                        <div className="recommended-post-copy">
                          <span className="recommended-post-category">{item.category.label}</span>
                          <h3>{item.title}</h3>
                          <p>{item.excerpt}</p>
                          <span className="recommended-post-link">記事を読む <span aria-hidden="true">→</span></span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
              <InstagramCta instagram={settings.instagram} />
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}
