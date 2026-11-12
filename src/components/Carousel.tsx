"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "./Icons";

export function ProductRail({
  products,
  moreHref,
  moreLabel,
  tone = "light",
}: {
  products: Product[];
  moreHref?: string;
  moreLabel?: string;
  tone?: "light" | "dark";
}) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + 16), behavior: "smooth" });
  };
  const arrow = `hidden h-11 w-11 items-center justify-center border transition-colors md:flex ${
    tone === "dark" ? "border-white/30 text-white hover:bg-white hover:text-ink" : "border-line hover:border-ink"
  }`;

  return (
    <div>
      <div
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[var(--gutter)] pb-2"
        style={{ scrollPaddingLeft: "var(--gutter)" }}
      >
        {products.map((p) => (
          <div key={p.id} data-card className="w-[64vw] shrink-0 snap-start sm:w-[40vw] lg:w-[22vw]">
            <ProductCard product={p} tone={tone} sizes="(min-width: 1024px) 22vw, 64vw" />
          </div>
        ))}
      </div>
      <div className="container-x mt-8 flex items-center justify-between">
        {moreHref && moreLabel ? (
          <Link href={moreHref} className={`caps link-line ${tone === "dark" ? "text-white" : ""}`}>
            {moreLabel}
          </Link>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <button type="button" aria-label="‹" onClick={() => scroll(-1)} className={arrow}>
            <ChevronLeft width={18} height={18} />
          </button>
          <button type="button" aria-label="›" onClick={() => scroll(1)} className={arrow}>
            <ChevronRight width={18} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
