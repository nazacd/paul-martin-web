import { getDict, type Locale } from "@/i18n/config";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Путь к файлу из /public с учётом basePath (нужно для GitHub Pages). */
export function asset(path: string): string {
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Фото товара из /public/media/p: полный размер и уменьшенная версия. */
export function photo(name: string) {
  const src = asset(`/media/p/${name}.webp`);
  const small = asset(`/media/p/${name}-480.webp`);
  return { src, small, srcSet: `${small} 480w, ${src} 960w` };
}

export function formatPrice(value: number, locale: Locale): string {
  const digits = String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${digits} ${getDict(locale).currency}`;
}
