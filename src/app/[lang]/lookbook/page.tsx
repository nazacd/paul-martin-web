import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, href, isLocale } from "@/i18n/config";
import { getProduct, productPath, type Product } from "@/data/products";
import { asset, formatPrice, photo } from "@/lib/asset";
import { InViewVideo } from "@/components/InViewVideo";
import { Reveal } from "@/components/Reveal";

export async function generateMetadata({ params }: PageProps<"/[lang]/lookbook">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? { title: getDict(lang).nav.lookbook } : {};
}

type Look = { film?: string; photo: string; products: string[] };

const looks: Look[] = [
  { film: "blazer", photo: "svitr-kofe-2", products: ["pidzhak-sero-goluboj", "svitr-v-polosku-kofejnyj"] },
  { film: "bomber", photo: "zip-bordo-2", products: ["bomber-temno-sinij", "dzhemper-na-molnii-bordovyj"] },
  { film: "jersey", photo: "pidzhak-jersey-1", products: ["pidzhak-trikotazhnyj-svetlo-seryj", "lofery-zamshevye"] },
  { film: "beige", photo: "zip-taupe-2", products: ["kurtka-bezhevaya", "dzhemper-na-molnii-seryj-korichnevyj"] },
  { photo: "kurtka-navy-3", products: ["kurtka-temno-sinyaya", "dzhemper-na-molnii-temno-sinij"] },
];

export default async function LookbookPage({ params }: PageProps<"/[lang]/lookbook">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);

  return (
    <div className="page">
      <header className="container-x pb-14 pt-14 text-center md:pb-24 md:pt-24">
        <div className="label text-muted">{t.lookbook.kicker}</div>
        <h1 className="display mx-auto mt-5 max-w-[1000px] text-[44px] md:text-[96px]">{t.lookbook.title}</h1>
        <p className="mx-auto mt-6 max-w-[520px] text-[15px] font-light leading-[1.8] text-muted">{t.lookbook.text}</p>
      </header>

      <div className="space-y-24 pb-24 md:space-y-40 md:pb-40">
        {looks.map((look, i) => {
          const items = look.products.map(getProduct).filter(Boolean) as Product[];
          const flip = i % 2 === 1;
          return (
            <section key={look.photo} className="container-x mx-auto max-w-[1400px]">
              <div className="grid items-end gap-4 md:grid-cols-12 md:gap-8">
                <Reveal className={`md:col-span-5 ${flip ? "md:order-2 md:col-start-8" : ""}`}>
                  <div className="relative aspect-[9/16] overflow-hidden bg-black md:aspect-[3/5]">
                    {look.film ? (
                      <InViewVideo
                        className="absolute inset-0 h-full w-full object-cover"
                        src={asset(`/media/film-${look.film}.mp4`)}
                        poster={asset(`/media/film-${look.film}-poster.webp`)}
                      />
                    ) : (
                      <img src={photo(items[0].images[0]).src} alt="" loading="lazy" className="photo absolute inset-0" />
                    )}
                  </div>
                </Reveal>

                <div className={`md:col-span-6 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-7"}`}>
                  <Reveal delay={120}>
                    <div className="flex items-baseline gap-4">
                      <span className="display text-[64px] text-bordo md:text-[120px]">0{i + 1}</span>
                      <span className="label text-muted">{t.lookbook.look}</span>
                    </div>
                    <div className="mt-6 grid grid-cols-5 gap-4 md:gap-6">
                      <div className="photo-box col-span-3 aspect-[4/5]">
                        <img src={photo(look.photo).src} alt="" loading="lazy" className="photo" />
                      </div>
                      <div className="col-span-2 flex flex-col justify-end">
                        <div className="label mb-4 text-muted">{t.lookbook.shop}</div>
                        <ul className="space-y-4">
                          {items.map((p) => (
                            <li key={p.id}>
                              <Link href={href(lang, productPath(p))} className="group block">
                                <span className="block text-[13px] leading-snug group-hover:text-bordo md:text-[14px]">{p.name[lang]}</span>
                                <span className="mt-1 block text-[13px] text-muted">{formatPrice(p.price, lang)}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="bg-ink text-white">
        <div className="container-x flex flex-col items-center py-20 text-center md:py-28">
          <div className="label text-white/50">{t.lookbook.backstage}</div>
          <h2 className="display mt-4 text-[32px] md:text-[56px]">{t.home.backstageTitle}</h2>
          <div className="mt-10 w-full max-w-[360px]">
            <div className="relative aspect-[9/16] overflow-hidden bg-black">
              <InViewVideo
                className="absolute inset-0 h-full w-full object-cover"
                src={asset("/media/film-backstage.mp4")}
                poster={asset("/media/film-backstage-poster.webp")}
              />
            </div>
          </div>
          <Link href={href(lang, "/catalog/?c=new")} className="btn btn-white mt-12">
            {t.home.newCollection}
          </Link>
        </div>
      </section>
    </div>
  );
}
