import type { L10n } from "@/i18n/config";

/**
 * Данные о магазине — в одном месте.
 * Пустая строка у ссылки = кнопка остаётся на сайте, но никуда не ведёт.
 */
export const site = {
  name: "Paul Martin",
  phone: "+998 98 126 16 68",
  phoneHref: "tel:+998981261668",
  /** Telegram менеджера для кнопок «Написать в Telegram». Пока пусто — ссылку дадут позже. */
  telegram: "",
  /** Telegram-канал магазина */
  telegramChannel: "https://t.me/+ounfz590AbBiM2Zi",
  instagram: "https://www.instagram.com/paulmartin_uzbekistan",
  stores: [
    {
      id: "amir-temur",
      name: { ru: "Бутик на Амира Темура", uz: "Amir Temur ko‘chasidagi butik" } as L10n,
      address: { ru: "Ташкент, ул. Амира Темура, 1", uz: "Toshkent, Amir Temur ko‘chasi, 1" } as L10n,
      map: "https://yandex.uz/maps/?text=" + encodeURIComponent("Ташкент, улица Амира Темура, 1"),
      image: "pidzhak-sg-2",
    },
    {
      id: "poytaxt",
      name: { ru: "ТРЦ «Пойтахт», Megabrand", uz: "«Poytaxt» SEM, Megabrand" } as L10n,
      address: { ru: "Ташкент, ТРЦ «Пойтахт», магазин Megabrand", uz: "Toshkent, «Poytaxt» savdo markazi, Megabrand do‘koni" } as L10n,
      map: "https://yandex.uz/maps/?text=" + encodeURIComponent("Ташкент, ТРЦ Пойтахт"),
      image: "zip-bordo-1",
    },
  ],
};
