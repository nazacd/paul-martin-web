import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, href, isLocale } from "@/i18n/config";
import { site } from "@/data/site";
import { categories, getProduct, isSale, products, type Product } from "@/data/products";
import { asset, photo } from "@/lib/asset";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { ProductRail } from "@/components/Carousel";
import { Reveal } from "@/components/Reveal";
import { InViewVideo } from "@/components/InViewVideo";
import { Leaf } from "@/components/Logo";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);
  const newIn = products.filter((p) => p.isNew).slice(0, 8);
  const sale = products.filter(isSale);
  const editorial = ["bomber-temno-sinij", "dzhemper-na-molnii-bordovyj"].map(getProduct).filter(Boolean) as Product[];
  const count = (key: string) => products.filter((p) => p.category === key).length;

  return (
    <>
      <Hero />

      {/* Манифест */}
      <section className="container-x flex flex-col items-center py-20 text-center md:py-32">
        <Reveal className="flex flex-col items-center">
          <Leaf className="h-[30px] text-bordo" />
          <h2 className="display mt-8 max-w-[900px] text-[28px] md:text-[46px]">{t.home.manifesto}</h2>
          <p className="mt-6 max-w-[560px] text-[15px] font-light leading-[1.8] text-muted">{t.home.manifestoText}</p>
        </Reveal>
      </section>

      {/* Категории */}
      <section aria-label={t.home.categories} className="pb-20 md:pb-28">
        <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-[var(--gutter)] md:grid md:grid-cols-6 md:gap-4 md:overflow-visible">
          {categories.map((c, i) => (
            <Link key={c.key} href={href(lang, `/catalog/?c=${c.key}`)} className="zoom group w-[42vw] shrink-0 snap-start md:w-auto">
              <div className="photo-box aspect-[3/4]">
                <img src={photo(c.cover).small} srcSet={photo(c.cover).srcSet} sizes="(min-width: 768px) 16vw, 42vw" alt={c.name[lang]} loading="lazy" className="photo" />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <span className="text-[14px] uppercase tracking-[0.12em] transition-colors group-hover:text-bordo">{c.name[lang]}</span>
                <span className="text-[11px] text-faint">
                  0{i + 1} · {count(c.key)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Новая коллекция */}
      <section className="container-x pb-24 md:pb-32">
        <div className="mb-8 flex items-end justify-between gap-6 border-t border-ink pt-6 md:mb-12">
          <div>
            <div className="label text-muted">{t.home.newCollectionSub}</div>
            <h2 className="display mt-3 text-[32px] md:text-[52px]">{t.home.newCollection}</h2>
          </div>
          <Link href={href(lang, "/catalog/?c=new")} className="caps link-line shrink-0">
            {t.home.viewAll}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-4 lg:grid-cols-4">
          {newIn.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Smart casual */}
      <section className="bg-stone">
        <div className="grid md:grid-cols-2">
          <div className="photo-box aspect-[4/5] md:aspect-auto md:min-h-[100svh]">
            <img src={photo("zip-bordo-1").src} alt="" loading="lazy" className="photo absolute inset-0" />
          </div>
          <div className="container-x flex flex-col justify-center py-16 md:px-16 md:py-24 xl:px-24">
            <Reveal>
              <div className="label text-bordo">{t.home.editorialKicker}</div>
              <h2 className="display mt-4 text-[36px] md:text-[60px]">{t.home.editorialTitle}</h2>
              <p className="mt-6 max-w-[460px] text-[15px] font-light leading-[1.8] text-muted">{t.home.editorialText}</p>
            </Reveal>
            <div className="mt-10 grid max-w-[520px] grid-cols-2 gap-4">
              {editorial.map((p) => (
                <ProductCard key={p.id} product={p} sizes="(min-width: 768px) 20vw, 45vw" />
              ))}
            </div>
            <Link href={href(lang, "/lookbook/")} className="btn btn-dark mt-10 self-start">
              {t.home.editorialCta}
            </Link>
          </div>
        </div>
      </section>

      {/* Распродажа */}
      <section className="overflow-hidden bg-bordo text-white">
        <div className="border-b border-white/15 py-3" aria-hidden="true">
          <div className="marquee label !tracking-[0.3em] text-white/70">
            {Array.from({ length: 2 }, (_, k) => (
              <span key={k} className="flex shrink-0">
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} className="px-8">
                    {t.promo} · Paul Martin
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
        <div className="container-x grid gap-8 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-5">
            <div className="label text-white/70">{t.home.saleKicker}</div>
            <div className="display mt-2 text-[96px] !leading-none md:text-[160px]">{t.home.saleTitle}</div>
          </div>
          <div className="flex flex-col justify-end md:col-span-5 md:col-start-8">
            <p className="text-[15px] font-light leading-[1.8] text-white/80">{t.home.saleText}</p>
            <Link href={href(lang, "/catalog/?c=sale")} className="btn btn-white mt-8 self-start">
              {t.home.saleCta}
            </Link>
          </div>
        </div>
        <div className="pb-16 md:pb-24">
          <ProductRail products={sale} tone="dark" />
        </div>
      </section>

      {/* Backstage */}
      <section className="bg-ink text-white">
        <div className="container-x grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
          <Reveal>
            <div className="label text-white/50">{t.home.backstageKicker}</div>
            <h2 className="display mt-4 text-[34px] md:text-[56px]">{t.home.backstageTitle}</h2>
            <p className="mt-6 max-w-[420px] text-[15px] font-light leading-[1.8] text-white/70">{t.home.backstageText}</p>
            <Link href={href(lang, "/lookbook/")} className="btn btn-line-white mt-10">
              {t.nav.lookbook}
            </Link>
          </Reveal>
          <div className="mx-auto w-full max-w-[380px]">
            <div className="relative aspect-[9/16] overflow-hidden bg-black">
              <InViewVideo
                className="absolute inset-0 h-full w-full object-cover"
                src={asset("/media/film-backstage.mp4")}
                poster={asset("/media/film-backstage-poster.webp")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Магазины */}
      <section className="container-x py-20 md:py-28">
        <div className="mb-10 flex items-end justify-between gap-6 border-t border-ink pt-6">
          <h2 className="display text-[30px] md:text-[48px]">{t.home.storesTitle}</h2>
          <Link href={href(lang, "/stores/")} className="caps link-line hidden shrink-0 md:inline">
            {t.home.storesCta}
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2 md:gap-4">
          {site.stores.map((s) => (
            <article key={s.id} className="group">
              <div className="photo-box aspect-[16/10]">
                <img src={photo(s.image).src} alt="" loading="lazy" className="photo object-[50%_30%]" />
              </div>
              <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-[18px] uppercase tracking-[0.1em]">{s.name[lang]}</h3>
                  <p className="mt-1 text-[14px] text-muted">{s.address[lang]}</p>
                </div>
                <a href={s.map} target="_blank" rel="noreferrer" className="caps link-line mt-1">
                  {t.stores.route}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
