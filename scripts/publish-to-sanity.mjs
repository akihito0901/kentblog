#!/usr/bin/env node
// publish-to-sanity.mjs — Publish a Kent Blog markdown article straight to Sanity.
//
// Usage:
//   node scripts/publish-to-sanity.mjs content/posts/xx.md                 # publish (live)
//   node scripts/publish-to-sanity.mjs content/posts/xx.md --draft         # save as a draft
//   node scripts/publish-to-sanity.mjs content/posts/xx.md --publish-draft # publish and remove its draft
//   node scripts/publish-to-sanity.mjs content/posts/xx.md --dry-run       # print the doc, write nothing
//   node scripts/publish-to-sanity.mjs content/posts/xx.md --draft --image path/to/photo.jpg --image-alt "説明"
//   node scripts/publish-to-sanity.mjs content/posts/xx.md --publish-draft --image-ref image-... --image-alt "説明"
//
// Requires SANITY_API_WRITE_TOKEN in .env.local (Editor token) and network
// access to *.api.sanity.io. Run it from a terminal with normal internet
// access. (Inside the Cowork sandbox the Sanity API is blocked by network
// egress — there, Claude publishes through the browser instead; see README.md.)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createClient } from '@sanity/client';

const root = process.cwd();
const envPath = path.join(root, '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'epj19ggx';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;
const file = process.argv[2];
const dry = process.argv.includes('--dry-run');
const draft = process.argv.includes('--draft');
const publishDraft = process.argv.includes('--publish-draft');
const option = (name) => {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
};
const imagePath = option('--image');
const imageRef = option('--image-ref');
const imageAlt = option('--image-alt');

if (!file) { console.error('Usage: node scripts/publish-to-sanity.mjs <file.md> [--draft|--publish-draft] [--dry-run] [--image <path>|--image-ref <asset-id>] [--image-alt <text>]'); process.exit(1); }
if (!token) { console.error('SANITY_API_WRITE_TOKEN is missing in .env.local'); process.exit(1); }
if (draft && publishDraft) { console.error('--draft and --publish-draft cannot be used together'); process.exit(1); }

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const doc = JSON.parse(execFileSync('node', [path.join(scriptDir, 'md-to-post.mjs'), file], { encoding: 'utf8' }));

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-08-24',
  token,
  useCdn: false,
  perspective: 'raw',
});

if (draft) doc._id = doc._id.startsWith('drafts.') ? doc._id : `drafts.${doc._id}`;

const catSlug = doc._categorySlug;
delete doc._categorySlug;
if (catSlug) {
  const cat = await client.fetch('*[_type=="category" && slug.current==$s][0]{_id,title}', { s: catSlug });
  if (!cat) { console.error(`Category not found for slug "${catSlug}". Existing categories:`); const all = await client.fetch('*[_type=="category"]{ "slug":slug.current, title }'); console.error(all); process.exit(1); }
  doc.category = { _type: 'reference', _ref: cat._id };
  console.error(`Category: ${cat.title} (${catSlug}) -> ${cat._id}`);
}

if (imagePath && imageRef) { console.error('--image and --image-ref cannot be used together'); process.exit(1); }

if (imageRef) {
  doc.mainImage = {
    _type: 'image',
    asset: {_type: 'reference', _ref: imageRef},
    ...(imageAlt ? {alt: imageAlt} : {}),
  };
}

if (!imagePath && !imageRef) {
  const publishedId = doc._id.replace(/^drafts\./, '');
  const imageSourceIds = draft ? [doc._id] : [publishedId, `drafts.${publishedId}`];
  for (const imageSourceId of imageSourceIds) {
    const existing = await client.getDocument(imageSourceId);
    if (existing?.mainImage) {
      doc.mainImage = existing.mainImage;
      break;
    }
  }
}

if (dry) { console.log(JSON.stringify(doc, null, 2)); console.error('\n[dry-run] nothing written.'); process.exit(0); }

if (imagePath) {
  const asset = await client.assets.upload('image', fs.createReadStream(imagePath), {
    filename: path.basename(imagePath),
  });
  doc.mainImage = {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
    ...(imageAlt ? {alt: imageAlt} : {}),
  };
  console.error(`Image: ${asset._id}`);
}

const res = await client.createOrReplace(doc);
if (publishDraft) {
  const draftId = `drafts.${doc._id.replace(/^drafts\./, '')}`;
  await client.delete(draftId);
  console.error(`Draft removed: ${draftId}`);
}
console.log(`${draft ? 'Draft saved' : 'Published'}: ${res._id}`);
console.log(`URL path : /blog/${doc.slug.current}`);
if (!draft) console.log('Live in ~1 minute (blog revalidates every 60s).');
