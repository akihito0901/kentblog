import Image from 'next/image'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import {urlFor} from '@/sanity/image'

const components: PortableTextComponents = {
  types: {
    image: ({value}) => {
      if (!value?.asset?._ref) return null
      return (
        <Image
          className="body-image"
          src={urlFor(value).width(1200).fit('max').url()}
          alt={value.alt || '記事内の画像'}
          width={1200}
          height={800}
          sizes="(max-width: 820px) 100vw, 760px"
        />
      )
    },
  },
  marks: {
    link: ({children, value}) => (
      <a href={value?.href} target="_blank" rel="noreferrer">{children}</a>
    ),
  },
}

export function ArticleBody({value}: {value: Array<Record<string, unknown>>}) {
  return <PortableText value={value} components={components} />
}
