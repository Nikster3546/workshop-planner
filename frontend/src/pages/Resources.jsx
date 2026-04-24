import { useState, useEffect } from 'react'
import { workersApi, equipmentApi } from '../api'
import Modal from '../components/Modal'
import * as ui from '../components/ui'

const SKILLS = ['Токарь', 'Фрезеровщик', 'Сверловщик', 'Шлифовщик', 'Слесарь']
const TYPES  = ['Токарный', 'Фрезерный', 'Сверлильный', 'Шлифовальный', 'Термическое']

export default function Resources() {
  const [workers, setWorkers]   = useState([])
  const [equipment, setEquip]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm]         = useState({})
  const [tab, setTab]           = useState('workers')

  const load = () => {
    Promise.all([workersApi.getAll(), equipmentApi.getAll()])
      .then(([w, e]) => { setWorkers(w.data); setEquip(e.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openWorker = (item = null) => {
    setEditItem(item)
    setForm(item
      ? { name: item.name, skill: item.skill, status: item.status }
      : { name: '', skill: '', status: true })
    setModal('worker')
  }

  const openEquip = (item = null) => {
    setEditItem(item)
    setForm(item
      ? { name: item.name, type: item.type, status: item.status }
      : { name: '', type: '', status: true })
    setModal('equip')
  }

  const saveWorker = async () => {
    if (editItem) await workersApi.update(editItem.id, form)
    else          await workersApi.create(form)
    setModal(null); load()
  }

  const saveEquip = async () => {
    if (editItem) await equipmentApi.update(editItem.id, form)
    else          await equipmentApi.create(form)
    setModal(null); load()
  }

  const delWorker = async (id) => {
    if (!confirm('Удалить работника?')) return
    await workersApi.delete(id); load()
  }

  const delEquip = async (id) => {
    if (!confirm('Удалить оборудование?')) return
    await equipmentApi.delete(id); load()
  }

  return (
    <div>
      <div style={ui.topBar}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Ресурсы</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Работники и оборудование цеха
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={ui.btnSecondary} onClick={() => openWorker()}>+ Работник</button>
          <button style={ui.btnPrimary}   onClick={() => openEquip()}>+ Оборудование</button>
        </div>
      </div>

      <div style={{
        padding: '16px 28px 0', display: 'flex', gap: 4,
        borderBottom: '1px solid var(--border-solid)',
        background: 'var(--surface)', backdropFilter: 'blur(20px)',
      }}>
        {[
          ['workers', '👷 Работники', workers.length],
          ['equip',   '⚙️ Оборудование', equipment.length],
        ].map(([key, label, cnt]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '8px 18px', border: 'none', cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif', fontSize: 13,
            fontWeight: tab === key ? 600 : 400,
            color: tab === key ? 'var(--primary-dark)' : 'var(--text-muted)',
            background: 'transparent',
            borderBottom: `2px solid ${tab === key ? 'var(--primary)' : 'transparent'}`,
            marginBottom: -1,
          }}>
            {label}{' '}
            <span style={{ ...ui.badge(tab === key ? 'green' : 'gray'), fontSize: 11, marginLeft: 4 }}>
              {cnt}
            </span>
          </button>
        ))}
      </div>

      <div style={ui.pageContent}>
        <div style={{ ...ui.card, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              Загрузка...
            </div>
          ) : tab === 'workers' ? (
            workers.length === 0 ? (
              <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>👷</div>
                <div style={{ fontWeight: 600 }}>Работников нет</div>
              </div>
            ) : (
              <table style={ui.table}>
                <thead>
                  <tr>
                    {['№', 'ФИО', 'Специализация', 'Статус', 'Действия'].map(h => (
                      <th key={h} style={ui.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {workers.map(w => (
                    <tr key={w.id}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-muted)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ ...ui.td, color: 'var(--text-muted)', width: 50 }}>#{w.id}</td>
                      <td style={{ ...ui.td, fontWeight: 600 }}>{w.name}</td>
                      <td style={ui.td}>
                        <span style={ui.badge('green')}>{w.skill || '—'}</span>
                      </td>
                      <td style={ui.td}>
                        <span style={ui.badge(w.status ? 'green' : 'red')}>
                          {w.status ? 'Активен' : 'Неактивен'}
                        </span>
                      </td>
                      <td style={ui.td}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button style={ui.btnSecondary} onClick={() => openWorker(w)}>✏️ Ред.</button>
                          <button style={ui.btnDanger}    onClick={() => delWorker(w.id)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            equipment.length === 0 ? (
              <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⚙️</div>
                <div style={{ fontWeight: 600 }}>Оборудования нет</div>
              </div>
            ) : (
              <table style={ui.table}>
                <thead>
                  <tr>
                    {['№', 'Наименование', 'Тип', 'Статус', 'Действия'].map(h => (
                      <th key={h} style={ui.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {equipment.map(e => (
                    <tr key={e.id}
                      onMouseEnter={ev => ev.currentTarget.style.background = 'var(--primary-muted)'}
                      onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ ...ui.td, color: 'var(--text-muted)', width: 50 }}>#{e.id}</td>
                      <td style={{ ...ui.td, fontWeight: 600 }}>{e.name}</td>
                      <td style={ui.td}>
                        <span style={ui.badge('green')}>{e.type}</span>
                      </td>
                      <td style={ui.td}>
                        <span style={ui.badge(e.status ? 'green' : 'amber')}>
                          {e.status ? 'Работает' : 'На ремонте'}
                        </span>
                      </td>
                      <td style={ui.td}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button style={ui.btnSecondary} onClick={() => openEquip(e)}>✏️ Ред.</button>
                          <button style={ui.btnDanger}    onClick={() => delEquip(e.id)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>

      {modal === 'worker' && (
        <Modal
          title={editItem ? 'Редактировать работника' : 'Новый работник'}
          onClose={() => setModal(null)}
        >
          <div style={{ marginBottom: 14 }}>
            <label style={ui.label}>ФИО</label>
            <input style={ui.input} placeholder="Иванов А.П." value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={ui.label}>Специализация</label>
            <select style={ui.input} value={form.skill}
              onChange={e => setForm(f => ({ ...f, skill: e.target.value }))}>
              <option value="">— Выбрать —</option>
              {SKILLS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="wstatus" checked={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.checked }))}
              style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
            <label htmlFor="wstatus" style={{ ...ui.label, margin: 0 }}>Активен</label>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end',
            paddingTop: 16, borderTop: '1px solid var(--border-solid)' }}>
            <button style={ui.btnSecondary} onClick={() => setModal(null)}>Отмена</button>
            <button style={ui.btnPrimary}   onClick={saveWorker}>Сохранить</button>
          </div>
        </Modal>
      )}

      {modal === 'equip' && (
        <Modal
          title={editItem ? 'Редактировать станок' : 'Новый станок'}
          onClose={() => setModal(null)}
        >
          <div style={{ marginBottom: 14 }}>
            <label style={ui.label}>Наименование</label>
            <input style={ui.input} placeholder="16К20" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={ui.label}>Тип</label>
            <select style={ui.input} value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="">— Выбрать —</option>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="estatus" checked={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.checked }))}
              style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
            <label htmlFor="estatus" style={{ ...ui.label, margin: 0 }}>Работоспособен</label>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end',
            paddingTop: 16, borderTop: '1px solid var(--border-solid)' }}>
            <button style={ui.btnSecondary} onClick={() => setModal(null)}>Отмена</button>
            <button style={ui.btnPrimary}   onClick={saveEquip}>Сохранить</button>
          </div>
        </Modal>
      )}
    </div>
  )
}