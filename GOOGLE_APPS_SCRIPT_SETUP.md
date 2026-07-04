# Google Apps Script — Настройка CRM интеграции

## Шаг 1: Создание проекта Google Apps Script

1. Откройте [Google Apps Script](https://script.google.com/)
2. Создайте новый проект (Blank Project)
3. Удалите весь код по умолчанию
4. Вставьте код ниже

## Шаг 2: Код скрипта

Скопируйте этот код в редактор:

```javascript
/**
 * CRM Web App для ГектарЪ
 * Структура таблицы (5 колонок):
 * A: Дата и время | B: Имя | C: Телефон | D: Сообщение | E: Бюджет
 */

const CONFIG = {
  SHEET_ID: '1JBucniOhKuREtC4VWPklmwoH4ON8Z9Sl5-eo32Zz4yk',
  BOT_TOKEN: '8382117990:AAELl3jIwC9tAMqqh7Yn0ZZUYdyv8qlSAG4',
  CHAT_ID: '-1002685493975',
  EMAIL_TO: 'Gektar.RF@yandex.com',
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    Logger.log('Received: ' + JSON.stringify(data));

    // 1. Записываем в Google Sheets (5 колонок)
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getActiveSheet();

    // Заголовки при первом запуске
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Дата и время', 'Имя', 'Телефон', 'Сообщение', 'Бюджет']);
    }

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.phone || '',
      data.message || '',
      data.budget || ''
    ]);

    // 2. Telegram
    sendTelegram(data);

    // 3. Email
    sendEmail(data);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
}

function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600',
    });
}

function sendTelegram(data) {
  try {
    const msg = [
      '📋 <b>Новая заявка с сайта ГектарЪ</b>',
      '',
      `👤 <b>Имя:</b> ${esc(data.name)}`,
      `📞 <b>Телефон:</b> ${esc(data.phone)}`,
      data.message ? `💬 <b>Сообщение:</b> ${esc(data.message)}` : '',
      data.budget ? `💰 <b>Бюджет:</b> ${esc(data.budget)}` : '',
      '',
      `⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`,
    ].filter(Boolean).join('\n');

    UrlFetchApp.fetch(`https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/sendMessage`, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        chat_id: CONFIG.CHAT_ID,
        text: msg,
        parse_mode: 'HTML',
      }),
    });
    Logger.log('Telegram OK');
  } catch (err) {
    Logger.log('Telegram error: ' + err);
  }
}

function sendEmail(data) {
  try {
    const body = [
      'Новая заявка с сайта ГектарЪ',
      '',
      `Имя: ${data.name || '—'}`,
      `Телефон: ${data.phone || '—'}`,
      `Сообщение: ${data.message || '—'}`,
      `Бюджет: ${data.budget || '—'}`,
      '',
      `Время: ${new Date().toLocaleString('ru-RU')}`,
    ].join('\n');

    MailApp.sendEmail({
      to: CONFIG.EMAIL_TO,
      subject: `Заявка ГектарЪ — ${data.name || 'Без имени'}`,
      body: body,
      name: 'ГектарЪ CRM',
    });
    Logger.log('Email OK');
  } catch (err) {
    Logger.log('Email error: ' + err);
  }
}

function esc(t) {
  if (!t) return '';
  return t.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
```

## Шаг 3: Деплой скрипта

1. Нажмите **Deploy** → **New deployment**
2. Тип: **Web app**
3. Описание: `ГектарЪ CRM API`
4. Execute as: **Me**
5. Who has access: **Anyone**
6. Нажмите **Deploy**
7. Подтвердите разрешения (необходимо дать доступ к Google Sheets, Gmail и внешним URL)
8. Скопируйте **Web App URL**

## Шаг 4: Обновление сайта

Вставьте скопированный URL в файл `src/services/crm.ts`:

```typescript
const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/ВАШ_СКРИПТ_ID/exec';
```

## Шаг 5: Права доступа к таблице

1. Откройте Google Sheets таблицу: `1JBucniOhKuREtC4VWPklmwoH4ON8Z9Sl5-eo32Zz4yk`
2. Нажмите **Share** → **Share with others**
3. Добавьте email сервисного аккаунта (если есть) или оставьте доступ по ссылке
4. Убедитесь, что у скрипта есть доступ к таблице

## Тестирование

Для проверки работы отправьте тестовый запрос:

```bash
curl -X POST \
  https://script.google.com/macros/s/ВАШ_СКРИПТ_ID/exec \
  -H 'Content-Type: application/json' \
  -d '{
    "timestamp": "2025-01-01T12:00:00.000Z",
    "name": "Тест",
    "phone": "+79999999999",
    "message": "Глэмпинг",
    "budget": "1000000-2000000"
  }'
```

## Устранение неполадок

### CORS ошибки
- Убедитесь, что в `doPost` и `doGet` возвращаются CORS заголовки
- Для тестирования используйте расширение Chrome с отключенным CORS

### Permission denied
- Перейдите в **Project settings** → **Google Cloud Platform**
- Убедитесь, что включены API: Google Sheets API, Gmail API

### Telegram не отправляет
- Проверьте, что бот добавлен в группу
- Убедитесь, что chat_id корректный
- Проверьте логи: **View** → **Executions**
