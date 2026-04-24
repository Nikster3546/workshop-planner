import { useState, useEffect } from 'react'
import { ordersApi, routesApi } from '../api'
import Modal from '../components/Modal'
import * as ui from '../components/ui'

const EMPTY = { name: '', route_id: '', start_after: '', end_before: '' }

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'create' | 'edit'
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)

  const load = () => {
    Promise.all([ordersApi.getAll(), routesApi.getAll()])
      .then(([o, r]) => { setOrders(o.data); setRoutes(r.data) })
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModal('form') }
  const openEdit   = (o) => {
    setForm({
      name: o.name,
      route_id: o.route_id,
      start_after: o.start_after?.slice(0,10),
      end_before:  o.end_before?.slice(0,10),
    })
    setEditId(o.id); setModal('form')
  }

  const handleSave = async () => {
    const payload = {
      ...form,
      route_id: parseInt(form.route_id),
      start_after: form.start_after + 'T08:00:00',
      end_before:  form.end_before  + 'T16:00:00',
    }
    if (editId) await ordersApi.update(editId, payload)
    else        await ordersApi.create(payload)
    setModal(null); load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить заказ?')) return
    await ordersApi.delete(id); load()
  }

  const routeName = (id) => routes.find(r => r.id === id)?.name || '—'

  return (
    <div>
      <div style={ui.topBar}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Заказы</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Управление производственными заказами
          </p>
        </div>
        <button style={ui.btnPrimary} onClick={openCreate}>+ Новый заказ</button>
      </div>

      <div style={ui.pageContent}>
        <div style={{ ...ui.card, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              Загрузка...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <div style={{ fontWeight: 600 }}>Заказов пока нет</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Создайте первый заказ</div>
            </div>
          ) : (
            <table style={ui.table}>
              <thead>
                <tr>
                  {['№', 'Деталь', 'Маршрут', 'Начать не ранее', 'Закончить до', 'Действия'].map(h => (
                    <th key={h} style={ui.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-muted)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ ...ui.td, color: 'var(--text-muted)', width: 50 }}>#{o.id}</td>
                    <td style={{ ...ui.td, fontWeight: 600 }}>{o.name}</td>
                    <td style={ui.td}>
                      <span style={ui.badge('green')}>{routeName(o.route_id)}</span>
                    </td>
                    <td style={{ ...ui.td, color: 'var(--text-muted)' }}>
                      {new Date(o.start_after).toLocaleDateString('ru-RU')}
                    </td>
                    <td style={{ ...ui.td, color: 'var(--text-muted)' }}>
                      {new Date(o.end_before).toLocaleDateString('ru-RU')}
                    </td>
                    <td style={ui.td}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button style={ui.btnSecondary} onClick={() => openEdit(o)}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-solid)'}
                        >✏️ Ред.</button>
                        <button style={ui.btnDanger} onClick={() => handleDelete(o.id)}>🗑 Удал.</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal === 'form' && (
        <Modal title={editId ? 'Редактировать заказ' : 'Новый заказ'} onClose={() => setModal(null)}>
          <FormField label="Наименование детали">
            <input style={ui.input} placeholder="Вал шестерни"
              value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
          </FormField>
          <FormField label="Технологический маршрут">
            <select style={ui.input} value={form.route_id}
              onChange={e => setForm(p => ({...p, route_id: e.target.value}))}>
              <option value="">— Выберите маршрут —</option>
              {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Начать не ранее">
              <input style={ui.input} type="date" value={form.start_after}
                onChange={e => setForm(p => ({...p, start_after: e.target.value}))} />
            </FormField>
            <FormField label="Закончить до">
              <input style={ui.input} type="date" value={form.end_before}
                onChange={e => setForm(p => ({...p, end_before: e.target.value}))} />
            </FormField>
          </div>
          <ModalFooter onClose={() => setModal(null)} onSave={handleSave} />
        </Modal>
      )}
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={ui.label}>{label}</label>
      {children}
    </div>
  )
}

function ModalFooter({ onClose, onSave }) {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24,
      paddingTop: 20, borderTop: '1px solid var(--border-solid)' }}>
      <button style={ui.btnSecondary} onClick={onClose}>Отмена</button>
      <button style={ui.btnPrimary} onClick={onSave}>Сохранить</button>
    </div>
  )
}