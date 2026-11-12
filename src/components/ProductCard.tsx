"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { getDict, href } from "@/i18n/config";
import { colors, isSale, productPath, type Product } from "@/data/products";
import { formatPrice, photo } from "@/lib/asset";
import { useUI } from "./Providers";
import { BookmarkIcon } from "./Icons";

/**
 * Карточка товара: фото переключаются движением курсора по горизонтали (на телефоне — свайпом),
 * снизу тонкие полоски-индикаторы.
 */
export function ProductCard({
  product,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  tone = "light",
}: {
  product: Product;
  sizes?: string;
  tone?: "light" | "dark";
}) {
  const { locale, isFavorite, toggleFavorite } = useUI();
  const t = getDict(locale).product;
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const count = product.images.length;
  const fav = isFavorite(product.id);
  const sale = isSale(product);

  return (
    <article className="group relative">
      <Link href={href(locale, productPath(product))} className="block" aria-label={product.name[locale]}>
        <div
          className="photo-box aspect-[4/5]"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const zone = Math.floor(((e.clientX - rect.left) / rect.width) * count);
            setIndex(Math.max(0, Math.min(count - 1, zone)));
          }}
          onMouseLeave={() => setIndex(0)}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) < 30) return;
            setIndex((i) => (dx < 0 ? Math.min(count - 1, i + 1) : Math.max(0, i - 1)));
          }}
        >
          {product.images.map((name, i) => {
            const img = photo(name);
            return (
              <img
                key={name}
                src={img.small}
                srcSet={img.srcSet}
                sizes={sizes}
                alt={i === 0 ? product.name[locale] : ""}
                loading="lazy"
                className={`photo absolute inset-0 transition-opacity duration-300 ${i === index ? "opacity-100" : "opacity-0"}`}
              />
            );
          })}

          <div className="absolute left-3 top-3 flex gap-1.5">
            {sale && <span className="bg-bordo px-2 py-1 text-[10px] font-medium leading-none tracking-[0.12em] text-white">{t.sale}</span>}
            {product.isNew && (
              <span className="bg-white px-2 py-1 text-[10px] font-medium uppercase leading-none tracking-[0.16em] text-ink">{t.new}</span>
            )}
          </div>

          {count > 1 && (
            <div className="absolute inset-x-3 bottom-3 flex gap-1 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
              {product.images.map((name, i) => (
                <span key={name} className={`h-[2px] flex-1 transition-colors duration-300 ${i === index ? "bg-white" : "bg-white/35"}`} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className={`line-clamp-2 text-[13px] leading-snug md:text-[14px] ${tone === "dark" ? "text-white" : "text-ink"}`}>
              {product.name[locale]}
            </h3>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 text-[13px] tracking-wide md:text-[14px]">
              <span className={sale ? (tone === "dark" ? "text-white" : "text-bordo") : tone === "dark" ? "text-white/70" : "text-muted"}>
                {formatPrice(product.price, locale)}
              </span>
              {product.oldPrice && (
                <span className={`text-[12px] line-through ${tone === "dark" ? "text-white/45" : "text-faint"}`}>
                  {formatPrice(product.oldPrice, locale)}
                </span>
              )}
            </div>
          </div>
          <span
            className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10"
            style={{ background: colors[product.color].hex }}
            title={colors[product.color].name[locale]}
          />
        </div>
      </Link>

      <button
        type="button"
        aria-label={fav ? t.favRemove : t.favAdd}
        aria-pressed={fav}
        onClick={() => toggleFavorite(product.id)}
        className={`absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center transition-colors ${
          fav ? "bg-ink text-white" : "bg-white/90 text-ink hover:bg-white"
        }`}
      >
        <BookmarkIcon width={16} height={16} filled={fav} />
      </button>
    </article>
  );
}
