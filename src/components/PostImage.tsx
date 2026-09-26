import Image from 'next/image'
import {urlFor} from '@/sanity/image'
import type {Post} from '@/sanity/types'

type Props = {
  post: Post
  className?: string
  priority?: boolean
}

export function PostImage({post, className, priority = false}: Props) {
  const sanityImage = post.mainImage?.asset?._ref
    ? urlFor(post.mainImage).width(1200).height(675).fit('crop').url()
    : null
  const src = sanityImage || post.fallbackImage || '/images/article-dog-work.svg'

  return (
    <Image
      className={className}
      src={src}
      alt={post.mainImage?.alt || `${post.title}のイメージ`}
      width={1200}
      height={675}
      priority={priority}
      sizes="(max-width: 720px) 100vw, (max-width: 1160px) 50vw, 720px"
    />
  )
}
