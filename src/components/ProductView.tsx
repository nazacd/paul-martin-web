"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { getDict, href } from "@/i18n/config";
import { categoryName, colors, getProduct, isSale, products, type Product } from "@/data/products";
import { formatPrice, photo } from "@/lib/asset";
import { useUI } from "./Providers";
import { ProductRail } from "./Carousel";
import { TelegramButton } from "./TelegramButton";
import { BookmarkIcon, ChevronDown, ChevronLeft, ChevronRight, CloseIcon, MinusIcon, PlusIcon } from "./Icons";

function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-[54px] w-full items-center justify-between text-left text-[13px] uppercase tracking-[0.14em]"
      >
        {title}
        {open ? <MinusIcon /> : <PlusIcon />}
      </button>
      <div className={`accordion-body ${open ? "is-open" : ""}`}>
        <div>
          <div className="pb-5 text-[14px] leading-relaxed text-muted">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ProductView({ product }: { product: Product }) {
  const { locale, open, requestCart, isFavorite, toggleFavorite } = useUI();
  const t = getDict(locale);
  const [size, setSize] = useState<string | null>(null);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const imageRefs = useRef<(HTMLElement | null)[]>([]);
  const galleryRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const fav = isFavorite(product.id);
  const sale = isSale(product);
  const oneSize = product.sizes.length === 0;
  const count = product.images.length;

  const look = (product.look ?? []).map(getProduct).filter(Boolean) as Product[];
  const more = [...look, ...products.filter((p) => p.id !== product.id && !look.includes(p) && p.category === product.category), ...products.filter((p) => p.id !== product.id && !look.includes(p) && p.category !== product.category)].slice(0, 8);
  const siblings = products.filter((p) => p.category === product.category && p.name.ru.split(",")[0] === product.name.ru.split(",")[0]);

  // Активная миниатюра следует за прокруткой галереи (десктоп)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = imageRefs.current.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActiveImage(idx);
          }
        });
      },
      { root: galleryRef.current, rootMargin: "-45% 0px -45% 0px" },
    );
    imageRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [product.id]);

  useEffect(() => {
    if (!sizeOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!sizeRef.current?.contains(e.target as Node)) setSizeOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [sizeOpen]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % count));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + count) % count));
    };
    document.body.classList.add("scroll-locked");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("scroll-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, count]);

  const addToCart = (chosen: string) => {
    setSheetOpen(false);
    requestCart({ productId: product.id, size: chosen });
  };

  const onBuy = () => {
    if (oneSize) addToCart("");
    else if (size) addToCart(size);
    else setSizeOpen(true);
  };

  const price = (
    <div className="flex flex-wrap items-baseline gap-x-3">
      <span className={`text-[22px] tracking-wide ${sale ? "text-bordo" : ""}`}>{formatPrice(product.price, locale)}</span>
      {product.oldPrice && <span className="text-[15px] text-faint line-through">{formatPrice(product.oldPrice, locale)}</span>}
      {sale && <span className="bg-bordo px-2 py-1 text-[11px] leading-none tracking-[0.12em] text-white">{t.product.sale}</span>}
    </div>
  );

  return (
    <div className="page">
      <div className="md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* ---------- Галерея ---------- */}
        <div className="relative">
          {/* Телефон: свайп по горизонтали */}
          <div className="relative md:hidden">
            <div
              className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
              onScroll={(e) => {
                const el = e.currentTarget;
                setActiveImage(Math.round(el.scrollLeft / el.clientWidth));
              }}
            >
              {product.images.map((name, i) => (
                <button
                  key={name}
                  type="button"
                  aria-label={t.product.openPhoto}
                  onClick={() => setLightbox(i)}
                  className="photo-box aspect-[4/5] w-full shrink-0 snap-center"
                >
                  <img src={photo(name).src} alt={i === 0 ? product.name[locale] : ""} className="photo" fetchPriority={i === 0 ? "high" : "auto"} />
                </button>
              ))}
            </div>
            {count > 1 && (
              <div className="pointer-events-none absolute inset-x-4 bottom-4 flex gap-1.5">
                {product.images.map((name, i) => (
                  <span key={name} className={`h-[2px] flex-1 ${i === activeImage ? "bg-white" : "bg-white/40"}`} />
                ))}
              </div>
            )}
          </div>

          {/* Десктоп: лента фото прокручивается внутри своей колонки, страница — отдельно */}
          <div className="sticky hidden md:block" style={{ top: "var(--top-offset)", height: "calc(100svh - var(--top-offset))" }}>
            {count > 1 && (
              <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
                {product.images.map((name, i) => (
                  <button
                    key={name}
                    type="button"
                    aria-label={`${t.product.photo} ${i + 1}`}
                    onClick={() => galleryRef.current?.scrollTo({ top: imageRefs.current[i]?.offsetTop ?? 0, behavior: "smooth" })}
                    className={`photo-box h-[60px] w-[48px] outline outline-1 outline-offset-2 transition-[outline-color] ${
                      i === activeImage ? "outline-white" : "outline-transparent"
                    }`}
                  >
                    <img src={photo(name).small} alt="" className="photo" />
                  </button>
                ))}
              </div>
            )}
            <div ref={galleryRef} className="no-scrollbar relative h-full overflow-y-auto">
              {product.images.map((name, i) => (
                <button
                  key={name}
                  type="button"
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  aria-label={t.product.openPhoto}
                  onClick={() => setLightbox(i)}
                  className="photo-box block aspect-[4/5] w-full cursor-zoom-in"
                >
                  <img src={photo(name).src} alt={i === 0 ? product.name[locale] : ""} className="photo" loading={i === 0 ? "eager" : "lazy"} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- Информация ---------- */}
        <div className="container-x pb-10 pt-7 md:mx-auto md:w-full md:max-w-[540px] md:px-12 md:pb-20 md:pt-14">
          <nav aria-label="breadcrumbs" className="text-[11px] uppercase tracking-[0.14em] text-faint">
            <Link href={href(locale, "/catalog/")} className="hover:text-ink">
              {t.catalog.title}
            </Link>
            <span className="mx-2">/</span>
            <Link href={href(locale, `/catalog/?c=${product.category}`)} className="hover:text-ink">
              {categoryName(product.category, locale)}
            </Link>
          </nav>

          <div className="label mt-8 text-muted">{sale ? t.product.seasonSale : t.product.seasonValue}</div>
          <h1 className="mt-3 text-[28px] font-light uppercase leading-[1.15] tracking-[0.06em] md:text-[34px]">{product.name[locale]}</h1>
          <div className="mt-5">{price}</div>

          <p className={`mt-7 text-[15px] font-light leading-[1.8] text-muted ${expanded ? "" : "line-clamp-3"}`}>{product.description[locale]}</p>
          <button type="button" onClick={() => setExpanded((v) => !v)} className="link-line mt-1 text-[12px]">
            {expanded ? t.product.collapse : t.product.readMore}
          </button>

          {/* Цвет */}
          <div className="mt-8">
            <div className="text-[13px] text-muted">
              {t.product.color}: <span className="text-ink">{colors[product.color].name[locale]}</span>
            </div>
            {siblings.length > 1 && (
              <div className="mt-3 flex gap-2">
                {siblings.map((p) => (
                  <Link
                    key={p.id}
                    href={href(locale, `/catalog/${p.slug}/`)}
                    aria-label={colors[p.color].name[locale]}
                    title={colors[p.color].name[locale]}
                    aria-current={p.id === product.id ? "true" : undefined}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border ${p.id === product.id ? "border-ink" : "border-transparent hover:border-line"}`}
                  >
                    <span className="h-7 w-7 rounded-full ring-1 ring-black/10" style={{ background: colors[p.color].hex }} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Размер и покупка — десктоп */}
          <div className="mt-8 hidden md:block">
            <div className="flex items-stretch gap-2">
              {oneSize ? (
                <div className="flex h-[52px] flex-1 items-center border border-line px-5 text-[13px] uppercase tracking-[0.14em] text-muted">
                  {t.product.oneSize}
                </div>
              ) : (
                <div ref={sizeRef} className="relative flex-1">
                  <button
                    type="button"
                    aria-expanded={sizeOpen}
                    onClick={() => setSizeOpen((v) => !v)}
                    className="flex h-[52px] w-full items-center justify-between border border-ink px-5 text-[12px] font-medium uppercase tracking-[0.16em]"
                  >
                    {size ? `${t.product.sizeLabel} ${size}` : t.product.chooseSize}
                    <ChevronDown className={`transition-transform ${sizeOpen ? "rotate-180" : ""}`} />
                  </button>
                  {sizeOpen && (
                    <div className="dropdown absolute inset-x-0 top-[calc(100%+4px)] z-20 grid grid-cols-3 gap-1.5 border border-line bg-paper p-3 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setSize(s);
                            setSizeOpen(false);
                          }}
                          className={`h-10 border text-[14px] transition-colors ${size === s ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <button
                type="button"
                aria-label={fav ? t.product.favRemove : t.product.favAdd}
                aria-pressed={fav}
                onClick={() => toggleFavorite(product.id)}
                className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center border transition-colors ${
                  fav ? "border-ink bg-ink text-white" : "border-line hover:border-ink"
                }`}
              >
                <BookmarkIcon filled={fav} />
              </button>
            </div>
            <button type="button" onClick={onBuy} className={`btn mt-2 h-[56px] w-full ${sale ? "btn-bordo" : "btn-dark"}`}>
              {t.product.addToCart}
            </button>
            <TelegramButton className="btn btn-line mt-2 w-full">{t.product.askTelegram}</TelegramButton>
            {!oneSize && (
              <button type="button" onClick={() => open("sizes")} className="link-line mt-5 text-[12px] text-muted">
                {t.product.howToSize}
              </button>
            )}
          </div>

          <div className="mt-6 space-y-3 md:hidden">
            <TelegramButton className="btn btn-line w-full">{t.product.askTelegram}</TelegramButton>
            {!oneSize && (
              <button type="button" onClick={() => open("sizes")} className="link-line text-[12px] text-muted">
                {t.product.howToSize}
              </button>
            )}
          </div>

          {/* Подробности */}
          <div className="mt-10 border-t border-line">
            <Accordion title={t.product.details} defaultOpen>
              <dl className="space-y-2.5">
                {[
                  [t.product.sku, product.sku],
                  [t.product.category, categoryName(product.category, locale)],
                  [t.product.color, colors[product.color].name[locale]],
                  [t.product.season, sale ? t.product.seasonSale : t.product.seasonValue],
                  ...(oneSize ? [] : [[t.product.sizeLabel, product.sizes.join(" · ")]]),
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6">
                    <dt className="text-ink">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </Accordion>
            <Accordion title={t.product.availability}>
              <p>{t.product.availabilityText}</p>
              <Link href={href(locale, "/stores/")} className="link-line mt-3 inline-block text-ink">
                {t.cart.stores}
              </Link>
            </Accordion>
            <Accordion title={t.product.care}>
              <p>{t.product.careText}</p>
            </Accordion>
          </div>
        </div>
      </div>

      {more.length > 0 && (
        <section className="border-t border-line py-16 md:py-24">
          <h2 className="display container-x mb-8 text-[26px] md:mb-10 md:text-[40px]">{t.product.fromLook}</h2>
          <ProductRail products={more} moreHref={href(locale, "/catalog/")} moreLabel={t.home.viewAll} />
        </section>
      )}

      {/* ---------- Телефон: нижняя панель покупки ---------- */}
      <div className="h-[80px] md:hidden" />
      <div
        className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:hidden"
        style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}
      >
        <button
          type="button"
          onClick={() => (oneSize ? addToCart("") : setSheetOpen(true))}
          className={`btn h-[52px] flex-1 justify-between px-5 ${sale ? "btn-bordo" : "btn-dark"}`}
        >
          <span>{oneSize ? t.product.addToCart : size ? `${t.product.addToCart} · ${size}` : t.product.chooseSize}</span>
          <span className="tracking-wide">{formatPrice(product.price, locale)}</span>
        </button>
        <button
          type="button"
          aria-label={fav ? t.product.favRemove : t.product.favAdd}
          aria-pressed={fav}
          onClick={() => toggleFavorite(product.id)}
          className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center border ${fav ? "border-ink bg-ink text-white" : "border-line"}`}
        >
          <BookmarkIcon filled={fav} />
        </button>
      </div>

      {/* Телефон: выбор размера */}
      <div className={`backdrop md:hidden ${sheetOpen ? "is-open" : ""}`} onClick={() => setSheetOpen(false)} aria-hidden="true" />
      <div className={`sheet md:hidden ${sheetOpen ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label={t.product.chooseSize} inert={!sheetOpen}>
        <div className="flex items-center justify-between px-5 pt-4">
          <div className="label">{t.product.chooseSize}</div>
          <button type="button" aria-label={t.nav.close} className="icon-btn -mr-2" onClick={() => setSheetOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 px-5 pt-4">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`h-11 border text-[14px] ${size === s ? "border-ink bg-ink text-white" : "border-line"}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="px-5 pb-5 pt-5">
          <button type="button" disabled={!size} onClick={() => size && addToCart(size)} className={`btn w-full ${sale ? "btn-bordo" : "btn-dark"}`}>
            {t.product.addToCart}
          </button>
        </div>
      </div>

      {/* ---------- Фото на весь экран ---------- */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[90] flex flex-col bg-ink text-white" role="dialog" aria-modal="true" aria-label={product.name[locale]}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="text-[12px] tracking-[0.2em]">
              {String(lightbox + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </div>
            <button type="button" aria-label={t.nav.close} onClick={() => setLightbox(null)} className="flex h-11 w-11 items-center justify-center border border-white/30">
              <CloseIcon />
            </button>
          </div>
          <div className="relative min-h-0 flex-1">
            <img src={photo(product.images[lightbox]).src} alt={product.name[locale]} className="h-full w-full object-contain" />
            {count > 1 && (
              <>
                <button
                  type="button"
                  aria-label={t.product.prevPhoto}
                  onClick={() => setLightbox((lightbox - 1 + count) % count)}
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/30 md:left-8"
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  aria-label={t.product.nextPhoto}
                  onClick={() => setLightbox((lightbox + 1) % count)}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/30 md:right-8"
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>
          <div className="flex justify-center gap-2 py-4">
            {product.images.map((name, i) => (
              <button
                key={name}
                type="button"
                aria-label={`${t.product.photo} ${i + 1}`}
                onClick={() => setLightbox(i)}
                className={`photo-box h-[60px] w-[48px] outline outline-1 outline-offset-2 ${i === lightbox ? "outline-white" : "outline-transparent"}`}
              >
                <img src={photo(name).small} alt="" className="photo" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
