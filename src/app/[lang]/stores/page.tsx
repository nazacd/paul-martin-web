import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/i18n/config";
import { site } from "@/data/site";
import { photo } from "@/lib/asset";
import { TelegramButton } from "@/components/TelegramButton";
import { PhoneIcon, PinIcon } from "@/components/Icons";

export async function generateMetadata({ params }: PageProps<"/[lang]/stores">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? { title: getDict(lang).stores.title } : {};
}

export default async function StoresPage({ params }: PageProps<"/[lang]/stores">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);

  return (
    <div className="page">
      <header className="container-x pb-12 pt-14 md:pb-16 md:pt-20">
        <div className="label text-muted">Paul Martin · Toshkent</div>
        <h1 className="display mt-5 text-[48px] md:text-[96px]">{t.stores.title}</h1>
        <p className="mt-5 max-w-[520px] text-[15px] font-light leading-[1.8] text-muted">{t.stores.text}</p>
      </header>

      <div className="container-x grid gap-14 pb-20 md:grid-cols-2 md:gap-6">
        {site.stores.map((s, i) => (
          <article key={s.id}>
            <div className="photo-box aspect-[4/5]">
              <img src={photo(s.image).src} alt="" className="photo" />
              <span className="display absolute left-5 top-4 text-[56px] text-white/90">0{i + 1}</span>
            </div>
            <h2 className="mt-6 text-[20px] uppercase tracking-[0.1em]">{s.name[lang]}</h2>
            <dl className="mt-5 border-t border-line">
              <div className="flex items-start gap-4 border-b border-line py-4">
                <PinIcon className="mt-0.5 shrink-0" />
                <div>
                  <dt className="label text-muted">{t.stores.address}</dt>
                  <dd className="mt-1 text-[16px]">{s.address[lang]}</dd>
                </div>
              </div>
              <div className="flex items-start gap-4 border-b border-line py-4">
                <PhoneIcon className="mt-0.5 shrink-0" />
                <div>
                  <dt className="label text-muted">{t.stores.phone}</dt>
                  <dd className="mt-1 text-[16px]">
                    <a href={site.phoneHref}>{site.phone}</a>
                  </dd>
                </div>
              </div>
            </dl>
            <a href={s.map} target="_blank" rel="noreferrer" className="btn btn-dark mt-6">
              {t.stores.route}
            </a>
          </article>
        ))}
      </div>

      <section className="border-t border-line">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <div>
            <div className="label text-muted">{t.stores.social}</div>
            <div className="mt-3 flex gap-8 text-[18px] uppercase tracking-[0.12em]">
              <a href={site.instagram} target="_blank" rel="noreferrer" className="link-line">
                Instagram
              </a>
              <a href={site.telegramChannel} target="_blank" rel="noreferrer" className="link-line">
                Telegram
              </a>
            </div>
          </div>
          <TelegramButton className="btn btn-line">{t.product.askTelegram}</TelegramButton>
        </div>
      </section>
    </div>
  );
}
