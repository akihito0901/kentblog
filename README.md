# Kent Blog

大型犬と暮らすフリーランス父のブログです。Next.jsで表示し、Sanityで記事を管理します。

## 記事を書く場所

公開後は、ブログURLの末尾に `/studio` を付けて開きます。

例：`https://kentblog.vercel.app/studio`

1. Googleでログインする
2. 「記事」を押す
3. 右上の「＋」で新しい記事を作る
4. タイトル、記事URL、短い説明、カテゴリ、本文を入れる
5. 「Publish（公開）」を押す

公開した記事は、通常は1分ほどでブログへ反映されます。

## Instagram欄を変える

編集室で「ブログ基本設定」を開きます。ユーザー名、投稿数、フォロワー数などを変えて公開すると、全記事末尾のInstagram欄がまとめて変わります。

## ローカルで動かす

```bash
npm install
npm run dev
```

- ブログ：`http://localhost:3000`
- 編集室：`http://localhost:3000/studio`

環境変数は `.env.example` を参考に `.env.local` へ設定します。`.env.local` はGitへ保存しません。
