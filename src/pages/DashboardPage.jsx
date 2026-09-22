import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StatCards from '../components/StatCards.jsx'
import FxRatesCard from '../components/FxRatesCard.jsx'
import SearchFilter from '../components/SearchFilter.jsx'
import InvoiceList from '../components/InvoiceList.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import Hint from '../components/Hint.jsx'

export default function DashboardPage({ store, notify }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const { invoices, loading, error, busyId } = store

  const term = search.trim().toLowerCase()
  const visible = invoices.filter((inv) => {
    const matchesSearch =
      !term ||
      inv.buyerName.toLowerCase().includes(term) ||
      inv.buyerUEN.toLowerCase().includes(term) ||
      inv.id.toLowerCase().includes(term)
    const matchesStatus = status === 'All' || inv.status === status
    return matchesSearch && matchesStatus
  })

  const handleDelete = (id) => {
    if (window.confirm(`Delete invoice ${id}? This cannot be undone.`)) {
      store.deleteInvoice(id)
      notify(`Invoice ${id} deleted.`, 'info')
    }
  }

  const handleTransmit = async (id) => {
    const ok = await store.transmitInvoice(id)
    if (ok) notify(`Invoice ${id} routed via the InvoiceNow Access Point.`)
    else notify(`Invoice ${id} was rejected by the Access Point.`, 'error')
  }

  const handleMarkPaid = (id) => {
    store.markPaid(id)
    notify(`Invoice ${id} marked as paid.`)
  }

  const handleReset = async () => {
    if (window.confirm('Reset the demo data? Your local changes will be replaced by the seed invoices.')) {
      await store.resetDemo()
      notify('Demo data reloaded from the mock API.', 'info')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Peppol Access Point connected</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Send machine-readable e-invoices to any Singapore UEN on the InvoiceNow network.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Hint label="store prop = useReducer state lifted to AppShell" />
            <Hint label="useState: search + status filter" />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition"
          >
            Reset demo
          </button>
          <Link
            to="/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition text-sm whitespace-nowrap"
          >
            + Create invoice
          </Link>
        </div>
      </div>

      {error && <ErrorBanner title="Could not load invoices" message={error} onRetry={store.retryLoad} />}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-14 text-center">
          <Hint label="Conditional rendering: loading / error / data" className="mb-3" />
          <LoadingSpinner label="Fetching invoices from the mock Access Point API..." />
        </div>
      ) : (
        <>
          <StatCards invoices={invoices} />
          <FxRatesCard />
          <SearchFilter search={search} onSearch={setSearch} status={status} onStatus={setStatus} />
          {busyId && <LoadingSpinner label="Processing Peppol transmission..." className="py-1" />}
          <InvoiceList
            invoices={visible}
            busyId={busyId}
            onTransmit={handleTransmit}
            onMarkPaid={handleMarkPaid}
            onEdit={(id) => navigate(`/edit?id=${encodeURIComponent(id)}`)}
            onDelete={handleDelete}
          />
          <p className="text-xs text-slate-400 text-center">
            Showing {visible.length} of {invoices.length} invoices. Data is fetched from a mock API on first load and then kept in your browser.
          </p>
        </>
      )}
    </div>
  )
}
