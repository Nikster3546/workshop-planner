import { useEffect } from 'react'

export default function Modal({ title, onClose, children, width = 500 }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(26,46,38,0.35)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface-solid)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        padding: 32, width, maxWidth: '100%',
        boxShadow: 'var(--shadow-lg)',
        animation: 'modalIn 0.2s ease',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 24,
        }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)' }}>{title}</h3>
          <button onClick={onClose} style={{
            width: 30, height: 30, border: 'none', borderRadius: '50%',
            background: 'var(--border-solid)', cursor: 'pointer',
            fontSize: 15, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'var(--text-muted)',
            transition: 'all 0.15s', fontFamily: 'inherit',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-light)'; e.currentTarget.style.color = 'var(--danger)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--border-solid)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >✕</button>
        </div>
        {children}
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </div>
  )
}