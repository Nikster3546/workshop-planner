import { useState, useEffect } from 'react'
import { scheduleApi } from '../api'
import * as ui from '../components/ui'

export default function Schedule() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [running, setRunning]   = useState(false)
  const [stats, setStats]       = useState(null)
  const [dateFrom, setDateFrom] = useState('2025-06-10')
  const [dateTo, setDateTo]     = useState('2025-06-14')

  const load = () => scheduleApi.getAll()
    .then(r => setItems(r.data)).finally(() => setLoading(false))
  useEffect(load, [])

  const handleRun = async () => {
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

  const fmt = (dt) => new Date(dt).toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
  })

  const orders = [...new Set(items.map(i => i.order_id))]

  return (
    <div>
      <div style={ui.topBar}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Расписание</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Результат работы алгоритма планирования
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input type="date" value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            style={{ ...ui.input, width: 'auto', padding: '7px 10px', fontSize: 13 }} />
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>—</span>
          <input type="date" value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            style={{ ...ui.input, width: 'auto', padding: '7px 10px', fontSize: 13 }} />
          <button style={ui.btnPrimary} onClick={handleRun} disabled={running}>
            {running ? '⏳ Планирование...' : '▶ Запустить алгоритм'}
          </button>
          <button style={ui.btnDanger} onClick={handleClear}>🗑 Очистить</button>
        </div>
      </div>

      <div style={ui.pageContent}>
        {/* Статистика */}
        {stats && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20,
          }}>
            {[
              { label: 'Запланировано', val: stats.created, color: 'green' },
              { label: 'Пропущено',     val: stats.skipped, color: stats.skipped > 0 ? 'red' : 'gray' },
              { label: 'Записей создано', val: items.length, color: 'green' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{
                ...ui.card, padding: '18px 22px',
                borderLeft: `3px solid ${color === 'green' ? 'var(--primary)' : color === 'red' ? 'var(--danger)' : 'var(--border-solid)'}`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  {label}
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: color === 'green' ? 'var(--primary-dark)' : color === 'red' ? 'var(--danger)' : 'var(--text)' }}>
                  {val}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Таблица */}
        <div style={{ ...ui.card, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Загрузка...</div>
          ) : items.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Расписание не сформировано</div>
              <div style={{ fontSize: 13 }}>Выберите период и нажмите «Запустить алгоритм»</div>
            </div>
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
                    style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(46,191,145,0.03)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-muted)'}
                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(46,191,145,0.03)'}
                  >
                    <td style={ui.td}>
                      <span style={ui.badge('green')}>Заказ #{item.order_id}</span>
                    </td>
                    <td style={{ ...ui.td, fontWeight: 600 }}>
                      {item.step?.name || `Шаг #${item.step_id}`}
                    </td>
                    <td style={ui.td}>{item.worker?.name || '—'}</td>
                    <td style={ui.td}>
                      {item.equipment ? (
                        <span style={ui.badge('gray')}>{item.equipment.name}</span>
                      ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td style={{ ...ui.td, color: 'var(--text-muted)', fontSize: 12 }}>
                      {fmt(item.start_time)}
                    </td>
                    <td style={{ ...ui.td, color: 'var(--text-muted)', fontSize: 12 }}>
                      {fmt(item.end_time)}
                    </td>
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