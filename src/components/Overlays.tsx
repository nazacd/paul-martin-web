"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getDict, href } from "@/i18n/config";
import { site } from "@/data/site";
import { categories, colors, products, productPath, sizeTable } from "@/data/products";
import { formatPrice, photo } from "@/lib/asset";
import { useUI } from "./Providers";
import { LangSwitch } from "./Header";
import { Logo } from "./Logo";
import { TelegramButton } from "./TelegramButton";
import { BagIcon, BookmarkIcon, CloseIcon, PhoneIcon, SearchIcon } from "./Icons";

function Drawer({
  open,
  side,
  title,
  onClose,
  closeLabel,
  children,
  footer,
}: {
  open: boolean;
  side: "left" | "right";
  title: ReactNode;
  onClose: () => void;
  closeLabel: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <aside className={`drawer drawer-${side} ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!open} inert={!open}>
      <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-line px-5">
        <div className="label">{title}</div>
        <button type="button" aria-label={closeLabel} className="icon-btn -mr-2" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
      {footer && <div className="shrink-0 border-t border-line p-5">{footer}</div>}
    </aside>
  );
}

/* ---------------- Меню ---------------- */

function MenuDrawer() {
  const { locale, panel, close } = useUI();
  const t = getDict(locale);
  const links = [
    { label: t.nav.home, path: "/" },
    { label: t.nav.catalog, path: "/catalog/" },
    { label: t.nav.newIn, path: "/catalog/?c=new" },
    { label: t.nav.sale, path: "/catalog/?c=sale" },
    { label: t.nav.lookbook, path: "/lookbook/" },
    { label: t.nav.stores, path: "/stores/" },
    { label: t.nav.favorites, path: "/favorites/" },
  ];
  return (
    <Drawer open={panel === "menu"} side="left" title={<Logo />} onClose={close} closeLabel={t.nav.close}>
      <nav className="px-5 py-6" aria-label={t.nav.menu}>
        <ul>
          {links.map((item) => (
            <li key={item.path}>
              <Link
                href={href(locale, item.path)}
                onClick={close}
                className="display block py-2.5 text-[24px] transition-colors hover:text-bordo"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-line pt-6">
          <div className="label mb-3 text-muted">{t.home.categories}</div>
          <ul className="grid grid-cols-2 gap-x-4">
            {categories.map((c) => (
              <li key={c.key}>
                <Link href={href(locale, `/catalog/?c=${c.key}`)} onClick={close} className="block py-1.5 text-[15px] hover:text-bordo">
                  {c.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-line pt-6 text-[14px] text-muted">
          <div className="label mb-3">{t.nav.stores}</div>
          {site.stores.map((s) => (
            <p key={s.id} className="mb-1">
              {s.address[locale]}
            </p>
          ))}
          <a href={site.phoneHref} className="mt-3 block text-[18px] text-ink">
            {site.phone}
          </a>
          <div className="mt-6 flex items-center justify-between">
            <span className="label">{t.nav.language}</span>
            <LangSwitch />
          </div>
        </div>
      </nav>
    </Drawer>
  );
}

/* ---------------- Корзина (временно недоступна) ---------------- */

function CartDrawer() {
  const { locale, panel, close, cartIntent, isFavorite, toggleFavorite } = useUI();
  const t = getDict(locale);
  const product = cartIntent ? products.find((p) => p.id === cartIntent.productId) : undefined;

  return (
    <Drawer
      open={panel === "cart"}
      side="right"
      title={t.cart.title}
      onClose={close}
      closeLabel={t.nav.close}
      footer={
        <div className="space-y-2.5">
          <TelegramButton className="btn btn-dark w-full">{t.product.askTelegram}</TelegramButton>
          <a href={site.phoneHref} className="btn btn-line w-full">
            <PhoneIcon width={17} height={17} />
            {t.cart.call}
          </a>
        </div>
      }
    >
      <div className="px-5 py-8">
        {product && cartIntent && (
          <div className="mb-8 flex gap-4 border-b border-line pb-8">
            <div className="photo-box h-[125px] w-[100px] shrink-0">
              <img src={photo(product.images[0]).small} alt="" className="photo" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="label text-muted">{t.cart.chosen}</div>
              <div className="mt-2 text-[15px] leading-snug">{product.name[locale]}</div>
              {cartIntent.size && (
                <div className="mt-1 text-[13px] text-muted">
                  {t.product.sizeLabel} {cartIntent.size}
                </div>
              )}
              <div className="mt-2 text-[15px]">{formatPrice(product.price, locale)}</div>
              {!isFavorite(product.id) && (
                <button
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  className="link-line mt-3 inline-flex items-center gap-2 text-[12px]"
                >
                  <BookmarkIcon width={14} height={14} /> {t.cart.save}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          <BagIcon width={30} height={30} />
          <h2 className="display mt-6 max-w-[300px] text-[26px]">{t.cart.soonTitle}</h2>
          <p className="mt-4 max-w-[320px] text-[14px] leading-relaxed text-muted">{t.cart.soonText}</p>
          <ul className="mt-6 space-y-1 text-[13px]">
            {site.stores.map((s) => (
              <li key={s.id}>{s.address[locale]}</li>
            ))}
          </ul>
          <Link href={href(locale, "/stores/")} onClick={close} className="link-line mt-4 text-[12px] uppercase tracking-[0.16em]">
            {t.cart.stores}
          </Link>
        </div>
      </div>
    </Drawer>
  );
}

/* ---------------- Таблица размеров ---------------- */

function SizeDrawer() {
  const { locale, panel, close } = useUI();
  const t = getDict(locale).sizes;
  return (
    <Drawer open={panel === "sizes"} side="right" title={t.title} onClose={close} closeLabel={getDict(locale).nav.close}>
      <div className="px-5 py-7">
        <p className="text-[14px] leading-relaxed text-muted">{t.intro}</p>
        <table className="mt-6 w-full border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-ink text-left">
              {[t.size, t.letter, t.chest, t.waist].map((h) => (
                <th key={h} className="label py-3 pr-2 !text-[10px] !tracking-[0.14em]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizeTable.map((row) => (
              <tr key={row.size} className="border-b border-line">
                <td className="py-3 pr-2 font-medium">{row.size}</td>
                <td className="py-3 pr-2">{row.letter}</td>
                <td className="py-3 pr-2">{row.chest}</td>
                <td className="py-3">{row.waist}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-6 text-[13px] leading-relaxed text-muted">{t.help}</p>
      </div>
    </Drawer>
  );
}

/* ---------------- Поиск ---------------- */

function SearchOverlay() {
  const { locale, panel, close } = useUI();
  const t = getDict(locale);
  const isOpen = panel === "search";
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 8);
    return products.filter((p) =>
      [p.name.ru, p.name.uz, colors[p.color].name.ru, colors[p.color].name.uz, p.sku, ...categories.filter((c) => c.key === p.category).flatMap((c) => [c.name.ru, c.name.uz])]
        .some((field) => field.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-[70] max-h-[100svh] overflow-y-auto bg-paper transition-[transform,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isOpen ? "visible translate-y-0" : "invisible -translate-y-full"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.search}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <div className="container-x mx-auto max-w-[1280px] py-5 md:py-8">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-muted" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search.placeholder}
              aria-label={t.search.placeholder}
              className="h-14 w-full border-b border-ink bg-transparent pl-9 pr-3 text-[22px] font-light outline-none placeholder:text-faint md:text-[28px]"
            />
          </div>
          <button type="button" className="caps px-2 py-3 hover:opacity-55" onClick={close}>
            {t.nav.close}
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="label mr-2 text-muted">{t.search.popular}</span>
          {t.search.terms.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="border border-line px-3.5 py-1.5 text-[13px] transition-colors hover:border-ink"
            >
              {term}
            </button>
          ))}
        </div>

        <div className="mt-7 pb-4">
          {results.length === 0 ? (
            <p className="py-10 text-center text-[15px] text-muted">{t.search.nothing(query)}</p>
          ) : (
            <>
              <div className="mb-4 text-[13px] text-muted">
                {query.trim() ? `${t.search.found}: ${results.length}` : t.search.all}
              </div>
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link href={href(locale, productPath(p))} onClick={close} className="zoom block">
                      <div className="photo-box aspect-[4/5]">
                        <img src={photo(p.images[0]).small} alt={p.name[locale]} className="photo" loading="lazy" />
                      </div>
                      <div className="mt-2.5 line-clamp-2 text-[13px] leading-snug">{p.name[locale]}</div>
                      <div className="text-[13px] text-muted">{formatPrice(p.price, locale)}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Уведомление ---------------- */

function Toast() {
  const { locale, toast } = useUI();
  if (!toast) return null;
  return (
    <div
      key={toast}
      role="status"
      className="toast fixed right-4 z-[80] flex items-center gap-4 bg-ink px-5 py-3.5 text-[13px] text-white"
      style={{ top: "calc(var(--top-offset) + 12px)" }}
    >
      {toast}
      <Link href={href(locale, "/favorites/")} className="link-line text-white/80">
        {getDict(locale).favorites.open}
      </Link>
    </div>
  );
}

export function Overlays() {
  const { panel, close } = useUI();
  return (
    <>
      <div className={`backdrop ${panel ? "is-open" : ""}`} onClick={close} aria-hidden="true" />
      <MenuDrawer />
      <CartDrawer />
      <SizeDrawer />
      <SearchOverlay />
      <Toast />
    </>
  );
}
