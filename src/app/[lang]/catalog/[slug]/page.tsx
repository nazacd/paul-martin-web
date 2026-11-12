import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { getProduct, products } from "@/data/products";
import { asset } from "@/lib/asset";
import { ProductView } from "@/components/ProductView";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => products.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/catalog/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!product || !isLocale(lang)) return {};
  return {
    title: product.name[lang],
    description: product.description[lang],
    openGraph: { images: [asset(`/media/p/${product.images[0]}.webp`)] },
  };
}

export default async function ProductPage({ params }: PageProps<"/[lang]/catalog/[slug]">) {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!product || !isLocale(lang)) notFound();
  return <ProductView key={product.id} product={product} />;
}
