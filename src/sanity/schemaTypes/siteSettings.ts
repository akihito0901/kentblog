import {defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'ブログ基本設定',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'ブログ名',
      type: 'string',
      initialValue: 'kent blog',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: '英語の短い説明',
      type: 'string',
      initialValue: 'Big dog, freelance & family life',
    }),
    defineField({
      name: 'profileName',
      title: 'プロフィール名',
      type: 'string',
      initialValue: 'Kent',
    }),
    defineField({
      name: 'profileText',
      title: 'プロフィール文',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram（全記事の最後に表示）',
      type: 'object',
      fields: [
        defineField({name: 'handle', title: 'ユーザー名', type: 'string', initialValue: 'kents_nft'}),
        defineField({name: 'url', title: 'InstagramのURL', type: 'url', initialValue: 'https://instagram.com/kents_nft/'}),
        defineField({name: 'displayName', title: '表示名', type: 'string', initialValue: 'Kent / ケント'}),
        defineField({name: 'posts', title: '投稿数', type: 'string', initialValue: '637'}),
        defineField({name: 'followers', title: 'フォロワー', type: 'string', initialValue: '3.3万人'}),
        defineField({name: 'following', title: 'フォロー中', type: 'string', initialValue: '681'}),
        defineField({name: 'bio', title: '紹介文', type: 'text', rows: 4}),
        defineField({name: 'updatedAt', title: '数字の確認日', type: 'date'}),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'ブログ基本設定'}),
  },
})
