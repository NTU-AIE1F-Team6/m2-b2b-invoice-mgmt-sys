import { useCallback, useState } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Toast from './Toast.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import CreateInvoicePage from '../pages/CreateInvoicePage.jsx'
import EditInvoicePage from '../pages/EditInvoicePage.jsx'
import CustomersPage from '../pages/CustomersPage.jsx'
import ProductsPage from '../pages/ProductsPage.jsx'
import { useInvoices } from '../hooks/useInvoices.js'
import { useAuth } from '../context/AuthContext.jsx'

const HINTS_KEY = 'invoicenow-hints'

function readHints() {
  try {
    return localStorage.getItem(HINTS_KEY) === '1'
  } catch {
    return false
  }
}

// Rendered only after login. Owns the invoice store and the toast, and passes both down as props
// (state is lifted here because Dashboard, Create and Edit all read or change the same list).
// Also owns the "React hints" toggle: a class on the wrapper shows every <Hint> label at once.
export default function AppShell() {
  const { user } = useAuth()
  const store = useInvoices(user?.username)
  const [toast, setToast] = useState(null)
  const [hints, setHints] = useState(readHints)

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type, at: Date.now() })
  }, [])

  const clearToast = useCallback(() => setToast(null), [])

  const toggleHints = useCallback(() => {
    setHints((on) => {
      const next = !on
      try {
        localStorage.setItem(HINTS_KEY, next ? '1' : '0')
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  return (
    <div className={`min-h-screen flex flex-col ${hints ? 'hints-on' : ''}`}>
      <Navbar hints={hints} onToggleHints={toggleHints} />
      {hints && (
        <div className="bg-violet-600 text-white text-xs sm:text-sm text-center px-4 py-2">
          React hints are on: purple labels name the React feature behind each part of the screen.{' '}
          <Link to="/tour" className="underline font-semibold">
            Read the full tour with code
          </Link>
        </div>
      )}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<DashboardPage store={store} notify={notify} />} />
          <Route path="/create" element={<CreateInvoicePage store={store} notify={notify} />} />
          <Route path="/edit" element={<EditInvoicePage store={store} notify={notify} />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-12 px-4">
        InvoiceNow SG simulation. Built with React, Vite and Tailwind CSS for the NTU AI Engineering Module 2 group project.
        Not connected to the real Peppol network.{' '}
        <Link to="/tour" className="underline">
          How it is built
        </Link>
      </footer>
      <Toast toast={toast} onDone={clearToast} />
    </div>
  )
}
