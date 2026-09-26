import type {Post, SiteSettings} from './types'

function paragraph(key: string, text: string) {
  return {
    _key: key,
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{_key: `${key}-span`, _type: 'span', marks: [], text}],
  }
}

function heading(key: string, text: string, style: 'h2' | 'h3' = 'h2') {
  return {
    _key: key,
    _type: 'block',
    style,
    markDefs: [],
    children: [{_key: `${key}-span`, _type: 'span', marks: [], text}],
  }
}

export const defaultSettings: SiteSettings = {
  siteTitle: 'kent blog',
  tagline: 'Big dog, freelance & family life',
  profileName: 'Kent',
  profileText:
    '大型犬と家族で暮らす、フリーランスの父です。副業の始め方、ドッグフード選び、犬と快適に暮らすためのDIYを、等身大で書いています。',
  instagram: {
    handle: 'kents_nft',
    url: 'https://instagram.com/kents_nft/',
    displayName: 'Kent / ケント',
    posts: '637',
    followers: '3.3万人',
    following: '681',
    bio: 'ハスキーと暮らす二児のパパ。子ども、犬と田舎で暮らす日常や、ブログ・ポッドキャストのことを発信しています。',
    updatedAt: '2026-08-24',
  },
}

export const fallbackPosts: Post[] = [
  {
    _id: 'fallback-freelance',
    title: '大型犬と暮らしながら、フリーランスの仕事を回す3つのルール',
    slug: 'big-dog-freelance-rules',
    excerpt: '散歩も仕事も家族との時間も、全部大事。予定を詰め込まずに一日を回すための、シンプルなルールです。',
    publishedAt: '2026-08-24T09:00:00+09:00',
    featured: true,
    category: {title: 'フリーランス', label: 'FREELANCE', slug: 'freelance'},
    fallbackImage: '/images/article-dog-work.svg',
    body: [
      paragraph('p1', '突然ですが、大型犬と暮らしながら家で仕事をするのって、思った以上に予定が読めません。'),
      paragraph('p2', '集中したいタイミングで散歩の時間が来るし、仕事の区切りと犬の生活リズムが噛み合わない日もあります。それでも、犬との暮らしを仕事の邪魔にはしたくありません。'),
      heading('h1', '散歩を一日の基準にする'),
      paragraph('p3', '犬の予定を後回しにせず、最初から仕事の予定に組み込む。これだけで、一日の見通しがかなり良くなりました。'),
      heading('h2', '朝いちばんは、重い仕事をひとつ', 'h3'),
      paragraph('p4', 'メールやSNSを見る前に、その日いちばん進めたい仕事へ着手します。15分で終わる大きさまで分けておけば、散歩の時間が来ても気持ちよく切り上げられます。'),
      heading('h3', '完璧より、毎日回る仕組み'),
      paragraph('p5', '仕事も犬との時間も100点を狙うと息切れします。家族みんなが無理なく続けられる形を、少しずつ整えればOKです。'),
    ],
  },
  {
    _id: 'fallback-sidejob',
    title: '父が副業を始めるなら、最初に決めたい3つのこと',
    slug: 'side-job-three-hours',
    excerpt: 'いきなり毎日やろうとすると、だいたい続きません。家族との時間を守りながら、最初の一歩を作る考え方です。',
    publishedAt: '2026-08-18T09:00:00+09:00',
    featured: true,
    category: {title: '副業', label: 'SIDE JOB', slug: 'side-job'},
    fallbackImage: '/images/featured-sidejob.svg',
    body: [
      paragraph('p1', '仕事、家事、家族、犬の散歩まであるので、毎日2時間なんて最初から狙うと、だいたい続きません。'),
      heading('h1', 'まず週3時間から始める'),
      paragraph('p2', '平日の朝に30分を2回、週末に2時間を1回。まずはこれで十分です。時間を増やすより、何をやるか絞るほうが大事です。'),
      heading('h2', 'ひとつ試して、合わなければ変える'),
      paragraph('p3', 'ブログ、Web制作、動画編集などを全部同時に始める必要はありません。ひとつ選び、1か月試してから次を考えましょう。'),
    ],
  },
  {
    _id: 'fallback-dogfood',
    title: '大型犬のドッグフード、まず見るべき5つのポイント',
    slug: 'large-dog-food-guide',
    excerpt: '原材料、体重との相性、便の状態、続けやすい価格。口コミだけに頼らず、毎日の様子から選ぶ基準です。',
    publishedAt: '2026-08-10T09:00:00+09:00',
    featured: true,
    category: {title: 'ドッグフード', label: 'DOG FOOD', slug: 'dog-food'},
    fallbackImage: '/images/featured-dogfood.svg',
    body: [
      paragraph('p1', '大型犬は食べる量が多いので、ドッグフード選びは体調だけでなく家計にも直結します。'),
      heading('h1', '食いつきだけで決めない'),
      paragraph('p2', '年齢や活動量、体重や便の状態、続けやすい価格、保存しやすさをまとめて見ます。口コミ1位だから安心、と決めつけないことも大切です。'),
      heading('h2', '迷ったら獣医師へ相談する'),
      paragraph('p3', '体質や持病によって必要な食事は変わります。気になる症状がある場合や療法食を検討するときは、自己判断で切り替えず獣医師へ相談してください。'),
    ],
  },
  {
    _id: 'fallback-diy',
    title: '大型犬と快適に暮らす、わが家の小さなDIY',
    slug: 'large-dog-entryway-diy',
    excerpt: '散歩前に探し物をしないため、リード、ライト、タオルを一か所へ。無理なく作れる収納の考え方です。',
    publishedAt: '2026-08-02T09:00:00+09:00',
    featured: false,
    category: {title: 'DIY', label: 'DOG × DIY', slug: 'diy'},
    fallbackImage: '/images/featured-diy.svg',
    body: [
      paragraph('p1', '大型犬との暮らしでは、市販品のサイズが合わないことがよくあります。そんな小さな不便こそDIYの出番です。'),
      heading('h1', 'まず玄関の散歩道具をまとめる'),
      paragraph('p2', 'リード、ライト、タオルを一か所に置くだけで、散歩前の探し物が減ります。毎日使うものから整えると効果を感じやすいです。'),
      heading('h2', '見た目より安全性を優先する'),
      paragraph('p3', '角を丸める、倒れないよう固定する、犬が口にする場所へ不向きな塗料を使わない。この3つは必ず確認します。'),
    ],
  },
]
