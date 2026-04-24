import { useState, useEffect } from 'react'
import { routesApi } from '../api'
import Modal from '../components/Modal'
import * as ui from '../components/ui'

const EMPTY_ROUTE = { name: '', steps: [] }
const EMPTY_STEP  = { name: '', worker_type: '', equipment_type: '', duration: 60 }
const SKILLS = ['Токарь', 'Фрезеровщик', 'Сверловщик', 'Шлифовщик', 'Слесарь']
const EQUIP  = ['Токарный', 'Фрезерный', 'Сверлильный', 'Шлифовальный', 'Термическое']

export default function Routes() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm]   = useState(EMPTY_ROUTE)
  const [detailRoute, setDetailRoute] = useState(null)

  const load = () => routesApi.getAll()
    .then(r => setRoutes(r.data)).finally(() => setLoading(false))
  useEffect(load, [])

  const openCreate = () => { setForm(EMPTY_ROUTE); setModal('form') }

  const addStep = () => setForm(f => ({ ...f, steps: [...f.steps, { ...EMPTY_STEP }] }))
  const updateStep = (i, key, val) => setForm(f => ({
    ...f,
    steps: f.steps.map((s, idx) => idx === i ? { ...s, [key]: val } : s)
  }))
  const removeStep = (i) => setForm(f => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i) }))

  const handleSave = async () => {
    await routesApi.create({ ...form, steps: form.steps.map(s => ({
      ...s, duration: parseInt(s.duration),
      equipment_type: s.equipment_type || null,
    }))})
    setModal(null); load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить маршрут?')) return
    await routesApi.delete(id); load()
  }

  return (
    <div>
      <div style={ui.topBar}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Маршруты</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Технологические процессы изготовления деталей
          </p>
        </div>
        <button style={ui.btnPrimary} onClick={openCreate}>+ Новый маршрут</button>
      </div>

      <div style={ui.pageContent}>
        <div style={{ ...ui.card, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Загрузка...</div>
          ) : routes.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔗</div>
              <div style={{ fontWeight: 600 }}>Маршрутов нет</div>
            </div>
          ) : (
            <table style={ui.table}>
              <thead>
                <tr>
                  {['№', 'Маршрут', 'Операций', 'Действия'].map(h => (
                    <th key={h} style={ui.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {routes.map(r => (
                  <tr key={r.id}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-muted)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ ...ui.td, color: 'var(--text-muted)', width: 50 }}>#{r.id}</td>
                    <td style={{ ...ui.td, fontWeight: 600 }}>
                      <div>{r.name}</div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                        {r.steps?.map((s, i) => (
                          <span key={i} style={{ ...ui.badge('gray'), fontSize: 11 }}>
                            {i + 1}. {s.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={ui.td}>
                      <span style={ui.badge('green')}>{r.steps?.length || 0} оп.</span>
                    </td>
                    <td style={ui.td}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button style={ui.btnSecondary} onClick={() => setDetailRoute(r)}>
                          👁 Детали
                        </button>
                        <button style={ui.btnDanger} onClick={() => handleDelete(r.id)}>
                          🗑 Удал.
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Детали маршрута */}
      {detailRoute && (
        <Modal title={detailRoute.name} onClose={() => setDetailRoute(null)} width={560}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {detailRoute.steps?.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', background: 'var(--primary-muted)',
                borderRadius: 'var(--radius)', border: '1px solid var(--border)',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  color: '#fff', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {s.worker_type}{s.equipment_type ? ` · ${s.equipment_type} станок` : ''} · {s.duration} мин
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Форма создания */}
      {modal === 'form' && (
        <Modal title="Новый маршрут" onClose={() => setModal(null)} width={580}>
          <div style={{ marginBottom: 16 }}>
            <label style={ui.label}>Наименование маршрута</label>
            <input style={ui.input} placeholder="Токарная → Фрезерная → Шлифовальная"
              value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <label style={ui.label}>Операции</label>
            <button style={{ ...ui.btnSecondary, padding: '5px 12px', fontSize: 12 }} onClick={addStep}>
              + Добавить операцию
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
            {form.steps.map((s, i) => (
              <div key={i} style={{
                padding: 14, background: 'var(--primary-muted)',
                borderRadius: 'var(--radius)', border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--primary-dark)' }}>
                    Операция {i + 1}
                  </span>
                  <button style={{ ...ui.btnDanger, padding: '3px 8px' }}
                    onClick={() => removeStep(i)}>✕</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={ui.label}>Название</label>
                    <input style={ui.input} placeholder="Токарная" value={s.name}
                      onChange={e => updateStep(i, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label style={ui.label}>Длительность (мин)</label>
                    <input style={ui.input} type="number" value={s.duration}
                      onChange={e => updateStep(i, 'duration', e.target.value)} />
                  </div>
                  <div>
                    <label style={ui.label}>Профессия</label>
                    <select style={ui.input} value={s.worker_type}
                      onChange={e => updateStep(i, 'worker_type', e.target.value)}>
                      <option value="">— Выбрать —</option>
                      {SKILLS.map(sk => <option key={sk}>{sk}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={ui.label}>Тип станка</label>
                    <select style={ui.input} value={s.equipment_type}
                      onChange={e => updateStep(i, 'equipment_type', e.target.value)}>
                      <option value="">— Не требуется —</option>
                      {EQUIP.map(eq => <option key={eq}>{eq}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20,
            paddingTop: 16, borderTop: '1px solid var(--border-solid)' }}>
            <button style={ui.btnSecondary} onClick={() => setModal(null)}>Отмена</button>
            <button style={ui.btnPrimary} onClick={handleSave}>Сохранить</button>
          </div>
        </Modal>
      )}
    </div>
  )
}