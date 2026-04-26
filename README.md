# ⚙️ Планирование производства — Механический цех

Веб-приложение для автоматизированного составления расписания работы станочного парка и персонала механического цеха машиностроительного предприятия.

---

## 🛠 Стек технологий

**Бэкенд:**
- Python 3.10
- FastAPI 0.133.1
- SQLAlchemy 2.0.48
- Alembic 1.18.4
- PostgreSQL 16
- Pydantic 2.12.5
- python-jose (JWT)
- passlib + bcrypt 4.0.1

**Фронтенд:**
- React 18
- Vite 4
- Axios
- React Router DOM v6

---

## 🚀 Функциональность

- 🔐 JWT-авторизация
- 📋 Управление производственными заказами (CRUD)
- 🔗 Создание технологических маршрутов с операциями
- 👷 Учёт работников и оборудования цеха
- 📅 Автоматическое составление расписания (алгоритм EDD)
- 📊 Диаграмма Ганта для визуализации расписания

---

## 📁 Структура проекта

```
workshop_planner/
├── app/
│   ├── models/           # SQLAlchemy модели (таблицы БД)
│   │   ├── db.py
│   │   ├── order.py
│   │   ├── route.py
│   │   ├── step.py
│   │   ├── worker.py
│   │   ├── equipment.py
│   │   ├── schedule.py
│   │   └── user.py
│   ├── schemas/          # Pydantic схемы (DTO)
│   │   ├── auth.py
│   │   ├── order.py
│   │   ├── route.py
│   │   ├── worker.py
│   │   ├── equipment.py
│   │   └── schedule.py
│   ├── repositories/     # CRUD операции с БД
│   │   ├── order_repo.py
│   │   ├── route_repo.py
│   │   ├── worker_repo.py
│   │   ├── equipment_repo.py
│   │   ├── schedule_repo.py
│   │   └── user_repo.py
│   ├── routers/          # HTTP эндпоинты
│   │   ├── auth.py
│   │   ├── orders.py
│   │   ├── routes.py
│   │   ├── workers.py
│   │   ├── equipment.py
│   │   └── schedule.py
│   ├── services/         # Бизнес-логика
│   │   ├── scheduler.py  # Алгоритм планирования EDD
│   │   └── auth_service.py # JWT токены, хэширование
│   ├── database.py       # Подключение к PostgreSQL
│   └── main.py           # Точка входа FastAPI
├── alembic/              # Миграции базы данных
│   └── versions/
├── frontend/             # React приложение
│   └── src/
│       ├── api/
│       │   └── index.js  # Axios клиент
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── Modal.jsx
│       │   ├── BlobBg.jsx
│       │   └── ui.js
│       └── pages/
│           ├── Login.jsx
│           ├── Orders.jsx
│           ├── Routes.jsx
│           ├── Resources.jsx
│           └── Schedule.jsx
├── .env                  # Переменные окружения (не в Git)
├── .gitignore
├── alembic.ini
├── requirements.txt
└── README.md
```

---

## ⚙️ Установка и запуск

### 1. Клонировать репозиторий

```bash
git clone https://github.com/ваш-логин/workshop_planner.git
cd workshop_planner
```

### 2. Создать виртуальное окружение и установить зависимости

```bash
# Windows (PowerShell)
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Linux / macOS
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Создать файл .env

Создать файл `.env` в корне проекта:

```env
DATABASE_URL=postgresql://postgres:ВАШ_ПАРОЛЬ@localhost:5432/workshop_db
SECRET_KEY=supersecretkey123456789
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

> Заменить `ВАШ_ПАРОЛЬ` на пароль пользователя postgres.

### 4. Создать базу данных

```bash
# Через pgAdmin 4 — создать БД с именем workshop_db
# Или через psql (добавить PostgreSQL в PATH):
psql -U postgres -c "CREATE DATABASE workshop_db;"
```

### 5. Применить миграции

```bash
alembic upgrade head
```

### 6. Создать пользователя-диспетчера

```bash
python -c "
from app.database import SessionLocal
from app.repositories.user_repo import create_user
from app.services.auth_service import hash_password
db = SessionLocal()
create_user(db, login='dispatcher', hashed_password=hash_password('12345'))
db.close()
print('Пользователь создан')
"
```

### 7. Установить зависимости фронтенда

```bash
cd frontend
npm install
```

### 8. Запуск (два терминала)

```bash
# Терминал 1 — бэкенд (в корне проекта)
uvicorn app.main:app --reload

# Терминал 2 — фронтенд
cd frontend
npm run dev
```

---

## 🌐 Адреса после запуска

| Сервис | URL |
|--------|-----|
| Фронтенд | http://localhost:5173 |
| Swagger UI (API docs) | http://127.0.0.1:8000/docs |
| ReDoc | http://127.0.0.1:8000/redoc |

**Данные для входа:** `dispatcher` / `12345`

---

## 📡 API эндпоинты

### Авторизация
| Метод | URL | Описание |
|-------|-----|----------|
| POST | `/api/auth/login` | Вход, получение JWT токена |
| POST | `/api/auth/logout` | Выход |

### Маршруты
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/routes/` | Список всех маршрутов |
| POST | `/api/routes/` | Создать маршрут |
| GET | `/api/routes/{id}` | Маршрут по ID |
| PUT | `/api/routes/{id}` | Обновить маршрут |
| DELETE | `/api/routes/{id}` | Удалить маршрут |

### Заказы
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/orders/` | Список всех заказов |
| POST | `/api/orders/` | Создать заказ |
| GET | `/api/orders/{id}` | Заказ по ID |
| PUT | `/api/orders/{id}` | Обновить заказ |
| DELETE | `/api/orders/{id}` | Удалить заказ |

### Ресурсы
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/workers/` | Список работников |
| POST | `/api/workers/` | Добавить работника |
| PUT | `/api/workers/{id}` | Обновить работника |
| DELETE | `/api/workers/{id}` | Удалить работника |
| GET | `/api/equipment/` | Список оборудования |
| POST | `/api/equipment/` | Добавить станок |
| PUT | `/api/equipment/{id}` | Обновить станок |
| DELETE | `/api/equipment/{id}` | Удалить станок |

### Расписание
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/schedule/` | Получить расписание |
| POST | `/api/schedule/run` | Запустить алгоритм планирования |
| DELETE | `/api/schedule/` | Очистить расписание |

---

## 🧠 Алгоритм планирования

Используется жадный алгоритм **EDD (Earliest Due Date)** — заказы с наиболее ранним сроком выполнения обрабатываются первыми.

Для каждого шага маршрута:
1. Отбираются работники с нужной специализацией
2. Отбирается оборудование нужного типа
3. Перебираются все пары (работник, станок)
4. Для каждой пары ищется первый свободный временной слот в рабочее время (08:00–16:00, пн–пт)
5. Выбирается пара с наиболее ранним стартом

---

## 🗄 База данных

| Таблица | Назначение |
|---------|-----------|
| `routes` | Технологические маршруты |
| `steps` | Операции маршрута |
| `orders` | Производственные заказы |
| `workers` | Работники цеха |
| `equipment` | Оборудование (станки) |
| `schedule` | Расписание (результат алгоритма) |
| `users` | Пользователи системы |

---

## 🔒 Безопасность

- Пароли хранятся в виде bcrypt-хэшей
- Аутентификация через JWT-токены (срок действия 60 мин)
- Все защищённые эндпоинты требуют заголовок `Authorization: Bearer <token>`
- При истечении токена — автоматический редирект на страницу входа
