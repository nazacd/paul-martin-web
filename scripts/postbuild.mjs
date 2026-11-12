// Своя страница 404 для GitHub Pages: стандартная от Next.js выходит без стилей сайта.
import { readFileSync, writeFileSync } from "node:fs";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const leaf = readFileSync(new URL("../src/brand/leaf.svg", import.meta.url), "utf8")
  .replace("currentColor", "#141414")
  .replace("<svg ", '<svg height="34" ');
const word = readFileSync(new URL("../src/brand/wordmark.svg", import.meta.url), "utf8")
  .replace("currentColor", "#141414")
  .replace("<svg ", '<svg height="20" ');

const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>404 — PAUL MARTIN</title>
<link rel="icon" href="${base}/icon.svg" />
<style>
  body { margin: 0; min-height: 100svh; display: flex; align-items: center; justify-content: center; background: #f3f2ef; color: #141414;
    font-family: "Jost", system-ui, -apple-system, "Segoe UI", sans-serif; text-align: center; padding: 24px; box-sizing: border-box; }
  .logo { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .code { margin-top: 48px; font-size: 11px; letter-spacing: .24em; color: #6f6b66; }
  h1 { margin: 16px 0 0; font-weight: 300; font-size: 34px; letter-spacing: .06em; text-transform: uppercase; }
  p { margin: 8px 0 0; color: #6f6b66; font-size: 15px; }
  .links { margin-top: 36px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  a { display: inline-block; padding: 16px 26px; font-size: 12px; letter-spacing: .18em; text-transform: uppercase; text-decoration: none; }
  .dark { background: #141414; color: #fff; } .line { border: 1px solid #141414; color: #141414; }
</style>
</head>
<body>
  <main>
    <a href="${base}/ru/" class="logo" aria-label="Paul Martin">${leaf}${word}</a>
    <div class="code">404</div>
    <h1>Страница не найдена</h1>
    <p>Sahifa topilmadi</p>
    <div class="links">
      <a class="dark" href="${base}/ru/catalog/">Каталог</a>
      <a class="line" href="${base}/uz/catalog/">Katalog</a>
    </div>
  </main>
</body>
</html>
`;
writeFileSync(new URL("../out/404.html", import.meta.url), html);
console.log("404.html written");
