import React, { useMemo, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useExpenses, CATEGORIES } from '../context/ExpenseContext'
import PageHeader from '../components/PageHeader'

const fmt = (n) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(n)

export default function StatsScreen({ theme, onToggleTheme }) {
  const { expenses, getCategoryTotals, getMonthlyTotal } = useExpenses()
  const [offset, setOffset] = useState(0)

  const targetDate = useMemo(() => {
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth()+offset); return d
  }, [offset])

  const monthName  = targetDate.toLocaleDateString('en-US', { month:'long', year:'numeric' })
  const catTotals  = getCategoryTotals(targetDate)
  const monthTotal = getMonthlyTotal(targetDate)

  const pieData = useMemo(() =>
    Object.entries(catTotals)
      .filter(([,v])=>v>0)
      .sort((a,b)=>b[1]-a[1])
      .map(([k,v])=>({ key:k, name:CATEGORIES[k].label, value:v, color:CATEGORIES[k].hex, emoji:CATEGORIES[k].emoji, soft:CATEGORIES[k].soft }))
  , [catTotals])

  const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth()+1, 0).getDate()
  const dailyMap = useMemo(()=>{
    const m=targetDate.getMonth(), y=targetDate.getFullYear(), map={}
    expenses.filter(e=>{ const d=new Date(e.date); return d.getMonth()===m&&d.getFullYear()===y })
            .forEach(e=>{ const day=new Date(e.date).getDate(); map[day]=(map[day]||0)+Number(e.amount) })
    return map
  },[expenses,targetDate])
  const maxDay = Math.max(...Object.values(dailyMap),1)

  const CustomTooltip = ({ active, payload }) => {
    if (!active||!payload?.length) return null
    const d = payload[0].payload
    return (
      <div style={{
        background:'var(--bg-card)',border:'0.5px solid var(--border)',
        borderRadius:12,padding:'10px 14px',
        boxShadow:'var(--shadow-md)',
        fontSize:13,color:'var(--text-primary)',fontWeight:500,
      }}>
        <span style={{marginRight:6}}>{d.emoji}</span>
        {d.name}: AED {fmt(d.value)}
      </div>
    )
  }

  return (
    <div style={{ paddingBottom:100 }}>
      <PageHeader title="Stats" theme={theme} onToggleTheme={onToggleTheme}
        right={
          <div style={{ display:'flex',alignItems:'center',gap:4 }}>
            <NavBtn onClick={()=>setOffset(o=>o-1)}><ChevronLeft size={16}/></NavBtn>
            <span style={{ fontSize:13,color:'var(--text-secondary)',fontWeight:500,minWidth:100,textAlign:'center' }}>{monthName}</span>
            <NavBtn onClick={()=>setOffset(o=>Math.min(o+1,0))} disabled={offset===0}><ChevronRight size={16}/></NavBtn>
          </div>
        }
      />

      <div style={{ padding:'16px 20px 0' }}>
        {pieData.length===0
          ? (
            <div style={{ textAlign:'center',padding:'80px 0' }}>
              <div style={{ fontSize:48,marginBottom:12 }}>📊</div>
              <div style={{ fontSize:17,fontWeight:600,color:'var(--text-primary)',marginBottom:4 }}>No data</div>
              <div style={{ fontSize:15,color:'var(--text-secondary)' }}>No expenses for this month</div>
            </div>
          ) : (
            <>
              {/* Summary row */}
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14 }}>
                <Card>
                  <p style={{ fontSize:12,color:'var(--text-secondary)',marginBottom:4,fontWeight:500 }}>Total</p>
                  <p style={{ fontSize:22,fontWeight:700,color:'var(--text-primary)',letterSpacing:'-0.4px' }}>
                    <span style={{ fontSize:13,fontWeight:400,color:'var(--text-secondary)' }}>AED </span>
                    {fmt(monthTotal)}
                  </p>
                </Card>
                <Card>
                  <p style={{ fontSize:12,color:'var(--text-secondary)',marginBottom:4,fontWeight:500 }}>Categories</p>
                  <p style={{ fontSize:22,fontWeight:700,color:'var(--text-primary)',letterSpacing:'-0.4px' }}>{pieData.length}</p>
                </Card>
              </div>

              {/* Pie */}
              <Card style={{ marginBottom:14, padding:'20px' }}>
                <div style={{ height:200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={84} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {pieData.map(d=><Cell key={d.key} fill={d.color}/>)}
                      </Pie>
                      <Tooltip content={<CustomTooltip/>}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px 12px',marginTop:8 }}>
                  {pieData.map(d=>(
                    <div key={d.key} style={{ display:'flex',alignItems:'center',gap:8 }}>
                      <div style={{ width:8,height:8,borderRadius:'50%',background:d.color,flexShrink:0 }}/>
                      <span style={{ fontSize:12,color:'var(--text-secondary)',flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
                        {d.name}
                      </span>
                      <span style={{ fontSize:12,fontWeight:600,color:'var(--text-primary)' }}>
                        {monthTotal>0?Math.round(d.value/monthTotal*100):0}%
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Daily bars */}
              <Card style={{ marginBottom:14, padding:'20px' }}>
                <p style={{ fontSize:13,fontWeight:600,color:'var(--text-primary)',marginBottom:14,letterSpacing:'-0.1px' }}>Daily Activity</p>
                <div style={{ display:'flex',alignItems:'flex-end',gap:2,height:56 }}>
                  {Array.from({length:daysInMonth},(_,i)=>{
                    const day=i+1, val=dailyMap[day]||0
                    const h = val>0 ? Math.max((val/maxDay)*100,8) : 3
                    return (
                      <div key={day} style={{
                        flex:1, height:`${h}%`, minHeight:3,
                        background: val>0 ? 'var(--accent)' : 'var(--bg-tertiary)',
                        borderRadius:3,
                        opacity: val>0 ? 1 : 0.5,
                        transition:'height 0.4s ease',
                      }}/>
                    )
                  })}
                </div>
                <div style={{ display:'flex',justifyContent:'space-between',marginTop:6 }}>
                  {['1',String(Math.ceil(daysInMonth/2)),String(daysInMonth)].map(l=>(
                    <span key={l} style={{ fontSize:11,color:'var(--text-tertiary)' }}>{l}</span>
                  ))}
                </div>
              </Card>

              {/* Breakdown list */}
              <Card style={{ padding:0, overflow:'hidden' }}>
                <div style={{ padding:'16px 16px 8px' }}>
                  <p style={{ fontSize:13,fontWeight:600,color:'var(--text-primary)',letterSpacing:'-0.1px' }}>Breakdown</p>
                </div>
                {pieData.map((d,i)=>{
                  const pct = monthTotal>0 ? (d.value/monthTotal)*100 : 0
                  return (
                    <div key={d.key} style={{
                      padding:'12px 16px',
                      borderTop: i>0 ? '0.5px solid var(--divider)' : 'none',
                    }}>
                      <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:8 }}>
                        <div style={{
                          width:36,height:36,borderRadius:10,
                          background:d.soft,
                          display:'flex',alignItems:'center',justifyContent:'center',
                          fontSize:18,flexShrink:0,
                        }}>{d.emoji}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:15,fontWeight:500,color:'var(--text-primary)' }}>{d.name}</div>
                          <div style={{ fontSize:12,color:'var(--text-secondary)' }}>{pct.toFixed(1)}% of total</div>
                        </div>
                        <div style={{ fontSize:15,fontWeight:600,color:'var(--text-primary)',letterSpacing:'-0.2px' }}>
                          AED {fmt(d.value)}
                        </div>
                      </div>
                      <div style={{ height:3,background:'var(--bg-tertiary)',borderRadius:2 }}>
                        <div style={{ width:`${pct}%`,height:'100%',background:d.color,borderRadius:2,transition:'width 0.6s ease' }}/>
                      </div>
                    </div>
                  )
                })}
              </Card>
            </>
          )
        }
      </div>
    </div>
  )
}

function Card({ children, style={} }) {
  return (
    <div style={{
      background:'var(--bg-card)',
      border:'0.5px solid var(--border)',
      borderRadius:16,
      padding:16,
      boxShadow:'var(--shadow-sm)',
      ...style,
    }}>{children}</div>
  )
}

function NavBtn({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} className={disabled?'':'pressable'} style={{
      width:30,height:30,borderRadius:8,
      background:'var(--bg-card-2)',
      border:'0.5px solid var(--border)',
      display:'flex',alignItems:'center',justifyContent:'center',
      color: disabled ? 'var(--text-tertiary)' : 'var(--text-secondary)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1,
    }}>{children}</button>
  )
}
