import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'カテゴリ',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'カテゴリ名',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL用の名前',
      description: '「Generate」を押せば自動で作られます。',
      type: 'slug',
      options: {source: 'title', maxLength: 80},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: '英語ラベル',
      description: '例：DOG FOOD、DIY、SIDE JOB',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
})
