"use client";

import { useEffect, useRef } from "react";

/** Беззвучное видео, которое играет, только пока его видно на экране. */
export function InViewVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return <video ref={ref} className={className} src={src} poster={poster} muted loop playsInline preload="none" />;
}
