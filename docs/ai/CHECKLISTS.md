# Чек-листы по задачам

Используй при выполнении соответствующих задач. Отмечай пункты по ходу работы.

---

## Деплой на сервер

- [ ] Код запушен в репозиторий (или передан на сервер)
- [ ] На сервере: `cd /opt/crmgenerator`, `./scripts/server-deploy.sh`
- [ ] Проверить: сайт открывается, `api.crmgenerator.ru/health` возвращает `{"ok":true}`
- [ ] При изменении схемы БД: миграции применятся через `server-deploy.sh` (prisma migrate deploy)

---

## Новая фича (frontend)

- [x] Создана папка `apps/web/src/app/features/<feature>/` (pages, components, data-access, models по необходимости)
- [x] Нет импортов из других features
- [x] HTTP-вызовы только из core или data-access фичи
- [x] Роут добавлен в `app.routes.ts`
- [x] Выполнен `npm run arch:check`
- [x] **Обязательно:** обновлён [ARCHITECTURE.md](./ARCHITECTURE.md) — новая фича добавлена в описание структуры (раздел Web / список features)

---

## Новая фича (backend)

- [x] Модуль/контроллер/сервис в `apps/api/src/`
- [ ] Конфиг через `ConfigService`, БД через `PrismaService`
- [x] Валидация DTO (если есть тело запроса)
- [ ] При изменении схемы: правка `prisma/schema.prisma` и новая миграция (`prisma migrate dev`)
- [x] **Обязательно:** обновлён [ARCHITECTURE.md](./ARCHITECTURE.md) — новый модуль/эндпоинт отражён в разделе API (при необходимости)

---

## Удаление фичи / модуля

- [ ] Код фичи или модуля удалён, сборка и `npm run arch:check` проходят
- [ ] Роуты / импорты, ссылающиеся на удалённое, убраны
- [ ] **Обязательно:** обновлён [ARCHITECTURE.md](./ARCHITECTURE.md) — удалённая фича/модуль убрана из описания структуры и разделов Web/API

---

## Рефакторинг

- [ ] Сохранена работоспособность: `npm run build`, `npm run arch:check`
- [ ] Нет нарушений [SPEC.md](./SPEC.md) (cross-feature, process.env, и т.д.)
- [ ] После переноса/переименования обновлены ссылки в [ARCHITECTURE.md](./ARCHITECTURE.md), [RUNBOOK](../tigran/RUNBOOK.md) (если затронуты команды/пути)

---

## Обновление документации (при любых изменениях)

- [ ] Изменились команды или пути → обновлён [RUNBOOK](../tigran/RUNBOOK.md) (осторожно, это для человека)
- [x] Изменилась структура папок или правила → обновлены [ARCHITECTURE.md](./ARCHITECTURE.md) и/или [SPEC.md](./SPEC.md)
- [ ] Появился новый тип задачи → добавлен чек-лист в [CHECKLISTS.md](./CHECKLISTS.md)
- [ ] Устаревшие разделы удалены, дубликатов нет
