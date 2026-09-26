export type SanityImageValue = {
  asset?: {_ref?: string; _type?: string}
  alt?: string
}

export type Category = {
  title: string
  label: string
  slug: string
}

export type Post = {
  _id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  featured?: boolean
  category: Category
  mainImage?: SanityImageValue
  fallbackImage?: string
  body: Array<Record<string, unknown>>
  seoTitle?: string
  seoDescription?: string
}

export type InstagramSettings = {
  handle: string
  url: string
  displayName: string
  posts: string
  followers: string
  following: string
  bio: string
  updatedAt?: string
}

export type SiteSettings = {
  siteTitle: string
  tagline: string
  profileName: string
  profileText: string
  instagram: InstagramSettings
}
