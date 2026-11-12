"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getDict, href } from "@/i18n/config";
import { categories, colors, isSale, products, type CategoryKey, type ColorKey } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { useUI } from "./Providers";
import { CheckIcon, ChevronDown, GridIcon } from "./Icons";

type Sort = "default" | "cheap" | "expensive";
type Filter = "all" | "new" | "sale" | CategoryKey;

const VIEW_KEY = "pm-catalog-view";
const FILTERS: Filter[] = ["all", "new", ...categories.map((c) => c.key), "sale"];

function isFilter(v: string | null): v is Filter {
  return !!v && (FILTERS as string[]).includes(v);
}

function Dropdown({
  label,
  active,
  align = "left",
  children,
}: {
  label: string;
  active?: boolean;
  align?: "left" | "right";
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-10 items-center gap-1.5 whitespace-nowrap px-2 text-[13px] transition-colors sm:px-3 sm:text-[14px] ${
          open ? "bg-stone" : "hover:bg-stone/70"
        }`}
      >
        {active && <span className="h-1.5 w-1.5 rounded-full bg-bordo" />}
        {label}
        <ChevronDown className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          className={`dropdown absolute top-[calc(100%+6px)] z-30 min-w-[230px] border border-line bg-paper p-4 shadow-[0_18px_40px_rgba(0,0,0,0.12)] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function CatalogView() {
  const { locale, open: openPanel } = useUI();
  const t = getDict(locale);
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("c");
  const filter: Filter = isFilter(raw) ? raw : "all";

  const [colorSel, setColorSel] = useState<ColorKey[]>([]);
  const [sizeSel, setSizeSel] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("default");
  const [cols, setCols] = useState<2 | 3 | 4>(4);

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(VIEW_KEY));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- читаем сохранённый вид после гидратации
      if (saved === 2 || saved === 3 || saved === 4) setCols(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const changeCols = (n: 2 | 3 | 4) => {
    setCols(n);
    try {
      window.localStorage.setItem(VIEW_KEY, String(n));
    } catch {
      /* ignore */
    }
  };

  const inFilter = useMemo(
    () =>
      products.filter((p) =>
        filter === "all" ? true : filter === "new" ? p.isNew : filter === "sale" ? isSale(p) : p.category === filter,
      ),
    [filter],
  );

  const colorOptions = useMemo(() => [...new Set(inFilter.map((p) => p.color))], [inFilter]);
  const sizeOptions = useMemo(() => {
    const all = [...new Set(inFilter.flatMap((p) => p.sizes))];
    const letters = ["S", "M", "L", "XL", "XXL"];
    return [...all.filter((s) => letters.includes(s)).sort((a, b) => letters.indexOf(a) - letters.indexOf(b)), ...all.filter((s) => !letters.includes(s)).sort((a, b) => Number(a) - Number(b))];
  }, [inFilter]);

  const visible = useMemo(() => {
    const list = inFilter.filter(
      (p) => (colorSel.length === 0 || colorSel.includes(p.color)) && (sizeSel.length === 0 || p.sizes.some((s) => sizeSel.includes(s))),
    );
    if (sort === "cheap") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "expensive") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [inFilter, colorSel, sizeSel, sort]);

  const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  const reset = () => {
    setColorSel([]);
    setSizeSel([]);
  };
  const setFilter = (f: Filter) => {
    reset();
    router.replace(href(locale, f === "all" ? "/catalog/" : `/catalog/?c=${f}`), { scroll: false });
  };

  const filterLabel = (f: Filter) =>
    f === "all" ? t.catalog.all : f === "new" ? t.catalog.newIn : f === "sale" ? t.catalog.sale : categories.find((c) => c.key === f)!.name[locale];

  const title = filter === "all" ? t.catalog.title : filterLabel(filter);
  const sortLabels: Record<Sort, string> = { default: t.catalog.sortDefault, cheap: t.catalog.sortCheap, expensive: t.catalog.sortExpensive };
  const gridClass = cols === 2 ? "grid-cols-1 sm:grid-cols-2" : cols === 3 ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4";

  return (
    <div className="page">
      <div className="container-x pt-8 md:pt-12">
        <nav aria-label="breadcrumbs" className="text-[12px] uppercase tracking-[0.14em] text-faint">
          <Link href={href(locale, "/")} className="hover:text-ink">
            Paul Martin
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{t.catalog.title}</span>
        </nav>
        <div className="mt-6 flex items-baseline gap-4">
          <h1 className={`display text-[40px] md:text-[64px] ${filter === "sale" ? "text-bordo" : ""}`}>{title}</h1>
          <span className="text-[13px] text-faint">{t.catalog.count(visible.length)}</span>
        </div>

        <div className="no-scrollbar -mx-[var(--gutter)] mt-8 flex gap-2 overflow-x-auto px-[var(--gutter)]">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`shrink-0 border px-4 py-2 text-[12px] uppercase tracking-[0.14em] transition-colors ${
                filter === f
                  ? f === "sale"
                    ? "border-bordo bg-bordo text-white"
                    : "border-ink bg-ink text-white"
                  : f === "sale"
                    ? "border-line text-bordo hover:border-bordo"
                    : "border-line hover:border-ink"
              }`}
            >
              {filterLabel(f)}
            </button>
          ))}
        </div>
      </div>

      <div className="sticky z-20 mt-8 border-y border-line bg-paper/95 backdrop-blur" style={{ top: "var(--top-offset)" }}>
        <div className="container-x flex items-center justify-between gap-2 py-1.5">
          <div className="-ml-2 flex items-center sm:-ml-3">
            {colorOptions.length > 1 && (
              <Dropdown label={t.catalog.color} active={colorSel.length > 0}>
                {() => (
                  <ul className="space-y-0.5">
                    {colorOptions.map((key) => {
                      const on = colorSel.includes(key);
                      return (
                        <li key={key}>
                          <button
                            type="button"
                            onClick={() => setColorSel((c) => toggle(c, key))}
                            className="flex w-full items-center gap-3 px-1 py-2 text-left text-[14px] hover:opacity-70"
                          >
                            <span className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ background: colors[key].hex }} />
                            <span className={on ? "font-medium" : ""}>{colors[key].name[locale]}</span>
                            {on && <CheckIcon className="ml-auto" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Dropdown>
            )}

            {sizeOptions.length > 0 && (
              <Dropdown label={t.catalog.size} active={sizeSel.length > 0}>
                {(close) => (
                  <div className="w-[230px]">
                    <div className="flex flex-wrap gap-2">
                      {sizeOptions.map((s) => {
                        const on = sizeSel.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSizeSel((list) => toggle(list, s))}
                            className={`flex h-9 min-w-11 items-center justify-center border px-2 text-[13px] transition-colors ${
                              on ? "border-ink bg-ink text-white" : "border-line hover:border-ink"
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        close();
                        openPanel("sizes");
                      }}
                      className="link-line mt-4 text-[12px]"
                    >
                      {t.catalog.sizeTable}
                    </button>
                  </div>
                )}
              </Dropdown>
            )}

            <Dropdown label={t.catalog.sort} active={sort !== "default"}>
              {(close) => (
                <ul>
                  {(Object.keys(sortLabels) as Sort[]).map((key) => (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => {
                          setSort(key);
                          close();
                        }}
                        className="flex w-full items-center justify-between gap-6 px-1 py-2 text-left text-[14px] hover:opacity-70"
                      >
                        <span className={sort === key ? "font-medium" : ""}>{sortLabels[key]}</span>
                        {sort === key && <CheckIcon />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Dropdown>

            {(colorSel.length > 0 || sizeSel.length > 0) && (
              <button type="button" onClick={reset} className="link-line ml-3 hidden text-[13px] text-muted sm:block">
                {t.catalog.reset}
              </button>
            )}
          </div>

          <div className="flex shrink-0 items-center" role="group" aria-label={t.catalog.view}>
            {([4, 3, 2] as const).map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} ${t.catalog.perRow}`}
                aria-pressed={cols === n}
                onClick={() => changeCols(n)}
                className={`h-9 w-9 items-center justify-center transition-colors ${n === 3 ? "hidden lg:flex" : "flex"} ${
                  cols === n ? "text-ink" : "text-faint hover:text-ink"
                }`}
              >
                <GridIcon cols={n} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x pb-24 pt-8 md:pb-32 md:pt-10">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <h2 className="display text-[28px]">{t.catalog.empty}</h2>
            <p className="mt-3 text-[14px] text-muted">{t.catalog.emptyText}</p>
            <button type="button" onClick={reset} className="btn btn-dark mt-7">
              {t.catalog.reset}
            </button>
          </div>
        ) : (
          <div className={`grid gap-x-3 gap-y-10 md:gap-x-4 md:gap-y-14 ${gridClass}`}>
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} sizes={cols === 2 ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
