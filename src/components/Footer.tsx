import Link from "next/link";
import { getDict, href, type Locale } from "@/i18n/config";
import { site } from "@/data/site";
import { categories } from "@/data/products";
import { Leaf, Wordmark } from "./Logo";

export function Footer({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const help = [
    { label: t.nav.stores, path: "/stores/" },
    { label: t.nav.lookbook, path: "/lookbook/" },
    { label: t.nav.sale, path: "/catalog/?c=sale" },
    { label: t.nav.favorites, path: "/favorites/" },
  ];

  return (
    <footer className="bg-ink text-white/60">
      <div className="container-x flex flex-col items-center border-b border-white/10 py-16 text-center text-white md:py-24">
        <Leaf className="h-[34px]" />
        <Wordmark className="mt-4 h-[22px] md:h-[30px]" />
        <p className="label mt-6 text-white/50">{t.footer.tagline}</p>
      </div>

      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-4 md:py-16">
        <div>
          <div className="label mb-5 text-white">{t.footer.collection}</div>
          <ul className="space-y-2.5 text-[14px]">
            {categories.map((c) => (
              <li key={c.key}>
                <Link href={href(locale, `/catalog/?c=${c.key}`)} className="transition-colors hover:text-white">
                  {c.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="label mb-5 text-white">{t.footer.help}</div>
          <ul className="space-y-2.5 text-[14px]">
            {help.map((item) => (
              <li key={item.path}>
                <Link href={href(locale, item.path)} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2">
          <div className="label mb-5 text-white">{t.footer.contacts}</div>
          <ul className="space-y-2.5 text-[14px]">
            {site.stores.map((s) => (
              <li key={s.id}>{s.address[locale]}</li>
            ))}
            <li className="pt-2">
              <a href={site.phoneHref} className="text-[26px] font-light tracking-wide text-white">
                {site.phone}
              </a>
            </li>
            <li className="flex gap-6 pt-2">
              <a href={site.instagram} target="_blank" rel="noreferrer" className="caps transition-colors hover:text-white">
                Instagram
              </a>
              <a href={site.telegramChannel} target="_blank" rel="noreferrer" className="caps transition-colors hover:text-white">
                Telegram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x flex flex-col gap-2 border-t border-white/10 py-6 text-[12px] md:flex-row md:items-center md:justify-between">
        <div>
          © {new Date().getFullYear()} Paul Martin. {t.footer.rights}
        </div>
        <div className="label !text-[10px] text-white/40">Fall–Winter 26/27</div>
      </div>
    </footer>
  );
}
