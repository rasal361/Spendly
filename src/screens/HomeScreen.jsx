import React, { useMemo } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { useExpenses, CATEGORIES } from '../context/ExpenseContext'
import ExpenseTile from '../components/ExpenseTile'
import PageHeader from '../components/PageHeader'

const fmt = (n) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

export default function HomeScreen({ onEdit, theme, onToggleTheme }) {
  const { getMonthlyTotal, getCategoryTotals, getRecentExpenses, deleteExpense } = useExpenses()
  const now       = new Date()
  const prev      = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const total     = getMonthlyTotal(now)
  const prevTotal = getMonthlyTotal(prev)
  const catTotals = getCategoryTotals(now)
  const recent    = getRecentExpenses(6)
  const diff      = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : null

  const topCats = useMemo(() =>
    Object.entries(catTotals).sort((a,b)=>b[1]-a[1]).slice(0,4)
  , [catTotals])

  const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div style={{ paddingBottom: 100 }}>
      <PageHeader
        title="Overview"
        subtitle={monthName}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <div style={{ padding: '16px 20px 0' }}>

        {/* Hero Card */}
        <div style={{
          background: theme === 'dark'
            ? 'linear-gradient(145deg, #1c1c1e 0%, #2c2c2e 100%)'
            : 'linear-gradient(145deg, #1d1d1f 0%, #3a3a3c 100%)',
          borderRadius: 24,
          padding: '28px 24px',
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}>
          {/* Subtle gradient blob */}
          <div style={{
            position: 'absolute', right: -30, top: -30,
            width: 160, height: 160, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(41,151,255,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}/>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500, marginBottom: 8, letterSpacing: '0.01em' }}>
              Total Spent
            </p>
            <div style={{
              fontSize: 44, fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-1px',
              lineHeight: 1,
              marginBottom: 20,
              animation: 'numberRoll 0.4s ease both',
            }}>
              <span style={{ fontSize: 20, fontWeight: 400, opacity: 0.6, letterSpacing: 0 }}>AED </span>
              {fmt(total)}
            </div>

            {diff !== null && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: diff <= 0 ? 'rgba(48,209,88,0.2)' : 'rgba(255,69,58,0.2)',
                borderRadius: 20,
                padding: '5px 12px',
              }}>
                {diff <= 0
                  ? <TrendingDown size={13} color="#30d158" />
                  : <TrendingUp   size={13} color="#ff453a" />
                }
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: diff <= 0 ? '#30d158' : '#ff453a',
                }}>
                  {Math.abs(diff).toFixed(1)}% vs last month
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Category Grid */}
        {topCats.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <SectionLabel>Top Categories</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {topCats.map(([key, amount]) => {
                const cat = CATEGORIES[key]
                const pct = total > 0 ? (amount / total) * 100 : 0
                return (
                  <div key={key} style={{
                    background: 'var(--bg-card)',
                    border: '0.5px solid var(--border)',
                    borderRadius: 18,
                    padding: 16,
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: cat.soft,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18,
                      }}>{cat.emoji}</div>
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.2px', marginBottom: 2 }}>
                      {fmt(amount)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{cat.label}</div>
                    <div style={{ marginTop: 10, height: 3, background: 'var(--bg-tertiary)', borderRadius: 2 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: cat.color, borderRadius: 2, transition: 'width 0.6s ease' }}/>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recent */}
        <div>
          <SectionLabel>Recent</SectionLabel>
          {recent.length === 0
            ? <Empty text="No expenses yet" sub="Tap + to add your first expense" emoji="💸" />
            : (
              <div style={{
                background: 'var(--bg-card)',
                border: '0.5px solid var(--border)',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}>
                {recent.map(e => (
                  <div key={e.id} className="list-item">
                    <ExpenseTile expense={e} onDelete={deleteExpense} onEdit={onEdit} />
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: 13, fontWeight: 600,
      color: 'var(--text-secondary)',
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
      marginBottom: 10,
      paddingLeft: 4,
    }}>{children}</p>
  )
}

function Empty({ text, sub, emoji }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 20px' }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>{emoji}</div>
      <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{text}</div>
      <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>{sub}</div>
    </div>
  )
}
