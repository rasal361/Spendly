import React, { useState, useEffect } from 'react'
import { ExpenseProvider } from './context/ExpenseContext'
import BottomNav from './components/BottomNav'
import HomeScreen from './screens/HomeScreen'
import AllExpensesScreen from './screens/AllExpensesScreen'
import StatsScreen from './screens/StatsScreen'
import AddExpenseScreen from './screens/AddExpenseScreen'
import { useExpenses } from './context/ExpenseContext'

function AppInner() {
  const [tab, setTab]       = useState('home')
  const [modal, setModal]   = useState(null)
  const [theme, setTheme]   = useState(() => localStorage.getItem('spendly_theme') || 'light')
  const { addExpense, updateExpense } = useExpenses()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('spendly_theme', theme)
    // Update meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.content = theme === 'dark' ? '#000000' : '#ffffff'
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')
  const openAdd  = ()  => setModal({ mode: 'add' })
  const openEdit = (e) => setModal({ mode: 'edit', expense: e })
  const closeModal = () => setModal(null)

  const handleSave = (data, isEdit) => {
    isEdit ? updateExpense(data) : addExpense(data)
    closeModal()
  }

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', background: 'var(--bg-primary)', transition: 'background 0.22s ease' }}>
      <div style={{ minHeight: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
        {tab === 'home'     && <HomeScreen     onEdit={openEdit} theme={theme} onToggleTheme={toggleTheme} />}
        {tab === 'expenses' && <AllExpensesScreen onEdit={openEdit} theme={theme} onToggleTheme={toggleTheme} />}
        {tab === 'stats'    && <StatsScreen    theme={theme} onToggleTheme={toggleTheme} />}
      </div>
      <BottomNav active={tab} onChange={setTab} onAdd={openAdd} />
      {modal && (
        <AddExpenseScreen
          expense={modal.mode === 'edit' ? modal.expense : null}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <ExpenseProvider>
      <AppInner />
    </ExpenseProvider>
  )
}
