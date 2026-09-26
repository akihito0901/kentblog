#!/usr/bin/env node
// md-to-post.mjs — Kent Blog: Markdown (frontmatter + body) -> Sanity `post` document.
// Usage: node scripts/md-to-post.mjs content/posts/xx.md [--pretty]
// Prints the post document as JSON on stdout.
// The category is emitted as `_categorySlug`; it is resolved to a real
// reference at publish time (see scripts/README.md).
import fs from 'node:fs';
import crypto from 'node:crypto';

const key = () => crypto.randomBytes(6).toString('hex');

function parseFrontmatter(raw) {
  const m = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error('Frontmatter (--- ... ---) not found at top of file');
  const fm = {};
  for (const line of m[1].split('\n')) {
    const mm = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!mm) continue;
    let [, k, v] = mm;
    v = v.trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    else if (v === 'true') v = true;
    else if (v === 'false') v = false;
    fm[k] = v;
  }
  return { fm, body: m[2] };
}

// Inline: **bold** and [label](url) links.
function inline(text) {
  const children = [];
  const markDefs = [];
  let buf = '';
  let bold = false;
  const push = (t, marks) => { if (t) children.push({ _type: 'span', _key: key(), text: t, marks }); };
  const flush = () => { if (buf) { push(buf, bold ? ['strong'] : []); buf = ''; } };
  let i = 0;
  while (i < text.length) {
    if (text.startsWith('**', i)) { flush(); bold = !bold; i += 2; continue; }
    if (text[i] === '[') {
      const lm = text.slice(i).match(/^\[([^\]]+)\]\(([^)\s]+)\)/);
      if (lm) {
        flush();
        const defKey = key();
        markDefs.push({ _key: defKey, _type: 'link', href: lm[2] });
        push(lm[1], bold ? ['strong', defKey] : [defKey]);
        i += lm[0].length;
        continue;
      }
    }
    buf += text[i++];
  }
  flush();
  if (children.length === 0) children.push({ _type: 'span', _key: key(), text: '', marks: [] });
  return { children, markDefs };
}

const block = (style, text) => { const { children, markDefs } = inline(text); return { _type: 'block', _key: key(), style, children, markDefs }; };
const listBlock = (listItem, text) => { const { children, markDefs } = inline(text); return { _type: 'block', _key: key(), style: 'normal', level: 1, listItem, children, markDefs }; };

function bodyToPortableText(body) {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let para = [];
  const flushPara = () => { if (para.length) { blocks.push(block('normal', para.join(''))); para = []; } };
  for (const raw of lines) {
    const t = raw.trim();
    if (t === '') { flushPara(); continue; }
    if (/^#\s+/.test(t)) { flushPara(); continue; }                                   // drop H1 (title shown separately)
    if (/^##\s+/.test(t)) { flushPara(); blocks.push(block('h2', t.replace(/^##\s+/, ''))); continue; }
    if (/^###\s+/.test(t)) { flushPara(); blocks.push(block('h3', t.replace(/^###\s+/, ''))); continue; }
    if (/^#{4,6}\s+/.test(t)) { flushPara(); blocks.push(block('h3', t.replace(/^#{4,6}\s+/, ''))); continue; }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) { flushPara(); continue; }                  // hr -> drop (no divider in schema)
    if (/^>\s?/.test(t)) { flushPara(); blocks.push(block('blockquote', t.replace(/^>\s?/, ''))); continue; }
    if (/^[-*]\s+/.test(t)) { flushPara(); blocks.push(listBlock('bullet', t.replace(/^[-*]\s+/, ''))); continue; }
    if (/^\d+\.\s+/.test(t)) { flushPara(); blocks.push(listBlock('number', t.replace(/^\d+\.\s+/, ''))); continue; }
    para.push(t);
  }
  flushPara();
  return blocks;
}

function main() {
  const path = process.argv[2];
  const pretty = process.argv.includes('--pretty');
  if (!path) { console.error('Usage: node scripts/md-to-post.mjs <file.md> [--pretty]'); process.exit(1); }
  const { fm, body } = parseFrontmatter(fs.readFileSync(path, 'utf8'));
  if (!fm.title || !fm.slug) throw new Error('frontmatter must include title and slug');
  const doc = {
    _id: 'post-' + fm.slug,
    _type: 'post',
    title: fm.title,
    slug: { _type: 'slug', current: fm.slug },
    excerpt: fm.excerpt || '',
    publishedAt: (fm.publishedAt && String(fm.publishedAt)) || new Date().toISOString(),
    featured: fm.featured === true || fm.featured === 'true',
    body: bodyToPortableText(body),
    _categorySlug: fm.categorySlug || null,
  };
  if (fm.seoTitle) doc.seoTitle = fm.seoTitle;
  if (fm.seoDescription) doc.seoDescription = fm.seoDescription;
  process.stdout.write(JSON.stringify(doc, null, pretty ? 2 : 0));
}
main();
