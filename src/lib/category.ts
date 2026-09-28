import type {Category} from '@/sanity/types'

const japaneseCategoryNames: Record<string, string> = {
  'DOG & HUSKY': '犬・ハスキー',
  DOG: '犬・ハスキー',
  'DOG FOOD': 'ドッグフード',
  'DOG × DIY': '犬のDIY',
  DIY: '犬のDIY',
  FREELANCE: 'フリーランス',
  'SIDE JOB': '副業',
}

export function categoryName(category: Category) {
  return japaneseCategoryNames[category.title]
    || japaneseCategoryNames[category.label]
    || category.title
}
