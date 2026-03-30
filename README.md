# delivery-app (backend)

Backend-сервис для приложения доставки на Node.js (Express) с авторизацией через `passport`, сессиями (`express-session`) и MongoDB (`mongoose`). API доступно по префиксу `/api`, статические загрузки — по `/uploads`.

## Требования

- Node.js 20+
- MongoDB 7+ (для локального запуска) **или** Docker + Docker Compose

## Переменные окружения

Можно начать с примера:

```bash
copy .env-example .env
```

Поддерживаемые переменные:

- `NODE_ENV`: `development` / `production`
- `HTTP_HOST`: хост для бинда (по умолчанию `0.0.0.0`)
- `HTTP_PORT`: порт HTTP-сервера (по умолчанию `3000`)
- `MONGODB_URI`: строка подключения к MongoDB
  - по умолчанию: `mongodb://127.0.0.1:27017/delivery-app`
- `SESSION_SECRET`: секрет для сессий (в проде обязательно переопределить; по умолчанию используется dev-значение)

## Запуск (локально)

1. Установить зависимости:

```bash
npm install
```

2. Поднять MongoDB локально и указать подключение в `.env` (например, как в `.env-example`).

3. Запустить в режиме разработки (автоперезапуск):

```bash
npm run dev
```

Или обычный запуск:

```bash
npm start
```

Сервер стартует на `http://HTTP_HOST:HTTP_PORT` (по умолчанию `http://0.0.0.0:3000`).

## Запуск (Docker Compose)

Поднимет два контейнера: `backend` и `mongo`. Подключение к Mongo внутри сети compose уже настроено.

```bash
docker compose up --build
```

После запуска:

- Backend: `http://localhost:3000`
- MongoDB (порт проброшен наружу): `mongodb://localhost:27017`

Чтобы остановить:

```bash
docker compose down
```

Чтобы остановить и удалить данные MongoDB:

```bash
docker compose down -v
```
