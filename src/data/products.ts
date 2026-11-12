import type { L10n, Locale } from "@/i18n/config";

export type CategoryKey = "blazers" | "outerwear" | "knitwear" | "trousers" | "shoes" | "accessories";

export const categories: { key: CategoryKey; name: L10n; cover: string }[] = [
  { key: "blazers", name: { ru: "Пиджаки", uz: "Pidjaklar" }, cover: "pidzhak-jersey-1" },
  { key: "outerwear", name: { ru: "Верхняя одежда", uz: "Ustki kiyimlar" }, cover: "kurtka-navy-1" },
  { key: "knitwear", name: { ru: "Трикотаж", uz: "Trikotaj" }, cover: "zip-taupe-3" },
  { key: "trousers", name: { ru: "Брюки", uz: "Shimlar" }, cover: "chinos-1" },
  { key: "shoes", name: { ru: "Обувь", uz: "Poyabzal" }, cover: "lofery-1" },
  { key: "accessories", name: { ru: "Аксессуары", uz: "Aksessuarlar" }, cover: "galstuki-1" },
];

export type ColorKey =
  | "greyBlue"
  | "lightGrey"
  | "khaki"
  | "navy"
  | "beige"
  | "green"
  | "burgundy"
  | "taupe"
  | "grey"
  | "coffee"
  | "brown"
  | "blue"
  | "black"
  | "olive"
  | "multi";

export const colors: Record<ColorKey, { hex: string; name: L10n }> = {
  greyBlue: { hex: "#7d8a99", name: { ru: "Серо-голубой", uz: "Kulrang-havorang" } },
  lightGrey: { hex: "#bdb6ab", name: { ru: "Светло-серый", uz: "Och kulrang" } },
  khaki: { hex: "#5b584d", name: { ru: "Хаки", uz: "Xaki" } },
  navy: { hex: "#1d2433", name: { ru: "Тёмно-синий", uz: "To‘q ko‘k" } },
  beige: { hex: "#cfc2b0", name: { ru: "Бежевый", uz: "Bej" } },
  green: { hex: "#4e6352", name: { ru: "Зелёный", uz: "Yashil" } },
  burgundy: { hex: "#6a1f2b", name: { ru: "Бордовый", uz: "To‘q qizil" } },
  taupe: { hex: "#8f8075", name: { ru: "Серо-коричневый", uz: "Kulrang-jigarrang" } },
  grey: { hex: "#8e9196", name: { ru: "Серый", uz: "Kulrang" } },
  coffee: { hex: "#6f5a4c", name: { ru: "Кофейный", uz: "Qahva rang" } },
  brown: { hex: "#4a3428", name: { ru: "Коричневый", uz: "Jigarrang" } },
  blue: { hex: "#2b3a6b", name: { ru: "Синий", uz: "Ko‘k" } },
  black: { hex: "#151515", name: { ru: "Чёрный", uz: "Qora" } },
  olive: { hex: "#6e6150", name: { ru: "Оливково-коричневый", uz: "Zaytun-jigarrang" } },
  multi: { hex: "linear-gradient(135deg,#2b3a6b,#6a1f2b,#b9a26a)", name: { ru: "Разные цвета", uz: "Turli ranglar" } },
};

export type Product = {
  id: string;
  slug: string;
  sku: string;
  category: CategoryKey;
  color: ColorKey;
  name: L10n;
  description: L10n;
  /** Цена в сумах. ДЕМО-значения для показа — заменить реальными. */
  price: number;
  /** Цена до скидки — только у товаров распродажи */
  oldPrice?: number;
  isNew: boolean;
  /** Имена файлов в /public/media/p без расширения; первый кадр — обложка карточки */
  images: string[];
  sizes: string[];
  /** Товары из того же образа — показываются на карточке */
  look?: string[];
};

const TAILORING = ["46", "48", "50", "52", "54", "56"];
const KNIT = ["S", "M", "L", "XL", "XXL"];
const SHOES = ["40", "41", "42", "43", "44", "45"];
const TROUSERS = ["46", "48", "50", "52", "54"];

export const products: Product[] = [
  {
    id: "pm-2601",
    slug: "pidzhak-sero-goluboj",
    sku: "PM-2601",
    category: "blazers",
    color: "greyBlue",
    name: { ru: "Пиджак однобортный, серо-голубой", uz: "Bir qatorli pidjak, kulrang-havorang" },
    description: {
      ru: "Мягкий однобортный пиджак без жёсткой конструкции: держит форму плеча и при этом не сковывает движений. Фактурная ткань в спокойном серо-голубом оттенке одинаково хорошо работает с рубашкой, тонким трикотажем и свитером в полоску.",
      uz: "Qattiq konstruksiyasiz yumshoq bir qatorli pidjak: yelka shaklini saqlaydi, harakatni cheklamaydi. Vazmin kulrang-havorang tusdagi teksturali mato ko‘ylak, nozik trikotaj va chiziqli sviter bilan birdek yaxshi uyg‘unlashadi.",
    },
    price: 3_490_000,
    isNew: true,
    images: ["pidzhak-sg-1", "pidzhak-sg-3", "pidzhak-sg-2", "pidzhak-sg-4", "pidzhak-sg-5"],
    sizes: TAILORING,
    look: ["svitr-v-polosku-kofejnyj", "lofery-zamshevye"],
  },
  {
    id: "pm-2602",
    slug: "pidzhak-trikotazhnyj-svetlo-seryj",
    sku: "PM-2602",
    category: "blazers",
    color: "lightGrey",
    name: { ru: "Трикотажный пиджак, светло-серый", uz: "Trikotaj pidjak, och kulrang" },
    description: {
      ru: "Пиджак из плотного трикотажа с мягким плечом и накладными карманами. Сочетание собранного силуэта и комфорта кардигана — с поло, классическими брюками и замшевыми лоферами.",
      uz: "Yumshoq yelkali va ustki cho‘ntakli zich trikotajdan tikilgan pidjak. Yig‘iq siluet va kardigan qulayligi uyg‘unligi — polo, klassik shim va zamsha loferlar bilan.",
    },
    price: 3_290_000,
    isNew: true,
    images: ["pidzhak-jersey-1", "pidzhak-jersey-2", "pidzhak-jersey-3"],
    sizes: TAILORING,
    look: ["lofery-zamshevye", "dzhemper-na-molnii-seryj-korichnevyj"],
  },
  {
    id: "pm-2603",
    slug: "palto-s-kapyushonom-haki",
    sku: "PM-2603",
    category: "outerwear",
    color: "khaki",
    name: { ru: "Пальто с капюшоном, хаки", uz: "Kapyushonli palto, xaki" },
    description: {
      ru: "Пальто прямого кроя из плотной фактурной ткани с капюшоном и контрастной планкой. Застёгивается на молнию и кнопки, длина до середины бедра — тёплый вариант на каждый день.",
      uz: "Zich teksturali matodan tikilgan, kapyushonli va kontrast planka bilan to‘g‘ri bichimli palto. Molniya va tugmalar bilan qadaladi, son o‘rtasigacha uzunlikda — har kun uchun issiq variant.",
    },
    price: 4_290_000,
    isNew: true,
    images: ["palto-haki-1", "palto-haki-2"],
    sizes: TAILORING,
    look: ["svitr-v-polosku-seryj", "pidzhak-sero-goluboj"],
  },
  {
    id: "pm-2604",
    slug: "kurtka-temno-sinyaya",
    sku: "PM-2604",
    category: "outerwear",
    color: "navy",
    name: { ru: "Куртка с отложным воротником, тёмно-синяя", uz: "Ag‘darma yoqali kurtka, to‘q ko‘k" },
    description: {
      ru: "Классическая куртка в глубоком тёмно-синем оттенке: отложной воротник, потайная застёжка и лаконичный силуэт. Надевается поверх джемпера или пиджака и подходит и к брюкам, и к джинсам.",
      uz: "Chuqur to‘q ko‘k tusdagi klassik kurtka: ag‘darma yoqa, yashirin qadama va lakonik siluet. Jemper yoki pidjak ustidan kiyiladi, shim bilan ham, jinsi bilan ham mos keladi.",
    },
    price: 3_690_000,
    isNew: true,
    images: ["kurtka-navy-1", "kurtka-navy-2", "kurtka-navy-3"],
    sizes: TAILORING,
    look: ["dzhemper-na-molnii-temno-sinij"],
  },
  {
    id: "pm-2605",
    slug: "bomber-temno-sinij",
    sku: "PM-2605",
    category: "outerwear",
    color: "navy",
    name: { ru: "Бомбер, тёмно-синий", uz: "Bomber, to‘q ko‘k" },
    description: {
      ru: "Лёгкий бомбер с воротником-стойкой и трикотажными манжетами. Матовая ткань и металлическая молния — спортивная форма в собранном, городском исполнении.",
      uz: "Tik yoqali va trikotaj manjetli yengil bomber. Mat mato va metall molniya — sportcha shakl yig‘iq, shaharcha ijroda.",
    },
    price: 2_790_000,
    isNew: true,
    images: ["bomber-1", "bomber-2", "bomber-3", "bomber-4"],
    sizes: TAILORING,
    look: ["dzhemper-na-molnii-bordovyj"],
  },
  {
    id: "pm-2606",
    slug: "kurtka-bezhevaya",
    sku: "PM-2606",
    category: "outerwear",
    color: "beige",
    name: { ru: "Куртка на молнии, бежевая", uz: "Molniyali kurtka, bej" },
    description: {
      ru: "Светлая куртка с контрастным воротником и трикотажными манжетами. Её легко носить поверх джемпера в межсезонье и с классическими брюками в городе.",
      uz: "Kontrast yoqali va trikotaj manjetli och rangli kurtka. Mavsumlararo davrda jemper ustidan va shaharda klassik shim bilan kiyish qulay.",
    },
    price: 2_990_000,
    isNew: true,
    images: ["kurtka-bezh-1", "kurtka-bezh-2", "kurtka-bezh-3"],
    sizes: TAILORING,
    look: ["dzhemper-na-molnii-seryj-korichnevyj"],
  },
  {
    id: "pm-2607",
    slug: "dzhemper-na-molnii-bordovyj",
    sku: "PM-2607",
    category: "knitwear",
    color: "burgundy",
    name: { ru: "Джемпер с воротником на молнии, бордовый", uz: "Yoqasi molniyali jemper, to‘q qizil" },
    description: {
      ru: "Тонкий джемпер из мягкой пряжи с воротником на молнии. Глубокий бордовый оттенок — самый выразительный в коллекции; хорош под бомбер и с серыми брюками.",
      uz: "Yoqasi molniyali, yumshoq ipdan to‘qilgan nozik jemper. Chuqur to‘q qizil tus — kolleksiyadagi eng ifodali rang; bomber ostida va kulrang shim bilan chiroyli.",
    },
    price: 1_390_000,
    isNew: true,
    images: ["zip-bordo-1", "zip-bordo-2", "zip-bordo-3", "zip-bordo-4"],
    sizes: KNIT,
    look: ["bomber-temno-sinij"],
  },
  {
    id: "pm-2608",
    slug: "dzhemper-na-molnii-seryj-korichnevyj",
    sku: "PM-2608",
    category: "knitwear",
    color: "taupe",
    name: { ru: "Джемпер с воротником на молнии, серо-коричневый", uz: "Yoqasi molniyali jemper, kulrang-jigarrang" },
    description: {
      ru: "Джемпер на молнии в универсальном серо-коричневом оттенке. Мягкая фактура, аккуратные манжеты и металлическая бирка — базовая вещь, которая собирает образ и с джинсами, и с пиджаком.",
      uz: "Universal kulrang-jigarrang tusdagi molniyali jemper. Yumshoq tekstura, ozoda manjetlar va metall yorliq — jinsi bilan ham, pidjak bilan ham obraz yaratadigan bazaviy kiyim.",
    },
    price: 1_390_000,
    isNew: true,
    images: ["zip-taupe-1", "zip-taupe-2", "zip-taupe-3"],
    sizes: KNIT,
    look: ["kurtka-bezhevaya"],
  },
  {
    id: "pm-2609",
    slug: "dzhemper-na-molnii-temno-sinij",
    sku: "PM-2609",
    category: "knitwear",
    color: "navy",
    name: { ru: "Джемпер с воротником на молнии, тёмно-синий", uz: "Yoqasi molniyali jemper, to‘q ko‘k" },
    description: {
      ru: "Тёмно-синий джемпер на молнии с контрастной отделкой воротника. Строгий цвет и тонкое плетение — подходит под пиджак в офисе и к брюкам свободного кроя в выходные.",
      uz: "Yoqasi kontrast bezakli to‘q ko‘k molniyali jemper. Jiddiy rang va nozik to‘qima — ofisda pidjak ostida, dam olish kunlari erkin shim bilan mos.",
    },
    price: 1_390_000,
    isNew: true,
    images: ["zip-navy-1", "zip-navy-2"],
    sizes: KNIT,
    look: ["kurtka-temno-sinyaya"],
  },
  {
    id: "pm-2610",
    slug: "dzhemper-na-molnii-zelenyj",
    sku: "PM-2610",
    category: "knitwear",
    color: "green",
    name: { ru: "Джемпер с воротником на молнии, зелёный", uz: "Yoqasi molniyali jemper, yashil" },
    description: {
      ru: "Джемпер в глубоком зелёном оттенке — сочетание комфорта, лаконичного дизайна и современной классики. Дополнит и деловой, и повседневный образ.",
      uz: "Chuqur yashil tusdagi jemper — qulaylik, lakonik dizayn va zamonaviy klassika uyg‘unligi. Ham ishchan, ham kundalik obrazni to‘ldiradi.",
    },
    price: 1_390_000,
    isNew: true,
    images: ["zip-zelenyj-1"],
    sizes: KNIT,
  },
  {
    id: "pm-2611",
    slug: "svitr-v-polosku-kofejnyj",
    sku: "PM-2611",
    category: "knitwear",
    color: "coffee",
    name: { ru: "Свитер в полоску, кофейный", uz: "Chiziqli sviter, qahva rang" },
    description: {
      ru: "Свитер из мягкой пряжи с тонкими светлыми полосками. Спокойный кофейный оттенок хорошо смотрится с рубашкой под горло и серым пиджаком.",
      uz: "Nozik och chiziqli, yumshoq ipdan to‘qilgan sviter. Vazmin qahva rang ko‘ylak va kulrang pidjak bilan chiroyli ko‘rinadi.",
    },
    price: 1_290_000,
    isNew: true,
    images: ["svitr-kofe-1", "svitr-kofe-2", "svitr-kofe-3", "svitr-kofe-4"],
    sizes: KNIT,
    look: ["pidzhak-sero-goluboj"],
  },
  {
    id: "pm-2612",
    slug: "svitr-v-polosku-seryj",
    sku: "PM-2612",
    category: "knitwear",
    color: "grey",
    name: { ru: "Свитер в полоску, серый", uz: "Chiziqli sviter, kulrang" },
    description: {
      ru: "Светло-серый свитер с тонкими контрастными линиями — современная интерпретация классического трикотажа. Легко сочетается с брюками, пиджаком и повседневным гардеробом.",
      uz: "Nozik kontrast chiziqli och kulrang sviter — klassik trikotajning zamonaviy talqini. Shim, pidjak va kundalik garderob bilan oson uyg‘unlashadi.",
    },
    price: 1_290_000,
    isNew: true,
    images: ["svitr-seryj-1", "svitr-seryj-2"],
    sizes: KNIT,
    look: ["palto-s-kapyushonom-haki"],
  },
  {
    id: "pm-2613",
    slug: "lofery-zamshevye",
    sku: "PM-2613",
    category: "shoes",
    color: "brown",
    name: { ru: "Лоферы замшевые, коричневые", uz: "Zamsha loferlar, jigarrang" },
    description: {
      ru: "Лоферы из премиальной замши на лёгкой рельефной подошве. Универсальная пара, которая дополняет и повседневный, и smart casual образ.",
      uz: "Yengil relyefli tag charmli premium zamshadan loferlar. Kundalik ham, smart casual obrazni ham to‘ldiradigan universal juftlik.",
    },
    price: 1_890_000,
    isNew: true,
    images: ["lofery-1"],
    sizes: SHOES,
  },
  {
    id: "pm-2614",
    slug: "galstuk",
    sku: "PM-2614",
    category: "accessories",
    color: "multi",
    name: { ru: "Галстук", uz: "Galstuk" },
    description: {
      ru: "Деталь, которая завершает образ: галстуки для деловых встреч, мероприятий и особых случаев. Разные расцветки — от однотонного синего до мелкого орнамента.",
      uz: "Obrazni yakunlaydigan detal: ishchan uchrashuvlar, tadbirlar va alohida kunlar uchun galstuklar. Turli ranglar — bir tusli ko‘kdan mayda naqshgacha.",
    },
    price: 390_000,
    isNew: false,
    images: ["galstuki-1"],
    sizes: [],
  },
  // ---------- Распродажа −50% ----------
  {
    id: "pm-2515",
    slug: "kurtka-hudi-temno-sinyaya",
    sku: "PM-2515",
    category: "outerwear",
    color: "navy",
    name: { ru: "Куртка-худи на молнии, тёмно-синяя", uz: "Molniyali xudi-kurtka, to‘q ko‘k" },
    description: {
      ru: "Куртка-худи на молнии с капюшоном и карманами-кенгуру. Повседневная вещь для прохладных дней — с чиносами и кедами.",
      uz: "Kapyushonli va kenguru cho‘ntakli molniyali xudi-kurtka. Salqin kunlar uchun kundalik kiyim — chinos va kedlar bilan.",
    },
    price: 990_000,
    oldPrice: 1_980_000,
    isNew: false,
    images: ["hudi-navy-1", "hudi-navy-2", "hudi-navy-3"],
    sizes: KNIT,
    look: ["bryuki-chinos"],
  },
  {
    id: "pm-2516",
    slug: "kurtka-rubashka-sinyaya",
    sku: "PM-2516",
    category: "outerwear",
    color: "blue",
    name: { ru: "Куртка-рубашка с капюшоном, синяя", uz: "Kapyushonli kurtka-ko‘ylak, ko‘k" },
    description: {
      ru: "Куртка-рубашка из мягкой фактурной ткани в глубоком синем оттенке: накладные карманы, пуговицы и капюшон. С классическими брюками — готовый образ для города и офиса.",
      uz: "Chuqur ko‘k tusdagi yumshoq teksturali matodan kurtka-ko‘ylak: ustki cho‘ntaklar, tugmalar va kapyushon. Klassik shim bilan — shahar va ofis uchun tayyor obraz.",
    },
    price: 1_190_000,
    oldPrice: 2_380_000,
    isNew: false,
    images: ["overshirt-1", "overshirt-2", "overshirt-3", "overshirt-4"],
    sizes: TAILORING,
  },
  {
    id: "pm-2517",
    slug: "kurtka-s-kapyushonom-chernaya",
    sku: "PM-2517",
    category: "outerwear",
    color: "black",
    name: { ru: "Куртка с капюшоном, чёрная", uz: "Kapyushonli kurtka, qora" },
    description: {
      ru: "Лёгкая куртка с капюшоном, двумя нагрудными карманами и фирменным бегунком молнии. Практичная вещь для города, прогулок и поездок.",
      uz: "Kapyushonli, ikkita ko‘krak cho‘ntakli va firma molniya surgichli yengil kurtka. Shahar, sayr va safarlar uchun amaliy kiyim.",
    },
    price: 1_390_000,
    oldPrice: 2_780_000,
    isNew: false,
    images: ["kurtka-black-1", "kurtka-black-2", "kurtka-black-3"],
    sizes: TAILORING,
  },
  {
    id: "pm-2518",
    slug: "bryuki-chinos",
    sku: "PM-2518",
    category: "trousers",
    color: "olive",
    name: { ru: "Брюки чинос прямого кроя", uz: "To‘g‘ri bichimli chinos shim" },
    description: {
      ru: "Чинос прямого кроя в оливково-коричневом оттенке. Сочетаются с худи, джемпером и пиджаком — основа повседневного гардероба.",
      uz: "Zaytun-jigarrang tusdagi to‘g‘ri bichimli chinos. Xudi, jemper va pidjak bilan mos — kundalik garderob asosi.",
    },
    price: 590_000,
    oldPrice: 1_180_000,
    isNew: false,
    images: ["chinos-1"],
    sizes: TROUSERS,
    look: ["kurtka-hudi-temno-sinyaya"],
  },
];

export const sizeTable = [
  { size: "46", letter: "S", chest: "90–93", waist: "78–81" },
  { size: "48", letter: "M", chest: "94–97", waist: "82–85" },
  { size: "50", letter: "L", chest: "98–101", waist: "86–89" },
  { size: "52", letter: "XL", chest: "102–105", waist: "90–93" },
  { size: "54", letter: "XXL", chest: "106–109", waist: "94–97" },
  { size: "56", letter: "3XL", chest: "110–113", waist: "98–101" },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function isSale(p: Product): boolean {
  return p.oldPrice !== undefined;
}

export function productPath(p: Product): string {
  return `/catalog/${p.slug}/`;
}

export function categoryName(key: CategoryKey, locale: Locale): string {
  return categories.find((c) => c.key === key)?.name[locale] ?? key;
}
