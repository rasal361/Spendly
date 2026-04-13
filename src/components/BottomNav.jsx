import React from 'react'
import { Home, List, BarChart2, Plus } from 'lucide-react'

const tabs = [
  { id: 'home',     label: 'Home',     Icon: Home },
  { id: 'expenses', label: 'Expenses', Icon: List },
  { id: 'stats',    label: 'Stats',    Icon: BarChart2 },
]

export default function BottomNav({ active, onChange, onAdd }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      zIndex: 100,
      background: 'var(--bg-nav)',
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      borderTop: '0.5px solid var(--border)',
      paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
      paddingTop: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
    }}>
      {tabs.slice(0, 1).map(t => <Tab key={t.id} {...t} active={active} onChange={onChange} />)}

      {/* Add button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <button
          onClick={onAdd}
          className="pressable"
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,113,227,0.35)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Plus size={22} color="#fff" strokeWidth={2.5} />
        </button>
        <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-tertiary)', letterSpacing: '0.01em' }}>Add</span>
      </div>

      {tabs.slice(1).map(t => <Tab key={t.id} {...t} active={active} onChange={onChange} />)}
    </nav>
  )
}

function Tab({ id, label, Icon, active, onChange }) {
  const on = active === id
  return (
    <button
      onClick={() => onChange(id)}
      className="pressable"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '2px 16px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: on ? 'var(--accent)' : 'var(--text-tertiary)',
        transition: 'color var(--transition)',
        minWidth: 60,
      }}
    >
      <Icon size={24} strokeWidth={on ? 2.2 : 1.6} />
      <span style={{ fontSize: 10, fontWeight: on ? 600 : 400, letterSpacing: '0.01em' }}>{label}</span>
    </button>
  )
}
