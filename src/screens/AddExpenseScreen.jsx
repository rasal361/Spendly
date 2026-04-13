import React, { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { CATEGORIES } from '../context/ExpenseContext'

const todayStr = () => new Date().toISOString().split('T')[0]

export default function AddExpenseScreen({ expense, onSave, onClose }) {
  const isEdit = !!expense
  const [form, setForm] = useState({ title:'', amount:'', category:'food', date: todayStr(), note:'' })

  useEffect(() => {
    if (expense) setForm({
      title: expense.title||'',
      amount: String(expense.amount||''),
      category: expense.category||'food',
      date: (expense.date||'').split('T')[0] || todayStr(),
      note: expense.note||'',
    })
  }, [expense])

  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  const valid = form.title.trim().length>0 && parseFloat(form.amount)>0

  const submit = () => {
    if (!valid) return
    const d = { ...form, amount: parseFloat(form.amount), date: new Date(form.date).toISOString() }
    if (isEdit) d.id = expense.id
    onSave(d, isEdit)
  }

  return (
    <div
      onClick={e => e.target===e.currentTarget && onClose()}
      style={{
        position:'fixed',inset:0,zIndex:200,
        background:'var(--bg-overlay)',
        display:'flex',alignItems:'flex-end',
        animation:'fadeIn 0.18s ease',
      }}
    >
      <div style={{
        width:'100%',maxWidth:430,margin:'0 auto',
        background:'var(--bg-sheet)',
        borderRadius:'24px 24px 0 0',
        paddingBottom:'max(28px, env(safe-area-inset-bottom))',
        animation:'sheetUp 0.32s cubic-bezier(0.32,0.72,0,1)',
        maxHeight:'94dvh',
        overflowY:'auto',
        boxShadow:'var(--shadow-xl)',
      }}>
        {/* Handle */}
        <div style={{ display:'flex', justifyContent:'center', paddingTop:10, paddingBottom:4 }}>
          <div style={{ width:36,height:4,borderRadius:2,background:'var(--bg-tertiary)' }}/>
        </div>

        {/* Header */}
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px 20px' }}>
          <h2 style={{ fontSize:22,fontWeight:700,color:'var(--text-primary)',letterSpacing:'-0.3px' }}>
            {isEdit ? 'Edit Expense' : 'New Expense'}
          </h2>
          <button onClick={onClose} className="pressable" style={{
            width:32,height:32,borderRadius:'50%',
            background:'var(--bg-card-2)',
            display:'flex',alignItems:'center',justifyContent:'center',
            color:'var(--text-secondary)',cursor:'pointer',
            border:'0.5px solid var(--border)',
          }}>
            <X size={16} strokeWidth={2}/>
          </button>
        </div>

        <div style={{ padding:'0 20px',display:'flex',flexDirection:'column',gap:20 }}>

          {/* Amount */}
          <div style={{
            background:'var(--bg-secondary)',
            borderRadius:18,
            padding:'20px 20px',
            border:'0.5px solid var(--border)',
          }}>
            <p style={{ fontSize:12,fontWeight:600,color:'var(--text-tertiary)',letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:10 }}>Amount</p>
            <div style={{ display:'flex',alignItems:'baseline',gap:6 }}>
              <span style={{ fontSize:20,fontWeight:400,color:'var(--text-secondary)' }}>AED</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                value={form.amount}
                onChange={e=>set('amount',e.target.value)}
                style={{
                  flex:1,
                  fontSize:42,fontWeight:700,
                  color:'var(--text-primary)',
                  background:'none',border:'none',outline:'none',
                  letterSpacing:'-1px',
                  width:'100%',
                }}
              />
            </div>
          </div>

          {/* Title */}
          <Field label="Title">
            <input
              type="text"
              placeholder="What did you spend on?"
              value={form.title}
              onChange={e=>set('title',e.target.value)}
              style={inputSt}
            />
          </Field>

          {/* Category */}
          <Field label="Category">
            <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8 }}>
              {Object.entries(CATEGORIES).map(([k,c])=>(
                <button key={k} onClick={()=>set('category',k)} className="pressable" style={{
                  padding:'10px 4px',
                  borderRadius:14,
                  border:`1.5px solid ${form.category===k ? c.hex : 'transparent'}`,
                  background: form.category===k ? c.soft : 'var(--bg-card-2)',
                  display:'flex',flexDirection:'column',alignItems:'center',gap:5,
                  cursor:'pointer',transition:'all 0.15s ease',
                }}>
                  <span style={{fontSize:20}}>{c.emoji}</span>
                  <span style={{
                    fontSize:10,fontWeight:600,
                    color: form.category===k ? c.color : 'var(--text-tertiary)',
                    letterSpacing:'0.01em',
                    lineHeight:1.2,
                    textAlign:'center',
                  }}>{c.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </Field>

          {/* Date */}
          <Field label="Date">
            <input
              type="date"
              value={form.date}
              onChange={e=>set('date',e.target.value)}
              style={{ ...inputSt, colorScheme: 'light dark' }}
            />
          </Field>

          {/* Note */}
          <Field label="Note (optional)">
            <textarea
              placeholder="Add a note..."
              value={form.note}
              onChange={e=>set('note',e.target.value)}
              rows={2}
              style={{ ...inputSt, resize:'none', lineHeight:1.6 }}
            />
          </Field>

          {/* Submit */}
          <button
            onClick={submit}
            disabled={!valid}
            className={valid ? 'pressable' : ''}
            style={{
              width:'100%',
              padding:'17px',
              borderRadius:16,
              background: valid ? 'var(--accent)' : 'var(--bg-card-2)',
              color: valid ? '#fff' : 'var(--text-tertiary)',
              fontSize:17,fontWeight:600,
              border:'none',cursor: valid ? 'pointer' : 'not-allowed',
              display:'flex',alignItems:'center',justifyContent:'center',gap:8,
              letterSpacing:'-0.1px',
              boxShadow: valid ? '0 2px 12px rgba(0,113,227,0.3)' : 'none',
              transition:'all 0.2s ease',
              marginBottom:4,
            }}
          >
            <Check size={18} strokeWidth={2.5}/>
            {isEdit ? 'Save Changes' : 'Add Expense'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <p style={{ fontSize:12,fontWeight:600,color:'var(--text-tertiary)',letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:8,paddingLeft:2 }}>
        {label}
      </p>
      {children}
    </div>
  )
}

const inputSt = {
  width:'100%',
  padding:'13px 15px',
  borderRadius:13,
  background:'var(--bg-input)',
  border:'0.5px solid var(--border)',
  color:'var(--text-primary)',
  fontSize:16,
  fontFamily:"'Figtree', -apple-system, sans-serif",
}
