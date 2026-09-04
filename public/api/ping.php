<?php
/**
 * GET /api/ping.php — диагностика. Показывает, что PHP на хостинге живой,
 * есть curl и лежит ли конфиг. Секретов не раскрывает.
 * Можно удалить после проверки.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$configPath = __DIR__ . '/config.php';
$shopId     = '';
if (is_file($configPath)) {
    $conf   = require $configPath;
    $shopId = is_array($conf) ? (string) ($conf['shop_id'] ?? '') : '';
}

// Подключаем библиотеку последней: если в ней синтаксическая ошибка,
// будет видно по 500 вместо этого ответа.
require __DIR__ . '/_lib.php';

echo json_encode([
    'php'            => PHP_VERSION,
    'curl'           => function_exists('curl_init'),
    'config_present' => is_file($configPath),
    'shop_id_set'    => $shopId !== '',
    'lib_loaded'     => function_exists('gk_uuid'),
    'logs_writable'  => is_writable(__DIR__),
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
