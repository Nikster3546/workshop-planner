from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.order import Order
from app.models.worker import Worker
from app.models.equipment import Equipment
from app.models.schedule import Schedule

WORK_START_HOUR = 8   # начало смены
WORK_END_HOUR = 16    # конец смены


def _next_work_time(dt: datetime) -> datetime:
    """Сдвигает время на начало следующей рабочей смены если вышли за рамки."""
    if dt.weekday() >= 5:  # суббота/воскресенье
        days_ahead = 7 - dt.weekday()
        dt = (dt + timedelta(days=days_ahead)).replace(
            hour=WORK_START_HOUR, minute=0, second=0, microsecond=0)
    elif dt.hour >= WORK_END_HOUR:
        dt = (dt + timedelta(days=1)).replace(
            hour=WORK_START_HOUR, minute=0, second=0, microsecond=0)
        return _next_work_time(dt)
    elif dt.hour < WORK_START_HOUR:
        dt = dt.replace(hour=WORK_START_HOUR, minute=0, second=0, microsecond=0)
    return dt

def _find_slot(busy: list, start: datetime, duration_min: int) -> datetime | None:
    """Находит первый свободный слот >= start длительностью duration_min минут."""
    candidate = _next_work_time(start)
    for _ in range(200):  # защита от бесконечного цикла
        end_candidate = candidate + timedelta(minutes=duration_min)
        # Проверяем что не выходим за конец смены
        day_end = candidate.replace(
            hour=WORK_END_HOUR, minute=0, second=0, microsecond=0)
        if end_candidate > day_end:
            # Переходим на следующий день
            candidate = _next_work_time(
                candidate.replace(hour=WORK_END_HOUR, minute=0))
            continue
        # Проверяем пересечение с занятыми интервалами
        conflict = False
        for (b_start, b_end) in busy:
            if candidate < b_end and end_candidate > b_start:
                conflict = True
                candidate = _next_work_time(b_end)
                break
        if not conflict:
            return candidate
    return None

def run_scheduler(db: Session) -> dict:
    # 1. Загрузить заказы, отсортировать по end_before
    orders = db.query(Order).order_by(Order.end_before).all()

    # 2. Загрузить ресурсы
    workers = db.query(Worker).filter(Worker.status == True).all()
    equipment = db.query(Equipment).filter(Equipment.status == True).all()

    # 3. Словари занятости: resource_id -> [(start, end), ...]
    worker_busy: dict[int, list] = {w.id: [] for w in workers}
    equip_busy: dict[int, list] = {e.id: [] for e in equipment}

    created = 0
    skipped = 0

    for order in orders:
        current_start = _next_work_time(order.start_after)
        route = order.route
        if not route:
            skipped += 1
            continue

        order_ok = True

        for step in route.steps:
            duration = step.duration

            # Подбираем подходящих работников
            suitable_workers = [
                w for w in workers if w.skill == step.worker_type
            ]
            # Подбираем подходящее оборудование
            suitable_equip = [
                e for e in equipment
                if step.equipment_type is None or e.type == step.equipment_type
            ]

            best_start = None
            best_worker = None
            best_equip = None

            # Перебираем все пары (работник, станок)
            for w in suitable_workers:
                for e in suitable_equip:
                    # Объединяем занятость обоих ресурсов
                    combined_busy = sorted(
                        worker_busy[w.id] + equip_busy[e.id],
                        key=lambda x: x[0]
                    )
                    slot = _find_slot(combined_busy, current_start, duration)
                    if slot is None:
                        continue
                    if best_start is None or slot < best_start:
                        best_start = slot
                        best_worker = w
                        best_equip = e

            # Если для шага без оборудования
            if step.equipment_type is None and not suitable_equip:
                for w in suitable_workers:
                    slot = _find_slot(worker_busy[w.id], current_start, duration)
                    if slot and (best_start is None or slot < best_start):
                        best_start = slot
                        best_worker = w
                        best_equip = None

            if best_start is None:
                order_ok = False
                break

            end_time = best_start + timedelta(minutes=duration)

            # Фиксируем занятость
            worker_busy[best_worker.id].append((best_start, end_time))
            if best_equip:
                equip_busy[best_equip.id].append((best_start, end_time))

            # Создаём запись расписания
            item = Schedule(
                order_id=order.id,
                step_id=step.id,
                worker_id=best_worker.id,
                equipment_id=best_equip.id if best_equip else None,
                start_time=best_start,
                end_time=end_time,
            )
            db.add(item)
            current_start = end_time

        if order_ok:
            created += 1
        else:
            skipped += 1

    db.commit()
    return {"created": created, "skipped": skipped}