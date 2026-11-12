import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="label text-muted">404</div>
      <h1 className="display mt-5 text-[40px] md:text-[60px]">Страница не найдена</h1>
      <p className="mt-4 max-w-[380px] text-[15px] text-muted">Sahifa topilmadi</p>
      <Link href="/ru/catalog/" className="btn btn-dark mt-8">
        Каталог
      </Link>
    </div>
  );
}
