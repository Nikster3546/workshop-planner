import { NavLink, useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import BlobBg from './BlobBg'

const NAV = [
  { to: '/orders',    icon: '📋', label: 'Заказы' },
  { to: '/routes',    icon: '🔗', label: 'Маршруты' },
  { to: '/resources', icon: '👷', label: 'Ресурсы' },
  { to: '/schedule',  icon: '📅', label: 'Расписание' },
]

export default function Layout({ children }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await authApi.logout().catch(() => {})
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <BlobBg />

      {/* Sidebar */}
      <aside style={{
        position: 'relative', zIndex: 10,
        width: 230, flexShrink: 0,
        background: 'var(--surface)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        padding: '0',
        boxShadow: '2px 0 20px rgba(46,191,145,0.06)',
      }}>
        {/* Logo */}
        <div style={{
          padding: '28px 24px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontWeight: 700, fontSize: 17, color: 'var(--primary)',
          }}>
            <span style={{
              width: 34, height: 34,
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
              borderRadius: 10, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 16, color: '#fff',
              boxShadow: '0 4px 12px rgba(46,191,145,0.35)',
            }}>⚙️</span>
            Цех №1
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, paddingLeft: 44 }}>
            Планирование производства
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 12px' }}>
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 'var(--radius)',
              marginBottom: 4, fontSize: 14, fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--primary-dark)' : 'var(--text-muted)',
              background: isActive ? 'var(--primary-muted)' : 'transparent',
              border: isActive ? '1px solid var(--border)' : '1px solid transparent',
              textDecoration: 'none', transition: 'all 0.18s',
            })}>
              <span style={{ fontSize: 17 }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User / Logout */}
        <div style={{
          padding: '16px 12px',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 14px', borderRadius: 'var(--radius)',
            marginBottom: 6,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 13, fontWeight: 600, flexShrink: 0,
            }}>Д</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Диспетчер</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>dispatcher</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 14px', borderRadius: 'var(--radius)',
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontSize: 13, color: 'var(--text-muted)', transition: 'all 0.18s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-light)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            🚪 Выйти из системы
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{
        flex: 1, overflow: 'auto',
        position: 'relative', zIndex: 10,
      }}>
        {children}
      </main>
    </div>
  )
}