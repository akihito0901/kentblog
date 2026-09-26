# 記事の書き方と公開の仕組み（scripts）

Markdown で記事を書き、Sanity（本番ブログ）へ公開するためのツールです。

## 記事ファイル

`content/posts/NN-slug.md` に、他の記事と同じ frontmatter で書きます。

```markdown
---
title: "記事タイトル"
slug: "記事のURL（半角英数とハイフン）"
excerpt: "一覧やSEOに使う短い説明（180字まで）"
category: "犬・ハスキー"        # 表示名（任意）
categorySlug: "husky"          # ← これで公開先カテゴリを決めます
categoryLabel: "DOG & HUSKY"   # 英語ラベル（任意）
featured: true                 # トップのおすすめ欄に出すなら true
seoTitle: "検索用タイトル（任意）"
seoDescription: "検索用の説明（任意）"
---

# 記事タイトル（この H1 は本文からは自動で除かれます）

本文…（## で見出し、- で箇条書き、1. で番号、**太字**、[リンク](URL) が使えます）
```

有効な categorySlug: `husky` / `dog-food` / `side-job` / `diy` / `freelance`
（最新は Sanity の「カテゴリ」に準じます）

## 変換だけ確認する

```bash
node scripts/md-to-post.mjs content/posts/NN-slug.md --pretty
```

Markdown を Sanity の post ドキュメント（Portable Text）に変換して表示します。
本文先頭の H1、`---`（区切り線）は自動で除かれます。

## 公開する

通常のターミナル（インターネットに出られる環境）で：

```bash
npm run publish -- content/posts/NN-slug.md            # 本番公開
npm run publish -- content/posts/NN-slug.md --dry-run  # 中身の確認だけ（書き込まない）
```

- 認証は `.env.local` の `SANITY_API_WRITE_TOKEN`（Editor 権限）を使います。
- `_id` は `post-<slug>` 固定なので、同じ slug で再実行すると「上書き更新」になります。
- 公開後、ブログには約1分で反映されます（60秒ごとに再取得）。

## 仕組みのメモ（Claude 向け）

- `md-to-post.mjs` … 依存パッケージなしの純 Node。Markdown → post ドキュメント JSON。
  カテゴリは `_categorySlug` として出力し、公開時に参照へ解決します。
- `publish-to-sanity.mjs` … `@sanity/client` で `createOrReplace`。
- **Cowork のサンドボックス内シェルは `*.api.sanity.io` への通信が遮断**されています
  （npm レジストリ等は許可）。そのため Cowork 上の Claude は、上記スクリプトの代わりに
  **ブラウザ（Chrome）の fetch から Sanity の mutate API を叩いて**公開します。
  トークンは `.env.local` に保存済みで、`www.sanity.io` オリジンからの fetch は
  CORS 許可されることを確認済みです。
