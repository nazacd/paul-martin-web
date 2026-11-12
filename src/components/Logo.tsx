import leaf from "@/brand/leaf.svg";
import wordmark from "@/brand/wordmark.svg";

/**
 * Логотип Paul Martin, векторизованный с фото вывески.
 * Рисуется маской, поэтому берёт цвет текста (currentColor): белый над видео, чёрный на светлом фоне.
 */
function Mask({ src, ratio, className }: { src: { src: string }; ratio: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block bg-current ${className ?? ""}`}
      style={{
        aspectRatio: String(ratio),
        WebkitMaskImage: `url(${src.src})`,
        maskImage: `url(${src.src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

export function Leaf({ className }: { className?: string }) {
  return <Mask src={leaf} ratio={774 / 844} className={className} />;
}

export function Wordmark({ className }: { className?: string }) {
  return <Mask src={wordmark} ratio={3871 / 389} className={className} />;
}

/** Лист над надписью — как на вывеске. */
export function Logo({ className, leafClass, wordClass }: { className?: string; leafClass?: string; wordClass?: string }) {
  return (
    <span className={`flex flex-col items-center ${className ?? ""}`}>
      <Leaf className={leafClass ?? "h-[15px]"} />
      <Wordmark className={wordClass ?? "mt-[5px] h-[12px]"} />
    </span>
  );
}
