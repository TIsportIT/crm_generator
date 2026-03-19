# Архитектура проекта

**Важно для ИИ:** при добавлении или удалении фичи, модуля или слоя этот файл нужно обновить: добавить новое в описание структуры ниже или убрать удалённое. Документ должен соответствовать реальной структуре репозитория.

## Цель

Скелет приложения без бизнес-логики, безопасно расширяемый (в т.ч. локальным ИИ).

## Структура репозитория

```text
root/
  apps/
    web/                    # Angular (standalone)
    api/                    # NestJS
  packages/
    shared/                 # общие типы/утилиты (без Angular/Nest)
  docs/
    tigran/                 # для человека: шпаргалка (RUNBOOK)
    ai/                     # для ИИ: главный вход, архитектура, спеки, чек-листы, правила
  scripts/
    arch-check.mjs          # запрет cross-feature imports (web)
    server-deploy.sh        # деплой на сервер
    server-db-dump.sh       # дамп БД на сервере
    server-db-restore.sh    # восстановление БД на сервере
    db-dump.ps1             # дамп БД локально (Windows)
    db-restore.ps1          # восстановление БД локально (Windows)
    prod.env.example        # пример .env.prod для сервера
  docker/
    docker-compose.yml      # Postgres локально
    compose.prod.yml        # прод: Caddy + web + api + postgres
    Caddyfile               # crmgenerator.ru, api.crmgenerator.ru
    api.Dockerfile
    web.Dockerfile
  prisma/
    schema.prisma
    migrations/
  package.json              # корневые команды (workspaces)
```

## Web (`apps/web`)

- **`src/app/core/`** — http-клиент, config/env, layout, роутинг
- **`src/app/shared/`** — ui-компоненты, utils
- **`src/app/features/<feature>/`** — pages, components, data-access, models
- **`src/app/features/clients/`** — страница «Заказчики» (организации/заказчики списками + модалки добавления)

**Guardrail:** feature не импортирует другую feature. Проверка: `npm run arch:check`.

## API (`apps/api`)

- Конфиг только через `ConfigService` (не `process.env` в коде)
- БД только через `PrismaService` (PrismaModule)
- Глобально: `ValidationPipe`, CORS
- Обязательный эндпоинт: `GET /health`
- Эндпоинты (clients): `GET/POST/PATCH/DELETE /organizations`, `GET/POST/PATCH/DELETE /clients` (+ фильтр `?organizationId=...`)

## Общее

- **packages/shared** — без зависимостей от Angular/Nest и без импортов из `apps/*`
- **prisma** — схема и миграции в git; команды: `prisma generate`, `prisma migrate dev` / `prisma migrate deploy` (прод)
- **Сервер:** папка `/opt/crmgenerator`, домены `crmgenerator.ru` и `api.crmgenerator.ru`
