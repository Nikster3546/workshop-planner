from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models.db import Base

# Импортируем все модели чтобы Base их увидел
from app.models import route, step, order, worker, equipment, schedule, user  # noqa

from app.routers import (
    orders, routes, workers, equipment as equip_router, schedule as sched_router, auth as auth_router
)

# Создаём таблицы (для разработки; в проде используй Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Планирование производства — Механический цех",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(orders.router)
app.include_router(routes.router)
app.include_router(workers.router)
app.include_router(equip_router.router)
app.include_router(sched_router.router)
app.include_router(auth_router.router)

@app.get("/")
def root():
    return {"status": "ok", "message": "API запущено"}