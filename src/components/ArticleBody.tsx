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

function getBlockText(block: Record<string, unknown>) {
  if (!Array.isArray(block.children)) return ''

  return block.children
    .map((child) => {
      if (!child || typeof child !== 'object' || !('text' in child)) return ''
      return typeof child.text === 'string' ? child.text : ''
    })
    .join('')
    .trim()
}

export function ArticleBody({value}: {value: Array<Record<string, unknown>>}) {
  const [firstBlock, ...remainingBlocks] = value
  const openingLine = firstBlock ? getBlockText(firstBlock) : ''
  const hasOpeningQuestion =
    firstBlock?._type === 'block' &&
    firstBlock.style === 'normal' &&
    openingLine.startsWith('「') &&
    openingLine.endsWith('」')

  return (
    <>
      {hasOpeningQuestion && (
        <aside className="article-question" aria-label="読者の悩み">
          <Image
            className="article-question-image"
            src="/images/profile-kent-dog.svg"
            alt=""
            width={116}
            height={116}
            sizes="(max-width: 640px) 76px, 116px"
          />
          <p>{openingLine}</p>
        </aside>
      )}
      <PortableText
        value={hasOpeningQuestion ? remainingBlocks : value}
        components={components}
      />
    </>
  )
}
