import { useState, useEffect, useRef } from 'react'
import { scheduleApi } from '../api'
import * as ui from '../components/ui'

const WORK_START = 8
const WORK_END = 16
const WORK_HOURS = WORK_END - WORK_START

function GanttChart({ items }) {
  if (!items.length) return null

  const workers = [...new Map(items.map(i => [i.worker_id, i.worker])).values()].filter(Boolean)
  const dates = [...new Set(items.map(i => new Date(i.start_time).toDateString()))]
    .sort((a, b) => new Date(a) - new Date(b))

  const colors = [
    '#2ebf91', '#27ae60', '#3498db', '#9b59b6',
    '#e67e22', '#e74c3c', '#1abc9c', '#f39c12',
  ]

  const orderColors = {}
  const orderIds = [...new Set(items.map(i => i.order_id))]
  orderIds.forEach((id, idx) => { orderColors[id] = colors[idx % colors.length] })

  const fmt = (dt) => new Date(dt).toLocaleTimeString('ru-RU', {
    hour: '2-digit', minute: '2-digit',
  })

  const fmtDate = (ds) => new Date(ds).toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit',
  })

  const getLeft = (dt) => {
    const h = new Date(dt).getHours() + new Date(dt).getMinutes() / 60
    return ((h - WORK_START) / WORK_HOURS) * 100
  }

  const getWidth = (start, end) => {
    const ms = new Date(end) - new Date(start)
    const hours = ms / 3600000
    return (hours / WORK_HOURS) * 100
  }


  const hours = Array.from({ length: WORK_HOURS + 1 }, (_, i) => WORK_START + i)
  const ROW_H = 44
  const LABEL_W = 160

  return (
    <div>
      {/* Легенда заказов */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '14px 20px',
        borderBottom: '1px solid var(--border-solid)' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: 4 }}>
          Заказы:
        </span>
        {orderIds.map(id => (
          <span key={id} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '2px 10px', borderRadius: 100, fontSize: 12, fontWeight: 500,
            background: orderColors[id] + '22', color: orderColors[id],
            border: `1px solid ${orderColors[id]}44`,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%',
              background: orderColors[id], display: 'inline-block' }} />
            Заказ #{id}
          </span>
        ))}
      </div>

      {/* Диаграмма по дням */}
      {dates.map(dateStr => {
        const dayItems = items.filter(i =>
          new Date(i.start_time).toDateString() === dateStr)

        return (
          <div key={dateStr}>
            {/* Заголовок дня */}
            <div style={{
              padding: '8px 20px', background: 'var(--primary-muted)',
              borderBottom: '1px solid var(--border)',
              fontSize: 12, fontWeight: 600, color: 'var(--primary-dark)',
            }}>
              📅 {fmtDate(dateStr)} — {new Date(dateStr).toLocaleDateString('ru-RU', { weekday: 'long' })}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: 700 }}>
                {/* Шкала времени */}
                <div style={{ display: 'flex', paddingLeft: LABEL_W, borderBottom: '1px solid var(--border-solid)' }}>
                  {hours.map(h => (
                    <div key={h} style={{
                      flex: 1, textAlign: 'left', fontSize: 10,
                      color: 'var(--text-muted)', padding: '4px 0 4px 4px',
                      borderLeft: '1px solid var(--border-solid)',
                    }}>{h}:00</div>
                  ))}
                </div>

                {/* Строки работников */}
                {workers.map(worker => {
                  const workerItems = dayItems.filter(i => i.worker_id === worker.id)
                  if (!workerItems.length) return null

                  return (
                    <div key={worker.id} style={{
                      display: 'flex', alignItems: 'center',
                      borderBottom: '1px solid var(--border-solid)',
                      height: ROW_H,
                    }}>
                      {/* Имя работника */}
                      <div style={{
                        width: LABEL_W, flexShrink: 0,
                        padding: '0 12px', fontSize: 12, fontWeight: 500,
                        color: 'var(--text)', whiteSpace: 'nowrap',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        borderRight: '1px solid var(--border-solid)',
                        height: '100%', display: 'flex', alignItems: 'center',
                      }}>
                        {worker.name}
                      </div>

                      {/* Полоса Ганта */}
                      <div style={{
                        flex: 1, position: 'relative', height: '100%',
                        background: 'repeating-linear-gradient(90deg, transparent, transparent calc(100%/8 - 1px), var(--border-solid) calc(100%/8))',
                      }}>
                        {workerItems.map(item => {
                          const left  = getLeft(item.start_time)
                          const width = getWidth(item.start_time, item.end_time)
                          const color = orderColors[item.order_id]

                          return (
                            <div key={item.id} title={`Заказ #${item.order_id} — ${item.step?.name}\n${fmt(item.start_time)} → ${fmt(item.end_time)}`}
                              style={{
                                position: 'absolute',
                                left: `${Math.max(0, left)}%`,
                                width: `${Math.min(width, 100 - left)}%`,
                                top: 6, height: ROW_H - 12,
                                background: color,
                                borderRadius: 6,
                                display: 'flex', alignItems: 'center',
                                padding: '0 8px', overflow: 'hidden',
                                cursor: 'default',
                                boxShadow: `0 2px 8px ${color}44`,
                              }}>
                              <span style={{
                                fontSize: 11, fontWeight: 600, color: '#fff',
                                whiteSpace: 'nowrap', overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}>
                                {item.step?.name || `Шаг #${item.step_id}`}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}

                {/* Строки оборудования */}
                {[...new Map(items.map(i => [i.equipment_id, i.equipment])).values()]
                  .filter(Boolean)
                  .map(equip => {
                    const equipItems = dayItems.filter(i => i.equipment_id === equip.id)
                    if (!equipItems.length) return null

                    return (
                      <div key={equip.id} style={{
                        display: 'flex', alignItems: 'center',
                        borderBottom: '1px solid var(--border-solid)',
                        height: ROW_H,
                        background: 'rgba(46,191,145,0.02)',
                      }}>
                        <div style={{
                          width: LABEL_W, flexShrink: 0,
                          padding: '0 12px', fontSize: 12, fontWeight: 500,
                          color: 'var(--text-muted)', whiteSpace: 'nowrap',
                          overflow: 'hidden', textOverflow: 'ellipsis',
                          borderRight: '1px solid var(--border-solid)',
                          height: '100%', display: 'flex', alignItems: 'center',
                          fontStyle: 'italic',
                        }}>
                          ⚙ {equip.name}
                        </div>

                        <div style={{
                          flex: 1, position: 'relative', height: '100%',
                          background: 'repeating-linear-gradient(90deg, transparent, transparent calc(100%/8 - 1px), var(--border-solid) calc(100%/8))',
                        }}>
                          {equipItems.map(item => {
                            const left  = getLeft(item.start_time)
                            const width = getWidth(item.start_time, item.end_time)
                            const color = orderColors[item.order_id]

                            return (
                              <div key={item.id}
                                title={`Заказ #${item.order_id} — ${item.step?.name}\n${fmt(item.start_time)} → ${fmt(item.end_time)}`}
                                style={{
                                  position: 'absolute',
                                  left: `${Math.max(0, left)}%`,
                                  width: `${Math.min(width, 100 - left)}%`,
                                  top: 8, height: ROW_H - 16,
                                  background: color + '55',
                                  border: `1px solid ${color}`,
                                  borderRadius: 4,
                                  display: 'flex', alignItems: 'center',
                                  padding: '0 6px', overflow: 'hidden',
                                  cursor: 'default',
                                }}>
                                <span style={{
                                  fontSize: 10, fontWeight: 500, color,
                                  whiteSpace: 'nowrap', overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}>
                                  {item.step?.name}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Schedule() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [running, setRunning]   = useState(false)
  const [stats, setStats]       = useState(null)
  const [dateFrom, setDateFrom] = useState('2025-06-10')
  const [dateTo, setDateTo]     = useState('2025-06-14')
  const [view, setView]         = useState('gantt')

  const load = () => {
    scheduleApi.getAll()
      .then(r => setItems(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

const handleRun = async () => {
    if (items.length > 0) {
      if (!confirm('Текущее расписание будет очищено и сформировано заново. Продолжить?')) return
    }
    setRunning(true)
    try {
      const res = await scheduleApi.run({
        date_from: dateFrom + 'T08:00:00',
        date_to:   dateTo   + 'T16:00:00',
      })
      setStats(res.data)
      load()
    } finally { setRunning(false) }
  }

  const handleClear = async () => {
    if (!confirm('Очистить всё расписание?')) return
    await scheduleApi.clear()
    setItems([]); setStats(null)
  }

  const fmt = (dt) => new Date(dt).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div>
      <div style={ui.topBar}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Расписание</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Диаграмма Ганта
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="date" value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            style={{ ...ui.input, width: 'auto', padding: '7px 10px', fontSize: 13 }} />
          <span style={{ color: 'var(--text-muted)' }}>—</span>
          <input type="date" value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            style={{ ...ui.input, width: 'auto', padding: '7px 10px', fontSize: 13 }} />
          <button style={ui.btnPrimary} onClick={handleRun} disabled={running}>
            {running ? '⏳ Планирование...' : '▶ Запустить'}
          </button>
          <button style={ui.btnDanger} onClick={handleClear}>🗑 Очистить</button>
        </div>
      </div>

      <div style={ui.pageContent}>
        {/* Статистика */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
            {[
              { label: 'Запланировано', val: stats.created, color: 'green' },
              { label: 'Пропущено',     val: stats.skipped, color: stats.skipped > 0 ? 'red' : 'gray' },
              { label: 'Операций',      val: items.length,  color: 'green' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{
                ...ui.card, padding: '16px 20px',
                borderLeft: `3px solid ${color === 'green' ? 'var(--primary)' : color === 'red' ? 'var(--danger)' : 'var(--border-solid)'}`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 26, fontWeight: 700,
                  color: color === 'green' ? 'var(--primary-dark)' : color === 'red' ? 'var(--danger)' : 'var(--text)' }}>
                  {val}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Переключатель вида */}
        {items.length > 0 && (
          <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
            {[['gantt', '📊 Ганта'], ['table', '📋 Таблица']].map(([key, label]) => (
              <button key={key} onClick={() => setView(key)} style={{
                ...ui.btnSecondary,
                background: view === key ? 'var(--primary-muted)' : 'var(--surface-solid)',
                borderColor: view === key ? 'var(--primary)' : 'var(--border-solid)',
                color: view === key ? 'var(--primary-dark)' : 'var(--text-muted)',
                fontWeight: view === key ? 600 : 400,
              }}>{label}</button>
            ))}
          </div>
        )}

        <div style={{ ...ui.card, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Загрузка...</div>
          ) : items.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Расписание не сформировано</div>
              <div style={{ fontSize: 13 }}>Выберите период и нажмите «Запустить»</div>
            </div>
          ) : view === 'gantt' ? (
            <GanttChart items={items} />
          ) : (
            <table style={ui.table}>
              <thead>
                <tr>
                  {['Заказ', 'Операция', 'Работник', 'Станок', 'Начало', 'Окончание'].map(h => (
                    <th key={h} style={ui.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id}
                    style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(46,191,145,0.02)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-muted)'}
                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(46,191,145,0.02)'}
                  >
                    <td style={ui.td}><span style={ui.badge('green')}>#{item.order_id}</span></td>
                    <td style={{ ...ui.td, fontWeight: 600 }}>{item.step?.name || `Шаг #${item.step_id}`}</td>
                    <td style={ui.td}>{item.worker?.name || '—'}</td>
                    <td style={ui.td}>
                      {item.equipment
                        ? <span style={ui.badge('gray')}>{item.equipment.name}</span>
                        : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td style={{ ...ui.td, fontSize: 12, color: 'var(--text-muted)' }}>{fmt(item.start_time)}</td>
                    <td style={{ ...ui.td, fontSize: 12, color: 'var(--text-muted)' }}>{fmt(item.end_time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}