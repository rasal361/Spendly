import React, { createContext, useContext, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid'

export const CATEGORIES = {
  food:          { label: 'Food & Drink',  emoji: '🍜', color: 'var(--orange)', soft: 'var(--orange-soft)', hex: '#ff9500' },
  transport:     { label: 'Transport',     emoji: '🚌', color: 'var(--teal)',   soft: 'var(--teal-soft)',   hex: '#5ac8fa' },
  shopping:      { label: 'Shopping',      emoji: '🛍️', color: 'var(--pink)',   soft: 'var(--pink-soft)',   hex: '#ff2d55' },
  bills:         { label: 'Bills',         emoji: '📋', color: 'var(--red)',    soft: 'var(--red-soft)',    hex: '#ff3b30' },
  health:        { label: 'Health',        emoji: '💊', color: 'var(--green)',  soft: 'var(--green-soft)',  hex: '#34c759' },
  entertainment: { label: 'Entertainment', emoji: '🎮', color: 'var(--purple)', soft: 'var(--purple-soft)', hex: '#af52de' },
  other:         { label: 'Other',         emoji: '📦', color: 'var(--accent)', soft: 'var(--accent-soft)', hex: '#0071e3' },
}

const STORAGE_KEY = 'spendly_v2'

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}
const save = (data) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }
  catch {}
}

const reducer = (state, action) => {
  let next
  switch (action.type) {
    case 'ADD':    next = [action.payload, ...state]; break
    case 'UPDATE': next = state.map(e => e.id === action.payload.id ? action.payload : e); break
    case 'DELETE': next = state.filter(e => e.id !== action.payload); break
    default: return state
  }
  save(next)
  return next
}

const Ctx = createContext(null)

export function ExpenseProvider({ children }) {
  const [expenses, dispatch] = useReducer(reducer, [], load)

  const addExpense    = (d) => dispatch({ type: 'ADD',    payload: { id: uuidv4(), createdAt: new Date().toISOString(), ...d } })
  const updateExpense = (d) => dispatch({ type: 'UPDATE', payload: d })
  const deleteExpense = (id) => dispatch({ type: 'DELETE', payload: id })

  const getMonthExpenses = (date = new Date()) => {
    const m = date.getMonth(), y = date.getFullYear()
    return expenses.filter(e => { const d = new Date(e.date); return d.getMonth()===m && d.getFullYear()===y })
  }
  const getMonthlyTotal   = (date) => getMonthExpenses(date).reduce((s,e) => s + Number(e.amount), 0)
  const getCategoryTotals = (date) => {
    const t = {}
    getMonthExpenses(date).forEach(e => { t[e.category] = (t[e.category]||0) + Number(e.amount) })
    return t
  }
  const getRecentExpenses = (n=5) => [...expenses].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,n)

  return (
    <Ctx.Provider value={{ expenses, addExpense, updateExpense, deleteExpense, getMonthlyTotal, getCategoryTotals, getRecentExpenses, getMonthExpenses }}>
      {children}
    </Ctx.Provider>
  )
}

export const useExpenses = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useExpenses must be inside ExpenseProvider')
  return ctx
}
