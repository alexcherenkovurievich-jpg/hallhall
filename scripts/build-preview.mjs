/**
 * Собирает из dist/ один самодостаточный HTML для предпросмотра.
 *
 * Нужен только затем, чтобы показать готовый сайт по ссылке-артефакту:
 * там страница живёт одним файлом и внешние запросы запрещены, поэтому
 * скрипт, стили, шрифты и фотографии вшиваются как data URI.
 * На боевой сайт это никак не влияет — Netlify отдаёт обычный dist/.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const OUT = 'preview/index.html';

const mime = (f) => ({
  '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml',
}[path.extname(f).toLowerCase()] ?? 'application/octet-stream');

const dataUri = (rel) => {
  const abs = path.join(DIST, rel.replace(/^\//, ''));
  return `data:${mime(abs)};base64,${fs.readFileSync(abs).toString('base64')}`;
};

let html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

// 1. Стили: сначала шрифты внутрь fonts.css, потом сам CSS в <style>
let fontsCss = fs.readFileSync(path.join(DIST, 'fonts/fonts.css'), 'utf8')
  .replace(/url\((\/fonts\/[^)]+)\)/g, (_, u) => `url(${dataUri(u)})`);

const cssHref = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"/)?.[1];
let appCss = cssHref ? fs.readFileSync(path.join(DIST, cssHref.slice(1)), 'utf8') : '';

// 2. Скрипт: пути к картинкам внутри бандла заменяем на data URI
const jsSrc = html.match(/<script type="module"[^>]*src="(\/assets\/[^"]+\.js)"/)?.[1];
let appJs = jsSrc ? fs.readFileSync(path.join(DIST, jsSrc.slice(1)), 'utf8') : '';
appJs = appJs.replace(/"(\/images\/photos\/[^"]+)"/g, (_, u) => JSON.stringify(dataUri(u)));

// 3. Собираем страницу без внешних ссылок.
//    Замена только функцией: в минифицированном React встречается $', а
//    строковая замена раскрыла бы это как «остаток строки» и покорёжила бандл.
html = html
  .replace(/<link rel="stylesheet"[^>]*href="\/fonts\/fonts\.css">/, () => `<style>${fontsCss}</style>`)
  .replace(/<link rel="stylesheet"[^>]*href="\/assets\/[^"]+\.css">/, () => `<style>${appCss}</style>`)
  .replace(/<script type="module"[^>]*src="\/assets\/[^"]+\.js"><\/script>/,
           () => `<script type="module">${appJs}</script>`)
  .replace(/<link rel="preload"[^>]*>/g, '')
  .replace(/<link rel="icon"[^>]*>/, '')
  .replace(/<meta property="og:image"[^>]*>/, '');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`${OUT}: ${(html.length / 1024 / 1024).toFixed(2)} MB`);
