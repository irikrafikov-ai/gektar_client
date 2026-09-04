/**
 * Оплата через ЮKassa.
 *
 * Через ЮKassa оформляется рассрочка на полную стоимость участка
 * (кредит/рассрочка от СберБанка). Продавец получает деньги сразу,
 * дальше клиент рассчитывается с банком.
 *
 * Браузер только собирает контакты и говорит, какой участок берут.
 * Сумму определяет сервер (public/api/pay.php) — подменить её из DevTools нельзя.
 */

export interface PaymentRequest {
  name: string;
  phone: string;
  email: string;
  /** id посёлка из каталога. */
  districtId: string;
  /** id участка из каталога. Цену сервер берёт по нему сам. */
  lotId: string;
  comment?: string;
}

export interface PaymentCreated {
  paymentId: string;
  confirmationUrl: string;
  amount: number;
  description: string;
}

export interface PaymentStatus {
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';
  paid: boolean;
  amount: number;
  description: string;
}

/**
 * База API. На проде — тот же домен. Для локальной разработки положите
 * в .env.local строку VITE_API_BASE=https://client.gektar.expert
 * (PHP на dev-сервере Vite не работает).
 */
const API_BASE = import.meta.env.VITE_API_BASE ?? '';

/** Ключ, под которым храним id платежа между редиректом на ЮKassa и возвратом. */
const STORAGE_KEY = 'gk_payment_id';

export function rememberPaymentId(id: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, id);
  } catch {
    // приватный режим — не критично, статус просто не покажем
  }
}

export function recallPaymentId(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function forgetPaymentId(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // игнорируем
  }
}

/** Создаёт платёж и возвращает ссылку, куда редиректить клиента. */
export async function createPayment(data: PaymentRequest): Promise<PaymentCreated> {
  const response = await fetch(`${API_BASE}/api/pay.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || 'Не удалось создать платёж. Позвоните: +7 (499) 325-48-58');
  }
  if (!result.confirmationUrl) {
    throw new Error('Платёжный сервис не вернул ссылку на оплату. Позвоните: +7 (499) 325-48-58');
  }

  return result as PaymentCreated;
}

/** Спрашивает у сервера, чем закончился платёж. */
export async function fetchPaymentStatus(id: string): Promise<PaymentStatus> {
  const response = await fetch(`${API_BASE}/api/status.php?id=${encodeURIComponent(id)}`);
  if (!response.ok) {
    throw new Error('Не удалось получить статус платежа');
  }
  return (await response.json()) as PaymentStatus;
}

/**
 * Лимиты рассрочки ЮKassa (sber_loan) — держим в одном месте с сервером.
 * Сервер проверяет их ещё раз, это только для подсказки клиенту.
 */
export const INSTALLMENT_MIN_AMOUNT = 3000;
export const INSTALLMENT_MAX_AMOUNT = 1500000;

export function formatRub(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₽`;
}
