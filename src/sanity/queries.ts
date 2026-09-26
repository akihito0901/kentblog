import {defineQuery} from 'next-sanity'
import {cache} from 'react'
import {client} from './client'
import {defaultSettings, fallbackPosts} from './fallback'
import type {Post, SiteSettings} from './types'

const postsQuery = defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featured,
  category->{title, label, "slug": slug.current},
  mainImage{asset, alt},
  body,
  seoTitle,
  seoDescription
}`)

const postQuery = defineQuery(`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featured,
  category->{title, label, "slug": slug.current},
  mainImage{asset, alt},
  body,
  seoTitle,
  seoDescription
}`)

const settingsQuery = defineQuery(`*[_type == "siteSettings"][0] {
  siteTitle,
  tagline,
  profileName,
  profileText,
  instagram
}`)

export async function getPosts(): Promise<Post[]> {
  try {
    const posts = await client.fetch<Post[]>(postsQuery, {}, {next: {revalidate: 60}})
    return posts.length ? posts : fallbackPosts
  } catch {
    return fallbackPosts
  }
}

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  try {
    const post = await client.fetch<Post | null>(postQuery, {slug}, {next: {revalidate: 60}})
    return post || fallbackPosts.find((item) => item.slug === slug) || null
  } catch {
    return fallbackPosts.find((item) => item.slug === slug) || null
  }
})

export async function getSettings(): Promise<SiteSettings> {
  try {
    const settings = await client.fetch<Partial<SiteSettings> | null>(settingsQuery, {}, {next: {revalidate: 60}})
    if (!settings) return defaultSettings
    return {
      ...defaultSettings,
      ...settings,
      instagram: {...defaultSettings.instagram, ...settings.instagram},
    }
  } catch {
    return defaultSettings
  }
}
