"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getDict, href } from "@/i18n/config";
import { asset } from "@/lib/asset";
import { useUI } from "./Providers";

type Film = { name: string; duration: number };

/** Ролики из /public/media: film-<name>.mp4 и постер film-<name>-poster.webp */
const DESKTOP: Film[] = [
  { name: "blazer", duration: 17.8 },
  { name: "bomber", duration: 19.4 },
  { name: "jersey", duration: 13.8 },
];
const MOBILE: Film[] = [
  { name: "bomber", duration: 19.4 },
  { name: "blazer", duration: 17.8 },
  { name: "beige", duration: 19.2 },
  { name: "jersey", duration: 13.8 },
];

const src = (f: Film) => asset(`/media/film-${f.name}.mp4`);
const poster = (f: Film) => asset(`/media/film-${f.name}-poster.webp`);

function useLayout(): "desktop" | "mobile" | null {
  const [layout, setLayout] = useState<"desktop" | "mobile" | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setLayout(mq.matches ? "desktop" : "mobile");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return layout;
}

/** Десктоп: три вертикальных фильма рядом, каждый крутится по кругу. */
function Triptych() {
  return (
    <div className="absolute inset-0 grid grid-cols-3 gap-px bg-black">
      {DESKTOP.map((f) => (
        <div key={f.name} className="relative overflow-hidden">
          <video className="hero-film" src={src(f)} poster={poster(f)} autoPlay muted loop playsInline preload="auto" />
        </div>
      ))}
    </div>
  );
}

/** Телефон: ролики идут друг за другом, как истории; тап слева/справа — назад/вперёд. */
function Stories() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const film = MOBILE[active];

  const go = useCallback((dir: 1 | -1) => setActive((i) => (i + dir + MOBILE.length) % MOBILE.length), []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => setPaused(true));
  }, [active]);

  return (
    <div className="absolute inset-0">
      <video
        key={film.name}
        ref={video}
        className="hero-film"
        src={src(film)}
        poster={poster(film)}
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={() => go(1)}
        onPlay={() => setPaused(false)}
      />
      <button type="button" aria-label="‹" className="absolute inset-y-0 left-0 z-10 w-1/4" onClick={() => go(-1)} />
      <button type="button" aria-label="›" className="absolute inset-y-0 right-0 z-10 w-1/4" onClick={() => go(1)} />
      <div className="absolute inset-x-4 z-10 flex gap-1" style={{ top: "calc(var(--top-offset) + 12px)" }}>
        {MOBILE.map((f, i) => (
          <span
            key={`${f.name}-${i === active ? active : "x"}`}
            className={`story-bar relative h-[2px] flex-1 overflow-hidden bg-white/30 ${i < active ? "is-done" : ""} ${
              i === active && !paused ? "is-active" : ""
            }`}
          >
            <span className="absolute inset-0 bg-white" style={{ animationDuration: `${f.duration}s` }} />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const { locale } = useUI();
  const t = getDict(locale).hero;
  const layout = useLayout();

  return (
    <section data-hero className="hero" aria-label={t.film}>
      {/* До загрузки скрипта — постеры, чтобы первый экран не был пустым */}
      {layout === null && (
        <div className="absolute inset-0 grid grid-cols-1 gap-px md:grid-cols-3">
          {DESKTOP.map((f, i) => (
            <img key={f.name} src={poster(f)} alt="" className={`hero-film !static ${i > 0 ? "hidden md:block" : ""}`} />
          ))}
        </div>
      )}
      {layout === "desktop" && <Triptych />}
      {layout === "mobile" && <Stories />}
      <div className="hero-veil" />

      <div className="hero-copy pointer-events-none absolute inset-x-0 bottom-[9%] z-20 flex flex-col items-center px-6 text-center text-white">
        <div className="label text-white/80">{t.kicker}</div>
        <h1 className="display mt-4 text-[44px] md:text-[76px]">{t.title}</h1>
        <p className="mt-4 max-w-[440px] text-[15px] font-light leading-relaxed text-white/85">{t.text}</p>
        <Link href={href(locale, "/catalog/")} className="btn btn-white pointer-events-auto mt-8">
          {t.cta}
        </Link>
      </div>
    </section>
  );
}
