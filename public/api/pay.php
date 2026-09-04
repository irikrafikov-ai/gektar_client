<?php
/**
 * POST /api/pay.php — создаёт платёж в ЮKassa и возвращает ссылку на оплату.
 *
 * Принимает: { name, phone, email, districtId, lotId, comment? }
 *
 * Через ЮKassa оформляется РАССРОЧКА на полную стоимость участка
 * (способ оплаты sber_loan — кредит/рассрочка от СберБанка).
 * Деньги продавцу приходят сразу и полностью, дальше клиент платит банку.
 * Отдаёт:    { paymentId, confirmationUrl, amount, description }
 *
 * Сумму считает СЕРВЕР по своему конфигу — из браузера она не принимается,
 * иначе её можно было бы подменить в DevTools.
 */

declare(strict_types=1);
require __DIR__ . '/_lib.php';

gk_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    gk_fail(405, 'Метод не поддерживается');
}

$config = gk_config();
$body   = gk_body();

// --- Валидация контактов -------------------------------------------------

$name  = trim((string) ($body['name'] ?? ''));
$phone = preg_replace('/[^\d+]/', '', (string) ($body['phone'] ?? '')) ?? '';
$email = trim((string) ($body['email'] ?? ''));
$plot = '';

if (mb_strlen($name) < 2) {
    gk_fail(422, 'Укажите имя');
}
if (mb_strlen($phone) < 11) {
    gk_fail(422, 'Укажите телефон в формате +7 XXX XXX-XX-XX');
}
// Email обязателен: на него ЮKassa отправит кассовый чек по 54-ФЗ
if ($config['send_receipt'] && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    gk_fail(422, 'Укажите e-mail — на него придёт кассовый чек');
}

// --- Расчёт суммы --------------------------------------------------------

// В ЮKassa уходит полная стоимость участка — её и оформляют в рассрочку.

// Если клиент выбрал конкретный участок — цену берём ИЗ КАТАЛОГА по его id.
// Число, пришедшее из браузера, в этом случае игнорируется полностью.
$districtId = trim((string) ($body['districtId'] ?? ''));
$lotId      = trim((string) ($body['lotId'] ?? ''));

// Участок обязателен. Произвольную сумму не принимаем: заявка на банковский
// кредит должна быть привязана к конкретному участку с ценой из каталога.
if ($districtId === '' || $lotId === '') {
    gk_fail(422, 'Выберите участок');
}

[$district, $catalogLot] = gk_find_lot($districtId, $lotId);

if ($district === null) {
    gk_fail(422, 'Посёлок не найден');
}
if ($catalogLot === null) {
    gk_fail(422, 'Участок не найден');
}
if (($catalogLot['status'] ?? '') !== 'free') {
    gk_fail(409, 'Этот участок уже занят. Обновите страницу и выберите другой.');
}

// Человекочитаемое описание участка — в чек и в уведомление менеджеру.
// Площадь не подставляем: в таблице она без единицы измерения и местами
// в гектарах вместо соток, а на кассовом чеке такая неоднозначность недопустима.
$plot = trim(sprintf(
    '%s, участок %s',
    (string) ($district['name'] ?? $districtId),
    (string) ($catalogLot['number'] ?? $lotId)
));

$plotPrice = (int) $catalogLot['price'];

$amount = $plotPrice;

// Лимиты рассрочки ЮKassa проверяем сами: иначе клиент дойдёт до банка
// и упрётся в отказ уже там, не понимая причины.
$minAmount = (int) $config['installment_min_amount'];
$maxAmount = (int) $config['installment_max_amount'];

if ($amount < $minAmount) {
    gk_fail(422, 'Сумма меньше минимальной для рассрочки — ' . gk_money($minAmount));
}
if ($amount > $maxAmount) {
    gk_fail(422, sprintf(
        'Рассрочка оформляется на сумму до %s. Для этого участка позвоните нам: +7 (995) 169-12-30',
        gk_money($maxAmount)
    ));
}

$description = 'Земельный участок' . ($plot !== '' ? ' — ' . $plot : '');

if ($amount < 1) {
    gk_fail(422, 'Некорректная сумма платежа');
}

$value = number_format($amount, 2, '.', '');

// --- Сборка запроса в ЮKassa ---------------------------------------------

$payload = [
    'amount'       => ['value' => $value, 'currency' => 'RUB'],
    'capture'      => true,
    'confirmation' => [
        'type'       => 'redirect',
        'return_url' => $config['return_url'],
    ],
    'description'  => mb_substr($description, 0, 128),
    'metadata'     => [
        'name'       => mb_substr($name, 0, 100),
        'phone'      => $phone,
        'email'      => $email,
        'plot'       => mb_substr($plot, 0, 100),
        'comment'    => mb_substr(trim((string) ($body['comment'] ?? '')), 0, 200),
        'plotPrice'  => (string) $plotPrice,
        'districtId' => $districtId,
        'lotId'      => $lotId,
        'source'     => 'client.gektar.expert',
    ],
];

// Отправляем клиента сразу в оформление рассрочки. Если способ не задан —
// ЮKassa покажет все методы, включённые в личном кабинете магазина.
$paymentMethod = trim((string) ($config['payment_method'] ?? ''));
if ($paymentMethod !== '') {
    $payload['payment_method_data'] = ['type' => $paymentMethod];
}

if ($config['send_receipt']) {
    $receipt = [
        'customer' => array_filter([
            'full_name' => $name,
            'email'     => $email,
            'phone'     => $phone,
        ]),
        'items' => [[
            'description'     => mb_substr($description, 0, 128),
            'quantity'        => '1.00',
            'amount'          => ['value' => $value, 'currency' => 'RUB'],
            'vat_code'        => (int) $config['vat_code'],
            // Банк перечисляет продавцу всю сумму сразу — для продавца это полный расчёт
            'payment_mode'    => (string) $config['receipt_mode'],
            'payment_subject' => (string) $config['receipt_subject'],
        ]],
    ];
    if ($config['tax_system_code'] !== null) {
        $receipt['tax_system_code'] = (int) $config['tax_system_code'];
    }
    $payload['receipt'] = $receipt;
}

// --- Создание платежа ----------------------------------------------------

[$code, $result] = gk_yookassa('POST', '/payments', $payload, gk_uuid());

if ($code >= 300 || empty($result['id'])) {
    gk_log('yookassa_create_failed', ['http' => $code, 'response' => $result]);
    $reason = $result['description'] ?? ($result['error'] ?? 'неизвестная ошибка');
    gk_fail(502, 'Не удалось создать платёж. Позвоните нам: +7 (995) 169-12-30', (string) $reason);
}

gk_log('payment_created', [
    'id'     => $result['id'],
    'amount' => $amount,
    'phone'  => $phone,
]);

// Менеджеру — сигнал, что клиент пошёл платить (ещё не оплатил)
gk_notify_telegram(implode("\n", array_filter([
    '🕓 <b>Клиент пошёл оформлять рассрочку</b>',
    '',
    '👤 <b>Имя:</b> ' . gk_esc($name),
    '📞 <b>Телефон:</b> ' . gk_esc($phone),
    '💳 <b>Сумма рассрочки:</b> ' . gk_esc(gk_money($amount)),
    '📄 <b>Назначение:</b> ' . gk_esc($description),
    '',
    '<i>Банк ещё не подтвердил заявку — ждём уведомление от ЮKassa.</i>',
])));

gk_json([
    'paymentId'       => $result['id'],
    'confirmationUrl' => $result['confirmation']['confirmation_url'] ?? null,
    'amount'          => $amount,
    'description'     => $description,
]);
