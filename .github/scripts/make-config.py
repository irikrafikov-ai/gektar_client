#!/usr/bin/env python3
"""
Собирает dist/api/config.php из секретов GitHub Actions.

Зачем отдельный скрипт, а не heredoc в yml: значения приходят из секретов и
могут содержать кавычки и обратные слэши. Тут они экранируются корректно,
а не ломают PHP-файл.
"""

import os
import pathlib
import sys

OUT = pathlib.Path("dist/api/config.php")


def php_str(value: str) -> str:
    """Значение в виде безопасного PHP-литерала в одинарных кавычках."""
    return "'" + value.replace("\\", "\\\\").replace("'", "\\'") + "'"


def php_int(value: str, default: int) -> str:
    try:
        return str(int(value))
    except (TypeError, ValueError):
        return str(default)


def env(name: str, default: str = "") -> str:
    return (os.environ.get(name) or default).strip()


# ShopID секретом не является — это публичный идентификатор магазина.
# Значение по умолчанию: магазин client.gektar.expert (ИП Рафиков И.Р.).
# Google-таблица с участками, открытая по ссылке. Экспорт первого листа в CSV.
# Не секрет: лист доступен на чтение всем, у кого есть ссылка.
SHEET_CSV_URL = (
    "https://docs.google.com/spreadsheets/d/"
    "1i4kgKY5PxjZxSn_tLl7MkIHJdT_9xkOU9eYqIGVCLpk/export?format=csv&gid=0"
)

shop_id = env("YOOKASSA_SHOP_ID", "1454166")
secret_key = env("YOOKASSA_SECRET_KEY")

if not shop_id or not secret_key:
    print(
        "::warning::YOOKASSA_SHOP_ID / YOOKASSA_SECRET_KEY не заданы. "
        "Сайт задеплоится, но оплата будет отвечать ошибкой, пока секреты не добавлены."
    )

# Чек можно временно отключить, пока не подключена онлайн-касса
send_receipt = env("YOOKASSA_SEND_RECEIPT", "true").lower() not in ("0", "false", "no")

tax_system = env("YOOKASSA_TAX_SYSTEM_CODE")
tax_system_php = php_int(tax_system, 0) if tax_system else "null"

config = f"""<?php
// СГЕНЕРИРОВАНО АВТОМАТИЧЕСКИ при деплое. Не редактировать вручную —
// файл перезаписывается при каждом push в main.
// Значения берутся из Secrets репозитория irikrafikov-ai/gektar_client.

return [
    'shop_id'    => {php_str(shop_id)},
    'secret_key' => {php_str(secret_key)},

    'payment_method'         => {php_str(env('YOOKASSA_PAYMENT_METHOD', 'sber_loan'))},
    'installment_min_amount' => {php_int(env('INSTALLMENT_MIN_AMOUNT'), 3000)},
    'installment_max_amount' => {php_int(env('INSTALLMENT_MAX_AMOUNT'), 1500000)},

    'lots_source_url' => {php_str(env('LOTS_SOURCE_URL', SHEET_CSV_URL))},

    'vat_code'        => {php_int(env('YOOKASSA_VAT_CODE'), 1)},
    'tax_system_code' => {tax_system_php},
    'send_receipt'    => {'true' if send_receipt else 'false'},

    'receipt_mode'    => {php_str(env('RECEIPT_MODE', 'full_payment'))},
    'receipt_subject' => {php_str(env('RECEIPT_SUBJECT', 'commodity'))},

    'return_url'      => {php_str(env('PAYMENT_RETURN_URL', 'https://client.gektar.expert/#/pay/result'))},
    'allowed_origins' => ['https://client.gektar.expert', 'http://localhost:5175'],

    'telegram_bot_token' => {php_str(env('TELEGRAM_BOT_TOKEN'))},
    'telegram_chat_id'   => {php_str(env('TELEGRAM_CHAT_ID', '@gektar_request'))},
    'gas_webapp_url'     => {php_str(env('GAS_WEBAPP_URL'))},

    'verify_webhook_ip' => {'false' if env('VERIFY_WEBHOOK_IP').lower() in ('0', 'false', 'no') else 'true'},
];
"""

if not OUT.parent.is_dir():
    print(f"::error::Нет папки {OUT.parent} — сборка прошла не так, как ожидалось.")
    sys.exit(1)

OUT.write_text(config, encoding="utf-8")
print(f"config.php записан ({len(config)} байт), shop_id задан: {bool(shop_id)}")
