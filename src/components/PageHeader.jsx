import React from 'react'
import { Sun, Moon } from 'lucide-react'

export default function PageHeader({ title, subtitle, theme, onToggleTheme, right }) {
  return (
    <div style={{
      padding: '56px 20px 8px',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 12,
    }}>
      <div>
        <h1 style={{
          fontSize: 34, fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.5px',
          lineHeight: 1.1,
        }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 400 }}>
            {subtitle}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, paddingBottom: 4 }}>
        {right}
        <button
          onClick={onToggleTheme}
          className="pressable"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--bg-card-2)',
            border: '0.5px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'background var(--transition)',
          }}
          aria-label="Toggle theme"
        >
          {theme === 'dark'
            ? <Sun size={16} strokeWidth={1.8} />
            : <Moon size={16} strokeWidth={1.8} />
          }
        </button>
      </div>
    </div>
  )
}
