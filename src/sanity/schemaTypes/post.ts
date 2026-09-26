import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: '記事',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '記事タイトル',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '記事URL',
      description: 'タイトルを入れた後に「Generate」を押してください。',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: '記事の短い説明',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: 'category',
      title: 'カテゴリ',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: '公開日',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'メイン画像',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: '画像の説明', type: 'string'})],
    }),
    defineField({
      name: 'featured',
      title: 'トップのおすすめ欄に出す',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'body',
      title: '本文',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: '本文', value: 'normal'},
            {title: '見出し2', value: 'h2'},
            {title: '見出し3', value: 'h3'},
            {title: '引用', value: 'blockquote'},
          ],
          marks: {
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'リンク',
                fields: [defineField({name: 'href', title: 'URL', type: 'url'})],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'alt', title: '画像の説明', type: 'string'})],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'seoTitle', title: '検索用タイトル（任意）', type: 'string'}),
    defineField({name: 'seoDescription', title: '検索用説明（任意）', type: 'text', rows: 3}),
  ],
  orderings: [
    {
      title: '公開日の新しい順',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', media: 'mainImage', subtitle: 'category.title'},
  },
})
