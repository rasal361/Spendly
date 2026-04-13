import React, { useState, useMemo } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useExpenses, CATEGORIES } from '../context/ExpenseContext'
import ExpenseTile from '../components/ExpenseTile'
import PageHeader from '../components/PageHeader'

const fmt = (n) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(n)

export default function AllExpensesScreen({ onEdit, theme, onToggleTheme }) {
  const { expenses, deleteExpense } = useExpenses()
  const [search,    setSearch]    = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [showFilter,setShowFilter]= useState(false)

  const filtered = useMemo(() =>
    [...expenses]
      .sort((a,b) => new Date(b.date)-new Date(a.date))
      .filter(e => {
        const matchCat = filterCat==='all' || e.category===filterCat
        const matchQ   = !search || e.title.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchQ
      })
  , [expenses, search, filterCat])

  const total = filtered.reduce((s,e) => s+Number(e.amount), 0)

  // Group by date label
  const groups = useMemo(() => {
    const map = {}
    filtered.forEach(e => {
      const key = new Date(e.date).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })
      if (!map[key]) map[key] = { label: key, items:[], total:0 }
      map[key].items.push(e)
      map[key].total += Number(e.amount)
    })
    return Object.values(map)
  }, [filtered])

  return (
    <div style={{ paddingBottom: 100 }}>
      <PageHeader
        title="Expenses"
        subtitle={`${filtered.length} entries · AED ${fmt(total)}`}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <div style={{ padding:'12px 20px 0' }}>
        {/* Search bar */}
        <div style={{
          display:'flex', alignItems:'center', gap:10,
          background:'var(--bg-input)',
          borderRadius:13,
          padding:'11px 14px',
          border:'0.5px solid var(--border)',
          marginBottom:12,
        }}>
          <Search size={16} color="var(--text-tertiary)" strokeWidth={2}/>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e=>setSearch(e.target.value)}
            style={{
              flex:1,background:'none',border:'none',outline:'none',
              color:'var(--text-primary)',fontSize:16,
              fontFamily:"'Figtree',-apple-system,sans-serif",
            }}
          />
          {search
            ? <button onClick={()=>setSearch('')} style={{color:'var(--text-tertiary)',background:'none',border:'none',cursor:'pointer',display:'flex'}}>
                <X size={15}/>
              </button>
            : <button onClick={()=>setShowFilter(f=>!f)} className="pressable" style={{
                display:'flex',alignItems:'center',
                color: showFilter ? 'var(--accent)' : 'var(--text-tertiary)',
                background:'none',border:'none',cursor:'pointer',
              }}>
                <SlidersHorizontal size={16}/>
              </button>
          }
        </div>

        {/* Filter chips */}
        {showFilter && (
          <div style={{
            display:'flex',gap:8,overflowX:'auto',
            paddingBottom:12,marginBottom:4,
            scrollbarWidth:'none',
            animation:'slideDown 0.2s ease both',
          }}>
            <Chip label="All" value="all" active={filterCat} onClick={setFilterCat} color="var(--accent)" />
            {Object.entries(CATEGORIES).map(([k,c])=>(
              <Chip key={k} label={`${c.emoji} ${c.label.split(' ')[0]}`} value={k} active={filterCat} onClick={setFilterCat} color={c.color} />
            ))}
          </div>
        )}

        {/* List */}
        {groups.length === 0
          ? <Empty />
          : groups.map(group => (
            <div key={group.label} style={{ marginBottom:20 }}>
              <div style={{
                display:'flex',justifyContent:'space-between',alignItems:'center',
                padding:'0 4px',marginBottom:8,
              }}>
                <span style={{ fontSize:12,fontWeight:600,color:'var(--text-secondary)',letterSpacing:'0.03em',textTransform:'uppercase' }}>
                  {group.label}
                </span>
                <span style={{ fontSize:13,color:'var(--text-secondary)',fontWeight:500 }}>
                  AED {fmt(group.total)}
                </span>
              </div>
              <div style={{
                background:'var(--bg-card)',
                border:'0.5px solid var(--border)',
                borderRadius:16,
                overflow:'hidden',
                boxShadow:'var(--shadow-sm)',
              }}>
                {group.items.map(e=>(
                  <div key={e.id} className="list-item">
                    <ExpenseTile expense={e} onDelete={deleteExpense} onEdit={onEdit}/>
                  </div>
                ))}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

function Chip({ label, value, active, onClick, color }) {
  const on = active===value
  return (
    <button onClick={()=>onClick(value)} className="pressable" style={{
      flexShrink:0,
      padding:'7px 14px',
      borderRadius:20,
      border:`1px solid ${on ? color : 'var(--border)'}`,
      background: on ? 'var(--accent-soft)' : 'var(--bg-card)',
      color: on ? color : 'var(--text-secondary)',
      fontSize:13,fontWeight:500,
      cursor:'pointer',whiteSpace:'nowrap',
      transition:'all 0.15s ease',
    }}>{label}</button>
  )
}

function Empty() {
  return (
    <div style={{ textAlign:'center',padding:'64px 20px',color:'var(--text-tertiary)' }}>
      <div style={{ fontSize:40,marginBottom:12 }}>🔍</div>
      <div style={{ fontSize:17,fontWeight:600,color:'var(--text-primary)',marginBottom:4 }}>No results</div>
      <div style={{ fontSize:15,color:'var(--text-secondary)' }}>Try a different search or filter</div>
    </div>
  )
}
