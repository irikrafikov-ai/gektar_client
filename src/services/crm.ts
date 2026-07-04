/**
 * CRM Service - отправка заявок в Google Sheets, Telegram и Email
 *
 * Структура таблицы Google Sheets (5 колонок):
 * 1. Дата и время | 2. Имя | 3. Телефон | 4. Сообщение | 5. Бюджет
 */

export interface LeadData {
  name: string;
  phone: string;
  message?: string;
  budget?: string;
}

// Google Apps Script Web App URL
const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbyjWLGDCCDjCl-ksMbDiCJOPUhaHN2KRTgSFhfMrUPUkMTlJkJmr6yBKWKCz2wh0_Bk/exec';

// Telegram config
const TELEGRAM_BOT_TOKEN = '8382117990:AAELl3jIwC9tAMqqh7Yn0ZZUYdyv8qlSAG4';
const TELEGRAM_CHAT_ID = '@gektar_request';

/**
 * Отправляет заявку в GAS и Telegram (одновременно).
 */
export async function sendLead(data: LeadData): Promise<{ success: boolean; message: string }> {
  const payload = {
    timestamp: new Date().toISOString(),
    name: data.name,
    phone: data.phone,
    message: data.message || '',
    budget: data.budget || '',
  };

  console.log('[CRM] Sending lead:', payload);

  const results = await Promise.allSettled([
    sendToGas(payload),
    sendTelegramDirect(data),
  ]);

  console.log('[CRM] GAS:', results[0].status);
  console.log('[CRM] TG:', results[1].status);

  if (results[0].status === 'fulfilled' || results[1].status === 'fulfilled') {
    return { success: true, message: 'Заявка отправлена! Мы свяжемся с вами.' };
  }

  return { success: false, message: 'Ошибка отправки. Позвоните: +7 (995) 169-12-30' };
}

/** Отправка в Google Apps Script */
async function sendToGas(payload: Record<string, string>): Promise<void> {
  await fetch(GAS_WEBAPP_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: JSON.stringify(payload),
  });
  console.log('[CRM] GAS sent');
}

/**
 * Отправка в Telegram группу @gektar_request
 * Сначала пробуем с cors (чтобы увидеть ответ), если падает — no-cors
 */
async function sendTelegramDirect(data: LeadData): Promise<void> {
  const msg = [
    '\u{1F4CB} <b>Новая заявка с сайта \u{0413}\u{0435}\u{043A}\u{0442}\u{0430}\u{0440}\u{42A} \u{0434}\u{043B}\u{044F} \u{043A}\u{043B}\u{0438}\u{0435}\u{043D}\u{0442}\u{043E}\u{0432}</b>',
    '',
    `\u{1F464} <b>\u{0418}\u{043C}\u{044F}:</b> ${esc(data.name)}`,
    `\u{1F4DE} <b>\u{0422}\u{0435}\u{043B}\u{0435}\u{0444}\u{043E}\u{043D}:</b> ${esc(data.phone)}`,
    data.message ? `\u{1F4AC} <b>\u{0421}\u{043E}\u{043E}\u{0431}\u{0449}\u{0435}\u{043D}\u{0438}\u{0435}:</b> ${esc(data.message)}` : '',
    data.budget ? `\u{1F4B0} <b>\u{0411}\u{044E}\u{0434}\u{0436}\u{0435}\u{0442}:</b> ${esc(data.budget)}` : '',
    '',
    `\u{23F0} <b>\u{0412}\u{0440}\u{0435}\u{043C}\u{044F}:</b> ${new Date().toLocaleString('ru-RU')}`,
  ].filter(Boolean).join('\n');

  const body = JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: msg,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });

  // Попытка 1: с cors mode (если TG API вернёт CORS — увидим ответ)
  try {
    const resp = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    });
    const json = await resp.json();
    console.log('[CRM] Telegram OK:', json.ok);
    if (!json.ok) {
      console.error('[CRM] Telegram API error:', json.description);
      throw new Error(json.description);
    }
    return;
  } catch (e) {
    console.log('[CRM] Telegram cors failed, trying no-cors:', e);
  }

  // Попытка 2: no-cors (гарантированно уйдёт, но ответа не видим)
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: body,
  });
  console.log('[CRM] Telegram sent (no-cors)');
}

function esc(t: string): string {
  return t?.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') || '';
}
