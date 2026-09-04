<?php
/**
 * POST /api/webhook.php — уведомления от ЮKassa о смене статуса платежа.
 *
 * Этот URL надо прописать в личном кабинете ЮKassa:
 *   Настройки → Уведомления → HTTP-уведомления
 *   https://client.gektar.expert/api/webhook.php
 *   события: payment.succeeded, payment.canceled
 *
 * Защита двойная: проверяем IP отправителя и перезапрашиваем платёж
 * через API — телу запроса на слово не верим.
 */

declare(strict_types=1);
require __DIR__ . '/_lib.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    exit;
}

$config = gk_config();

// --- Проверка источника --------------------------------------------------

/** Официальные подсети, с которых ЮKassa шлёт уведомления. */
const GK_YOOKASSA_NETS = [
    '185.71.76.0/27',
    '185.71.77.0/27',
    '77.75.153.0/25',
    '77.75.154.128/25',
    '77.75.156.11/32',
    '77.75.156.35/32',
];

function gk_ip_in_net(string $ip, string $cidr): bool
{
    [$subnet, $bits] = array_pad(explode('/', $cidr, 2), 2, '32');
    $ipLong     = ip2long($ip);
    $subnetLong = ip2long($subnet);
    if ($ipLong === false || $subnetLong === false) {
        return false;
    }
    $mask = -1 << (32 - (int) $bits);
    return ($ipLong & $mask) === ($subnetLong & $mask);
}

function gk_client_ip(): string
{
    // На reg.ru перед PHP стоит nginx — реальный IP приходит в заголовке
    foreach (['HTTP_X_REAL_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $key) {
        $value = $_SERVER[$key] ?? '';
        if ($value !== '') {
            return trim(explode(',', $value)[0]);
        }
    }
    return '';
}

if ($config['verify_webhook_ip']) {
    $ip = gk_client_ip();
    $ok = false;
    foreach (GK_YOOKASSA_NETS as $net) {
        if (gk_ip_in_net($ip, $net)) {
            $ok = true;
            break;
        }
    }
    // IPv6-диапазон ЮKassa 2a02:5180::/32 — проверяем по префиксу
    if (!$ok && stripos($ip, '2a02:5180:') === 0) {
        $ok = true;
    }
    if (!$ok) {
        gk_log('webhook_rejected_ip', ['ip' => $ip]);
        http_response_code(403);
        exit;
    }
}

// --- Разбор уведомления --------------------------------------------------

$event     = gk_body();
$paymentId = $event['object']['id'] ?? '';

if ($paymentId === '') {
    gk_log('webhook_no_id', ['event' => $event]);
    http_response_code(400);
    exit;
}

// Перезапрашиваем платёж у ЮKassa — источник правды это API, а не тело запроса
[$code, $payment] = gk_yookassa('GET', '/payments/' . rawurlencode($paymentId));

if ($code >= 300 || empty($payment['status'])) {
    gk_log('webhook_fetch_failed', ['id' => $paymentId, 'http' => $code]);
    // 500 → ЮKassa повторит уведомление позже
    http_response_code(500);
    exit;
}

$status = (string) $payment['status'];
$meta   = $payment['metadata'] ?? [];
$amount = (int) round((float) ($payment['amount']['value'] ?? 0));

gk_log('webhook', ['id' => $paymentId, 'status' => $status, 'amount' => $amount]);

// --- Реакция на успешную оплату ------------------------------------------

if ($status === 'succeeded') {
    $kind = 'Рассрочка оформлена';

    gk_notify_telegram(implode("\n", array_filter([
        '✅ <b>РАССРОЧКА ОФОРМЛЕНА</b>',
        '',
        '💰 <b>Сумма:</b> ' . gk_esc(gk_money($amount)),
        '🏷 <b>Назначение:</b> ' . gk_esc($kind),
        '👤 <b>Имя:</b> ' . gk_esc((string) ($meta['name'] ?? '—')),
        '📞 <b>Телефон:</b> ' . gk_esc((string) ($meta['phone'] ?? '—')),
        ($meta['email'] ?? '') !== '' ? '✉️ <b>E-mail:</b> ' . gk_esc((string) $meta['email']) : '',
        ($meta['plot'] ?? '') !== '' ? '📍 <b>Участок:</b> ' . gk_esc((string) $meta['plot']) : '',
        ($meta['comment'] ?? '') !== '' ? '💬 <b>Комментарий:</b> ' . gk_esc((string) $meta['comment']) : '',
        '',
        '🧾 <b>ID платежа:</b> <code>' . gk_esc($paymentId) . '</code>',
        '⏰ ' . date('d.m.Y H:i'),
    ])));

    gk_notify_sheets([
        'timestamp' => date('c'),
        'name'      => (string) ($meta['name'] ?? ''),
        'phone'     => (string) ($meta['phone'] ?? ''),
        'message'   => 'ОПЛАЧЕНО: ' . $kind . ' | ' . $paymentId
                       . (($meta['plot'] ?? '') !== '' ? ' | участок: ' . $meta['plot'] : ''),
        'budget'    => gk_money($amount),
    ]);
}

if ($status === 'canceled') {
    gk_notify_telegram(implode("\n", [
        '❌ <b>Рассрочку не оформили</b>',
        '',
        '👤 ' . gk_esc((string) ($meta['name'] ?? '—')) . ' — ' . gk_esc((string) ($meta['phone'] ?? '—')),
        '💰 ' . gk_esc(gk_money($amount)),
        '📄 Причина: ' . gk_esc((string) ($payment['cancellation_details']['reason'] ?? 'неизвестно')),
        '',
        '<i>Стоит перезвонить — клиент явно хотел купить.</i>',
    ]));
}

// ЮKassa ждёт 200, иначе будет слать повторы
http_response_code(200);
echo 'ok';
