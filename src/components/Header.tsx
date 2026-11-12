"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { getDict, href, locales } from "@/i18n/config";
import { useUI } from "./Providers";
import { Logo } from "./Logo";
import { BagIcon, BookmarkIcon, CloseIcon, MenuIcon, SearchIcon } from "./Icons";

const PROMO_KEY = "pm-promo-closed";
const promoListeners = new Set<() => void>();

function promoVisible(): boolean {
  try {
    return window.sessionStorage.getItem(PROMO_KEY) !== "1";
  } catch {
    return true;
  }
}

function subscribePromo(l: () => void) {
  promoListeners.add(l);
  return () => {
    promoListeners.delete(l);
  };
}

function closePromo() {
  try {
    window.sessionStorage.setItem(PROMO_KEY, "1");
  } catch {
    /* ignore */
  }
  promoListeners.forEach((l) => l());
}

/** Тот же адрес на другом языке: /ru/catalog/ -> /uz/catalog/ */
export function switchLocalePath(pathname: string, target: string): string {
  return pathname.replace(/^\/(ru|uz)(?=\/|$)/, `/${target}`) || `/${target}/`;
}

export function LangSwitch({ className = "" }: { className?: string }) {
  const { locale } = useUI();
  const pathname = usePathname();
  return (
    <div className={`flex items-center gap-1 text-[11px] font-medium tracking-[0.16em] ${className}`}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="opacity-40">/</span>}
          <Link
            href={switchLocalePath(pathname, l)}
            hrefLang={l}
            onClick={() => {
              try {
                window.localStorage.setItem("pm-locale", l);
              } catch {
                /* ignore */
              }
            }}
            aria-current={l === locale ? "true" : undefined}
            className={`px-0.5 py-1 transition-opacity ${l === locale ? "opacity-100" : "opacity-45 hover:opacity-80"}`}
          >
            {getDict(l).langShort}
          </Link>
        </span>
      ))}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const { locale, open, favorites } = useUI();
  const t = getDict(locale);
  const showPromo = useSyncExternalStore(subscribePromo, promoVisible, () => true);
  const [overHero, setOverHero] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("has-promo", showPromo);
  }, [showPromo]);

  useEffect(() => {
    const update = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      setOverHero(!!hero && window.scrollY < hero.offsetHeight - 80);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  const nav = [
    { label: t.nav.catalog, path: "/catalog/" },
    { label: t.nav.sale, path: "/catalog/?c=sale" },
    { label: t.nav.lookbook, path: "/lookbook/" },
    { label: t.nav.stores, path: "/stores/" },
  ];

  return (
    <>
      {showPromo && (
        <div className="fixed inset-x-0 top-0 z-50 flex h-[36px] items-center justify-center bg-bordo px-10 text-white">
          <Link href={href(locale, "/catalog/?c=sale")} className="label flex items-center gap-3 truncate !tracking-[0.18em]">
            <span className="truncate">{t.promo}</span>
            <span className="hidden underline underline-offset-4 sm:inline">{t.promoLink}</span>
          </Link>
          <button
            type="button"
            aria-label={t.nav.close}
            onClick={closePromo}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-white/70 hover:text-white"
          >
            <CloseIcon width={14} height={14} />
          </button>
        </div>
      )}

      <header
        className={`site-header fixed inset-x-0 z-40 h-[var(--header-h)] transition-[background-color,color,border-color] duration-500 ${
          overHero ? "is-over-hero border-b border-white/15 bg-transparent" : "border-b border-line bg-paper/95 backdrop-blur-md"
        }`}
        style={{ top: "var(--promo-h)" }}
      >
        <div className="relative flex h-full items-center justify-between px-2 md:px-6">
          <div className="flex items-center gap-1 lg:gap-7">
            <button type="button" aria-label={t.nav.menu} className="icon-btn" onClick={() => open("menu")}>
              <MenuIcon />
            </button>
            <nav className="hidden items-center gap-7 lg:flex" aria-label={t.nav.menu}>
              {nav.map((item) => (
                <Link key={item.path} href={href(locale, item.path)} className="caps transition-opacity hover:opacity-55">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            href={href(locale, "/")}
            aria-label="Paul Martin"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Logo wordClass="mt-[5px] h-[11px] md:h-[13px]" leafClass="h-[14px] md:h-[16px]" />
          </Link>

          <div className="flex items-center">
            <LangSwitch className="mr-2 hidden sm:flex" />
            <button type="button" aria-label={t.nav.search} className="icon-btn" onClick={() => open("search")}>
              <SearchIcon />
            </button>
            <Link href={href(locale, "/favorites/")} aria-label={t.nav.favorites} className="icon-btn relative">
              <BookmarkIcon />
              {favorites.length > 0 && (
                <span className="absolute right-1 top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-bordo px-1 text-[9px] font-semibold leading-none text-white">
                  {favorites.length}
                </span>
              )}
            </Link>
            <button type="button" aria-label={t.nav.cart} className="icon-btn" onClick={() => open("cart")}>
              <BagIcon />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
