/**
 * Каталог участков для страницы оплаты.
 *
 * Данные берутся из /api/lots.json — того же файла, который читает PHP.
 * Цена здесь нужна только чтобы показать её клиенту: платёж всё равно
 * считается на сервере по id участка.
 */

export type LotStatus = 'free' | 'reserved' | 'sold';

export interface Lot {
  id: string;
  number: string;
  areaLabel?: string;
  price: number;
  status: LotStatus;
}

export interface District {
  id: string;
  name: string;
  region?: string;
  lots: Lot[];
}

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

async function loadFrom(url: string): Promise<District[] | null> {
  try {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (!Array.isArray(data?.districts)) {
      return null;
    }
    return (data.districts as District[]).filter(
      (district) => district && typeof district.id === 'string' && Array.isArray(district.lots),
    );
  } catch {
    return null;
  }
}

/**
 * Загружает каталог. Основной источник — lots.php (он тянет Google-таблицу
 * и кэширует её). Если PHP недоступен — например, на dev-сервере Vite —
 * откатываемся на статический lots.json.
 *
 * Если не вышло ни то ни другое, возвращаем пустой список: страница оплаты
 * тогда просто покажет слайдер стоимости вместо выбора участка.
 */
export async function fetchDistricts(): Promise<District[]> {
  return (
    (await loadFrom(`${API_BASE}/api/lots.php`)) ??
    (await loadFrom(`${API_BASE}/api/lots.json`)) ??
    []
  );
}

/** Статусы, при которых участок можно оплатить. */
export function isLotAvailable(lot: Lot): boolean {
  return lot.status === 'free';
}

export function lotStatusLabel(status: LotStatus): string {
  if (status === 'reserved') return 'забронирован';
  if (status === 'sold') return 'продан';
  return 'свободен';
}
