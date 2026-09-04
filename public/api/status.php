<?php
/**
 * GET /api/status.php?id=<paymentId> — статус платежа для страницы результата.
 *
 * Отдаём только обезличенный минимум (статус, сумма, назначение):
 * ID платежа — это UUID, но светить по нему контакты клиента незачем.
 */

declare(strict_types=1);
require __DIR__ . '/_lib.php';

gk_cors();

$id = (string) ($_GET['id'] ?? '');
if (!preg_match('/^[a-f0-9-]{10,64}$/i', $id)) {
    gk_fail(422, 'Некорректный идентификатор платежа');
}

[$code, $payment] = gk_yookassa('GET', '/payments/' . rawurlencode($id));

if ($code >= 300 || empty($payment['status'])) {
    gk_fail(404, 'Платёж не найден');
}

gk_json([
    'status'      => $payment['status'],
    'paid'        => (bool) ($payment['paid'] ?? false),
    'amount'      => (int) round((float) ($payment['amount']['value'] ?? 0)),
    'description' => (string) ($payment['description'] ?? ''),
]);
