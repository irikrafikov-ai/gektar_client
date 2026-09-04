<?php
/**
 * GET /api/lots.php — каталог посёлков и участков для страницы оплаты.
 *
 * Источник — Google-таблица (если задана в конфиге), иначе локальный lots.json.
 * Результат кэшируется на диске, поэтому в Google мы ходим не чаще раза в 5 минут.
 */

declare(strict_types=1);
require __DIR__ . '/_lib.php';

gk_cors();

$catalog = gk_lots_catalog();

gk_json([
    'districts' => $catalog['districts'],
    'updatedAt' => $catalog['updatedAt'],
    'source'    => $catalog['source'],
]);
