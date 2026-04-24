import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import BlobBg from '../components/BlobBg'

export default function Login() {
  const [form, setForm] = useState({ login: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!form.login || !form.password) { setError('Заполните все поля'); return }
    setLoading(true); setError('')
    try {
      const res = await authApi.login(form)
      localStorage.setItem('token', res.data.access_token)
      navigate('/orders')
    } catch {
      setError('Неверный логин или пароль')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', position: 'relative', overflow: 'hidden',
    }}>
      <BlobBg />
      <div style={{
        position: 'relative', zIndex: 10,
        width: 400, padding: '44px 40px',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 20px 60px rgba(46,191,145,0.12)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #2ebf91, #27ae60)',
            borderRadius: 16, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 26,
            boxShadow: '0 8px 24px rgba(46,191,145,0.35)',
          }}>⚙️</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
            Добро пожаловать
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Система планирования производства
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'var(--danger-light)', color: 'var(--danger)',
            padding: '10px 14px', borderRadius: 'var(--radius)',
            fontSize: 13, marginBottom: 20, textAlign: 'center',
          }}>{error}</div>
        )}

        {/* Inputs */}
        {[
          { key: 'login',    label: 'Логин',  type: 'text',     placeholder: 'dispatcher' },
          { key: 'password', label: 'Пароль', type: 'password', placeholder: '••••••••' },
        ].map(({ key, label, type, placeholder }) => (
          <div key={key} style={{ marginBottom: 20, position: 'relative' }}>
            <label style={{
              position: 'absolute', top: form[key] ? -18 : 10, left: 0,
              fontSize: form[key] ? 11 : 14,
              color: form[key] ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all 0.25s', pointerEvents: 'none',
              fontWeight: form[key] ? 600 : 400,
            }}>{label}</label>
            <input
              type={type}
              value={form[key]}
              placeholder={form[key] ? '' : placeholder}
              onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{
                width: '100%', padding: '10px 0',
                border: 'none', borderBottom: '2px solid var(--border-solid)',
                background: 'transparent', outline: 'none',
                fontSize: 14, color: 'var(--text)',
                fontFamily: 'Outfit, sans-serif',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderBottomColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderBottomColor = 'var(--border-solid)'}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, height: 2,
              background: 'var(--primary)',
              width: form[key] ? '100%' : 0,
              transition: 'width 0.3s',
            }} />
          </div>
        ))}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', marginTop: 12, padding: '13px',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
          color: '#fff', border: 'none', borderRadius: 12,
          fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'Outfit, sans-serif',
          boxShadow: '0 6px 20px rgba(46,191,145,0.35)',
          transition: 'all 0.2s', opacity: loading ? 0.7 : 1,
        }}>
          {loading ? 'Вход...' : 'Войти в систему'}
        </button>
      </div>
    </div>
  )
}