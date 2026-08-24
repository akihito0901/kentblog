import Image from 'next/image'
import type {InstagramSettings} from '@/sanity/types'

export function InstagramCta({instagram}: {instagram: InstagramSettings}) {
  return (
    <section className="instagram-cta" aria-labelledby="instagram-heading">
      <div className="instagram-profile">
        <Image
          className="instagram-avatar"
          src="/images/profile-kent-dog.svg"
          alt={`${instagram.displayName}のプロフィール画像`}
          width={152}
          height={152}
        />
        <div>
          <p className="instagram-eyebrow">Instagram</p>
          <h2 id="instagram-heading">@{instagram.handle}</h2>
          <p className="instagram-name">{instagram.displayName}</p>
        </div>
      </div>

      <dl className="instagram-stats">
        <div><dt>{instagram.posts}</dt><dd>投稿</dd></div>
        <div><dt>{instagram.followers}</dt><dd>フォロワー</dd></div>
        <div><dt>{instagram.following}</dt><dd>フォロー中</dd></div>
      </dl>

      <p className="instagram-bio">{instagram.bio}</p>
      <a className="instagram-button" href={instagram.url} target="_blank" rel="noreferrer">
        Instagramをフォローする →
      </a>
      {instagram.updatedAt && <p className="instagram-updated">数字は {instagram.updatedAt} 確認時点</p>}
    </section>
  )
}
