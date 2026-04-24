export const card = {
  background: 'var(--surface)',
  backdropFilter: 'blur(20px)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow)',
}

export const input = {
  width: '100%', padding: '10px 14px',
  border: '1.5px solid var(--border-solid)',
  borderRadius: 'var(--radius)', fontSize: 14,
  outline: 'none', fontFamily: 'Outfit, sans-serif',
  background: '#fff', color: 'var(--text)',
  transition: 'border-color 0.2s',
}

export const label = {
  display: 'block', fontSize: 12,
  fontWeight: 600, color: 'var(--text-muted)',
  marginBottom: 6, textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

export const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: 7,
  padding: '9px 18px',
  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
  color: '#fff', border: 'none', borderRadius: 'var(--radius)',
  fontSize: 13, fontWeight: 600, cursor: 'pointer',
  fontFamily: 'Outfit, sans-serif',
  boxShadow: '0 4px 14px rgba(46,191,145,0.3)',
  transition: 'all 0.18s',
}

export const btnSecondary = {
  display: 'inline-flex', alignItems: 'center', gap: 7,
  padding: '9px 18px',
  background: 'var(--surface-solid)', color: 'var(--text)',
  border: '1.5px solid var(--border-solid)',
  borderRadius: 'var(--radius)',
  fontSize: 13, fontWeight: 500, cursor: 'pointer',
  fontFamily: 'Outfit, sans-serif',
  transition: 'all 0.18s',
}

export const btnDanger = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '6px 12px',
  background: 'var(--danger-light)', color: 'var(--danger)',
  border: '1px solid #f5c6c2', borderRadius: 'var(--radius)',
  fontSize: 12, fontWeight: 500, cursor: 'pointer',
  fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s',
}

export const badge = (color = 'green') => {
  const map = {
    green: { bg: 'var(--primary-light)', color: 'var(--primary-dark)' },
    red:   { bg: 'var(--danger-light)',  color: 'var(--danger)' },
    gray:  { bg: '#f1f5f3',              color: 'var(--text-muted)' },
    amber: { bg: 'var(--warning-light)', color: 'var(--warning)' },
  }
  const s = map[color] || map.gray
  return {
    display: 'inline-block', padding: '2px 10px',
    borderRadius: 100, fontSize: 12, fontWeight: 500,
    background: s.bg, color: s.color,
  }
}

export const topBar = {
  padding: '20px 28px',
  background: 'var(--surface)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid var(--border)',
  display: 'flex', alignItems: 'center',
  justifyContent: 'space-between',
  position: 'sticky', top: 0, zIndex: 50,
}

export const pageContent = { padding: '24px 28px' }

export const table = {
  width: '100%', borderCollapse: 'collapse', fontSize: 13,
}

export const th = {
  textAlign: 'left', padding: '10px 14px',
  borderBottom: '1.5px solid var(--border-solid)',
  color: 'var(--text-muted)', fontWeight: 600,
  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em',
}

export const td = {
  padding: '12px 14px',
  borderBottom: '1px solid var(--border-solid)',
  color: 'var(--text)',
}