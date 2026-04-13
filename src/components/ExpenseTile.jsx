import React, { useRef, useState } from 'react'
import { CATEGORIES } from '../context/ExpenseContext'

const fmtAmount = (n) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

const fmtDate = (s) => {
  const d = new Date(s), now = new Date()
  const yest = new Date(); yest.setDate(yest.getDate()-1)
  if (d.toDateString() === now.toDateString())  return 'Today'
  if (d.toDateString() === yest.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function ExpenseTile({ expense, onDelete, onEdit }) {
  const cat = CATEGORIES[expense.category] || CATEGORIES.other
  const touchX  = useRef(null)
  const [offset, setOffset] = useState(0)
  const [gone, setGone]     = useState(false)

  const onTouchStart = e => { touchX.current = e.touches[0].clientX }
  const onTouchMove  = e => {
    if (touchX.current === null) return
    const dx = touchX.current - e.touches[0].clientX
    if (dx > 0) setOffset(Math.min(dx, 80))
    else setOffset(Math.max(dx, 0))
  }
  const onTouchEnd = () => {
    if (offset > 48) setOffset(72)
    else setOffset(0)
    touchX.current = null
  }

  const handleDelete = () => {
    setGone(true)
    setTimeout(() => onDelete(expense.id), 260)
  }

  return (
    <div style={{
      position: 'relative',
      marginBottom: 1,
      overflow: 'hidden',
      opacity: gone ? 0 : 1,
      maxHeight: gone ? 0 : 200,
      transition: gone ? 'all 0.26s ease' : 'none',
    }}>
      {/* Delete bg */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: 80,
        background: 'var(--red-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '0 12px 12px 0',
      }}>
        <button onClick={handleDelete} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--red)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          border: 'none',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
          </svg>
        </button>
      </div>

      {/* Tile */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => { if (offset < 20) onEdit(expense) }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          background: 'var(--bg-card)',
          cursor: 'pointer',
          transform: `translateX(-${offset}px)`,
          transition: offset === 0 || offset === 72 ? 'transform 0.22s ease' : 'none',
          position: 'relative',
          zIndex: 1,
          borderBottom: '0.5px solid var(--divider)',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: cat.soft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, flexShrink: 0,
        }}>
          {cat.emoji}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 15, fontWeight: 500, color: 'var(--text-primary)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            marginBottom: 2,
          }}>{expense.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: 12, color: cat.color, fontWeight: 500,
            }}>{cat.label}</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>·</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{fmtDate(expense.date)}</span>
          </div>
        </div>

        {/* Amount */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
            AED {fmtAmount(expense.amount)}
          </div>
        </div>
      </div>
    </div>
  )
}
