"use client";

import Link from "next/link";
import { getDict, href } from "@/i18n/config";
import { products } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { useUI } from "./Providers";
import { BookmarkIcon } from "./Icons";

export function FavoritesView() {
  const { locale, favorites } = useUI();
  const t = getDict(locale);
  const list = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="page">
      <div className="container-x pb-24 pt-10 md:pb-32 md:pt-14">
        <div className="flex items-baseline gap-3">
          <h1 className="display text-[40px] md:text-[64px]">{t.favorites.title}</h1>
          {list.length > 0 && <span className="text-[14px] text-faint">{list.length}</span>}
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <BookmarkIcon width={30} height={30} />
            <h2 className="display mt-6 text-[26px]">{t.favorites.empty}</h2>
            <p className="mt-3 max-w-[340px] text-[14px] leading-relaxed text-muted">{t.favorites.emptyText}</p>
            <Link href={href(locale, "/catalog/")} className="btn btn-dark mt-7">
              {t.favorites.toCatalog}
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-4 md:gap-y-14 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
