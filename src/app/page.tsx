import Image from 'next/image'
import Link from 'next/link'
import {Footer} from '@/components/Footer'
import {Header} from '@/components/Header'
import {PostImage} from '@/components/PostImage'
import {getPosts, getSettings} from '@/sanity/queries'

export const revalidate = 60

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date)).replaceAll('/', '.')
}

export default async function Home() {
  const [posts, settings] = await Promise.all([getPosts(), getSettings()])
  const featured = posts.filter((post) => post.featured).slice(0, 3)

  return (
    <>
      <Header siteTitle={settings.siteTitle} tagline={settings.tagline} />
      <main className="main-area" id="main-content">
        <div className="container">
          <section className="featured-grid" aria-label="おすすめ記事">
            {featured.map((post) => (
              <article className="featured-card fade-up" id={post.category.slug} key={post._id}>
                <Link className="featured-media" href={`/blog/${post.slug}`}>
                  <PostImage post={post} priority />
                  <span className="featured-label">{post.category.label}</span>
                </Link>
                <div className="featured-body">
                  <h2 className="featured-title"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                  <p className="featured-kicker">{post.excerpt}</p>
                  <Link className="text-link" href={`/blog/${post.slug}`}>READ MORE</Link>
                </div>
              </article>
            ))}
          </section>

          <div className="content-grid">
            <section className="content-column" aria-labelledby="latest-heading">
              <h1 className="section-heading" id="latest-heading">Latest articles</h1>
              <div className="post-list">
                {posts.map((post) => (
                  <article className="post-item fade-up" id={`post-${post.category.slug}`} key={post._id}>
                    <div className="post-meta">
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      <a className="category" href={`#${post.category.slug}`}>{post.category.label}</a>
                    </div>
                    <h2 className="post-title"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <Link className="post-more" href={`/blog/${post.slug}`}>READ MORE</Link>
                  </article>
                ))}
              </div>
            </section>

            <aside className="sidebar" aria-label="サイドバー">
              <section className="sidebar-section profile fade-up">
                <div className="avatar">
                  <Image src="/images/profile-kent-dog.svg" alt="Kentと大型犬" width={240} height={240} />
                </div>
                <h2 className="profile-name">{settings.profileName}</h2>
                <p className="profile-role">Freelance / Dog dad</p>
                <p className="profile-text">{settings.profileText}</p>
                <a className="profile-link" href={settings.instagram.url} target="_blank" rel="noreferrer">
                  @{settings.instagram.handle}を見る&nbsp; →
                </a>
              </section>

              <section className="sidebar-section fade-up">
                <h2 className="widget-title">Popular articles</h2>
                <ol className="popular-list">
                  {posts.slice(0, 4).map((post) => (
                    <li key={post._id}><Link href={`/blog/${post.slug}`}>{post.title}</Link></li>
                  ))}
                </ol>
              </section>

              <section className="sidebar-section fade-up" aria-labelledby="tags-heading">
                <h2 className="widget-title" id="tags-heading">Topics</h2>
                <div className="tag-list">
                  {[...new Map(posts.map((post) => [post.category.slug, post.category])).values()].map((category) => (
                    <a href={`#${category.slug}`} key={category.slug}>{category.title}</a>
                  ))}
                  <a href="#about">父の暮らし</a>
                </div>
              </section>

              <section className="newsletter studio-guide fade-up">
                <h2 className="widget-title">Write a new post</h2>
                <p>記事の追加やInstagramの数字変更は、編集室からできます。</p>
                <Link className="studio-link" href="/studio">編集室を開く →</Link>
              </section>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
