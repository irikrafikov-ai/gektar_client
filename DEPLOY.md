# Автодеплой на reg.ru

Сайт собирается и заливается на хостинг автоматически при каждом `git push` в ветку `main`
(файл `.github/workflows/deploy.yml`).

## Что происходит
1. GitHub Actions ставит зависимости (`npm ci`) и собирает сайт (`npm run build`).
2. Содержимое папки `dist/` заливается на reg.ru по FTP.

## Секреты, которые нужно добавить в GitHub
Репозиторий → **Settings → Secrets and variables → Actions → New repository secret**:

| Имя секрета      | Значение (из панели reg.ru / письма хостинга)                         |
|------------------|----------------------------------------------------------------------|
| `FTP_SERVER`     | FTP-хост, напр. `server123.hosting.reg.ru` (или IP / домен)          |
| `FTP_USERNAME`   | FTP-логин, напр. `u1234567`                                          |
| `FTP_PASSWORD`   | FTP-пароль                                                            |
| `FTP_SERVER_DIR` | Папка на хостинге, обязательно со слэшем в конце, напр. `/public_html/` или `/site.ru/public_html/` |

## Ручной запуск
Actions → **Build & Deploy to reg.ru** → **Run workflow**.

## Если reg.ru требует FTPS
В `.github/workflows/deploy.yml` поменяйте `protocol: ftp` на `protocol: ftps`.
