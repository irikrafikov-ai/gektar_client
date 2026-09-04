<?php
/**
 * Общие функции платёжного модуля: конфиг, ответы, вызовы ЮKassa, уведомления.
 * Подключается всеми эндпоинтами, наружу сам ничего не отдаёт.
 */

declare(strict_types=1);

// Предупреждения PHP не должны попадать в тело JSON-ответа и ломать его разбор
@ini_set('display_errors', '0');

// --- Конфиг ---------------------------------------------------------------

function gk_config(): array
{
    static $config = null;
    if ($config === null) {
        $path = __DIR__ . '/config.php';
        if (!is_file($path)) {
            gk_fail(500, 'Модуль не настроен: нет config.php');
        }
        $config = require $path;
        if (!is_array($config)) {
            gk_fail(500, 'Модуль не настроен: config.php повреждён');
        }
    }
    return $config;
}

/**
 * Проверяет, что ключи ЮKassa заданы.
 *
 * Вызывается только там, где мы реально идём в ЮKassa. Каталог участков
 * от платёжных ключей не зависит и обязан работать без них: список
 * участков нужен сайту, даже когда приём платежей ещё не подключён.
 */
function gk_require_yookassa(): void
{
    $config = gk_config();
    if (($config['shop_id'] ?? '') === '' || ($config['secret_key'] ?? '') === '') {
        gk_fail(503, 'Онлайн-оформление временно недоступно. Позвоните нам: +7 (995) 169-12-30');
    }
}

// --- HTTP-ответы ----------------------------------------------------------

/** Разрешает CORS для origin'ов из конфига (нужно только dev-серверу Vite). */
function gk_cors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        return;
    }
    $path = __DIR__ . '/config.php';
    $allowed = [];
    if (is_file($path)) {
        $conf = require $path;
        $allowed = is_array($conf) ? ($conf['allowed_origins'] ?? []) : [];
    }
    if (in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    }
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function gk_json(array $data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Ответ с ошибкой. $detail пишется в лог, но клиенту не показывается. */
function gk_fail(int $code, string $message, string $detail = ''): void
{
    gk_log('error', ['code' => $code, 'message' => $message, 'detail' => $detail]);
    gk_json(['error' => $message], $code);
}

function gk_body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

// --- Логи (best-effort: если папка недоступна на запись — молча пропускаем) --

function gk_log(string $kind, array $data): void
{
    $dir = __DIR__ . '/logs';
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $line = json_encode(
        ['ts' => date('c'), 'kind' => $kind] + $data,
        JSON_UNESCAPED_UNICODE
    );
    @file_put_contents($dir . '/' . date('Y-m') . '.log', $line . "\n", FILE_APPEND | LOCK_EX);
}

// --- ЮKassa API -----------------------------------------------------------

/**
 * Запрос к API ЮKassa. Возвращает [httpCode, decodedBody].
 */
function gk_yookassa(string $method, string $path, ?array $payload = null, ?string $idempotenceKey = null): array
{
    gk_require_yookassa();
    $config = gk_config();
    $headers = [
        'Authorization: Basic ' . base64_encode($config['shop_id'] . ':' . $config['secret_key']),
        'Content-Type: application/json',
    ];
    if ($idempotenceKey !== null) {
        $headers[] = 'Idempotence-Key: ' . $idempotenceKey;
    }

    $ch = curl_init('https://api.yookassa.ru/v3' . $path);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST  => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_CONNECTTIMEOUT => 10,
    ]);
    if ($payload !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload, JSON_UNESCAPED_UNICODE));
    }

    $response = curl_exec($ch);
    $code     = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        gk_fail(502, 'Платёжный сервис недоступен, попробуйте позже', 'curl: ' . $error);
    }

    return [$code, json_decode((string) $response, true) ?: []];
}

/** UUID v4 для Idempotence-Key. */
function gk_uuid(): string
{
    $b = random_bytes(16);
    $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
    $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($b), 4));
}

// --- Уведомления ----------------------------------------------------------

function gk_notify_telegram(string $html): void
{
    $config = gk_config();
    if (($config['telegram_bot_token'] ?? '') === '') {
        return;
    }
    $ch = curl_init('https://api.telegram.org/bot' . $config['telegram_bot_token'] . '/sendMessage');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS     => json_encode([
            'chat_id'                  => $config['telegram_chat_id'],
            'text'                     => $html,
            'parse_mode'               => 'HTML',
            'disable_web_page_preview' => true,
        ], JSON_UNESCAPED_UNICODE),
    ]);
    curl_exec($ch);
    curl_close($ch);
}

function gk_notify_sheets(array $row): void
{
    $config = gk_config();
    if (($config['gas_webapp_url'] ?? '') === '') {
        return;
    }
    $ch = curl_init($config['gas_webapp_url']);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => ['Content-Type: text/plain;charset=UTF-8'],
        CURLOPT_POSTFIELDS     => json_encode($row, JSON_UNESCAPED_UNICODE),
    ]);
    curl_exec($ch);
    curl_close($ch);
}

// --- Каталог участков -----------------------------------------------------
//
// Источник цен — Google-таблица, опубликованная как CSV. Скачанная таблица
// кладётся в кэш на диск: сайт не должен ходить в Google на каждый запрос,
// и должен продолжать работать, если Google недоступен.
// Если таблица не настроена — читаем локальный lots.json.

/** Сколько секунд кэш считается свежим. */
const GK_LOTS_CACHE_TTL = 300;

function gk_lots_cache_path(): string
{
    return __DIR__ . '/cache/lots.json';
}

/**
 * Возвращает каталог: ['districts' => [...], 'source' => ..., 'updatedAt' => ...].
 */
function gk_lots_catalog(): array
{
    $config = gk_config();
    $url    = trim((string) ($config['lots_source_url'] ?? ''));

    if ($url === '') {
        return [
            'districts' => gk_lots_from_file(),
            'source'    => 'file',
            'updatedAt' => null,
        ];
    }

    $cachePath = gk_lots_cache_path();
    $cache     = is_file($cachePath)
        ? json_decode((string) file_get_contents($cachePath), true)
        : null;
    $cacheAge  = is_file($cachePath) ? time() - (int) filemtime($cachePath) : PHP_INT_MAX;

    // Кэш свежий — отдаём его, в Google не ходим
    if (is_array($cache) && isset($cache['districts']) && $cacheAge < GK_LOTS_CACHE_TTL) {
        return $cache + ['source' => 'cache', 'updatedAt' => date('c', filemtime($cachePath))];
    }

    $csv = gk_fetch_url($url);

    if ($csv !== null) {
        $districts = gk_parse_lots_csv($csv);
        if ($districts !== []) {
            $fresh = ['districts' => $districts, 'updatedAt' => date('c')];
            $dir = dirname($cachePath);
            if (!is_dir($dir)) {
                @mkdir($dir, 0750, true);
            }
            @file_put_contents($cachePath, json_encode($fresh, JSON_UNESCAPED_UNICODE), LOCK_EX);
            return $fresh + ['source' => 'sheets'];
        }
        gk_log('lots_sheet_empty', ['url' => $url]);
    } else {
        gk_log('lots_sheet_unreachable', ['url' => $url]);
    }

    // Google недоступен или отдал мусор — работаем на протухшем кэше
    if (is_array($cache) && isset($cache['districts'])) {
        return $cache + ['source' => 'stale-cache', 'updatedAt' => date('c', filemtime($cachePath))];
    }

    // Кэша нет вообще — последний рубеж, локальный файл
    return [
        'districts' => gk_lots_from_file(),
        'source'    => 'file-fallback',
        'updatedAt' => null,
    ];
}

/** Читает локальный lots.json (запасной источник). */
function gk_lots_from_file(): array
{
    $path = __DIR__ . '/lots.json';
    if (!is_file($path)) {
        return [];
    }
    $data = json_decode((string) file_get_contents($path), true);
    return is_array($data) && is_array($data['districts'] ?? null) ? $data['districts'] : [];
}

/** Скачивает URL. Возвращает тело или null. */
function gk_fetch_url(string $url): ?string
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS      => 5,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_CONNECTTIMEOUT => 8,
    ]);
    $body = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ($body === false || $code >= 300) ? null : (string) $body;
}

/**
 * Разбирает CSV из Google-таблицы в структуру посёлков и участков.
 *
 * Колонки ищутся по названиям в шапке (регистр и порядок не важны):
 *   Посёлок | Участок | Площадь | Цена | Статус
 * Необязательные: «ID посёлка», «ID участка» — если нужны стабильные
 * идентификаторы, не зависящие от переименования.
 */
function gk_parse_lots_csv(string $csv): array
{
    $csv  = preg_replace('/^\xEF\xBB\xBF/', '', $csv) ?? $csv;
    $rows = array_map('str_getcsv', preg_split('/\r\n|\r|\n/', $csv) ?: []);
    $rows = array_values(array_filter($rows, static fn($r) => is_array($r) && trim(implode('', $r)) !== ''));

    if (count($rows) < 2) {
        return [];
    }

    $header = array_map(static fn($h) => mb_strtolower(trim((string) $h)), array_shift($rows));

    $find = static function (array $names) use ($header): ?int {
        foreach ($names as $name) {
            $index = array_search($name, $header, true);
            if ($index !== false) {
                return (int) $index;
            }
        }
        return null;
    };

    $colDistrict = $find(['посёлок', 'поселок', 'район', 'объект']);
    $colLot      = $find(['участок', '№ участка', 'номер участка', 'номер']);
    $colPrice    = $find(['цена', 'стоимость']);
    $colArea     = $find(['площадь', 'размер']);
    $colStatus   = $find(['статус', 'состояние']);
    $colDistId   = $find(['id посёлка', 'id поселка']);
    $colLotId    = $find(['id участка']);

    if ($colDistrict === null || $colLot === null || $colPrice === null) {
        gk_log('lots_csv_bad_header', ['header' => $header]);
        return [];
    }

    $districts = [];

    foreach ($rows as $row) {
        $districtName = trim((string) ($row[$colDistrict] ?? ''));
        $lotNumber    = trim((string) ($row[$colLot] ?? ''));
        if ($districtName === '' || $lotNumber === '') {
            continue;
        }

        $price = gk_parse_money((string) ($row[$colPrice] ?? ''));
        if ($price <= 0) {
            continue; // строка без цены — в каталог не берём
        }

        $districtId = $colDistId !== null && trim((string) ($row[$colDistId] ?? '')) !== ''
            ? trim((string) $row[$colDistId])
            : gk_slug($districtName);

        $lotId = $colLotId !== null && trim((string) ($row[$colLotId] ?? '')) !== ''
            ? trim((string) $row[$colLotId])
            : $lotNumber;

        if (!isset($districts[$districtId])) {
            $districts[$districtId] = [
                'id'     => $districtId,
                'name'   => $districtName,
                'region' => '',
                'lots'   => [],
            ];
        }

        $districts[$districtId]['lots'][] = [
            'id'        => $lotId,
            'number'    => $lotNumber,
            'areaLabel' => gk_area_label($colArea !== null ? (string) ($row[$colArea] ?? '') : ''),
            'price'     => $price,
            'status'    => gk_parse_status($colStatus !== null ? (string) ($row[$colStatus] ?? '') : ''),
        ];
    }

    return array_values($districts);
}

/**
 * Площадь для показа клиенту — отдаём ровно то, что в таблице.
 *
 * НЕ дописываем единицу автоматически, хотя соблазн есть: в таблице единицы
 * смешаны (в «Светлой» часть участков указана в сотках, часть — в гектарах),
 * и подпись «сот.» для гектарного участка соврала бы клиенту в сто раз.
 * Единицу нужно писать в самой ячейке: «8,67 сот.», «1,2 га».
 */
function gk_area_label(string $raw): string
{
    return trim($raw);
}

/**
 * «1 450 000 ₽», «1450000,00», «1.450.000», «1 450 000руб» → 1450000
 *
 * Копейки отбрасываем: цена участка ведётся в целых рублях, а любые
 * оставшиеся точки и запятые — это разделители тысяч.
 */
function gk_parse_money(string $raw): int
{
    $clean = preg_replace('/[^\d.,]/u', '', trim($raw)) ?? '';
    // дробная часть в конце — копейки, отбрасываем
    $clean = preg_replace('/[.,]\d{1,2}$/', '', $clean) ?? $clean;
    $digits = preg_replace('/\D/', '', $clean) ?? '';

    return $digits === '' ? 0 : (int) $digits;
}

/**
 * Приводит статус к free / reserved / sold.
 * Неизвестное значение считаем занятым: лучше не продать, чем продать дважды.
 */
function gk_parse_status(string $raw): string
{
    $value = mb_strtolower(trim($raw));

    if ($value === '' ) {
        return 'free';
    }
    // «Продан» проверяем первым: «продан» и «в продаже» имеют общий корень,
    // и порядок здесь решает, будет участок продаваться или нет.
    foreach (['продан', 'sold'] as $needle) {
        if (mb_strpos($value, $needle) !== false) {
            return 'sold';
        }
    }
    foreach (['свобод', 'акци', 'free', 'доступ', 'в продаже'] as $needle) {
        if (mb_strpos($value, $needle) !== false) {
            return 'free';
        }
    }
    return 'reserved';
}

/** Транслитерация названия в безопасный id для URL. */
function gk_slug(string $text): string
{
    $map = [
        'а'=>'a','б'=>'b','в'=>'v','г'=>'g','д'=>'d','е'=>'e','ё'=>'e','ж'=>'zh','з'=>'z',
        'и'=>'i','й'=>'y','к'=>'k','л'=>'l','м'=>'m','н'=>'n','о'=>'o','п'=>'p','р'=>'r',
        'с'=>'s','т'=>'t','у'=>'u','ф'=>'f','х'=>'h','ц'=>'ts','ч'=>'ch','ш'=>'sh','щ'=>'sch',
        'ъ'=>'','ы'=>'y','ь'=>'','э'=>'e','ю'=>'yu','я'=>'ya',
    ];
    $slug = strtr(mb_strtolower(trim($text)), $map);
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?? '';
    return trim($slug, '-');
}

/**
 * Находит участок по id посёлка и id участка.
 * Возвращает [посёлок, участок] или [null, null].
 */
function gk_find_lot(string $districtId, string $lotId): array
{
    $catalog = gk_lots_catalog();

    foreach ($catalog['districts'] as $district) {
        if (($district['id'] ?? '') !== $districtId) {
            continue;
        }
        foreach ($district['lots'] ?? [] as $lot) {
            if ((string) ($lot['id'] ?? '') === $lotId) {
                return [$district, $lot];
            }
        }
        return [$district, null];
    }

    return [null, null];
}


function gk_esc(string $text): string
{
    return htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function gk_money(int $rub): string
{
    return number_format($rub, 0, ',', ' ') . ' ₽';
}
